namespace EquipmentTracker.Api.Models.Enums;

// I'm using enums for clear meaning ideal for states
public enum ProductionState
{
    Red = 0,    // Standing still
    Yellow = 1, // Starting up / winding down
    Green = 2   // Producing normally
}