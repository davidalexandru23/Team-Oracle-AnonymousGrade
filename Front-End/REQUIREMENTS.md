Esti responsabil de frontend (React SPA) pentru proiectul “Aplicatie Web pentru Acordarea Anonima de Note”. Lucrezi pe branch-ul `frontend` in acelasi repo. Backend-ul este deja facut in Node/Express cu Prisma + Postgres (Neon) si expune un REST API cu JWT.

Obiectivul tau: sa construiesti un frontend simplu, curat, modern, care acopera 3 roluri:

1. Student MP (owner proiect)
2. Student Evaluator (jurat)
3. Teacher (profesor)

Ai voie sa folosesti componente UI open-source (ex shadcn/ui + lucide + framer-motion), dar pastreaza aplicatia simpla si functionala.

1. Setup Git

* Creeaza/foloseste branch `frontend`
* Lucreaza doar pe frontend. Nu modifica backend decat daca e nevoie (si atunci anunta).

2. Setup proiect React

* Creeaza folder `frontend/` in root repo
* Foloseste Vite React
* Instaleaza:

  * react-router-dom
  * axios
  * (optional) zod pentru validari
  * (optional) framer-motion pentru animatii

Structura recomandata:
frontend/
src/
api/
client.js
auth.js
projects.js
deliverables.js
jury.js
grades.js
pages/
Login.jsx
Register.jsx
MpDashboard.jsx
ProjectDetails.jsx
EvaluatorAssignments.jsx
TeacherDashboard.jsx
components/
Navbar.jsx
ProtectedRoute.jsx
RoleGuard.jsx
ProjectCard.jsx
DeliverableCard.jsx
GradeForm.jsx
store/
authStore.js (sau context)
utils/
token.js
.env (VITE_API_URL)

3. Autentificare in frontend

* Implementare login/register
* Stocare token JWT in localStorage
* Axios interceptor care pune automat header:
  Authorization: Bearer <token>
* Ruta protected: daca nu ai token, redirect la /login
* Role guard: anumite pagini doar pentru TEACHER, altele pentru STUDENT

4. Pagini si flow minim (MVP)
   A) Login / Register

* Register: name, email, password, role (dropdown: STUDENT/TEACHER)
* Login: email, password
* Dupa login, redirect in functie de rol:

  * TEACHER -> /teacher
  * STUDENT -> /mp (si evaluator are pagina de assignments in acelasi rol, userul e STUDENT oricum)

B) MP Dashboard (STUDENT)

* Lista proiectelor mele
* Buton “Create project”
* Click pe proiect -> pagina proiect (detalii + livrabile)
* In pagina proiect: lista livrabile + form de creare livrabil + edit demoUrl

C) Evaluator Assignments (STUDENT)

* Lista “my assignments”
* Pentru fiecare assignment: proiect, livrabil, demoUrl, expiresAt, nota mea (daca exista)
* Form de trimis/modificat nota (pana la expiresAt)

D) Teacher Dashboard (TEACHER)

* Lista tuturor proiectelor
* In pagina proiect: lista livrabile
* La livrabil: buton “Assign jury” (daca nu e asignat deja)
* La livrabil: pagina “Grades” care arata:

  * notele individuale anonime
  * finalGrade calculat de backend
  * status (insufficient_grades / ok)

5. API calls: ce face fiecare, payload, raspuns, permisiuni

