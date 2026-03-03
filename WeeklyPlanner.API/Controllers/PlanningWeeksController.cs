using Microsoft.AspNetCore.Mvc;
using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Application.Interfaces;

namespace WeeklyPlanner.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlanningWeeksController : ControllerBase
{
    private readonly IPlanningService _planning;
    public PlanningWeeksController(IPlanningService planning) => _planning = planning;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _planning.GetAllAsync());

    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
    {
        var week = await _planning.GetActiveWeekAsync();
        return week is null ? NoContent() : Ok(week);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var week = await _planning.GetByIdAsync(id);
        return week is null ? NotFound() : Ok(week);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWeekRequest request)
    {
        try
        {
            var created = await _planning.CreateWeekAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("{id:guid}/open")]
    public async Task<IActionResult> Open(Guid id)
    {
        try { return Ok(await _planning.OpenForPlanningAsync(id)); }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id:guid}/freeze")]
    public async Task<IActionResult> Freeze(Guid id)
    {
        try { return Ok(await _planning.FreezeWeekAsync(id)); }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id:guid}/complete")]
    public async Task<IActionResult> Complete(Guid id)
    {
        try { return Ok(await _planning.CompleteWeekAsync(id)); }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        try
        {
            var success = await _planning.CancelWeekAsync(id);
            return success ? Ok() : NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}