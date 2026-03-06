# Weekly Plan Tracker

A full-stack weekly planning tool for development teams built with .NET 10 and Angular 21.

## Stack
- **Backend**: .NET 10, C#, Entity Framework Core, SQLite
- **Frontend**: Angular 21, Angular Material, TypeScript
- **Tests**: xUnit, FluentAssertions (backend) · Vitest (frontend)

## Features
- Team lead creates planning weeks (must be Tuesday, category % must sum to 100)
- Members commit exactly 30 hours per week across categories
- Category budgets: Client Focused, Tech Debt, R&D
- Progress tracking with completed hours and status updates
- Team dashboard with KPIs and drill-down views
- Past weeks history (read-only)
- Full reset and data export/import

## Getting Started

### Backend
```bash
cd WeeklyPlanner.API
dotnet run
# API runs at http://localhost:5217
# Swagger at http://localhost:5217/swagger
```

### Frontend
```bash
cd weekly-planner-ui
npm install
ng serve
# App runs at http://localhost:4200
```

### Tests
```bash
# Backend (35 tests)
dotnet test

# Frontend (21 tests)
cd weekly-planner-ui
npx vitest run --coverage
```

## Docker
```bash
docker build -t weekly-planner-api .
docker run -p 8080:8080 weekly-planner-api
```

## Business Rules
1. Planning date must be a Tuesday
2. Category percentages must sum to 100
3. Each member commits exactly 30 hours
4. Only one active planning week at a time
5. After freeze: no hour changes, only progress updates

## API Endpoints
- `GET/POST /api/TeamMembers`
- `GET/POST /api/BacklogItems`
- `GET/POST /api/PlanningWeeks`
- `GET /api/PlanningWeeks/active`
- `POST /api/PlanningWeeks/{id}/freeze`
- `GET/POST /api/WorkItems`
- `POST /api/Progress`
- `GET /api/Progress/dashboard/{weekId}`