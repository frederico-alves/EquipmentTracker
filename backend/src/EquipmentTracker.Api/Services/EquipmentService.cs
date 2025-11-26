using Microsoft.EntityFrameworkCore;
using EquipmentTracker.Api.Data;
using EquipmentTracker.Api.DTOs;
using EquipmentTracker.Api.Models;
using EquipmentTracker.Api.Models.Enums;

namespace EquipmentTracker.Api.Services;

// Service layer for equipment operations - implements IEquipmentService interface.
// Contains the business logic and database operations for equipment management.
public class EquipmentService : IEquipmentService
{
    // readonly: can only be assigned in constructor, prevents accidental reassignment
    private readonly AppDbContext _context;

    // Constructor Injection: ASP.NET Core automatically provides AppDbContext
    public EquipmentService(AppDbContext context)
    {
        _context = context;
    }

    // async/await enables non-blocking operations:
    public async Task<IEnumerable<EquipmentDto>> GetAllEquipmentAsync()
    {
        // Gets all equipment sorted by location, then by name.
        // LINQ query: OrderBy -> ThenBy -> Select -> ToListAsync
        // Select() transforms Equipment entity to EquipmentDto (projection)
        return await _context.Equipment
            .OrderBy(e => e.Location)
            .ThenBy(e => e.Name)
            .Select(e => new EquipmentDto(
                e.Id,
                e.Name,
                e.Location,
                e.CurrentState,
                GetStateDisplay(e.CurrentState),
                e.UpdatedAt
            ))
            .ToListAsync(); // Executes query and returns List
    }


    public async Task<EquipmentDto?> GetEquipmentByIdAsync(Guid id)
    {
        // Gets a single equipment by its unique ID.
        // Returns null if not found.
        // FirstOrDefaultAsync: returns first match or null if none found
        var equipment = await _context.Equipment
            .FirstOrDefaultAsync(e => e.Id == id);

        if (equipment == null) return null;

        // Map entity to DTO before returning
        return new EquipmentDto(
            equipment.Id,
            equipment.Name,
            equipment.Location,
            equipment.CurrentState,
            GetStateDisplay(equipment.CurrentState),
            equipment.UpdatedAt
        );
    }

    // Updates the production state of equipment and records the change in history.
    public async Task<EquipmentDto?> UpdateStateAsync(Guid id, UpdateStateRequest request)
    {
        var equipment = await _context.Equipment
            .FirstOrDefaultAsync(e => e.Id == id);

        if (equipment == null) return null;

        // Save previous state for history tracking
        var previousState = equipment.CurrentState;

        // Create history record to track state changes over time
        var stateChange = new StateChange
        {
            EquipmentId = id,
            PreviousState = previousState,
            NewState = request.NewState,
            ChangedBy = request.ChangedBy,
            Notes = request.Notes
        };

        // Update the equipment with new state
        equipment.CurrentState = request.NewState;
        equipment.UpdatedAt = DateTime.UtcNow;

        // Add history record and save all changes in single transaction
        _context.StateChanges.Add(stateChange);
        await _context.SaveChangesAsync();

        return new EquipmentDto(
            equipment.Id,
            equipment.Name,
            equipment.Location,
            equipment.CurrentState,
            GetStateDisplay(equipment.CurrentState),
            equipment.UpdatedAt
        );
    }

    // Gets state change history with optional filters.
    // Can filter by equipment ID, start date (from), and end date (to).
    public async Task<IEnumerable<StateHistoryDto>> GetStateHistoryAsync(
        Guid? equipmentId, DateTime? from, DateTime? to)
    {
        // Start with base query, Include() eager-loads related Equipment data
        var query = _context.StateChanges
            .Include(s => s.Equipment)
            .AsQueryable();

        // Apply filters conditionally - only if parameter has value
        if (equipmentId.HasValue)
            query = query.Where(s => s.EquipmentId == equipmentId.Value);

        if (from.HasValue)
            query = query.Where(s => s.ChangedAt >= from.Value);

        if (to.HasValue)
            query = query.Where(s => s.ChangedAt <= to.Value);

        // Execute query: sort by most recent first, project to DTO
        return await query
            .OrderByDescending(s => s.ChangedAt)
            .Select(s => new StateHistoryDto(
                s.Id,
                s.EquipmentId,
                s.Equipment.Name,
                s.PreviousState,
                GetStateDisplay(s.PreviousState),
                s.NewState,
                GetStateDisplay(s.NewState),
                s.ChangedBy,
                s.ChangedAt,
                s.Notes
            ))
            .ToListAsync();
    }

    // Helper method: converts ProductionState enum to human-readable string.
    // Uses switch expression for concise pattern matching.
    private static string GetStateDisplay(ProductionState state) => state switch
    {
        ProductionState.Red => "Standing Still",
        ProductionState.Yellow => "Starting Up / Winding Down",
        ProductionState.Green => "Producing Normally",
        _ => "Unknown" // Default case (underscore = discard pattern)
    };
}