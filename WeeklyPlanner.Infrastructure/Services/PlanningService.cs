using Microsoft.EntityFrameworkCore;
using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Application.Interfaces;
using WeeklyPlanner.Application.Models;
using WeeklyPlanner.Infrastructure.Data;

namespace WeeklyPlanner.Infrastructure.Services;

public class PlanningService : IPlanningService
{
    private readonly AppDbContext _db;
    public PlanningService(AppDbContext db) => _db = db;

    private static int CalcBudget(int totalHours, int pct) =>
        (int)Math.Round(totalHours * pct / 100.0);

    private async Task<WeekSummaryDto> ToDto(PlanningWeek week)
    {
        var members = await _db.PlanningWeekMembers
            .Include(m => m.TeamMember)
            .Where(m => m.PlanningWeekId == week.Id)
            .ToListAsync();

        var memberDtos = new List<MemberBudgetDto>();
        foreach (var m in members)
        {
            var committed = await _db.WorkItems
                .Where(w => w.PlanningWeekId == week.Id && w.TeamMemberId == m.TeamMemberId)
                .SumAsync(w => (int?)w.CommittedHours) ?? 0;

            memberDtos.Add(new MemberBudgetDto(
                m.TeamMemberId, m.TeamMember.Name, m.IsReady,
                CalcBudget(30, week.ClientFocusedPct),
                CalcBudget(30, week.TechDebtPct),
                CalcBudget(30, week.RnDPct),
                committed
            ));
        }

        return new WeekSummaryDto(
            week.Id, week.PlanningDate,
            week.Status.ToString(), (int)week.Status,
            week.ClientFocusedPct, week.TechDebtPct, week.RnDPct,
            memberDtos
        );
    }

    public async Task<WeekSummaryDto> CreateWeekAsync(CreateWeekRequest request)
    {
        // Rule: must be a Tuesday
        if (request.PlanningDate.DayOfWeek != DayOfWeek.Tuesday)
            throw new InvalidOperationException("Planning date must be a Tuesday.");

        // Rule: percentages must sum to 100
        if (request.ClientFocusedPct + request.TechDebtPct + request.RnDPct != 100)
            throw new InvalidOperationException("Category percentages must sum to exactly 100.");

        // Rule: only one active week at a time
        var activeExists = await _db.PlanningWeeks
            .AnyAsync(w => w.Status != WeekStatus.Completed);
        if (activeExists)
            throw new InvalidOperationException("An active planning week already exists. Complete or cancel it first.");

        if (request.ParticipatingMemberIds.Count < 1)
            throw new InvalidOperationException("At least one member must be selected.");

        var week = new PlanningWeek
        {
            PlanningDate     = request.PlanningDate.Date,
            ClientFocusedPct = request.ClientFocusedPct,
            TechDebtPct      = request.TechDebtPct,
            RnDPct           = request.RnDPct,
            Status           = WeekStatus.Setup
        };
        _db.PlanningWeeks.Add(week);

        foreach (var memberId in request.ParticipatingMemberIds)
        {
            var exists = await _db.TeamMembers.AnyAsync(m => m.Id == memberId && m.IsActive);
            if (!exists)
                throw new InvalidOperationException($"Member {memberId} not found or inactive.");

            _db.PlanningWeekMembers.Add(new PlanningWeekMember
            {
                PlanningWeekId = week.Id,
                TeamMemberId   = memberId
            });
        }

        await _db.SaveChangesAsync();
        return await ToDto(week);
    }

    public async Task<WeekSummaryDto?> GetActiveWeekAsync()
    {
        var week = await _db.PlanningWeeks
            .OrderByDescending(w => w.PlanningDate)
            .FirstOrDefaultAsync(w => w.Status != WeekStatus.Completed);
        return week is null ? null : await ToDto(week);
    }

    public async Task<WeekSummaryDto?> GetByIdAsync(Guid id)
    {
        var week = await _db.PlanningWeeks.FindAsync(id);
        return week is null ? null : await ToDto(week);
    }

    public async Task<List<WeekSummaryDto>> GetAllAsync()
    {
        var weeks = await _db.PlanningWeeks
            .OrderByDescending(w => w.PlanningDate)
            .ToListAsync();
        var dtos = new List<WeekSummaryDto>();
        foreach (var w in weeks) dtos.Add(await ToDto(w));
        return dtos;
    }

    public async Task<WeekSummaryDto> OpenForPlanningAsync(Guid weekId)
    {
        var week = await _db.PlanningWeeks.FindAsync(weekId)
            ?? throw new InvalidOperationException("Week not found.");
        if (week.Status != WeekStatus.Setup)
            throw new InvalidOperationException("Week must be in Setup status to open for planning.");
        week.Status = WeekStatus.Planning;
        await _db.SaveChangesAsync();
        return await ToDto(week);
    }

    public async Task<WeekSummaryDto> FreezeWeekAsync(Guid weekId)
    {
        var week = await _db.PlanningWeeks.FindAsync(weekId)
            ?? throw new InvalidOperationException("Week not found.");
        if (week.Status != WeekStatus.Planning)
            throw new InvalidOperationException("Week must be in Planning status to freeze.");

        var members = await _db.PlanningWeekMembers
            .Where(m => m.PlanningWeekId == weekId)
            .ToListAsync();

        foreach (var member in members)
        {
            var total = await _db.WorkItems
                .Where(w => w.PlanningWeekId == weekId && w.TeamMemberId == member.TeamMemberId)
                .SumAsync(w => (int?)w.CommittedHours) ?? 0;
            if (total != 30)
                throw new InvalidOperationException(
                    $"Member has {total}/30 hours planned. All members must plan exactly 30 hours before freezing.");
        }

        week.Status = WeekStatus.Frozen;
        await _db.SaveChangesAsync();
        return await ToDto(week);
    }

    public async Task<WeekSummaryDto> CompleteWeekAsync(Guid weekId)
    {
        var week = await _db.PlanningWeeks.FindAsync(weekId)
            ?? throw new InvalidOperationException("Week not found.");
        week.Status = WeekStatus.Completed;
        await _db.SaveChangesAsync();
        return await ToDto(week);
    }

    public async Task<bool> CancelWeekAsync(Guid weekId)
    {
        var week = await _db.PlanningWeeks.FindAsync(weekId);
        if (week is null) return false;
        if (week.Status == WeekStatus.Frozen || week.Status == WeekStatus.Completed)
            throw new InvalidOperationException("Cannot cancel a frozen or completed week.");

        var workItems = await _db.WorkItems
            .Where(w => w.PlanningWeekId == weekId).ToListAsync();
        _db.WorkItems.RemoveRange(workItems);

        var members = await _db.PlanningWeekMembers
            .Where(m => m.PlanningWeekId == weekId).ToListAsync();
        _db.PlanningWeekMembers.RemoveRange(members);

        _db.PlanningWeeks.Remove(week);
        await _db.SaveChangesAsync();
        return true;
    }
}