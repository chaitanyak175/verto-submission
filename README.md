# Employee Management System

A full-stack CRUD (Create, Read, Update, Delete) application built with Next.js for managing employee records.

## Features

### Core Features

-   **Complete CRUD Operations**: Add, view, edit, and delete employees
-   **Modern UI**: Built with shadcn/ui components for a clean, professional interface
-   **Real-time Updates**: Instant UI updates after any operation
-   **Form Validation**: Client-side and server-side validation with proper error handling

## Tech Stack

-   **Frontend**: Next.js 15, React 19, TypeScript
-   **Backend**: Next.js API Routes
-   **Database**: SQLite with Prisma ORM
-   **UI Components**: shadcn/ui (built on Radix UI)
-   **Styling**: Tailwind CSS
-   **Form Handling**: React Hook Form with Zod validation
-   **Testing**: Jest with React Testing Library

## Database Schema

```prisma
model Employee {
  id       Int    @id @default(autoincrement())
  name     String
  email    String @unique
  position String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("employees")
}
```

## API Endpoints

-   `GET /api/employees` - Fetch all employees (with optional search)
-   `POST /api/employees` - Create a new employee
-   `GET /api/employees/[id]` - Fetch a specific employee
-   `PUT /api/employees/[id]` - Update an employee
-   `DELETE /api/employees/[id]` - Delete an employee

## Getting Started

### Prerequisites

-   Node.js 18+
-   pnpm (or npm/yarn)

### Installation

1. **Install dependencies**

    ```bash
    pnpm install
    ```

2. **Set up the database**

    ```bash
    # Generate Prisma client
    pnpm prisma generate

    # Run migrations
    pnpm prisma migrate dev --name init
    ```

3. **Start the development server**

    ```bash
    pnpm dev
    ```

4. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

### Available Scripts

-   `pnpm dev` - Start development server
-   `pnpm build` - Build for production
-   `pnpm start` - Start production server
-   `pnpm test` - Run tests
-   `pnpm test:watch` - Run tests in watch mode
-   `pnpm test:coverage` - Run tests with coverage report
-   `pnpm lint` - Run ESLint

## Features Walkthrough

### 1. Employee List

-   View all employees in a clean, organized table
-   Search functionality to filter by name, email, or position
-   Responsive design that works on all devices

### 2. Add Employee

-   Click "Add Employee" to open the form
-   Required fields: Name, Email, Position
-   Email validation and uniqueness checks
-   Real-time form validation with error messages

### 3. Edit Employee

-   Click the edit button (pencil icon) on any employee
-   Opens a modal with pre-populated form
-   Same validation as create form
-   Instant updates in the table

### 4. Delete Employee

-   Click the delete button (trash icon) on any employee
-   Confirmation dialog prevents accidental deletions
-   Permanent removal from the database

### 5. Search & Filter

-   Use the search bar to find specific employees
-   Searches across name, email, and position fields
-   Real-time filtering as you type

## Testing

The project includes comprehensive tests for:

-   Employee data validation
-   Form validation logic
-   Error handling scenarios

Run tests with:

```bash
pnpm test
```

## Environment Variables

The `.env` file is already configured:

```env
DATABASE_URL="file:./dev.db"
```
