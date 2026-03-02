namespace WeeklyPlanner.Application.Models;

public class ProgressEntry
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid WorkItemId { get; set; }

    public int CompletedHours { get; set; }

    public WorkItemStatus Status { get; set; }

    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public WorkItem WorkItem { get; set; } = null!;
}