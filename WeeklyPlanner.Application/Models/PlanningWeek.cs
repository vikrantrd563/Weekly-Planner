namespace WeeklyPlanner.Application.Models;

public class PlanningWeek
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public DateTime PlanningDate { get; set; }  // Must be a Tuesday

    public WeekStatus Status { get; set; } = WeekStatus.Setup;

    public int ClientFocusedPct { get; set; }

    public int TechDebtPct { get; set; }

    public int RnDPct { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<PlanningWeekMember> Members { get; set; }
        = new List<PlanningWeekMember>();

    public ICollection<WorkItem> WorkItems { get; set; }
        = new List<WorkItem>();
}