using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Application.Models;
using WeeklyPlanner.Infrastructure.Data;
using WeeklyPlanner.Infrastructure.Services;

namespace WeeklyPlanner.Tests.Services;

public class WorkItemServiceTests
{
    private AppDbContext CreateDb()
    {
        var opts = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;
        return new AppDbContext(opts);
    }

    private async Task<(AppDbContext db, Guid weekId, Guid memberId, Guid backlogId)> Setup(
        int clientPct = 50, int techPct = 30, int rndPct = 20)
    {
        var db = CreateDb();
        var member = new TeamMember { Name = "Alice" };
        var backlog = new BacklogItem
        {
            Title = "Task",
            Category = BacklogCategory.ClientFocused
        };
        db.TeamMembers.Add(member);
        db.BacklogItems.Add(backlog);

        var week = new PlanningWeek
        {
            PlanningDate     = DateTime.Today,
            Status           = WeekStatus.Planning,
            ClientFocusedPct = clientPct,
            TechDebtPct      = techPct,
            RnDPct           = rndPct
        };
        db.PlanningWeeks.Add(week);
        db.PlanningWeekMembers.Add(new PlanningWeekMember
        {
            PlanningWeekId = week.Id,
            TeamMemberId   = member.Id
        });
        await db.SaveChangesAsync();
        return (db, week.Id, member.Id, backlog.Id);
    }

    [Fact]
    public async Task AddWorkItemAsync_AddsSuccessfully()
    {
        var (db, weekId, memberId, backlogId) = await Setup();
        var svc = new WorkItemService(db);

        var result = await svc.AddWorkItemAsync(
            new CreateWorkItemRequest(weekId, memberId, backlogId, 5));

        result.CommittedHours.Should().Be(5);
        result.IsOverCommitted.Should().BeFalse();
    }

    [Fact]
    public async Task AddWorkItemAsync_ThrowsWhenExceedsCategoryBudget()
    {
        // ClientFocused budget = 30 * 10% = 3h
        var (db, weekId, memberId, backlogId) = await Setup(clientPct: 10, techPct: 60, rndPct: 30);
        var svc = new WorkItemService(db);

        var act = async () => await svc.AddWorkItemAsync(
            new CreateWorkItemRequest(weekId, memberId, backlogId, 5));

        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("*budget*");
    }

    [Fact]
    public async Task AddWorkItemAsync_ThrowsWhenExceedsTotal30Hours()
    {
        var (db, weekId, memberId, backlogId) = await Setup(clientPct: 100, techPct: 0, rndPct: 0);
        var svc = new WorkItemService(db);
        await svc.AddWorkItemAsync(new CreateWorkItemRequest(weekId, memberId, backlogId, 28));

        var act = async () => await svc.AddWorkItemAsync(
            new CreateWorkItemRequest(weekId, memberId, backlogId, 5));

        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("*30h*");
    }

    [Fact]
    public async Task RemoveWorkItemAsync_ThrowsOnFrozenWeek()
    {
        var (db, weekId, memberId, backlogId) = await Setup();
        var svc = new WorkItemService(db);
        var item = await svc.AddWorkItemAsync(
            new CreateWorkItemRequest(weekId, memberId, backlogId, 5));

        var week = await db.PlanningWeeks.FindAsync(weekId);
        week!.Status = WeekStatus.Frozen;
        await db.SaveChangesAsync();

        var act = async () => await svc.RemoveWorkItemAsync(item.Id);

        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("*frozen*");
    }

    [Fact]
    public async Task MarkReadyAsync_ReturnsTrueForValidMember()
    {
        var (db, weekId, memberId, _) = await Setup();
        var svc = new WorkItemService(db);

        var result = await svc.MarkReadyAsync(weekId, memberId);

        result.Should().BeTrue();
    }
}