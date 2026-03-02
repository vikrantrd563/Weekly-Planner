namespace WeeklyPlanner.Application.DTOs;

public record TeamMemberDto(
    Guid Id,
    string Name,
    bool IsLead,
    bool IsActive,
    DateTime CreatedAt
);

public record CreateTeamMemberRequest(string Name, bool IsLead = false);

public record UpdateTeamMemberRequest(string? Name, bool? IsLead, bool? IsActive);