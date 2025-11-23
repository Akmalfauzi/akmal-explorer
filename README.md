# Akmal Explorer

A modern file explorer application built with Bun, Elysia, and Vue 3 with clean architecture patterns.

## 📋 Requirements

### Prerequisites
- **Bun** (latest version)
- **PostgreSQL** (for backend database)
- **Node.js 18+** (optional, for development tools)

### Technologies Used
- **Database**: PostgreSQL with Drizzle ORM
- **Backend**: Bun runtime with Elysia framework (TypeScript)
- **Frontend**: Vue 3 Composition API with custom folder tree component
- **API**: RESTful endpoints for file and folder operations
- **Testing**: Unit tests and E2E tests (39 total tests)
- **Architecture**: Clean Architecture with SOLID principles
- **UI Components**: Reka UI/shadcn-vue components

## 🚀 Installation & Setup

### 1. Install Prerequisites
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install PostgreSQL
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql postgresql-contrib
# Windows: Download from postgresql.org
```

### 2. Setup Project
```bash
# Clone repository
git clone https://github.com/Akmalfauzi/akmal-explorer.git
cd akmal-explorer

# Install all dependencies
bun install
```

### 3. Setup Environment
```bash
# Setup environment variables automatically
bun run setup:env

# Or create manually:
# apps/backend/.env
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
PORT=3000
NODE_ENV=development

# apps/frontend/.env
VITE_API_URL=http://localhost:3000
```

### 4. Setup Database
```bash
# Generate migrations from Drizzle schema
bun run db:generate

# Apply migrations to database
bun run db:migrate

# Seed database with initial data
bun run db:seed
```

### 5. Run Application

```bash
# Start backend (terminal 1)
bun run dev:backend

# Start frontend (terminal 2)
bun run dev:frontend
```

### 6. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/docs

## 🎯 Features

### File Explorer
- **Two-Panel Layout**: Left panel for folder tree, right panel for files
- **Unlimited Folder Levels**: Nested folders with expand/collapse functionality
- **File & Folder Management**: View details, context menu with right-click
- **Search**: Search folders and files with pagination
- **Responsive Design**: Mobile-friendly with slide-over navigation

### Technical Features
- **Real-time Updates**: Instant folder expansion and file loading
- **Performance Optimizations**:
  - Search input with debounce
  - Infinite scrolling with pagination
  - File caching system
  - Memoization for expensive operations
- **Modern UI/UX**: Clean interface with Tailwind CSS
- **Error Handling**: Comprehensive error states
- **Loading States**: Skeleton loaders and smooth transitions

### Architecture
- **Clean Architecture**: Separation of concerns with layered structure
- **Type Safety**: Full TypeScript support
- **Scalable Codebase**: Modular structure for easy maintenance
- **Testing**: Comprehensive unit and integration tests
- **API Standards**: RESTful API with proper HTTP methods

## 🛠️ Development Commands

### Root Commands
```bash
bun install          # Install all dependencies
bun run test         # Run all tests
bun run setup:env    # Setup environment files
```

### Backend Commands
```bash
bun run dev:backend  # Start backend dev server
bun run test:backend # Run backend tests
bun run db:generate  # Generate migrations from Drizzle schema
bun run db:migrate   # Apply migrations to database
bun run db:seed      # Seed database with initial data
```

### Frontend Commands
```bash
bun run dev:frontend    # Start frontend dev server
bun run build:frontend  # Build for production
bun run preview:frontend # Preview production build
bun test                # Run frontend tests
```

## 🌐 API Documentation

When backend is running, visit http://localhost:3000/docs for interactive API documentation.

## 📁 Project Structure

```
akmal-explorer/
├── apps/
│   ├── backend/           # Elysia API + PostgreSQL
│   └── frontend/          # Vue 3 + Tailwind CSS
├── packages/
│   └── shared/           # Shared utilities
├── scripts/             # Setup and utility scripts
├── screenshots/         # App screenshots
└── README.md           # This file
```

## 🧪 Testing

This project includes **39 passing tests**:
- **Backend**: 15 tests (unit + e2e)
- **Frontend**: 25 tests (unit + components)

```bash
# Run all tests
bun run test

# Run specific test suites
bun run test:backend
cd apps/frontend && bun test
```
