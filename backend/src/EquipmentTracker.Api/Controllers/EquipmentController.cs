using Microsoft.AspNetCore.Mvc;
using EquipmentTracker.Api.DTOs;
using EquipmentTracker.Api.Services;

namespace EquipmentTracker.Api.Controllers;

[ApiController] // Enables API-specific behaviors
[Route("api/[controller]")] // URL pattern: api/equipment
public class EquipmentController : ControllerBase
//           ─────────┬────────
//                    │
//         ASP.NET removes "Controller" suffix
//         and uses lowercase: "equipment" for the API endpoint
//         api/equipment
{
    private readonly IEquipmentService _equipmentService;

    public EquipmentController(IEquipmentService equipmentService)
    {
        _equipmentService = equipmentService;
    }

    // Get all equipment with current states
    // Responds to GET requests
    // GET /api/equipment
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EquipmentDto>>> GetAll()
    {
        var equipment = await _equipmentService.GetAllEquipmentAsync();
        return Ok(equipment); // Returns 200 with data
    }

    // Get single equipment by ID
    // GET with route parameter
    // GET /api/equipment/123
    [HttpGet("{id:guid}")] 
    public async Task<ActionResult<EquipmentDto>> GetById(Guid id)
    {
        var equipment = await _equipmentService.GetEquipmentByIdAsync(id);
        if (equipment == null) return NotFound(); // Returns 404 status
        return Ok(equipment); // Returns 200 with data
    }

    // Update equipment state (Red/Yellow/Green)
    // PUT with route parameter
    // PUT /api/equipment/123/state
    [HttpPut("{id:guid}/state")]
    public async Task<ActionResult<EquipmentDto>> UpdateState(
        Guid id, // From route: /api/equipment/{id}/state
        [FromBody] UpdateStateRequest request) // From request body (JSON)
    {
        var equipment = await _equipmentService.UpdateStateAsync(id, request);
        if (equipment == null) return NotFound(); // Returns 404 status
        return Ok(equipment); // Returns 200 with data
    }

    // Get state change history with optional filters
    // Responds to GET requests
    // GET /api/equipment/history
    [HttpGet("history")]
    public async Task<ActionResult<IEnumerable<StateHistoryDto>>> GetHistory(
        [FromQuery] Guid? equipmentId,  // From: ?equipmentId=...
        [FromQuery] DateTime? from,     // From: ?from=...
        [FromQuery] DateTime? to)       // From: ?to=...
    {
        var history = await _equipmentService.GetStateHistoryAsync(equipmentId, from, to);
        return Ok(history); // Returns 200 with data
    }
}

// Example API calls:
// 
// # Get all equipment
// GET /api/equipment

// # Get single equipment
// GET /api/equipment/11111111-1111-1111-1111-111111111111

// # Update state
// PUT /api/equipment/11111111-1111-1111-1111-111111111111/state
// Content-Type: application/json
// {
//   "newState": 2,
//   "changedBy": "John",
//   "notes": "Starting production"
// }

// # Get history with filters
// GET /api/equipment/history?equipmentId=111...&from=2025-01-01&to=2025-12-31