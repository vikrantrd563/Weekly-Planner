namespace WeeklyPlanner.Application.Models;

public class TeamMember
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public bool IsLead { get; set; } = false;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<PlanningWeekMember> WeekMemberships { get; set; }
        = new List<PlanningWeekMember>();

    public ICollection<WorkItem> WorkItems { get; set; }
        = new List<WorkItem>();
}