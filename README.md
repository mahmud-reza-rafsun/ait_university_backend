# 🎓 AIT University — Backend API

**Advanced Information of Technology**

A full-stack university management system built with **Prisma ORM**, designed to handle admissions, academics, credit management, and more.

---

## 📁 Schema Structure

The database schema is organized into **modular Prisma schema files** for clean separation of concerns:

```
schema/
├── admission.prisma     # Student admission & enrollment
├── auth.prisma          # Authentication & user management
├── credit.prisma        # Credit hours & transfer credits
├── enums.prisma         # Shared enums (roles, statuses, etc.)
├── lession.prisma       # Lessons, schedules & class content
├── schema.prisma        # Root config (datasource, generator)
├── subject.prisma       # Subjects, courses & departments
└── task.prisma          # Assignments, tasks & submissions
```

---

## 🛠️ Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Runtime     | Node.js / Bun           |
| ORM         | Prisma                  |
| Database    | PostgreSQL (Neon)       |
| Language    | TypeScript              |
| Auth        | Better Auth / JWT       |

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Setup

```env
DATABASE_URL="postgresql://user:password@host/ait_university?sslmode=require"
```

### 3. Generate Prisma Client

```bash
bunx prisma generate
```

### 4. Run Migrations

```bash
bunx prisma migrate dev --name init
```

### 5. Seed Database

```bash
bun run seed
```

---

## 📦 Schema Modules

### 🔐 `auth.prisma`
Handles users, roles, sessions, and permissions.
- User registration & login
- Role-based access control (Admin, Teacher, Student)
- Session & token management

### 📋 `admission.prisma`
Manages student admission lifecycle.
- Application submissions
- Admission status tracking
- Enrollment confirmation

### 📚 `subject.prisma`
Covers academic subjects and departments.
- Subject/course definitions
- Department assignments
- Prerequisites

### 📖 `lession.prisma`
Handles lesson scheduling and content.
- Class schedules
- Lecture materials
- Attendance tracking

### 🏅 `credit.prisma`
Manages credit hours and GPA.
- Credit hour assignments
- Transfer credit evaluation
- GPA calculation

### ✅ `task.prisma`
Tracks assignments and submissions.
- Task creation by teachers
- Student submissions
- Grading & feedback

### 🔢 `enums.prisma`
Shared enum types used across all schemas.
- User roles
- Admission statuses
- Task/submission statuses

---

## 📂 Project Structure

```
ait-university/
├── prisma/
│   └── schema/
│       ├── schema.prisma
│       ├── enums.prisma
│       ├── auth.prisma
│       ├── admission.prisma
│       ├── subject.prisma
│       ├── lession.prisma
│       ├── credit.prisma
│       └── task.prisma
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   └── index.ts
├── .env
├── package.json
└── README.md
```

---

## 🧑‍💻 Author

Built with ❤️ for **AIT University** — Advanced Information of Technology.

---

## 📄 License

MIT License