using EquipmentTracker.Api.DTOs;

namespace EquipmentTracker.Api.Services;

// Interface:
// public interface IEquipmentService
// {
//     Task<EquipmentDto?> GetEquipmentByIdAsync(Guid id);
//     //└── return type     └── method name      └── parameters
// }

// Why use interfaces?
// - Abstraction: Controller depends on IEquipmentService, not EquipmentService
// - Testability: Easily mock the interface in unit tests

public interface IEquipmentService
{
    // Task<T> represents an asynchronous operation that will eventually return a value of type T
    // The ? in Task<EquipmentDto?> means the method might return null (e.g., when equipment isn't found)
    Task<IEnumerable<EquipmentDto>> GetAllEquipmentAsync();
    Task<EquipmentDto?> GetEquipmentByIdAsync(Guid id);
    Task<EquipmentDto?> UpdateStateAsync(Guid id, UpdateStateRequest request);
    Task<IEnumerable<StateHistoryDto>> GetStateHistoryAsync(Guid? equipmentId, DateTime? from, DateTime? to);
}