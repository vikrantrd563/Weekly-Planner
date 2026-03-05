using Microsoft.EntityFrameworkCore;
using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Application.Interfaces;
using WeeklyPlanner.Application.Models;
using WeeklyPlanner.Infrastructure.Data;

namespace WeeklyPlanner.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _db;

    public DashboardService(AppDbContext db) => _db = db;

    public async Task<TeamDashboardDto> GetDashboardAsync(Guid weekId)
    {
        var week = await _db.PlanningWeeks.FindAsync(weekId)
            ?? throw new InvalidOperationException("Week not found.");

        var workItems = await _db.WorkItems
            .Include(w => w.BacklogItem)
            .Include(w => w.TeamMember)
            .Where(w => w.PlanningWeekId == weekId)
            .ToListAsync();

        var totalCommitted = workItems.Sum(w => w.CommittedHours);
        var totalCompleted = workItems.Sum(w => w.CompletedHours);
        var totalDone      = workItems.Count(w => w.Status == WorkItemStatus.Done);
        var totalBlocked   = workItems.Count(w => w.Status == WorkItemStatus.Blocked);
        var overallPct     = totalCommitted > 0
            ? Math.Round((double)totalCompleted / totalCommitted * 100, 1) : 0.0;

        var categories = workItems
            .GroupBy(w => w.BacklogItem.Category)
            .Select(g => BuildCategorySummary(g.Key, g.ToList()))
            .ToList();

        var members = workItems
            .GroupBy(w => w.TeamMemberId)
            .Select(g => BuildMemberSummary(
                g.Key,
                g.First().TeamMember.Name,
                g.ToList()))
            .ToList();

        return new TeamDashboardDto(
            weekId,
            week.PlanningDate,
            overallPct,
            totalDone,
            totalBlocked,
            workItems.Count,
            totalCommitted,
            totalCompleted,
            categories,
            members
        );
    }

    public async Task<CategorySummaryDto> GetCategorySummaryAsync(Guid weekId, int categoryId)
    {
        var category = (BacklogCategory)categoryId;

        var workItems = await _db.WorkItems
            .Include(w => w.BacklogItem)
            .Where(w => w.PlanningWeekId == weekId &&
                        w.BacklogItem.Category == category)
            .ToListAsync();

        return BuildCategorySummary(category, workItems);
    }

    public async Task<MemberSummaryDto> GetMemberSummaryAsync(Guid weekId, Guid memberId)
    {
        var member = await _db.TeamMembers.FindAsync(memberId)
            ?? throw new InvalidOperationException("Member not found.");

        var workItems = await _db.WorkItems
            .Include(w => w.BacklogItem)
            .Where(w => w.PlanningWeekId == weekId && w.TeamMemberId == memberId)
            .ToListAsync();

        return BuildMemberSummary(memberId, member.Name, workItems);
    }

    private static CategorySummaryDto BuildCategorySummary(
        BacklogCategory category, List<WorkItem> items)
    {
        var committed = items.Sum(w => w.CommittedHours);
        var completed = items.Sum(w => w.CompletedHours);
        var pct       = committed > 0
            ? Math.Round((double)completed / committed * 100, 1) : 0.0;

        var tasks = items.Select(w => new TaskDetailDto(
            w.Id,
            w.BacklogItem.Title,
            w.BacklogItem.Category.ToString(),
            w.CommittedHours,
            w.CompletedHours,
            w.Status.ToString()
        )).ToList();

        return new CategorySummaryDto(
            category.ToString(),
            (int)category,
            committed,
            completed,
            pct,
            items.Count,
            items.Count(w => w.Status == WorkItemStatus.Done),
            tasks
        );
    }

    private static MemberSummaryDto BuildMemberSummary(
        Guid memberId, string memberName, List<WorkItem> items)
    {
        var committed = items.Sum(w => w.CommittedHours);
        var completed = items.Sum(w => w.CompletedHours);
        var pct       = committed > 0
            ? Math.Round((double)completed / committed * 100, 1) : 0.0;

        var tasks = items.Select(w => new TaskDetailDto(
            w.Id,
            w.BacklogItem.Title,
            w.BacklogItem.Category.ToString(),
            w.CommittedHours,
            w.CompletedHours,
            w.Status.ToString()
        )).ToList();

        return new MemberSummaryDto(
            memberId,
            memberName,
            committed,
            completed,
            pct,
            items.Count(w => w.Status == WorkItemStatus.Done),
            items.Count(w => w.Status == WorkItemStatus.Blocked),
            items.Count,
            tasks
        );
    }
}