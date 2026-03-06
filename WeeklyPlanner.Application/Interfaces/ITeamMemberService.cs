using WeeklyPlanner.Application.DTOs;

namespace WeeklyPlanner.Application.Interfaces;

public interface ITeamMemberService
{
    Task<List<TeamMemberDto>> GetAllAsync();
    Task<TeamMemberDto?> GetByIdAsync(Guid id);
    Task<TeamMemberDto> CreateAsync(CreateTeamMemberRequest request);
    Task<TeamMemberDto?> UpdateAsync(Guid id, UpdateTeamMemberRequest request);
    Task<bool> SetLeadAsync(Guid id);
    Task<bool> ToggleActiveAsync(Guid id);
    Task ResetAllAsync();
}