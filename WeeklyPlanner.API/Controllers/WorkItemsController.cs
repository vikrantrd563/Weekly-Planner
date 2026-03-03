using Microsoft.AspNetCore.Mvc;
using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Application.Interfaces;

namespace WeeklyPlanner.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkItemsController : ControllerBase
{
    private readonly IWorkItemService _service;
    public WorkItemsController(IWorkItemService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetByWeekAndMember(
        [FromQuery] Guid weekId, [FromQuery] Guid memberId) =>
        Ok(await _service.GetByWeekAndMemberAsync(weekId, memberId));

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] CreateWorkItemRequest request)
    {
        try { return Ok(await _service.AddWorkItemAsync(request)); }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateWorkItemRequest request)
    {
        try
        {
            var result = await _service.UpdateWorkItemAsync(id, request);
            return result is null ? NotFound() : Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(423, new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Remove(Guid id)
    {
        try
        {
            var success = await _service.RemoveWorkItemAsync(id);
            return success ? Ok() : NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(423, new { message = ex.Message });
        }
    }

    [HttpPatch("{weekId:guid}/member/{memberId:guid}/ready")]
    public async Task<IActionResult> MarkReady(Guid weekId, Guid memberId)
    {
        var success = await _service.MarkReadyAsync(weekId, memberId);
        return success ? Ok() : NotFound();
    }
}