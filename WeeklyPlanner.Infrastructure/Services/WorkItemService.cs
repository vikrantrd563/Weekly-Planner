using Microsoft.EntityFrameworkCore;
using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Application.Interfaces;
using WeeklyPlanner.Application.Models;
using WeeklyPlanner.Infrastructure.Data;

namespace WeeklyPlanner.Infrastructure.Services;

public class WorkItemService : IWorkItemService
{
    private readonly AppDbContext _db;
    public WorkItemService(AppDbContext db) => _db = db;

    private static WorkItemDto ToDto(WorkItem w) => new(
        w.Id, w.PlanningWeekId, w.TeamMemberId, w.TeamMember?.Name ?? "",
        w.BacklogItemId, w.BacklogItem?.Title ?? "",
        w.BacklogItem?.Category.ToString() ?? "", (int)(w.BacklogItem?.Category ?? 0),
        w.CommittedHours, w.CompletedHours,
        w.Status.ToString(), (int)w.Status,
        w.CompletedHours > w.CommittedHours
    );

    public async Task<WorkItemDto> AddWorkItemAsync(CreateWorkItemRequest request)
    {
        var week = await _db.PlanningWeeks.FindAsync(request.PlanningWeekId)
            ?? throw new InvalidOperationException("Planning week not found.");
        if (week.Status != WeekStatus.Planning)
            throw new InvalidOperationException("Can only add items while week is in Planning status.");

        var isMember = await _db.PlanningWeekMembers
            .AnyAsync(m => m.PlanningWeekId == request.PlanningWeekId
                        && m.TeamMemberId == request.TeamMemberId);
        if (!isMember)
            throw new InvalidOperationException("This member is not part of this planning week.");

        var backlogItem = await _db.BacklogItems.FindAsync(request.BacklogItemId)
            ?? throw new InvalidOperationException("Backlog item not found.");

        var existingHoursInCategory = await _db.WorkItems
            .Include(w => w.BacklogItem)
            .Where(w => w.PlanningWeekId == request.PlanningWeekId
                     && w.TeamMemberId == request.TeamMemberId
                     && w.BacklogItem.Category == backlogItem.Category)
            .SumAsync(w => (int?)w.CommittedHours) ?? 0;

        int categoryBudget = backlogItem.Category switch
        {
            BacklogCategory.ClientFocused => (int)Math.Round(30 * week.ClientFocusedPct / 100.0),
            BacklogCategory.TechDebt      => (int)Math.Round(30 * week.TechDebtPct / 100.0),
            BacklogCategory.RnD           => (int)Math.Round(30 * week.RnDPct / 100.0),
            _                             => 0
        };

        if (existingHoursInCategory + request.CommittedHours > categoryBudget)
            throw new InvalidOperationException(
                $"Adding {request.CommittedHours}h would exceed the {backlogItem.Category} budget of {categoryBudget}h. Currently claimed: {existingHoursInCategory}h.");

        var totalCommitted = await _db.WorkItems
            .Where(w => w.PlanningWeekId == request.PlanningWeekId
                     && w.TeamMemberId == request.TeamMemberId)
            .SumAsync(w => (int?)w.CommittedHours) ?? 0;

        if (totalCommitted + request.CommittedHours > 30)
            throw new InvalidOperationException(
                $"Adding {request.CommittedHours}h would exceed the 30h total limit. Currently committed: {totalCommitted}h.");

        var workItem = new WorkItem
        {
            PlanningWeekId = request.PlanningWeekId,
            TeamMemberId   = request.TeamMemberId,
            BacklogItemId  = request.BacklogItemId,
            CommittedHours = request.CommittedHours
        };
        _db.WorkItems.Add(workItem);
        await _db.SaveChangesAsync();

        await _db.Entry(workItem).Reference(w => w.BacklogItem).LoadAsync();
        await _db.Entry(workItem).Reference(w => w.TeamMember).LoadAsync();
        return ToDto(workItem);
    }

    public async Task<WorkItemDto?> UpdateWorkItemAsync(Guid id, UpdateWorkItemRequest request)
    {
        var workItem = await _db.WorkItems
            .Include(w => w.BacklogItem)
            .Include(w => w.TeamMember)
            .Include(w => w.PlanningWeek)
            .FirstOrDefaultAsync(w => w.Id == id);

        if (workItem is null) return null;
        if (workItem.PlanningWeek.Status == WeekStatus.Frozen ||
            workItem.PlanningWeek.Status == WeekStatus.Completed)
            throw new InvalidOperationException("Cannot modify work items in a frozen or completed week.");

        workItem.CommittedHours = request.CommittedHours;
        await _db.SaveChangesAsync();
        return ToDto(workItem);
    }

    public async Task<bool> RemoveWorkItemAsync(Guid id)
    {
        var workItem = await _db.WorkItems
            .Include(w => w.PlanningWeek)
            .FirstOrDefaultAsync(w => w.Id == id);
        if (workItem is null) return false;
        if (workItem.PlanningWeek.Status == WeekStatus.Frozen ||
            workItem.PlanningWeek.Status == WeekStatus.Completed)
            throw new InvalidOperationException("Cannot remove work items from a frozen or completed week.");

        _db.WorkItems.Remove(workItem);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> MarkReadyAsync(Guid weekId, Guid memberId)
    {
        var membership = await _db.PlanningWeekMembers
            .FirstOrDefaultAsync(m => m.PlanningWeekId == weekId
                                   && m.TeamMemberId == memberId);
        if (membership is null) return false;
        membership.IsReady = true;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<WorkItemDto>> GetByWeekAndMemberAsync(Guid weekId, Guid memberId)
    {
        return await _db.WorkItems
            .Include(w => w.BacklogItem)
            .Include(w => w.TeamMember)
            .Where(w => w.PlanningWeekId == weekId && w.TeamMemberId == memberId)
            .Select(w => ToDto(w))
            .ToListAsync();
    }
}