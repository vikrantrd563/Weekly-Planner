namespace WeeklyPlanner.Application.DTOs;

public record UpdateProgressRequest(
    Guid WorkItemId,
    double CompletedHours,
    int Status,
    string? Note = null
);

public record UpdateProgressResponse(
    Guid WorkItemId,
    string BacklogItemTitle,
    double CommittedHours,
    double CompletedHours,
    string Status,
    bool IsOverCommitted,
    string? Warning = null
);

public record ProgressEntryDto(
    Guid Id,
    Guid WorkItemId,
    double CompletedHours,
    string Status,
    string? Note,
    DateTime CreatedAt
);

public record TeamDashboardDto(
    Guid WeekId,
    DateTime PlanningDate,
    double OverallCompletionPct,
    int TotalTasksDone,
    int TotalTasksBlocked,
    int TotalTasks,
    double OverallCommittedHours,
    double OverallCompletedHours,
    List<CategorySummaryDto> CategorySummaries,
    List<MemberSummaryDto> MemberSummaries
);

public record CategorySummaryDto(
    string Category,
    int CategoryId,
    double CommittedHours,
    double CompletedHours,
    double CompletionPct,
    int TaskCount,
    int DoneCount,
    List<TaskDetailDto> Tasks
);

public record MemberSummaryDto(
    Guid MemberId,
    string MemberName,
    double CommittedHours,
    double CompletedHours,
    double CompletionPct,
    int TasksDone,
    int TasksBlocked,
    int TotalTasks,
    List<TaskDetailDto> Tasks
);

public record TaskDetailDto(
    Guid WorkItemId,
    string BacklogItemTitle,
    string Category,
    double CommittedHours,
    double CompletedHours,
    string Status
);