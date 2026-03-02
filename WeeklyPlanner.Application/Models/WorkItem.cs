namespace WeeklyPlanner.Application.Models;

public class WorkItem
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PlanningWeekId { get; set; }

    public Guid TeamMemberId { get; set; }

    public Guid BacklogItemId { get; set; }

    public int CommittedHours { get; set; }

    public int CompletedHours { get; set; } = 0;

    public WorkItemStatus Status { get; set; } = WorkItemStatus.NotStarted;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public PlanningWeek PlanningWeek { get; set; } = null!;

    public TeamMember TeamMember { get; set; } = null!;

    public BacklogItem BacklogItem { get; set; } = null!;

    public ICollection<ProgressEntry> ProgressEntries { get; set; }
        = new List<ProgressEntry>();
}