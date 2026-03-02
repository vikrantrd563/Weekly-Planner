using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Application.Models;
using WeeklyPlanner.Infrastructure.Data;
using WeeklyPlanner.Infrastructure.Services;

namespace WeeklyPlanner.Tests.Services;

public class BacklogServiceTests
{
    private AppDbContext CreateDb()
    {
        var opts = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(opts);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllItems()
    {
        using var db = CreateDb();
        var svc = new BacklogService(db);
        await svc.CreateAsync(new CreateBacklogItemRequest("Task A", Category: BacklogCategory.ClientFocused));
        await svc.CreateAsync(new CreateBacklogItemRequest("Task B", Category: BacklogCategory.TechDebt));

        var result = await svc.GetAllAsync();

        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetAllAsync_FiltersByStatus()
    {
        using var db = CreateDb();
        var svc = new BacklogService(db);
        var item = await svc.CreateAsync(new CreateBacklogItemRequest("Task A"));
        await svc.ArchiveAsync(item.Id);

        var available = await svc.GetAllAsync(BacklogStatus.Available);
        var archived  = await svc.GetAllAsync(BacklogStatus.Archived);

        available.Should().BeEmpty();
        archived.Should().HaveCount(1);
    }

    [Fact]
    public async Task CreateAsync_SetsCorrectDefaults()
    {
        using var db = CreateDb();
        var svc = new BacklogService(db);

        var result = await svc.CreateAsync(new CreateBacklogItemRequest("My Task"));

        result.Status.Should().Be("Available");
        result.CategoryId.Should().Be((int)BacklogCategory.ClientFocused);
    }

    [Fact]
    public async Task ArchiveAsync_SetsStatusToArchived()
    {
        using var db = CreateDb();
        var svc = new BacklogService(db);
        var item = await svc.CreateAsync(new CreateBacklogItemRequest("Task"));

        await svc.ArchiveAsync(item.Id);

        var updated = await svc.GetByIdAsync(item.Id);
        updated!.Status.Should().Be("Archived");
    }

    [Fact]
    public async Task ArchiveAsync_ThrowsWhenItemInActiveFrozenWeek()
    {
        using var db = CreateDb();
        var svc = new BacklogService(db);
        var item = await svc.CreateAsync(new CreateBacklogItemRequest("Task"));

        var week   = new PlanningWeek { PlanningDate = DateTime.Today, Status = WeekStatus.Frozen, ClientFocusedPct = 100 };
        var member = new TeamMember { Name = "Alice" };
        db.PlanningWeeks.Add(week);
        db.TeamMembers.Add(member);
        db.WorkItems.Add(new WorkItem
        {
            PlanningWeekId = week.Id,
            TeamMemberId   = member.Id,
            BacklogItemId  = item.Id,
            CommittedHours = 4
        });
        await db.SaveChangesAsync();

        var act = async () => await svc.ArchiveAsync(item.Id);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*active planning week*");
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNullForMissingId()
    {
        using var db = CreateDb();
        var svc = new BacklogService(db);

        var result = await svc.UpdateAsync(Guid.NewGuid(), new UpdateBacklogItemRequest("New Title"));

        result.Should().BeNull();
    }
}