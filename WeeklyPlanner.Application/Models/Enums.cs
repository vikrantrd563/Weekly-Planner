namespace WeeklyPlanner.Application.Models;

public enum BacklogCategory
{
    ClientFocused = 1,
    TechDebt = 2,
    RnD = 3
}

public enum BacklogStatus
{
    Available = 1,
    Completed = 2,
    Archived = 3
}

public enum WeekStatus
{
    Setup = 1,
    Planning = 2,
    Frozen = 3,
    Completed = 4
}

public enum WorkItemStatus
{
    NotStarted = 1,
    InProgress = 2,
    Done = 3,
    Blocked = 4
}