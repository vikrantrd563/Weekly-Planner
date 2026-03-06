using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Application.Models;

namespace WeeklyPlanner.Application.Interfaces;

public interface IBacklogService
{
    Task<List<BacklogItemDto>> GetAllAsync(BacklogStatus? statusFilter = null);
    Task<BacklogItemDto?> GetByIdAsync(Guid id);
    Task<BacklogItemDto> CreateAsync(CreateBacklogItemRequest request);
    Task<BacklogItemDto?> UpdateAsync(Guid id, UpdateBacklogItemRequest request);
    Task<bool> ArchiveAsync(Guid id);
    Task<bool> ResetAllAsync();
}