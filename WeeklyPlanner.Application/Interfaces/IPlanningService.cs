using WeeklyPlanner.Application.DTOs;

namespace WeeklyPlanner.Application.Interfaces;

public interface IPlanningService
{
    Task<WeekSummaryDto> CreateWeekAsync(CreateWeekRequest request);
    Task<WeekSummaryDto?> GetActiveWeekAsync();
    Task<WeekSummaryDto?> GetByIdAsync(Guid id);
    Task<List<WeekSummaryDto>> GetAllAsync();
    Task<WeekSummaryDto> OpenForPlanningAsync(Guid weekId);
    Task<WeekSummaryDto> FreezeWeekAsync(Guid weekId);
    Task<WeekSummaryDto> CompleteWeekAsync(Guid weekId);
    Task<bool> CancelWeekAsync(Guid weekId);
    Task<bool> ResetAllAsync();
}

public interface IWorkItemService
{
    Task<WorkItemDto> AddWorkItemAsync(CreateWorkItemRequest request);
    Task<WorkItemDto?> UpdateWorkItemAsync(Guid id, UpdateWorkItemRequest request);
    Task<bool> RemoveWorkItemAsync(Guid id);
    Task<bool> MarkReadyAsync(Guid weekId, Guid memberId);
    Task<List<WorkItemDto>> GetByWeekAndMemberAsync(Guid weekId, Guid memberId);
}