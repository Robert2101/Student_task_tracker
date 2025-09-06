# Student Task Tracker – Project Overview

## What Is It?
**Student Task Tracker** is a full-stack web application designed to help instructors assign, track, and manage tasks for students, while also allowing students to manage their own tasks and update their progress. It supports both *personal tasks* (created by students for themselves) and *assigned tasks* (created by instructors for all students).

---

## Key Features

- **Role-Based Access:**
  - **Instructors:** Can create, update, and delete tasks for all students, and monitor each student's progress.
  - **Students:** Can create their own tasks, view tasks assigned by instructors, update status, and manage their personal to-dos.

- **Task Management:**
  - Task creation with title, description, due date, and priority (low/medium/high).
  - Each task has a `status` (pending/completed).
  - Instructors assign the same task to all students; each student gets an individual instance.
  - Students can only update the status of instructor-assigned tasks, but can fully edit their own personal tasks.

- **Dashboards:**
  - **Instructor Dashboard:** Group and track all assigned tasks, see completion progress per task and student, filter/search tasks.
  - **Student Dashboard:** View all assigned tasks and personal tasks, filter and search, update status, edit/delete own tasks.

- **UI/UX:**
  - Responsive design; works on mobile and desktop.
  - User-friendly modals for task creation and editing.
  - Overview/statistics widgets (total tasks, completed, pending, etc.).
  - Real-time feedback via toasts (success/error messages).

---

## How Does It Work?

### 1. **Authentication & Roles**
- Users log in and are assigned a role (`student` or `instructor`).
- Role is checked server-side for every task operation, ensuring proper permissions.

### 2. **Task Creation Logic**
- **Instructors**: When an instructor creates a task, it is individually assigned to all students in the system.
- **Students**: When a student creates a task, it is only for themselves.

### 3. **Task Model**
- Each task has:
  - `createdBy`: User who created it.
  - `assignedTo`: User the task is assigned to (all students for instructor tasks; self for personal tasks).
  - `title`, `description`, `dueDate`, `priority`, `status`.

### 4. **Task Operations**
- **Instructors:**
  - Can view all tasks they've created (across all students).
  - Can update any task they've created (for any student).
  - Can delete any task they've created.
- **Students:**
  - Can view all their own tasks and those assigned by instructors.
  - Can create, edit, and delete their own tasks.
  - Can only update the *status* (not content) of tasks assigned by an instructor.

### 5. **Grouping and Statistics**
- Tasks are grouped by instructor and student for efficient display.
- Progress for each task can be seen (e.g., X out of Y students completed).

---

## Technical Stack

- **Frontend:** React.js (with modern hooks, context for authentication, and modular components)
  - Pages: `DashBoard.jsx`, `StudentDashboard.jsx`, `InstructorDashboard.jsx`, `Home.jsx`
  - Components: `CreateTask.jsx`, statistics widgets, modals, etc.
  - Libraries: likely uses a UI library (e.g., Material-UI or Shadcn), toast notifications, date pickers.

- **Backend:** Node.js with Express.js
  - RESTful API endpoints for tasks, users.
  - Role-based middleware for authorization.
  - Controllers: `task.controller.js` handles logic for create, update, delete, and fetch.
  - Models: Mongoose schemas for Task and User.

- **Database:** MongoDB (via Mongoose)
  - Stores users (with roles) and tasks.

---

## Example User Flows

### Instructor:
1. Logs in → sees a dashboard of all tasks they've assigned.
2. Clicks "Assign New Task" → fills out form (title, description, due date, priority) → submits → task is assigned to ALL students.
3. Can view each task group’s progress (how many students completed).
4. Can edit/update/delete tasks they assigned.

### Student:
1. Logs in → sees dashboard with all tasks assigned by instructor + personal tasks.
2. Can create new personal tasks.
3. Can update status of any task (own or assigned).
4. Can edit/delete their own personal tasks, but not instructor-assigned ones (except status).

---



## Summary

**Student Task Tracker** is a robust, role-based task management solution for educational environments, supporting clear separation between instructor and student workflows, detailed tracking, and an extensible design.
