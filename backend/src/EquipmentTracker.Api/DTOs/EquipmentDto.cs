// DTO - Data Transfer Objects
using EquipmentTracker.Api.Models.Enums;

namespace EquipmentTracker.Api.DTOs;

// Records are reference types optimized for immutable data.
// Introduced in C# 9 it's perfect for DTOs.
public record EquipmentDto(
    Guid Id,
    string Name,
    string Location,
    ProductionState CurrentState,
    string CurrentStateDisplay,
    DateTime UpdatedAt
);

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