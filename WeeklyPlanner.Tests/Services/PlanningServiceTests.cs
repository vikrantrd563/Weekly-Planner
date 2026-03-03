using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Application.Models;
using WeeklyPlanner.Infrastructure.Data;
using WeeklyPlanner.Infrastructure.Services;

namespace WeeklyPlanner.Tests.Services;

public class PlanningServiceTests
{
    private AppDbContext CreateDb()
    {
        var opts = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;
        return new AppDbContext(opts);
    }

    private async Task<(AppDbContext db, Guid memberId)> CreateDbWithMember()
    {
        var db = CreateDb();
        var member = new TeamMember { Name = "Alice", IsLead = true };
        db.TeamMembers.Add(member);
        await db.SaveChangesAsync();
        return (db, member.Id);
    }

    private static DateTime GetNextTuesday()
    {
        var d = DateTime.Today;
        while (d.DayOfWeek != DayOfWeek.Tuesday) d = d.AddDays(1);
        return d;
    }

    private CreateWeekRequest ValidRequest(List<Guid> memberIds) => new(
        PlanningDate: GetNextTuesday(),
        ParticipatingMemberIds: memberIds,
        ClientFocusedPct: 50,
        TechDebtPct: 30,
        RnDPct: 20
    );

    [Fact]
    public async Task CreateWeekAsync_ThrowsOnNonTuesday()
    {
        var (db, memberId) = await CreateDbWithMember();
        var svc = new PlanningService(db);
        var nonTuesday = DateTime.Today;
        while (nonTuesday.DayOfWeek == DayOfWeek.Tuesday) nonTuesday = nonTuesday.AddDays(1);

        var act = async () => await svc.CreateWeekAsync(
            ValidRequest(new List<Guid> { memberId }) with { PlanningDate = nonTuesday });

        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("*Tuesday*");
    }

    [Fact]
    public async Task CreateWeekAsync_ThrowsWhenPercentagesDontSum100()
    {
        var (db, memberId) = await CreateDbWithMember();
        var svc = new PlanningService(db);
        var bad = ValidRequest(new List<Guid> { memberId }) with
        {
            ClientFocusedPct = 50, TechDebtPct = 30, RnDPct = 10
        };

        var act = async () => await svc.CreateWeekAsync(bad);

        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("*100*");
    }

    [Fact]
    public async Task CreateWeekAsync_ThrowsWhenActiveWeekExists()
    {
        var (db, memberId) = await CreateDbWithMember();
        var svc = new PlanningService(db);
        await svc.CreateWeekAsync(ValidRequest(new List<Guid> { memberId }));

        var act = async () => await svc.CreateWeekAsync(
            ValidRequest(new List<Guid> { memberId }));

        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("*active*");
    }

    [Fact]
    public async Task FreezeWeekAsync_ThrowsWhenMemberHasLessThan30Hours()
    {
        var (db, memberId) = await CreateDbWithMember();
        var svc = new PlanningService(db);
        var week = await svc.CreateWeekAsync(ValidRequest(new List<Guid> { memberId }));
        await svc.OpenForPlanningAsync(week.Id);

        var act = async () => await svc.FreezeWeekAsync(week.Id);

        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("*30*");
    }

    [Fact]
    public async Task GetActiveWeekAsync_ReturnsNullWhenNoActiveWeek()
    {
        var db = CreateDb();
        var svc = new PlanningService(db);

        var result = await svc.GetActiveWeekAsync();

        result.Should().BeNull();
    }

    [Fact]
    public async Task CancelWeekAsync_RemovesWeekAndWorkItems()
    {
        var (db, memberId) = await CreateDbWithMember();
        var svc = new PlanningService(db);
        var week = await svc.CreateWeekAsync(ValidRequest(new List<Guid> { memberId }));

        var result = await svc.CancelWeekAsync(week.Id);

        result.Should().BeTrue();
        (await svc.GetActiveWeekAsync()).Should().BeNull();
    }
}