namespace WeeklyPlanner.Application.Models;

public class BacklogItem
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public BacklogCategory Category { get; set; }

    public int? EstimatedHours { get; set; }

    public BacklogStatus Status { get; set; } = BacklogStatus.Available;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<WorkItem> WorkItems { get; set; }
        = new List<WorkItem>();
}