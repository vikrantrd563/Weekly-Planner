using Microsoft.AspNetCore.Mvc;
using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Application.Interfaces;

namespace WeeklyPlanner.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamMembersController : ControllerBase
{
    private readonly ITeamMemberService _service;
    public TeamMembersController(ITeamMemberService service) => _service = service;

    /// <summary>Get all team members ordered by lead first, then name</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _service.GetAllAsync());

    /// <summary>Get a single team member by ID</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var member = await _service.GetByIdAsync(id);
        return member is null ? NotFound() : Ok(member);
    }

    /// <summary>Create a new team member</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTeamMemberRequest request)
    {
        try
        {
            var created = await _service.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    /// <summary>Update a team member's name, lead status, or active status</summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTeamMemberRequest request)
    {
        var updated = await _service.UpdateAsync(id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>Make this member the team lead (clears previous lead)</summary>
    [HttpPatch("{id:guid}/lead")]
    public async Task<IActionResult> SetLead(Guid id)
    {
        var success = await _service.SetLeadAsync(id);
        return success ? Ok() : NotFound();
    }

    /// <summary>Toggle active/inactive status (soft delete)</summary>
    [HttpPatch("{id:guid}/toggle-active")]
    public async Task<IActionResult> ToggleActive(Guid id)
    {
        var success = await _service.ToggleActiveAsync(id);
        return success ? Ok() : NotFound();
    }

    /// <summary>Delete all team members (full reset)</summary>
    [HttpDelete("reset-all")]
    public async Task<IActionResult> ResetAll()
    {
        await _service.ResetAllAsync();
        return NoContent();
    }
}