Base URL: VITE_API_URL (ex: [http://localhost:3000](http://localhost:3000))

Auth

1. POST /auth/register

* Scop: creeaza cont (student sau teacher)
* Body:
  { name: string, email: string, password: string, role?: "STUDENT"|"TEACHER" }
* Response:
  { user: { id, name, email, role }, token }
* UI: pagina Register. Dupa succes: salvezi token + redirect.

2. POST /auth/login

* Scop: autentificare
* Body:
  { email: string, password: string }
* Response:
  { user: { id, name, email, role }, token }
* UI: pagina Login.

3. GET /auth/me

* Scop: verifica token si ia user curent
* Header: Authorization: Bearer token
* Response:
  { user: { id, name, email, role } }
* UI: la refresh, ca sa refaci sesiunea (read token din localStorage).

Projects
4) POST /projects (STUDENT)

* Scop: MP creeaza proiect
* Header: Bearer token
* Body:
  { title: string, description: string }
* Response:
  { project: { id, title, description, ownerId, createdAt } }
* UI: form create project (in MP dashboard)

5. GET /projects (STUDENT/TEACHER)

* Scop:

  * STUDENT: listeaza doar proiectele lui (MP)
  * TEACHER: listeaza toate proiectele
* Header: Bearer token
* Response:
  { projects: [...] }
* UI:

  * MP dashboard si teacher dashboard

6. GET /projects/:id (STUDENT owner sau TEACHER)

* Scop: detalii proiect + livrabile
* Header: Bearer token
* Response:
  { project: { id, title, description, deliverables: [...] } }
* UI: pagina ProjectDetails

Deliverables
7) POST /projects/:projectId/deliverables (owner sau TEACHER)

* Scop: creeaza livrabil pentru proiect
* Header: Bearer token
* Body:
  { title: string, description: string, deadline: ISO string, demoUrl?: string }
* Response:
  { deliverable: { id, projectId, title, description, deadline, demoUrl } }
* UI: in ProjectDetails (MP)

8. GET /projects/:projectId/deliverables (owner sau TEACHER)

* Scop: lista livrabile
* Header: Bearer token
* Response:
  { deliverables: [...] }
* UI: lista livrabile proiect

9. PATCH /deliverables/:id/demo-url (owner sau TEACHER)

* Scop: actualizeaza demoUrl
* Header: Bearer token
* Body:
  { demoUrl: string }
* Response:
  { deliverable: {...} }
* UI: edit demoUrl pentru livrabil

Jury
10) POST /deliverables/:deliverableId/assign-jury (TEACHER)

* Scop: serverul selecteaza aleator jurati (exclude owner proiect)
* Header: Bearer token (TEACHER)
* Response:
  { message, assignmentsCreated, jurySize, expiresAt }
* UI: buton in teacher dashboard pentru fiecare livrabil

11. GET /my-assignments (STUDENT)

* Scop: evaluator vede asignarile lui
* Header: Bearer token (STUDENT)
* Response:
  { assignments: [
  {
  assignmentId,
  deliverableId,
  assignedAt,
  expiresAt,
  deliverable: { title, deadline, demoUrl, project: { id, title } },
  myGrade: { score, updatedAt } | null
  }
  ] }
* UI: pagina EvaluatorAssignments

Grades
12) POST /deliverables/:deliverableId/grade (STUDENT jurat)

* Scop: juratul trimite sau modifica nota pentru livrabil (pana la expiresAt)
* Header: Bearer token
* Body:
  { score: number sau string (ex 9.50) }
* Response:
  { message, grade: { id, score, createdAt, updatedAt } }
* UI: form de nota in pagina assignments

13. GET /deliverables/:deliverableId/grades (TEACHER sau owner)

* Scop:

  * TEACHER: vede toate notele individuale anonime + finalGrade
  * Owner (MP): vede doar finalGrade + gradesCount
* Header: Bearer token
* Response (TEACHER):
  { deliverable, gradesCount, status, finalGrade, grades: [{ gradeId, score, createdAt }] }
* Response (MP):
  { deliverable, gradesCount, status, finalGrade }
* UI:

  * teacher: pagina livrabil grades
  * MP: afiseaza doar finalGrade la livrabil

6. UX minim recomandat

* Navbar cu: Projects (pentru MP), Assignments (pentru STUDENT), Teacher (pentru TEACHER), Logout
* Logout: sterge token din localStorage si redirect la login
* Afiseaza clar status:

  * “Waiting for grades” daca status = insufficient_grades
  * “Final grade: X.XX” daca status = ok

7. Ce livrabil livrezi

* Frontend functional MVP (rutele de mai sus + axios client + UI basic)
* README cu cum se porneste:

  * npm install
  * set VITE_API_URL
  * npm run dev

Constrangeri

* Nu folosi AI in cod in sensul de “copy paste generat”; scrie curat, simplu, comentarii minime.
* Pastreaza UI modern dar minimal (2-3 pagini principale, nu overdesign).