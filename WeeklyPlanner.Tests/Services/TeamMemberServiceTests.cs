using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Infrastructure.Data;
using WeeklyPlanner.Infrastructure.Services;

namespace WeeklyPlanner.Tests.Services;

public class TeamMemberServiceTests
{
    private AppDbContext CreateDb()
    {
        var opts = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(opts);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsLeadFirst()
    {
        using var db = CreateDb();
        var svc = new TeamMemberService(db);

        await svc.CreateAsync(new CreateTeamMemberRequest("Bob"));
        await svc.CreateAsync(new CreateTeamMemberRequest("Alice", IsLead: true));

        var result = await svc.GetAllAsync();

        result[0].Name.Should().Be("Alice");
        result[0].IsLead.Should().BeTrue();
    }

    [Fact]
    public async Task CreateAsync_CreatesWithCorrectDefaults()
    {
        using var db = CreateDb();
        var svc = new TeamMemberService(db);

        var result = await svc.CreateAsync(
            new CreateTeamMemberRequest("Alice"));

        result.Name.Should().Be("Alice");
        result.IsLead.Should().BeFalse();
        result.IsActive.Should().BeTrue();
        result.Id.Should().NotBeEmpty();
    }

    [Fact]
    public async Task CreateAsync_ThrowsOnDuplicateName()
    {
        using var db = CreateDb();
        var svc = new TeamMemberService(db);

        await svc.CreateAsync(new CreateTeamMemberRequest("Alice"));

        var act = async () =>
            await svc.CreateAsync(
                new CreateTeamMemberRequest("alice"));

        await act.Should()
            .ThrowAsync<InvalidOperationException>()
            .WithMessage("*Alice*");
    }

    [Fact]
    public async Task SetLeadAsync_ClearsPreviousLead()
    {
        using var db = CreateDb();
        var svc = new TeamMemberService(db);

        var alice =
            await svc.CreateAsync(
                new CreateTeamMemberRequest("Alice", IsLead: true));

        var bob =
            await svc.CreateAsync(
                new CreateTeamMemberRequest("Bob"));

        await svc.SetLeadAsync(bob.Id);

        var all = await svc.GetAllAsync();

        all.Single(m => m.Name == "Bob").IsLead.Should().BeTrue();
        all.Single(m => m.Name == "Alice").IsLead.Should().BeFalse();
    }

    [Fact]
    public async Task ToggleActiveAsync_TogglesCorrectly()
    {
        using var db = CreateDb();
        var svc = new TeamMemberService(db);

        var member =
            await svc.CreateAsync(
                new CreateTeamMemberRequest("Alice"));

        await svc.ToggleActiveAsync(member.Id);

        var updated = await svc.GetByIdAsync(member.Id);

        updated!.IsActive.Should().BeFalse();
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNullForMissingId()
    {
        using var db = CreateDb();
        var svc = new TeamMemberService(db);

        var result =
            await svc.GetByIdAsync(Guid.NewGuid());

        result.Should().BeNull();
    }
}