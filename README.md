You are building the **frontend-only MVP** for a responsive web application called "Permit Genie". 
It helps contractors and event planners find required permits based on project details and location.

---

### General Requirements for Phase 1 (Frontend):
- **Web-first**, fully responsive, works on desktop and mobile browsers.
- All pages, navigation, buttons, and input fields must be functional on the client side.
- No backend integration yet — use placeholder/dummy data where needed.
- **Style using Tailwind CSS** for modern, professional UI.
- Use **React.js with React Router** for SPA navigation.
- Maintain a clean, minimalist design:
  - **White background** for the main app area
  - Use **modern gradient accents** (orange → purple → red blends) for buttons, highlights, and headers.
  - Gradients should be smooth and subtle but give a premium feel (inspired by current AI tools like ChatGPT's gradient styles).
  - Plenty of whitespace, rounded corners, soft shadows for cards and modals.
  - Typography should be clean and readable (e.g., Inter, Poppins, or similar).

---

### Pages to Build:

1. **Landing Page**
   - Header: Logo (Permit Genie), Navigation links (Home, About, Contact, Login/Sign up)
   - Hero section: Headline "Find Permits Fast, Stay Compliant", CTA button "Get Started"
     - CTA button uses gradient (orange → purple) with white text.
   - Feature highlights: 3 cards (Permit Finder, Deadline Tracker, Document Vault) with gradient icon accents.
   - Footer: white background with subtle gradient border.

2. **Sign Up Page**
   - Fields: Name, Email, Password, Confirm Password
   - Button: "Create Account" with gradient background.
   - Link to "Already have an account? Login"

3. **Login Page**
   - Fields: Email, Password
   - Button: "Login" with gradient background.
   - Link to "Don't have an account? Sign Up"

4. **Dashboard**
   - Sidebar navigation: Dashboard, New Project, My Projects, Document Vault, Settings, Logout
     - Sidebar background: white with gradient accent line.
   - Main panel:
     - Welcome message in gradient text.
     - "Start New Project" button with gradient background.
     - Recent projects preview (cards with soft shadows, gradient top border).

5. **New Project Form**
   - Multi-step wizard with progress indicator using gradient fill.
   - Step 1: Project name, location (text input), type of work (dropdown), start date.
   - Step 2: Project scope (textarea), budget (number field).
   - Step 3: Review & submit.
   - Navigation buttons: gradient background.

6. **Project Details Page**
   - Shows project info in a clean card.
   - Placeholder permit list table with gradient header row.
   - "View Checklist" button with gradient background.

7. **Checklist Page**
   - Task list with checkboxes.
   - Buttons: "Mark Complete" (gradient background), "Back to Project".

8. **Document Vault Page**
   - Grid/list layout for documents with gradient folder/file icons.
   - "Upload Document" button (gradient background).
   - Preview/delete icons with subtle hover effects.

9. **Settings Page**
   - Fields: Business name, address, license number, tax ID.
   - Save button with gradient background.

---

### Functional Requirements:
- All navigation and buttons should route correctly with React Router.
- All form inputs must be interactive and maintain state with React hooks.
- Multi-step form should retain user inputs until submitted.
- Use **dummy data** for now for project lists, permit lists, and documents.
- Keep UI consistent and professional across all pages.
- Tailwind gradients should use `bg-gradient-to-r` or `bg-gradient-to-br` with colors like `from-orange-400 via-purple-500 to-red-500`.
- Include smooth hover and active states for all interactive elements.

---

### Output:
Generate the complete React project structure:
- /src/components → Reusable UI components
- /src/pages → LandingPage.jsx, SignupPage.jsx, LoginPage.jsx, Dashboard.jsx, NewProjectForm.jsx, ProjectDetails.jsx, Checklist.jsx, DocumentVault.jsx, Settings.jsx
- /src/App.jsx → App routing with React Router
- Tailwind CSS configured with gradient color palette and chosen font.

# Permit Genie – Phase 2 Backend Integration

This document outlines all tasks, requirements, and structures for **Phase 2** of the Permit Genie MVP.  
In this phase, we will connect the already-built frontend (Phase 1) to a **real backend + database**, with mock permit data for now.

---

-----------------------------------------------------------
-----------------------------------------------------------
-----------------------------------------------------------
-----------------------------------------------------------

## 🎯 Goals for Phase 2
- Implement a secure and scalable **backend API**.
- Connect frontend forms, buttons, and pages to backend routes.
- Store all user and project data in a persistent database.
- Implement **authentication & authorization**.
- Add **mock permit search results** (to be replaced with live APIs later).
- Prepare deployment for testing/demo.

---

## 🛠 Tech Stack
**Backend**
- **Node.js** + **Express.js** for the API server.
- **PostgreSQL** for the database.
- **Prisma ORM** (preferred) or Sequelize.
- **JWT Authentication** for login sessions.
- **bcrypt** for password hashing.

**Hosting**
- Backend: Render / Railway / Vercel Functions.
- Database: Supabase / Neon.tech.

---

## 📦 Features to Implement

### 1. Authentication
- **Sign Up**
  - Input: `name`, `email`, `password`
  - Password stored as **bcrypt hash**
  - Returns JWT on success
- **Login**
  - Validates credentials
  - Returns JWT on success
- **Protected Routes**
  - All project, checklist, and document endpoints require valid JWT.

---

### 2. Project Management
- **Create Project**
  - Inputs: `name`, `location`, `typeOfWork`, `startDate`, `scope`, `budget`
  - Linked to authenticated user
- **Get All Projects**
  - Lists all projects for logged-in user
- **Get Single Project**
  - Returns project details + checklist + documents
- **Delete Project**
  - Removes project and all linked data

---

### 3. Permit Search (Mocked)
- **Mock Dataset**
  - Predefined JSON responses for:
    - Building Permits
    - Electrical Permits
    - Plumbing Permits
    - Event Permits
- **Logic**
  - Match permit data based on:
    - `typeOfWork`
    - `location`
- **Later**
  - Replace with live city/state APIs or paid aggregator services.

Example mock data:
```json
{
  "permitType": "Building Permit",
  "requirements": [
    "Submit site plan",
    "Obtain zoning approval",
    "Environmental clearance",
    "Pay application fee"
  ]
}

