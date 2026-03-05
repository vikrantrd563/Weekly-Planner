using Microsoft.EntityFrameworkCore;
using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Application.Interfaces;
using WeeklyPlanner.Application.Models;
using WeeklyPlanner.Infrastructure.Data;

namespace WeeklyPlanner.Infrastructure.Services;

public class ProgressService : IProgressService
{
    private readonly AppDbContext _db;

    public ProgressService(AppDbContext db) => _db = db;

    public async Task<UpdateProgressResponse> UpdateProgressAsync(UpdateProgressRequest request)
    {
        var workItem = await _db.WorkItems
            .Include(w => w.PlanningWeek)
            .Include(w => w.BacklogItem)
            .FirstOrDefaultAsync(w => w.Id == request.WorkItemId)
            ?? throw new InvalidOperationException("Work item not found.");

        if (workItem.PlanningWeek.Status != WeekStatus.Frozen &&
            workItem.PlanningWeek.Status != WeekStatus.Completed)
            throw new InvalidOperationException(
                "Progress can only be updated on frozen or completed weeks.");

        if (!Enum.IsDefined(typeof(WorkItemStatus), request.Status))
            throw new InvalidOperationException("Invalid status value.");

        workItem.CompletedHours = Convert.ToInt32(request.CompletedHours);
        workItem.Status = (WorkItemStatus)request.Status;

        var entry = new ProgressEntry
        {
            WorkItemId     = request.WorkItemId,
            CompletedHours = (int)request.CompletedHours,
            Status         = (WorkItemStatus)request.Status,
            Note           = request.Note
        };
        _db.ProgressEntries.Add(entry);
        await _db.SaveChangesAsync();

        bool overCommitted = request.CompletedHours > workItem.CommittedHours;
        string? warning = overCommitted
            ? $"Completed hours ({request.CompletedHours}) exceed committed hours ({workItem.CommittedHours})."
            : null;

        return new UpdateProgressResponse(
            workItem.Id,
            workItem.BacklogItem.Title,
            workItem.CommittedHours,
            workItem.CompletedHours,
            workItem.Status.ToString(),
            overCommitted,
            warning
        );
    }

    public async Task<List<ProgressEntryDto>> GetWorkItemHistoryAsync(Guid workItemId)
    {
        return await _db.ProgressEntries
            .Where(p => p.WorkItemId == workItemId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new ProgressEntryDto(
                p.Id,
                p.WorkItemId,
                p.CompletedHours,
                p.Status.ToString(),
                p.Note,
                p.CreatedAt
            ))
            .ToListAsync();
    }

    public async Task<List<UpdateProgressResponse>> GetMemberProgressAsync(Guid weekId, Guid memberId)
    {
        return await _db.WorkItems
            .Include(w => w.BacklogItem)
            .Where(w => w.PlanningWeekId == weekId && w.TeamMemberId == memberId)
            .Select(w => new UpdateProgressResponse(
                w.Id,
                w.BacklogItem.Title,
                w.CommittedHours,
                w.CompletedHours,
                w.Status.ToString(),
                w.CompletedHours > w.CommittedHours,
                null
            ))
            .ToListAsync();
    }
}