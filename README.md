# Job Board

A full stack job board web application built as a portfolio project. Candidates can browse and apply for jobs, while employers can post and manage job listings.

## Tech Stack

**Backend**
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core 8
- SQL Server
- JWT Authentication
- BCrypt password hashing
- Swagger / OpenAPI

**Frontend**
- React 18 with TypeScript
- Vite
- SCSS Modules
- Shadcn/Radix UI
- React Router
- Axios

**DevOps**
- Docker
- Docker Compose

## Features

**Candidates**
- Browse and filter job listings by title, location and salary
- Apply for jobs with a cover letter and resume URL
- View and manage submitted applications
- Withdraw applications
- Edit personal profile

**Employers**
- Create, edit and delete job posts
- Manage job post status (Draft, Published, Closed)
- View applications for each job post
- Update application statuses (Pending, Reviewed, Accepted, Rejected)
- Edit company profile

**General**
- JWT based authentication
- Role based access control (Candidate, Employer)
- Responsive design (desktop, tablet, mobile)
- Demo accounts for quick access

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Candidate | candidate@demo.com | Demo123! |
| Employer (Google) | employer@demo.com | Demo123! |
| Employer (Microsoft) | microsoft@demo.com | Demo123! |
| Employer (Amazon) | amazon@demo.com | Demo123! |
| Employer (Meta) | meta@demo.com | Demo123! |

## Running Locally

### Option 1 — Docker (recommended)

Prerequisites: Docker Desktop installed and running.

1. Clone the repository
```bash
git clone https://github.com/Simasdan/job-board.git
cd job-board
```

2. Create a `.env` file in the root of the project:
JWT_SECRET=your-secret-key-here
DB_PASSWORD=YourPassword123!

3. Start the application:
```bash
docker compose up --build
```

4. The API will be available at `http://localhost:5028`

5. Swagger UI available at `http://localhost:5028/swagger`

### Option 2 — Manual setup

**Backend prerequisites:** .NET 8 SDK, SQL Server LocalDB

1. Clone the repository
```bash
git clone https://github.com/Simasdan/job-board.git
```

2. Create `appsettings.Development.json` in `backend/job-board-api/job-board-api/`:
```json
{
    "ConnectionStrings": {
        "DefaultConnectionString": "Server=(localdb)\\MSSQLLocalDB;Database=job-board-db;Trusted_Connection=true;MultipleActiveResultSets=true"
    },
    "JWT": {
        "Audience": "User",
        "Issuer": "http://localhost:5028",
        "Secret": "your-secret-key-at-least-32-characters-long"
    }
}
```

3. Run the backend:
```bash
cd backend/job-board-api/job-board-api
dotnet run
```

4. Run the frontend:
```bash
cd frontend
npm install
npm run dev
```

5. Open `http://localhost:5173` in your browser

## API Endpoints

**Authentication**
- `POST /api/v1/auth/register` — Register a new user
- `POST /api/v1/auth/login` — Login and receive JWT token

**Job Posts**
- `GET /api/v1/jobposts` — Get all published job posts (supports filtering and pagination)
- `GET /api/v1/jobposts/{id}` — Get a specific job post
- `POST /api/v1/jobposts` — Create a job post (Employer only)
- `PUT /api/v1/jobposts/{id}` — Update a job post (Employer only)
- `DELETE /api/v1/jobposts/{id}` — Delete a job post (Employer only)
- `GET /api/v1/jobposts/my-posts` — Get employer's own job posts (Employer only)

**Job Applications**
- `POST /api/v1/jobapplications/{jobPostId}` — Apply for a job (Candidate only)
- `GET /api/v1/jobapplications/my-applications` — Get candidate's applications (Candidate only)
- `GET /api/v1/jobapplications/jobpost/{jobPostId}` — Get applications for a job post (Employer only)
- `PUT /api/v1/jobapplications/{id}` — Update application status (Employer only)
- `DELETE /api/v1/jobapplications/{id}` — Withdraw application (Candidate only)

**Profiles**
- `GET /api/v1/candidates/my-profile` — Get candidate profile
- `PUT /api/v1/candidates/my-profile` — Update candidate profile
- `GET /api/v1/employers/my-profile` — Get employer profile
- `PUT /api/v1/employers/my-profile` — Update employer profile
