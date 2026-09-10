# 🤖 AI Job Portal

An AI-powered full-stack job recruitment platform built with **React.js, Django REST Framework, PostgreSQL, JWT Authentication, and OpenAI**.

The platform provides separate experiences for **Candidates, Recruiters, and Administrators**, with AI-powered features that help candidates analyze resumes, discover relevant jobs, match with job opportunities, and prepare for interviews.

---

## 📌 Project Overview

AI Job Portal is a full-stack recruitment application designed to connect candidates with recruiters through a modern job-search and hiring platform.

The application provides:

- Candidate registration and authentication
- Recruiter registration and authentication
- Role-based access control
- Job searching and filtering
- Company management
- Job management
- Job applications
- Application status management
- Resume upload and AI analysis
- AI job matching
- AI job recommendations
- AI interview question generation
- Administrator management and monitoring

---

# 👥 User Roles

## 🎓 Candidate

Candidates can:

- Register and log in
- Manage their profile
- Upload their resume
- Analyze their resume using AI
- Search and browse jobs
- View detailed job information
- Apply for jobs
- Withdraw applications
- Track application status
- Generate AI job matches
- Get AI-powered job recommendations
- Generate AI interview questions
- View previously generated AI results

---

## 💼 Recruiter

Recruiters can:

- Register and log in
- Manage their profile
- Create and manage companies
- Create jobs for their own companies
- Edit and delete their jobs
- Activate or deactivate jobs
- View applications for their jobs
- Update application statuses
- Review candidate information and resumes

---

## 🛡️ Administrator

Administrators can:

- View dashboard statistics
- Manage users
- Activate or deactivate users
- Manage companies
- Monitor jobs
- Monitor applications
- Access administrator-only functionality
- Manage platform resources

The main administrator account is protected from modification.

---

# 🤖 AI Features

## 1. 📄 AI Resume Analysis

Candidates can upload a **PDF or DOCX resume**.

The system analyzes the resume and provides:

- AI resume score
- Resume summary
- Extracted skills
- Strengths
- Missing skills
- Improvement suggestions
- Interview questions

The uploaded resume is persisted and can be reused when applying for jobs.

---

## 2. 🎯 AI Job Matching

The platform analyzes candidate information and job information to generate an AI-powered job match.

The result includes:

- Match score
- Matching skills
- Missing skills
- Strengths
- Improvement suggestions
- AI-generated explanation

Candidates can regenerate the match when required.

---

## 3. ✨ AI Job Recommendations

The system analyzes candidate information and available jobs to generate personalized job recommendations.

Recommendations include:

- Recommended job
- Recommendation score
- AI-generated reason

The recommendation results are validated before being returned to the frontend.

---

## 4. 🧠 AI Interview Questions

Candidates can select a job and generate personalized interview questions using AI.

The questions are generated based on the selected job and candidate context.

Candidates can:

- Generate interview questions
- Regenerate questions
- View previously generated questions
- Refresh the page without losing saved questions

---

# 🏗️ Technology Stack

## Frontend

- React.js
- Vite
- JavaScript ES6+
- Tailwind CSS
- Axios
- React Router
- Lucide React

## Backend

- Python
- Django
- Django REST Framework
- PostgreSQL
- Django REST Framework Simple JWT
- REST APIs

## AI

- OpenAI API
- AI Resume Analysis
- AI Job Matching
- AI Job Recommendations
- AI Interview Question Generation

## Development Tools

- Git
- GitHub
- VS Code
- Postman

---

# 🔐 Authentication & Security

The application uses **JWT-based authentication**.

Security features include:

- Access token authentication
- Refresh token authentication
- Protected frontend routes
- Role-based frontend routes
- Backend permission classes
- Object-level permissions
- Recruiter ownership validation
- Company ownership validation
- Job ownership validation
- Admin-only API endpoints
- Protected administrator account
- Environment variables for sensitive configuration
- CORS configuration

Sensitive credentials such as:

- OpenAI API keys
- Database passwords
- Django secret keys

are stored using environment variables and are not committed to the repository.

---

# 🔄 Application Workflow

## Candidate Workflow

