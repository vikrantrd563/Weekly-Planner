using Microsoft.EntityFrameworkCore;
using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Application.Interfaces;
using WeeklyPlanner.Application.Models;
using WeeklyPlanner.Infrastructure.Data;

namespace WeeklyPlanner.Infrastructure.Services;

public class BacklogService : IBacklogService
{
    private readonly AppDbContext _db;
    public BacklogService(AppDbContext db) => _db = db;

    private static BacklogItemDto ToDto(BacklogItem b) => new(
        b.Id, b.Title, b.Description,
        b.Category.ToString(), (int)b.Category,
        b.EstimatedHours,
        b.Status.ToString(), (int)b.Status,
        b.CreatedAt
    );

    public async Task<List<BacklogItemDto>> GetAllAsync(BacklogStatus? statusFilter = null)
    {
        var query = _db.BacklogItems.AsQueryable();

        if (statusFilter.HasValue)
            query = query.Where(b => b.Status == statusFilter.Value);

        return await query
            .OrderBy(b => b.Category)
            .ThenBy(b => b.Title)
            .Select(b => ToDto(b))
            .ToListAsync();
    }

    public async Task<BacklogItemDto?> GetByIdAsync(Guid id)
    {
        var item = await _db.BacklogItems.FindAsync(id);
        return item is null ? null : ToDto(item);
    }

    public async Task<BacklogItemDto> CreateAsync(CreateBacklogItemRequest request)
    {
        var item = new BacklogItem
        {
            Title          = request.Title.Trim(),
            Description    = request.Description.Trim(),
            Category       = request.Category,
            EstimatedHours = request.EstimatedHours
        };
        _db.BacklogItems.Add(item);
        await _db.SaveChangesAsync();
        return ToDto(item);
    }

    public async Task<BacklogItemDto?> UpdateAsync(Guid id, UpdateBacklogItemRequest request)
    {
        var item = await _db.BacklogItems.FindAsync(id);
        if (item is null) return null;

        if (request.Title is not null)       item.Title       = request.Title.Trim();
        if (request.Description is not null) item.Description = request.Description.Trim();
        if (request.Category.HasValue)       item.Category    = request.Category.Value;
        if (request.EstimatedHours.HasValue) item.EstimatedHours = request.EstimatedHours;

        await _db.SaveChangesAsync();
        return ToDto(item);
    }

    public async Task<bool> ArchiveAsync(Guid id)
    {
        var item = await _db.BacklogItems.FindAsync(id);
        if (item is null) return false;

        // Cannot archive if item is in an active frozen or planning week
        var hasActiveWorkItem = await _db.WorkItems
            .Include(w => w.PlanningWeek)
            .AnyAsync(w => w.BacklogItemId == id &&
                          (w.PlanningWeek.Status == WeekStatus.Planning ||
                           w.PlanningWeek.Status == WeekStatus.Frozen));

        if (hasActiveWorkItem)
            throw new InvalidOperationException(
                "Cannot archive this item — it is part of an active planning week.");

        item.Status = BacklogStatus.Archived;
        await _db.SaveChangesAsync();
        return true;
    }
    public async Task<bool> ResetAllAsync()
    {
        var items = await _db.BacklogItems.ToListAsync();
        _db.BacklogItems.RemoveRange(items);
        await _db.SaveChangesAsync();
        return true;
    }
}