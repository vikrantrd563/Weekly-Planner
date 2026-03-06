using WeeklyPlanner.Application.Models;

namespace WeeklyPlanner.Infrastructure.Data;

public static class SeedData
{
    public static void Seed(AppDbContext context)
    {
        // Only seed team members if none exist
        if (!context.TeamMembers.Any())
        {
            var lead = new TeamMember { Name = "Alice (Lead)", IsLead = true };
            var bob  = new TeamMember { Name = "Bob" };
            var cara = new TeamMember { Name = "Cara" };
            var dan  = new TeamMember { Name = "Dan" };
            context.TeamMembers.AddRange(lead, bob, cara, dan);
            context.SaveChanges();
        }

        // Get existing backlog titles to avoid duplicates
        var existingTitles = context.BacklogItems
            .Select(b => b.Title)
            .ToHashSet();

        var candidates = new List<BacklogItem>
        {
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
                Description = "Payments timing out after 30s."
            },
            new BacklogItem
            {
                Title = "Export reports to PDF",
                Category = BacklogCategory.ClientFocused,
                EstimatedHours = 6,
                Description = "Users need PDF export from dashboard."
            },
            new BacklogItem
            {
                Title = "Refactor authentication middleware",
                Category = BacklogCategory.TechDebt,
                EstimatedHours = 5,
                Description = "Current middleware is hard to maintain."
            },
            new BacklogItem
            {
                Title = "Upgrade to .NET 9",
                Category = BacklogCategory.TechDebt,
                EstimatedHours = 8,
                Description = "Migrate solution to latest LTS."
            },
            new BacklogItem
            {
                Title = "Add database indexing for reports",
                Category = BacklogCategory.TechDebt,
                EstimatedHours = 3,
                Description = "Slow report queries need indexing."
            },
            new BacklogItem
            {
                Title = "Improve test coverage to 90%",
                Category = BacklogCategory.TechDebt,
                EstimatedHours = 6,
                Description = "Coverage currently at 60%."
            },
            new BacklogItem
            {
                Title = "Evaluate GraphQL vs REST",
                Category = BacklogCategory.RnD,
                EstimatedHours = 4,
                Description = "Research best API approach."
            },
            new BacklogItem
            {
                Title = "Proof of concept: AI auto-categorization",
                Category = BacklogCategory.RnD,
                EstimatedHours = 8,
                Description = "Test AI for backlog categorization."
            },
            new BacklogItem
            {
                Title = "Research WebSocket for real-time updates",
                Category = BacklogCategory.RnD,
                EstimatedHours = 4,
                Description = "Real-time dashboard feasibility."
            }
        };

        var toAdd = candidates.Where(c => !existingTitles.Contains(c.Title)).ToList();

        if (toAdd.Any())
        {
            context.BacklogItems.AddRange(toAdd);
            context.SaveChanges();
        }
    }
}