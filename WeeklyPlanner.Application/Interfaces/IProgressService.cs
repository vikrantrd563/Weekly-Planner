using WeeklyPlanner.Application.DTOs;

namespace WeeklyPlanner.Application.Interfaces;

public interface IProgressService
{
    Task<UpdateProgressResponse> UpdateProgressAsync(UpdateProgressRequest request);
    Task<List<ProgressEntryDto>> GetWorkItemHistoryAsync(Guid workItemId);
    Task<List<UpdateProgressResponse>> GetMemberProgressAsync(Guid weekId, Guid memberId);
}

public interface IDashboardService
{
    Task<TeamDashboardDto> GetDashboardAsync(Guid weekId);
    Task<CategorySummaryDto> GetCategorySummaryAsync(Guid weekId, int categoryId);
    Task<MemberSummaryDto> GetMemberSummaryAsync(Guid weekId, Guid memberId);
}