// DTO - Data Transfer Objects
using EquipmentTracker.Api.Models.Enums;

namespace EquipmentTracker.Api.DTOs;

// Records are reference types optimized for immutable data.
// Introduced in C# 9 it's perfect for DTOs.

// Use Records for:
// DTOs / API responses
// Immutable data
// Value-based equality
// Simple data carriers

// Use Classes for:
// Domain entities with behavior
// Mutable state
// Reference-based identity
// Complex business logic

public record UpdateStateRequest(
    ProductionState NewState,
    string ChangedBy,
    string? Notes
);

// Request body to change the equipment state:
// {
//   "newState": 2,
//   "changedBy": "Freddy",
//   "notes": "Starting morning shift"
// }