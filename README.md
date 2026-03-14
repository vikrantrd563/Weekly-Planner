# 📅 Weekly Plan Tracker

> A full-stack weekly planning tool for development teams — built with .NET 10 and Angular 21.

---

## 🌐 Live Deployment

| | URL |
|---|---|
| 🖥️ **Frontend** | [https://icy-river-020b19200.2.azurestaticapps.net](https://icy-river-020b19200.2.azurestaticapps.net) |
| 🔗 **API** | [https://weekly-planner-api-vrd-c7e6ewbsamfragfp.eastasia-01.azurewebsites.net](https://weekly-planner-api-vrd-c7e6ewbsamfragfp.eastasia-01.azurewebsites.net) |
| 📖 **Swagger** | [/swagger](https://weekly-planner-api-vrd-c7e6ewbsamfragfp.eastasia-01.azurewebsites.net/swagger) |

---

## 📖 About the App

Weekly Plan Tracker helps development teams plan and track their weekly work with structured hour budgets across business categories.

A **Team Lead** sets up a planning week by choosing a date (must be a Tuesday) and splitting the team's capacity across three categories: **Client Focused**, **Tech Debt**, and **R&D**. Each team member then picks backlog items and commits exactly **30 hours** within their allocated budget. Once the week is frozen, members can only update progress — no hour changes allowed.

The app provides a real-time dashboard with KPIs, category breakdowns, member-level drill-downs, and a read-only history of past weeks.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | .NET 10, C#, ASP.NET Core Web API |
| **ORM** | Entity Framework Core 9 |
| **Database** | SQLite |
| **Validation** | FluentValidation |
| **Frontend** | Angular 21, TypeScript |
| **UI Library** | Angular Material + Custom Dark Theme |
| **HTTP** | Angular HttpClient |
| **Backend Tests** | xUnit, FluentAssertions, Moq |
| **Frontend Tests** | Vitest v4, Angular Testing Library |
| **Backend Hosting** | Azure App Service (F1, Windows, East Asia) |
| **Frontend Hosting** | Azure Static Web Apps (Free, East Asia) |
| **CI/CD** | GitHub Actions |
| **Containerisation** | Docker |

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Angular 21 SPA                        │
│         (Azure Static Web Apps — East Asia)              │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS REST (JSON)
┌────────────────────────▼────────────────────────────────┐
│               ASP.NET Core Web API (.NET 10)             │
│           (Azure App Service — East Asia)                │
│                                                          │
│  Controllers → Services (Application layer)             │
│       ↓                                                  │
│  Infrastructure (EF Core + SQLite)                      │
└─────────────────────────────────────────────────────────┘

Layers:
  WeeklyPlanner.Application   — Interfaces, Models, DTOs
  WeeklyPlanner.Infrastructure — EF Core DbContext, Services
  WeeklyPlanner.API            — Controllers, Program.cs, Validators
  WeeklyPlanner.Tests          — Unit + Integration Tests
```

---

## 📁 Project Structure
```
Weekly-Planner/
├── WeeklyPlanner.Application/
│   ├── Models/              # Domain models + enums
│   ├── DTOs/                # Request / Response DTOs
│   └── Interfaces/          # ITeamMemberService, IBacklogService, etc.
│
├── WeeklyPlanner.Infrastructure/
│   ├── Data/                # AppDbContext, SeedData, Migrations
│   └── Services/            # Service implementations
│
├── WeeklyPlanner.API/
│   ├── Controllers/         # REST controllers
│   ├── Program.cs           # DI, CORS, Swagger, Middleware
│   └── Validators.cs        # FluentValidation validators
│
├── WeeklyPlanner.Tests/
│   ├── Services/            # Unit tests (30 tests)
│   └── Integration/         # Controller integration tests (5 tests)
│
├── weekly-planner-ui/                  # Angular 21 SPA
│   └── src/app/
│       ├── core/
│       │   ├── models/index.ts         # All TypeScript interfaces
│       │   └── services/               # API, session, feature services
│       └── features/
│           ├── home/                   # Role-based home pages
│           ├── team/                   # Team management
│           ├── backlog/                # Backlog management
│           ├── planning/               # Week setup, plan work, freeze
│           ├── progress/               # Progress updates
│           ├── dashboard/              # KPIs and drill-downs
│           └── history/                # Past weeks (read-only)
│
├── Dockerfile
└── README.md
```

---

## 📄 Page Descriptions

| Page | Role | Description |
|---|---|---|
| **Home** | Both | Role selector — routes Lead or Member to their dashboard |
| **Team Setup** | Lead | Add team members, assign Team Lead |
| **Backlog** | Lead | Create and manage backlog items with categories |
| **Week Setup** | Lead | Create a planning week (Tuesday date, category % split) |
| **Plan My Work** | Member | Pick backlog items, commit hours within budget |
| **Review & Freeze** | Lead | Review all member plans, freeze the week |
| **Update Progress** | Member | Log completed hours and status per work item |
| **Dashboard** | Both | KPIs, category breakdown, member drill-down |
| **Past Weeks** | Both | Read-only history of all completed weeks |

---

## 📡 API Reference

### Team Members
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/TeamMembers` | Get all team members |
| POST | `/api/TeamMembers` | Add a team member |
| DELETE | `/api/TeamMembers/reset-all` | Delete all members |

### Backlog Items
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/BacklogItems` | Get all backlog items |
| POST | `/api/BacklogItems` | Create a backlog item |
| POST | `/api/BacklogItems/seed` | Seed sample backlog items |
| DELETE | `/api/BacklogItems/reset-all` | Delete all backlog items |

### Planning Weeks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/PlanningWeeks` | Get all planning weeks |
| POST | `/api/PlanningWeeks` | Create a planning week |
| GET | `/api/PlanningWeeks/active` | Get the currently active week |
| POST | `/api/PlanningWeeks/{id}/freeze` | Freeze a planning week |
| DELETE | `/api/PlanningWeeks/reset-all` | Delete all planning weeks |

### Work Items
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/WorkItems` | Get work items (filter by weekId / memberId) |
| POST | `/api/WorkItems` | Assign a backlog item to a member for a week |

### Progress
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/Progress` | Submit a progress update |
| GET | `/api/Progress/dashboard/{weekId}` | Get dashboard data for a week |

---

## 🚀 Running Locally

### Prerequisites
- .NET 10 SDK
- Node.js 20+
- Angular CLI 21 (`npm install -g @angular/cli`)

### Backend
```bash
cd WeeklyPlanner.API
dotnet run
# API: http://localhost:5217
# Swagger: http://localhost:5217/swagger
```

### Frontend
```bash
cd weekly-planner-ui
npm install
ng serve
# App: http://localhost:4200
```

> ⚠️ Stop the API (`Ctrl+C`) before running backend tests.

---

## 🧪 Running Tests

### Backend — 35 tests
```bash
# From repo root (API must be stopped)
dotnet test
```

| Test Suite | Tests |
|---|---|
| TeamMemberServiceTests | 6 |
| BacklogServiceTests | 6 |
| PlanningServiceTests | 6 |
| WorkItemServiceTests | 5 |
| ProgressServiceTests | 6 |
| PlanningWeeksControllerTests | 5 (integration) |
| **Total** | **35** |

### Frontend — 21 tests
```bash
cd weekly-planner-ui
npx vitest run --coverage
```

| Details | Value |
|---|---|
| Test runner | Vitest v4.0.18 |
| Spec files | 15 |
| Total tests | 21 |
| Errors | 0 |

---

## ⚙️ CI/CD Pipeline

The project uses **GitHub Actions** for continuous deployment.
```
git push to main
      ↓
GitHub Actions triggered
      ↓
  ┌───────────────────────────────────────┐
  │  Build .NET 10 app                    │
  │  Deploy to Azure App Service          │
  │                                       │
  │  Build Angular 21 app                 │
  │  Deploy to Azure Static Web Apps      │
  └───────────────────────────────────────┘
      ↓
Both services auto-update
with new deployment
```

**Workflow files:**
- `.github/workflows/main_weekly-planner-api-vrd.yml` — Backend
- `.github/workflows/azure-static-web-apps-icy-river-020b19200.yml` — Frontend

---

## 🧠 Key Design Decisions

**1. Standalone Angular Components**
All Angular components are standalone (no NgModules), following Angular 17+ best practices for simpler dependency management.

**2. Vitest instead of Karma**
Vitest was chosen over the default Karma/Jasmine setup for faster test execution and better ESM support with Angular 21.

**3. SQLite for persistence**
SQLite keeps the stack simple and self-contained — no external database server needed. On Azure, the database file is stored at `D:\home\site\wwwroot\weeklyplanner.db` for persistence across restarts.

**4. FluentValidation for business rules**
All business rule validation (Tuesday date, percentages summing to 100, 30-hour budget) is enforced server-side via FluentValidation, keeping the API self-documenting and testable.

**5. Clean Architecture layers**
The solution is split into Application (interfaces + models), Infrastructure (EF Core + services), and API (controllers) layers — making services fully unit-testable with mocked dependencies.

**6. CORS via environment config**
Allowed origins are read from Azure App Settings (`AllowedOrigins`), keeping production URLs out of source code.

---

## 📊 Test Coverage Summary

| Area | Tests | Status |
|---|---|---|
| Team Member Service | 6 unit tests | ✅ Pass |
| Backlog Service | 6 unit tests | ✅ Pass |
| Planning Service | 6 unit tests | ✅ Pass |
| Work Item Service | 5 unit tests | ✅ Pass |
| Progress Service | 6 unit tests | ✅ Pass |
| Planning Weeks Controller | 5 integration tests | ✅ Pass |
| Angular Components | 21 Vitest tests | ✅ Pass |
| **Total** | **56 tests** | ✅ **All passing** |

---

## 👤 Author

**Vikrant Dhongde**
- GitHub: [@vikrantrd563](https://github.com/vikrantrd563)
- Project: [github.com/vikrantrd563/Weekly-Planner](https://github.com/vikrantrd563/Weekly-Planner)

---

## 🐳 Docker
```bash
# Build
docker build -t weekly-planner-api .

# Run
docker run -p 8080:8080 weekly-planner-api

# API available at http://localhost:8080
```