using Microsoft.EntityFrameworkCore;
using WeeklyPlanner.Application.Models;

namespace WeeklyPlanner.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
    public DbSet<BacklogItem> BacklogItems => Set<BacklogItem>();
    public DbSet<PlanningWeek> PlanningWeeks => Set<PlanningWeek>();
    public DbSet<PlanningWeekMember> PlanningWeekMembers => Set<PlanningWeekMember>();
    public DbSet<WorkItem> WorkItems => Set<WorkItem>();
    public DbSet<ProgressEntry> ProgressEntries => Set<ProgressEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Composite PK for join table
        modelBuilder.Entity<PlanningWeekMember>()
            .HasKey(x => new { x.PlanningWeekId, x.TeamMemberId });

        // Indexes
        modelBuilder.Entity<WorkItem>()
            .HasIndex(x => new { x.PlanningWeekId, x.TeamMemberId });

        modelBuilder.Entity<BacklogItem>()
            .HasIndex(x => x.Category);

        // Relationships
        modelBuilder.Entity<WorkItem>()
            .HasOne(w => w.BacklogItem)
            .WithMany(b => b.WorkItems)
            .HasForeignKey(w => w.BacklogItemId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ProgressEntry>()
            .HasOne(p => p.WorkItem)
            .WithMany(w => w.ProgressEntries)
            .HasForeignKey(p => p.WorkItemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}