using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
// using WeeklyPlanner.Application.Interfaces;
using WeeklyPlanner.Infrastructure.Data;
// using WeeklyPlanner.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Database ─────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── Services (Dependency Injection) ───────────────────────
// builder.Services.AddScoped<ITeamMemberService, TeamMemberService>();
// builder.Services.AddScoped<IBacklogService, BacklogService>();

// ── Validation ────────────────────────────────────────────
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// ── CORS ──────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins(
            "http://localhost:4200",
            builder.Configuration["AllowedOrigins"] ?? "http://localhost:4200"
        )
        .AllowAnyMethod()
        .AllowAnyHeader());
});

// ── Controllers & Swagger ─────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Weekly Planner API", Version = "v1" });
});

var app = builder.Build();

// ── Seed database ─────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    // SeedData.Seed(db);   // enable later if needed
}

// ── Middleware ────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngular");
app.UseAuthorization();
app.MapControllers();

app.Run();

// Needed for WebApplicationFactory tests
public partial class Program { }