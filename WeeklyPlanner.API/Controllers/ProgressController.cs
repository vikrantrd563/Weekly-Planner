using Microsoft.AspNetCore.Mvc;
using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Application.Interfaces;

namespace WeeklyPlanner.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProgressController : ControllerBase
{
    private readonly IProgressService _progressService;
    private readonly IDashboardService _dashboardService;

    public ProgressController(
        IProgressService progressService,
        IDashboardService dashboardService)
    {
        _progressService  = progressService;
        _dashboardService = dashboardService;
    }

    [HttpPost]
    public async Task<IActionResult> UpdateProgress([FromBody] UpdateProgressRequest request)
    {
        try
        {
            var result = await _progressService.UpdateProgressAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("work-item/{workItemId}/history")]
    public async Task<IActionResult> GetHistory(Guid workItemId)
    {
        var result = await _progressService.GetWorkItemHistoryAsync(workItemId);
        return Ok(result);
    }

    [HttpGet("week/{weekId}/member/{memberId}")]
    public async Task<IActionResult> GetMemberProgress(Guid weekId, Guid memberId)
    {
        var result = await _progressService.GetMemberProgressAsync(weekId, memberId);
        return Ok(result);
    }

    [HttpGet("dashboard/{weekId}")]
    public async Task<IActionResult> GetDashboard(Guid weekId)
    {
        try
        {
            var result = await _dashboardService.GetDashboardAsync(weekId);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("dashboard/{weekId}/category/{categoryId}")]
    public async Task<IActionResult> GetCategorySummary(Guid weekId, int categoryId)
    {
        var result = await _dashboardService.GetCategorySummaryAsync(weekId, categoryId);
        return Ok(result);
    }

    [HttpGet("dashboard/{weekId}/member/{memberId}")]
    public async Task<IActionResult> GetMemberSummary(Guid weekId, Guid memberId)
    {
        try
        {
            var result = await _dashboardService.GetMemberSummaryAsync(weekId, memberId);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}