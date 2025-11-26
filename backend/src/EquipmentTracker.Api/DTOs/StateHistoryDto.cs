using EquipmentTracker.Api.Models.Enums;

namespace EquipmentTracker.Api.DTOs;

public record StateHistoryDto(
    Guid Id,
    Guid EquipmentId,
    string EquipmentName,
    ProductionState PreviousState,
    string PreviousStateDisplay,
    ProductionState NewState,
    string NewStateDisplay,
    string ChangedBy,
    DateTime ChangedAt,
    string? Notes
);