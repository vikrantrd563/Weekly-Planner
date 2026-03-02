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