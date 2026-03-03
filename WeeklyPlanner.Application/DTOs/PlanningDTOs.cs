using WeeklyPlanner.Application.Models;

namespace WeeklyPlanner.Application.DTOs;

public record CreateWeekRequest(
    DateTime PlanningDate,
    List<Guid> ParticipatingMemberIds,
    int ClientFocusedPct,
    int TechDebtPct,
    int RnDPct
);

public record WeekSummaryDto(
    Guid Id,
    DateTime PlanningDate,
    string Status,
    int StatusId,
    int ClientFocusedPct,
    int TechDebtPct,
    int RnDPct,
    List<MemberBudgetDto> Members
);

public record MemberBudgetDto(
    Guid MemberId,
    string MemberName,
    bool IsReady,
    int ClientFocusedBudget,
    int TechDebtBudget,
    int RnDBudget,
    int TotalCommitted
);

public record WorkItemDto(
    Guid Id,
    Guid PlanningWeekId,
    Guid TeamMemberId,
    string MemberName,
    Guid BacklogItemId,
    string BacklogItemTitle,
    string Category,
    int CategoryId,
    int CommittedHours,
    int CompletedHours,
    string Status,
    int StatusId,
    bool IsOverCommitted
);

public record CreateWorkItemRequest(
    Guid PlanningWeekId,
    Guid TeamMemberId,
    Guid BacklogItemId,
    int CommittedHours
);

public record UpdateWorkItemRequest(int CommittedHours);