using Microsoft.EntityFrameworkCore;
using WeeklyPlanner.Application.DTOs;
using WeeklyPlanner.Application.Interfaces;
using WeeklyPlanner.Application.Models;
using WeeklyPlanner.Infrastructure.Data;

namespace WeeklyPlanner.Infrastructure.Services;

public class TeamMemberService : ITeamMemberService
{
    private readonly AppDbContext _db;

    public TeamMemberService(AppDbContext db) => _db = db;

    private static TeamMemberDto ToDto(TeamMember m) =>
        new(m.Id, m.Name, m.IsLead, m.IsActive, m.CreatedAt);

    public async Task<List<TeamMemberDto>> GetAllAsync()
    {
        return await _db.TeamMembers
            .OrderByDescending(m => m.IsLead)
            .ThenBy(m => m.Name)
            .Select(m => ToDto(m))
            .ToListAsync();
    }

    public async Task<TeamMemberDto?> GetByIdAsync(Guid id)
    {
        var m = await _db.TeamMembers.FindAsync(id);
        return m is null ? null : ToDto(m);
    }

    public async Task<TeamMemberDto> CreateAsync(CreateTeamMemberRequest request)
    {
        var exists = await _db.TeamMembers
            .AnyAsync(m => m.Name.ToLower() == request.Name.ToLower());
        if (exists)
            throw new InvalidOperationException($"A team member named '{request.Name}' already exists.");

        var member = new TeamMember
        {
            Name = request.Name.Trim(),
            IsLead = request.IsLead
        };

        if (request.IsLead)
        {
            var current = await _db.TeamMembers.FirstOrDefaultAsync(m => m.IsLead);
            if (current is not null) current.IsLead = false;
        }

        _db.TeamMembers.Add(member);
        await _db.SaveChangesAsync();
        return ToDto(member);
    }

    public async Task<TeamMemberDto?> UpdateAsync(Guid id, UpdateTeamMemberRequest request)
    {
        var member = await _db.TeamMembers.FindAsync(id);
        if (member is null) return null;

        if (request.Name is not null) member.Name = request.Name.Trim();
        if (request.IsActive.HasValue) member.IsActive = request.IsActive.Value;
        if (request.IsLead.HasValue) member.IsLead = request.IsLead.Value;

        await _db.SaveChangesAsync();
        return ToDto(member);
    }

    public async Task<bool> SetLeadAsync(Guid id)
    {
        var member = await _db.TeamMembers.FindAsync(id);
        if (member is null) return false;

        var current = await _db.TeamMembers.FirstOrDefaultAsync(m => m.IsLead);
        if (current is not null) current.IsLead = false;

        member.IsLead = true;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleActiveAsync(Guid id)
    {
        var member = await _db.TeamMembers.FindAsync(id);
        if (member is null) return false;

        member.IsActive = !member.IsActive;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task ResetAllAsync()
    {
        var all = await _db.TeamMembers.ToListAsync();
        _db.TeamMembers.RemoveRange(all);
        await _db.SaveChangesAsync();
    }
}