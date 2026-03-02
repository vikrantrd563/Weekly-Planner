using WeeklyPlanner.Application.Models;

namespace WeeklyPlanner.Application.DTOs;

public record BacklogItemDto(
    Guid Id,
    string Title,
    string Description,
    string Category,
    int CategoryId,
    int? EstimatedHours,
    string Status,
    int StatusId,
    DateTime CreatedAt
);

public record CreateBacklogItemRequest(
    string Title,
    string Description = "",
    BacklogCategory Category = BacklogCategory.ClientFocused,
    int? EstimatedHours = null
);

public record UpdateBacklogItemRequest(
    string? Title = null,
    string? Description = null,
    BacklogCategory? Category = null,
    int? EstimatedHours = null
);