```text
Candidate
   │
   ├── Register / Login
   │
   ├── Create Profile
   │
   ├── Upload Resume
   │       │
   │       └── AI Resume Analysis
   │
   ├── Browse Jobs
   │
   ├── AI Job Recommendations
   │
   ├── AI Job Match
   │
   ├── Apply for Job
   │
   ├── Track Application
   │
   └── AI Interview Questions
           │
           ▼
        Interview


Recruiter Workflow

Recruiter
   │
   ├── Register / Login
   │
   ├── Create Company
   │
   ├── Create Job
   │
   ├── Manage Jobs
   │
   ├── Receive Applications
   │
   └── Update Application Status
           │
           ▼
        Candidate


Administrator Workflow

Administrator
   │
   ├── Dashboard Statistics
   │
   ├── User Management
   │
   ├── Company Management
   │
   ├── Job Management
   │
   └── Application Management


📁 Project Structure

AI-Job-Portal/
│
├── backend/
│   │
│   ├── accounts/
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── admin_serializers.py
│   │   ├── apps.py
│   │   ├── jwt_serializers.py
│   │   ├── logout_serializer.py
│   │   ├── models.py
│   │   ├── permissions.py
│   │   ├── serializers.py
│   │   ├── services.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── ai_services/
│   │   ├── migrations/
│   │   ├── interview_service.py
│   │   ├── interview_views.py
│   │   ├── job_matching.py
│   │   ├── llm.py
│   │   ├── models.py
│   │   ├── recommendation_service.py
│   │   ├── recommendation_views.py
│   │   ├── resume_service.py
│   │   ├── resume_views.py
│   │   ├── serializers.py
│   │   ├── services.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── applications/
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── permissions.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── companies/
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── permissions.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── jobs/
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── permissions.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── profiles/
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── permissions.py
│   │   ├── serializers.py
│   │   ├── signals.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── common/
│   ├── config/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   │
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md


🔌 API Structure

Base API:

/api/v1/


Authentication

POST   /api/v1/auth/register/
POST   /api/v1/auth/login/
POST   /api/v1/auth/refresh/
GET    /api/v1/auth/me/
POST   /api/v1/auth/logout/


Companies

GET    /api/v1/companies/
POST   /api/v1/companies/
GET    /api/v1/companies/<id>/
PATCH  /api/v1/companies/<id>/
DELETE /api/v1/companies/<id>/
GET    /api/v1/companies/my/


Jobs

GET    /api/v1/jobs/
POST   /api/v1/jobs/
GET    /api/v1/jobs/<id>/
PATCH  /api/v1/jobs/<id>/
DELETE /api/v1/jobs/<id>/
GET    /api/v1/jobs/recruiter/
GET    /api/v1/jobs/admin/


Applications

GET    /api/v1/applications/
POST   /api/v1/applications/
GET    /api/v1/applications/<id>/
DELETE /api/v1/applications/<id>/withdraw/
GET    /api/v1/applications/recruiter/
PATCH  /api/v1/applications/<id>/status/


AI

GET    /api/v1/ai/job-match/<job_id>/
POST   /api/v1/ai/job-match/
POST   /api/v1/ai/job-match/<job_id>/regenerate/

GET    /api/v1/ai/my-matches/

POST   /api/v1/ai/recommendations/

POST   /api/v1/ai/resume-score/
GET    /api/v1/ai/resume-score/

GET    /api/v1/ai/interview-questions/<job_id>/
POST   /api/v1/ai/interview-questions/
POST   /api/v1/ai/interview-questions/<job_id>/regenerate/


⚙️ Local Setup
Prerequisites

Install the following:

Python 3.x
Node.js
PostgreSQL
Git
VS Code
Postman


🐍 Backend Setup

Open a terminal and navigate to the backend:

cd backend

Create a virtual environment:

python -m venv venv

Activate the virtual environment on Windows:

venv\Scripts\activate

Install Python dependencies:

pip install -r requirements.txt


🔑 Environment Variables

Create:

backend/.env

Example:

SECRET_KEY=your-secret-key
DEBUG=True

OPENAI_API_KEY=your-openai-api-key

DB_NAME=ai_job_portal
DB_USER=postgres
DB_PASSWORD=your-postgresql-password
DB_HOST=localhost
DB_PORT=5433

ALLOWED_HOSTS=localhost,127.0.0.1

Never commit your real .env file or API keys to GitHub.


🗄️ Database Setup

Create a PostgreSQL database:

ai_job_portal

Run Django migrations:

python manage.py migrate

Start the backend server:

python manage.py runserver

Backend:

http://127.0.0.1:8000/


⚛️ Frontend Setup

Open another terminal.

Navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Frontend:

http://localhost:5173/


🧪 Testing

The application was tested across the major user workflows.

Candidate Testing
Registration
Login
Dashboard
Profile
Resume upload
Resume AI analysis
AI recommendations
AI job matching
AI interview questions
Job search
Job details
Apply for job
View applications
Withdraw application
Application status persistence
Resume persistence
AI result persistence


Recruiter Testing

Login
Dashboard
Company management
Job creation
Job editing
Job deletion
Job activation/deactivation
Application management
Application status updates
Recruiter ownership permissions


Administrator Testing

Dashboard statistics
User management
User activation/deactivation
Protected administrator account
Company management
Job management
Application management
Admin-only permissions



Security Testing

Candidate access protection
Recruiter access protection
Admin access protection
Resource ownership validation
Protected administrator account
Role-based authorization


🧠 Key Backend Concepts Demonstrated

This project demonstrates practical knowledge of:

Django models
Django REST Framework
Serializers
Generic API views
APIView
Custom permissions
Object-level permissions
JWT authentication
PostgreSQL relationships
ForeignKey relationships
Query optimization with select_related
REST API design
File uploads
PDF/DOCX text extraction
Environment variables
OpenAI API integration
Error handling
Role-based authorization
CRUD operations


💻 Key Frontend Concepts Demonstrated

The frontend demonstrates:

React functional components
React Hooks
useState
useEffect
React Router
Protected routes
Role-based routes
Axios API integration
JWT token handling
Local storage
Form handling
Loading states
Error states
Empty states
Responsive UI
Tailwind CSS
Reusable components
Service-layer API organization


⭐ Project Highlights

Full-stack architecture using React and Django REST Framework
PostgreSQL relational database
JWT authentication
Candidate, Recruiter and Admin roles
Role-based authorization
Recruiter resource ownership
Administrator management system
AI-powered recruitment features
Resume file persistence
Job application workflow
Application status management
RESTful API architecture
Responsive modern UI
Git/GitHub version control


🔮 Future Enhancements

Possible future improvements include:

Email notifications
Recruiter-to-candidate messaging
Advanced job recommendation algorithms
Interview scheduling
Application analytics
Resume builder
Advanced recruiter analytics
Production deployment
Automated testing and CI/CD
Cloud file storage


👨‍💻 Developer
Guna Sekar

Full Stack Python Developer — Fresher

GitHub:

https://github.com/gunasekar999

📌 Repository

GitHub Repository:

https://github.com/gunasekar999/AI-Job-Portal


📄 License

This project was created as a portfolio and learning project.