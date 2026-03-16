using WeeklyPlanner.Application.Models;
namespace WeeklyPlanner.Infrastructure.Data;
public static class SeedData
{
    public static void Seed(AppDbContext context)
    {
        // Only seed team members if none exist
        if (!context.TeamMembers.Any())
        {
            var lead   = new TeamMember { Name = "Vikrant", IsLead = true };
            var shruti = new TeamMember { Name = "Shruti" };
            var vaibhav = new TeamMember { Name = "Vaibhav" };
            var akshay = new TeamMember { Name = "Akshay" };
            context.TeamMembers.AddRange(lead, shruti, vaibhav, akshay);
            context.SaveChanges();
        }

        // Get existing backlog titles to avoid duplicates
        var existingTitles = context.BacklogItems
            .Select(b => b.Title)
            .ToHashSet();

        var candidates = new List<BacklogItem>
        {
            // ── Client Focused ───────────────────────────────────────
            new BacklogItem
            {
                Title = "Customer portal login redesign",
                Category = BacklogCategory.ClientFocused,
                EstimatedHours = 8,
                Description = "Redesign the login flow for better UX."
            },
            new BacklogItem
            {
                Title = "Fix payment gateway timeout bug",
                Category = BacklogCategory.ClientFocused,
                EstimatedHours = 4,
                Description = "Payments timing out after 30s on production."
            },
            new BacklogItem
            {
                Title = "Export reports to PDF",
                Category = BacklogCategory.ClientFocused,
                EstimatedHours = 6,
                Description = "Users need PDF export from the dashboard."
            },
            new BacklogItem
            {
                Title = "Add multi-language support (i18n)",
                Category = BacklogCategory.ClientFocused,
                EstimatedHours = 10,
                Description = "Support English, Hindi, and Marathi for client-facing pages."
            },
            new BacklogItem
            {
                Title = "Mobile responsive dashboard",
                Category = BacklogCategory.ClientFocused,
                EstimatedHours = 7,
                Description = "Dashboard is not usable on mobile — needs responsive layout."
            },
            new BacklogItem
            {
                Title = "Client onboarding wizard",
                Category = BacklogCategory.ClientFocused,
                EstimatedHours = 9,
                Description = "Step-by-step onboarding flow for new clients."
            },

            // ── Tech Debt ────────────────────────────────────────────
            new BacklogItem
            {
                Title = "Refactor authentication middleware",
                Category = BacklogCategory.TechDebt,
                EstimatedHours = 5,
                Description = "Current middleware is tightly coupled and hard to maintain."
            },
            new BacklogItem
            {
                Title = "Upgrade to .NET 10",
                Category = BacklogCategory.TechDebt,
                EstimatedHours = 8,
                Description = "Migrate solution to .NET 10 LTS."
            },
            new BacklogItem
            {
                Title = "Add database indexing for reports",
                Category = BacklogCategory.TechDebt,
                EstimatedHours = 3,
                Description = "Slow report queries need proper indexing."
            },
            new BacklogItem
            {
                Title = "Improve test coverage to 90%",
                Category = BacklogCategory.TechDebt,
                EstimatedHours = 6,
                Description = "Current coverage is at 60% — need more unit tests."
            },
            new BacklogItem
            {
                Title = "Remove deprecated NuGet packages",
                Category = BacklogCategory.TechDebt,
                EstimatedHours = 3,
                Description = "Several packages are outdated and have security warnings."
            },
            new BacklogItem
            {
                Title = "Split monolithic service into smaller services",
                Category = BacklogCategory.TechDebt,
                EstimatedHours = 12,
                Description = "UserService is doing too much — needs to be broken down."
            },

            // ── R&D ──────────────────────────────────────────────────
            new BacklogItem
            {
                Title = "Evaluate GraphQL vs REST",
                Category = BacklogCategory.RnD,
                EstimatedHours = 4,
                Description = "Research best API approach for next-gen frontend."
            },
            new BacklogItem
            {
                Title = "Proof of concept: AI auto-categorization",
                Category = BacklogCategory.RnD,
                EstimatedHours = 8,
                Description = "Test if AI can automatically categorize backlog items."
            },
            new BacklogItem
            {
                Title = "Research WebSocket for real-time updates",
                Category = BacklogCategory.RnD,
                EstimatedHours = 4,
                Description = "Evaluate feasibility of real-time dashboard updates."
            },
            new BacklogItem
            {
                Title = "Spike: migrate to microservices architecture",
                Category = BacklogCategory.RnD,
                EstimatedHours = 10,
                Description = "Explore breaking the monolith into microservices."
            },
            new BacklogItem
            {
                Title = "Explore Blazor for internal tools",
                Category = BacklogCategory.RnD,
                EstimatedHours = 6,
                Description = "Evaluate Blazor as an alternative to Angular for admin panels."
            },
            new BacklogItem
            {
                Title = "Research caching strategies (Redis vs in-memory)",
                Category = BacklogCategory.RnD,
                EstimatedHours = 4,
                Description = "Identify best caching approach to reduce DB load."
            },
        };

        var toAdd = candidates.Where(c => !existingTitles.Contains(c.Title)).ToList();
        if (toAdd.Any())
        {
            context.BacklogItems.AddRange(toAdd);
            context.SaveChanges();
        }
    }
}
