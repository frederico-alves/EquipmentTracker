using EquipmentTracker.Api.Models.Enums;

namespace EquipmentTracker.Api.Models;

public class Equipment
{
    // { get; set; } Read and write allowed
    // { get; } Read only
    // { get; private set; } Publicly readable, privately writable
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public ProductionState CurrentState { get; set; } = ProductionState.Red;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property - one-to-many relationship between
    // EquipmentTracker and StateChange
    // ICollection - interface representing a collection of <StateChange>
    // = new List<StateChange>() - initialized to empty list
    // EF Core will create a foreign key in the StateChange table 
    // pointing back to EquipmentTracker, allowing queries like:
    // var history = equipment.StateChanges.ToList();
    public ICollection<StateChange> StateChanges { get; set; } = new List<StateChange>();
}