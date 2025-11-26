using EquipmentTracker.Api.Models.Enums;

namespace EquipmentTracker.Api.Models;

public class StateChange
{
    public Guid Id {get; set;}
    public Guid EquipmentId {get; set;}
    public ProductionState PreviousState {get; set;}
    public ProductionState NewState {get; set;}
    public string ChangedBy {get; set;} = string.Empty;
    public DateTime ChangedAt {get; set;} = DateTime.UtcNow; // Non-nullable - should never be null
    public string? Notes {get; set;} // ? Nullable - can be null

    // Navigation property
    public Equipment Equipment {get; set;} = null!; // Non-nullable but EF will populate it

}