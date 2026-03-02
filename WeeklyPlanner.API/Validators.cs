using FluentValidation;
using WeeklyPlanner.Application.DTOs;

namespace WeeklyPlanner.API;

public class CreateTeamMemberRequestValidator : AbstractValidator<CreateTeamMemberRequest>
{
    public CreateTeamMemberRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(100).WithMessage("Name must be 100 characters or less.");
    }
}

public class CreateBacklogItemRequestValidator : AbstractValidator<CreateBacklogItemRequest>
{
    public CreateBacklogItemRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title must be 200 characters or less.");

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Description must be 2000 characters or less.");

        RuleFor(x => x.Category)
            .IsInEnum().WithMessage("Invalid category. Use 1=ClientFocused, 2=TechDebt, 3=RnD.");

        RuleFor(x => x.EstimatedHours)
            .GreaterThan(0).WithMessage("Estimated hours must be greater than 0.")
            .LessThanOrEqualTo(999).WithMessage("Estimated hours must be 999 or less.")
            .When(x => x.EstimatedHours.HasValue);
    }
}