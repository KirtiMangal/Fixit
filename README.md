# 🛠️ FixIt — Problem-Resolution & Maintenance Platform

[![Spring Boot 3](https://img.shields.io/badge/Spring_Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java 17+](https://img.shields.io/badge/Java-17%20%7C%2025-orange.svg)](https://openjdk.org/)
[![React 18](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.13-teal.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **"Diagnose → Decide → Resolve → Learn → Remember → Prevent"**

**FixIt** is a full-stack engineering platform built to solve physical problem-resolution and ongoing maintenance. Unlike typical gig-economy booking clones that rush users to pay for contractor dispatch, FixIt acts as an engineering partner: uncovering root causes through AI diagnosis, presenting balanced resolution choices (DIY self-repair, expert mentorship, or certified technician), logging a permanent device repair ledger, and scheduling proactive maintenance.

---

## 📌 Architectural Philosophy

Traditional apps treat maintenance as an emergency dispatch transaction:
$$\text{Something is broken} \longrightarrow \text{Book Technician} \longrightarrow \text{Pay Bill}$$

FixIt implements the **6-Stage Problem-Resolution Lifecycle**:
1. **Diagnose**: Analyze symptoms using AI triage to detect root causes, severity, and critical safety hazards.
2. **Decide**: Choose between 3 resolution pathways (DIY Guide, Expert Mentorship, or Technician Dispatch).
3. **Resolve**: Follow verified step-by-step procedures or track technician job progression.
4. **Learn**: Schedule 1-on-1 virtual sessions with vetted experts to learn hands-on diagnostic skills.
5. **Remember**: Automatically log every fix to an Asset health ledger with spending and DIY savings metrics.
6. **Prevent**: AI predictive maintenance engine schedules recurring care cycles before breakdowns occur.

---

## 🏛️ System Architecture

FixIt uses a decoupled multi-service architecture:

```
                                  +-----------------------------+
                                  |     React 18 + Vite SPA     |
                                  |   (Custom CSS Design Sys)   |
                                  +--------------+--------------+
                                                 |
                                     REST / JSON | JWT Bearer
                                                 v
                                  +-----------------------------+
                                  |   Spring Boot 3.3 Gateway   |
                                  |   Security / RBAC / JPA     |
                                  +-------+--------------+------+
                                          |              |
                      HTTP Timeout / Rest |              | Hibernate 6
                                          v              v
               +----------------------------+   +-------------------+
               |  FastAPI AI Microservice   |   | PostgreSQL DB     |
               |  (Python 3.13 / Pydantic)  |   | (H2 Local Memory) |
               +--------------+-------------+   +-------------------+
                              |
                     LLM API  v (with Heuristic Fallback)
               +----------------------------+
               | OpenAI / Rule-Based Engine |
               +----------------------------+
```

---

## 📁 Repository Structure

```
fixit/
├── backend/                     # Spring Boot 3.3.4 (REST API, Security, JPA)
│   ├── src/main/java/com/fixit/
│   │   ├── config/              # CORS and Web configuration
│   │   ├── controller/          # REST Controllers (11 controllers)
│   │   ├── dto/                 # Immutable Request/Response DTO contracts
│   │   ├── entity/              # JPA Domain Entities (14 entities, 7 enums)
│   │   ├── exception/           # Global Exception Handler & ApiException
│   │   ├── repository/          # Spring Data JPA Repositories (11 repositories)
│   │   ├── security/            # JWT Token Provider, Auth Filter & SecurityConfig
│   │   ├── service/             # Business Logic & Orchestration Services
│   │   └── FixItApplication.java# Application entry point
│   ├── src/main/resources/      # application.yml, application-local.yml
│   └── src/test/java/com/fixit/ # Automated Integration Test Suites
│
├── frontend/                    # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/          # Reusable UI widgets, Modals, ProtectedRoute
│   │   ├── context/             # AuthContext with localStorage token hydration
│   │   ├── layouts/             # MainLayout with responsive navbar & NotificationBell
│   │   ├── pages/               # 15 domain pages matching the 6-stage lifecycle
│   │   │   └── dashboards/      # Customer, Technician, Expert & Admin dashboards
│   │   ├── services/            # Axios API clients with auto token injection
│   │   └── App.jsx              # Central router configuration
│   └── package.json
│
├── ai-service/                  # Python 3.13 FastAPI Microservice
│   ├── app/
│   │   ├── api/v1/endpoints/    # /diagnose and /health routes
│   │   ├── core/                # Pydantic configuration & CORS
│   │   ├── models/schemas.py    # Request & Response Pydantic models
│   │   ├── services/            # Heuristic & LLM DiagnosisEngine
│   │   └── main.py              # FastAPI app instance
│   ├── tests/                   # Python unittest test suite
│   └── requirements.txt
│
├── INTERVIEW_PREP.md            # 15 Senior Technical Interview Questions & Answers
├── .env.example                 # Root environment template
└── README.md                    # Project documentation
```

---

## 🚀 17 Integrated Modules

| Module | Scope | Key Capabilities |
| :--- | :--- | :--- |
| **M1: AI Diagnosis** | Full Stack | Automated root cause hypotheses, severity scoring, and safety triage for electrical, gas, and vehicle hazards. |
| **M2: Tech Marketplace** | Full Stack | Provider profiles, hourly rates, service area filtering, availability toggle, and admin verification workflow. |
| **M3: Service Requests** | Full Stack | Strict state machine lifecycle: `REQUESTED` → `ACCEPTED` → `IN_PROGRESS` → `COMPLETED` / `CANCELLED` / `REJECTED`. |
| **M4: DIY Guides** | Full Stack | Curated step-by-step guides, required tool lists, safety protocols, and automated $0 repair logging upon completion. |
| **M5: Expert Mentoring** | Full Stack | 1-on-1 virtual instruction booking, session agendas, interactive checklists, and repair logging at session rate. |
| **M6: Repair Ledger** | Full Stack | Lifetime item health ledger, cumulative spending analytics, and estimated DIY cost savings metrics. |
| **M7: Care Reminders** | Full Stack | Automated recurring maintenance schedule recalculator (e.g. 90-day HVAC filter, 180-day thermal paste). |
| **M8: Review System** | Full Stack | Verified-job star ratings, reviews, duplicate review prevention, and aggregate technician rating calculation. |
| **M9: Notifications** | Full Stack | In-app notification center with unread badge, deep linking, and lifecycle event broadcasts. |
| **M10: Admin Center** | Full Stack | Platform GMV metrics, user role management, technician/expert credential verification. |
| **M11: Personal Hub** | Full Stack | User maintenance overview, device health widgets, overdue reminder alerts, and spend KPIs. |
| **M12: Preventive AI** | Full Stack | Asset-aware preventative care recommendations generated dynamically based on item age and category. |
| **M13: Similar Problems**| Full Stack | In-domain keyword matching surfacing historical resolved issues to give users immediate context. |
| **M14: UI Polish** | Frontend | Interactive 6-stage lifecycle showcase, 8 domain categories, and responsive card design. |
| **M15: Security Audit** | Backend | Stateless JWT RBAC, BCrypt password hashing, and strict IDOR/cross-tenant ownership checks. |
| **M16: Automated Tests**| Full Stack | Hermetic test suites for Auth, Problem reporting, Service lifecycle, Reminders, and Python AI engine. |
| **M17: Documentation** | Docs | Comprehensive system documentation and 15 senior-level technical interview preparation questions. |

---

## 🛠️ Getting Started & Local Setup

### Prerequisites
- **JDK 17 or higher** (OpenJDK 25 supported)
- **Node.js 18+** & npm
- **Python 3.11+**
- **Maven 3.9+**

---

### 1. Backend (Spring Boot)
The backend supports running with a local PostgreSQL instance or with an instant zero-setup in-memory H2 profile.

```powershell
cd backend

# Option A: Run with in-memory local H2 profile (No PostgreSQL setup required)
mvn spring-boot:run -Dspring-boot.run.profiles=local

# Option B: Run with PostgreSQL (Configure DB_HOST, DB_USER, DB_PASSWORD in .env)
mvn spring-boot:run
```
*Backend API will be active at: `http://localhost:8080`*  
*Health Check: `http://localhost:8080/api/health`*

---

### 2. Frontend (React + Vite)
```powershell
cd frontend
npm install
npm run dev
```
*Frontend UI will be active at: `http://localhost:5173`*

---

### 3. AI Service (Python FastAPI)
```powershell
cd ai-service
python -m venv .venv

# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# On Linux / macOS:
# source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --reload
```
*AI API will be active at: `http://localhost:8000`*  
*Swagger Documentation: `http://localhost:8000/docs`*

---

## 🧪 Running Automated Tests

### Backend Test Suite (Spring Boot & JUnit 5)
```powershell
cd backend
mvn test
```
*Executes unit and integration test suites (`AuthIntegrationTest`, `ProblemAndDiagnosisIntegrationTest`, `ServiceLifecycleIntegrationTest`, `MaintenanceReminderIntegrationTest`, `FixItApplicationTests`) with 100% pass rate.*

### AI Service Test Suite (Python unittest)
```powershell
cd ai-service
.\.venv\Scripts\python.exe -m unittest discover -s tests
```
*Executes domain rule tests and safety triage verifications for electrical, vehicle, and appliance hazards.*

### Frontend Production Build Verification
```powershell
cd frontend
npm run build
```
*Transforms 132 modules into an optimized production bundle in under 1 second.*

---

## 🔒 Security & IDOR Mitigation Architecture

FixIt strictly implements multi-tenant data isolation:
- **Stateless JWT Tokens**: Signed with HMAC-SHA384; valid for 24 hours.
- **Strict Role-Based Authorization**: `CUSTOMER`, `TECHNICIAN`, `EXPERT`, and `ADMIN` roles enforced at both Spring Security filter chain and method-level `@PreAuthorize`.
- **Insecure Direct Object Reference (IDOR) Protection**:
  - `AssetService` checks `asset.owner.email == userEmail` before every view, edit, or delete operation.
  - `ProblemService` checks `problem.createdBy.email == userEmail` and validates asset ownership before linking.
  - `ServiceRequestService` checks customer and technician identities on all state transitions.
  - `ReviewService` prevents customers from reviewing services they did not book and blocks duplicate reviews.

---

## 📚 Interview Preparation Questions

FixIt comes with a dedicated **15 Deep-Dive Interview Preparation Questions & Answers** covering:
- Decoupled AI Microservice Resilience & Circuit Breaking
- State Machine Integrity for Service Bookings
- IDOR Vulnerability Prevention in Multi-Tenant REST APIs
- Relational Schema Design & Bidirectional JPA Mappings
- Financial Modeling of DIY Savings vs Commercial Dispatch

👉 **[Read the Full Interview Preparation Guide (INTERVIEW_PREP.md)](./INTERVIEW_PREP.md)**

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
