using Microsoft.AspNetCore.Mvc;
using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Application.Interfaces;
using WeeklyPlanner.Application.Models;

namespace WeeklyPlanner.API.Controllers;

[ApiController]
[Route("api/BacklogItems")]
public class BacklogItemsController : ControllerBase
{
    private readonly IBacklogService _service;
    public BacklogItemsController(IBacklogService service) => _service = service;

    /// <summary>Get backlog items. Filter by status: Available, Completed, Archived, or omit for all.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status = null)
    {
        BacklogStatus? filter = status?.ToLower() switch
        {
            "available" => BacklogStatus.Available,
            "completed" => BacklogStatus.Completed,
            "archived"  => BacklogStatus.Archived,
            _           => null
        };
        return Ok(await _service.GetAllAsync(filter));
    }

    /// <summary>Get a single backlog item by ID</summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var item = await _service.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    /// <summary>Create a new backlog item</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBacklogItemRequest request)
    {
        var created = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Update a backlog item</summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBacklogItemRequest request)
    {
        var updated = await _service.UpdateAsync(id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    /// <summary>Archive a backlog item (fails if item is in an active week)</summary>
    [HttpPatch("{id:guid}/archive")]
    public async Task<IActionResult> Archive(Guid id)
    {
        try
        {
            var success = await _service.ArchiveAsync(id);
            return success ? Ok() : NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>Seed sample data</summary>
    [HttpPost("seed")]
    public IActionResult Seed([FromServices] Infrastructure.Data.AppDbContext db)
    {
        Infrastructure.Data.SeedData.Seed(db);
        return Ok(new { message = "Sample data seeded successfully." });
    }
}