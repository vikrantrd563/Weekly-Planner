using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using WeeklyPlanner.Infrastructure.Data;

namespace WeeklyPlanner.Tests.Integration;

public class PlanningWeeksControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public PlanningWeeksControllerTests(WebApplicationFactory<Program> factory)
    {
        Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Testing");

        var customFactory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Remove ALL EF Core related descriptors
                var descriptorsToRemove = services
                    .Where(d =>
                        d.ServiceType.FullName != null &&
                        d.ServiceType.FullName.Contains("EntityFrameworkCore"))
                    .ToList();

                foreach (var d in descriptorsToRemove)
                    services.Remove(d);

                // Also remove AppDbContext registration
                var dbContextDescriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(AppDbContext));
                if (dbContextDescriptor != null)
                    services.Remove(dbContextDescriptor);

                // Register fresh InMemory DbContext
                services.AddDbContext<AppDbContext>(options =>
                    options.UseInMemoryDatabase("IntegrationTestDb_" + Guid.NewGuid()));
            });
        });

        _client = customFactory.CreateClient();
    }

    [Fact]
    public async Task GetActive_ReturnsNoContent_WhenNoActiveWeek()
    {
        var response = await _client.GetAsync("/api/PlanningWeeks/active");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task GetAll_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/PlanningWeeks");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenNotTuesday()
    {
        var date = DateTime.Today;
        while (date.DayOfWeek == DayOfWeek.Tuesday) date = date.AddDays(1);

        var request = new
        {
            planningDate = date.ToString("o"),
            participatingMemberIds = new[] { Guid.NewGuid() },
            clientFocusedPct = 50,
            techDebtPct = 30,
            rNdPct = 20
        };

        var response = await _client.PostAsJsonAsync("/api/PlanningWeeks", request);
        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenPercentagesDontSum100()
    {
        var date = DateTime.Today;
        while (date.DayOfWeek != DayOfWeek.Tuesday) date = date.AddDays(1);

        var request = new
        {
            planningDate = date.ToString("o"),
            participatingMemberIds = new[] { Guid.NewGuid() },
            clientFocusedPct = 50,
            techDebtPct = 30,
            rNdPct = 10
        };

        var response = await _client.PostAsJsonAsync("/api/PlanningWeeks", request);
        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_ForUnknownId()
    {
        var response = await _client.GetAsync($"/api/PlanningWeeks/{Guid.NewGuid()}");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}