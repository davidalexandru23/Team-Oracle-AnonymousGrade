# AnonymousGrade Frontend

React SPA for the Anonymous Grade application - a platform for anonymous project grading.

## Features

- **Student (MP)**: Create projects, add deliverables, view final grades
- **Evaluator**: View assignments, submit grades for deliverables
- **Teacher**: View all projects, assign jury, see individual grades

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure the API URL by creating/editing `.env`:
```
VITE_API_URL=http://localhost:3000
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── api/             # API client and endpoints
│   ├── client.js    # Axios instance with JWT interceptor
│   ├── auth.js      # Auth endpoints
│   ├── projects.js  # Projects endpoints
│   ├── deliverables.js
│   ├── jury.js
│   └── grades.js
├── components/      # Reusable components
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── RoleGuard.jsx
│   ├── ProjectCard.jsx
│   ├── DeliverableCard.jsx
│   └── GradeForm.jsx
├── pages/           # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── MpDashboard.jsx
│   ├── ProjectDetails.jsx
│   ├── EvaluatorAssignments.jsx
│   └── TeacherDashboard.jsx
├── store/           # State management
│   └── authStore.js # Auth context
├── utils/           # Utilities
│   └── token.js     # Token helpers
├── App.jsx          # Main app with routing
├── main.jsx         # Entry point
└── index.css        # Styles
```

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/login` | Public | Login page |
| `/register` | Public | Registration page |
| `/mp` | Student | My Projects dashboard |
| `/assignments` | Student | Evaluator assignments |
| `/teacher` | Teacher | All projects dashboard |
| `/projects/:id` | Authenticated | Project details |

## Backend API

The frontend expects the backend to be running at the URL specified in `VITE_API_URL`.
See the backend documentation for API endpoints.
