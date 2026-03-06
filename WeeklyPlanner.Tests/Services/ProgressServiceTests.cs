using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Application.Models;
using WeeklyPlanner.Infrastructure.Data;
using WeeklyPlanner.Infrastructure.Services;

namespace WeeklyPlanner.Tests.Services;

public class ProgressServiceTests
{
    private AppDbContext CreateDb()
    {
        var opts = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;
        return new AppDbContext(opts);
    }

    private async Task<(AppDbContext db, Guid weekId, Guid memberId, Guid workItemId)> Setup(
        WeekStatus weekStatus = WeekStatus.Frozen)
    {
        var db = CreateDb();

        var member = new TeamMember { Name = "Alice" };
        var backlog = new BacklogItem
        {
            Title    = "Task A",
            Category = BacklogCategory.ClientFocused
        };
        db.TeamMembers.Add(member);
        db.BacklogItems.Add(backlog);

        var week = new PlanningWeek
        {
            PlanningDate     = DateTime.Today,
            Status           = weekStatus,
            ClientFocusedPct = 100,
            TechDebtPct      = 0,
            RnDPct           = 0
        };
        db.PlanningWeeks.Add(week);

        var workItem = new WorkItem
        {
            PlanningWeekId = week.Id,
            TeamMemberId   = member.Id,
            BacklogItemId  = backlog.Id,
            CommittedHours = 8,
            CompletedHours = 0,
            Status         = WorkItemStatus.NotStarted
        };
        db.WorkItems.Add(workItem);
        await db.SaveChangesAsync();

        return (db, week.Id, member.Id, workItem.Id);
    }

    [Fact]
    public async Task UpdateProgressAsync_UpdatesSuccessfully()
    {
        var (db, _, _, workItemId) = await Setup();
        var svc = new ProgressService(db);

        var result = await svc.UpdateProgressAsync(
            new UpdateProgressRequest(workItemId, 6, (int)WorkItemStatus.InProgress));

        result.CompletedHours.Should().Be(6);
        result.Status.Should().Be("InProgress");
        result.IsOverCommitted.Should().BeFalse();
    }

    [Fact]
    public async Task UpdateProgressAsync_ThrowsWhenWeekNotFrozen()
    {
        var (db, _, _, workItemId) = await Setup(WeekStatus.Planning);
        var svc = new ProgressService(db);

        var act = async () => await svc.UpdateProgressAsync(
            new UpdateProgressRequest(workItemId, 6, (int)WorkItemStatus.InProgress));

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*frozen*");
    }

    [Fact]
    public async Task UpdateProgressAsync_FlagsOverCommitted()
    {
        var (db, _, _, workItemId) = await Setup();
        var svc = new ProgressService(db);

        var result = await svc.UpdateProgressAsync(
            new UpdateProgressRequest(workItemId, 10, (int)WorkItemStatus.Done));

        result.IsOverCommitted.Should().BeTrue();
        result.Warning.Should().NotBeNull();
    }

    [Fact]
    public async Task GetWorkItemHistoryAsync_ReturnsHistory()
    {
        var (db, _, _, workItemId) = await Setup();
        var svc = new ProgressService(db);

        await svc.UpdateProgressAsync(
            new UpdateProgressRequest(workItemId, 4, (int)WorkItemStatus.InProgress));
        await svc.UpdateProgressAsync(
            new UpdateProgressRequest(workItemId, 8, (int)WorkItemStatus.Done));

        var history = await svc.GetWorkItemHistoryAsync(workItemId);

        history.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetMemberProgressAsync_ReturnsWorkItems()
    {
        var (db, weekId, memberId, _) = await Setup();
        var svc = new ProgressService(db);

        var result = await svc.GetMemberProgressAsync(weekId, memberId);

        result.Should().HaveCount(1);
    }

    [Fact]
    public async Task UpdateProgressAsync_MarkedDone_StatusCorrect()
    {
        var (db, _, _, workItemId) = await Setup();
        var svc = new ProgressService(db);

        var result = await svc.UpdateProgressAsync(
            new UpdateProgressRequest(workItemId, 8, (int)WorkItemStatus.Done));

        result.Status.Should().Be("Done");
        result.IsOverCommitted.Should().BeFalse();
    }
}