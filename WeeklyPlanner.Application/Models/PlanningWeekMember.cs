namespace WeeklyPlanner.Application.Models;

/// <summary>
/// Join table: which members participate in a given planning week
/// </summary>
public class PlanningWeekMember
{
    public Guid PlanningWeekId { get; set; }

    public Guid TeamMemberId { get; set; }

    public bool IsReady { get; set; } = false;

    // Navigation
    public PlanningWeek PlanningWeek { get; set; } = null!;

    public TeamMember TeamMember { get; set; } = null!;
}