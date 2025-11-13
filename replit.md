# Ordano - Study Group Management Application

## Overview

Ordano is a web application for managing study groups, enabling users to organize groups, tasks, classes, and exams in one centralized platform. The application provides a productivity-focused interface inspired by Linear and Notion aesthetics, prioritizing clarity and efficient task completion flows.

The project is built as a full-stack TypeScript application with a React frontend and Express backend, currently using JSON file storage with architecture prepared for PostgreSQL database migration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite for fast development and optimized production builds
- **Routing:** Wouter for lightweight client-side routing
- **State Management:** TanStack Query (React Query) for server state management
- **UI Components:** Radix UI primitives with custom shadcn/ui components
- **Styling:** Tailwind CSS with custom design system

**Design System:**
The application follows a productivity-focused design system with:
- Typography hierarchy using Inter font family
- Consistent spacing scale based on Tailwind units (2, 3, 4, 6, 8, 12, 16)
- Component library built on Radix UI primitives for accessibility
- Responsive grid patterns for study groups, todos, classes, and exams
- Dark/light mode support via CSS custom properties

**Component Structure:**
- Comprehensive UI component library in `client/src/components/ui/`
- Reusable form components with react-hook-form integration
- Toast notifications for user feedback
- Mobile-responsive layouts with dedicated mobile menu

### Backend Architecture

**Server Framework:**
- **Runtime:** Node.js with Express
- **Language:** TypeScript with ES modules
- **Development Server:** tsx for TypeScript execution
- **Production Build:** esbuild for bundling

**API Structure:**
The application uses a RESTful API architecture with endpoints for:
- Study groups management (CRUD operations)
- Todo items with toggle completion
- Classes management
- Exams scheduling

**Current Implementation:**
- `server.js`: Legacy Express server with JSON file-based storage
- `server/index.ts`: Modern entry point that spawns the legacy server
- `server/routes.ts`: Prepared route registration system (currently minimal)
- `server/storage.ts`: Storage abstraction layer with in-memory implementation

**Storage Layer:**
The application implements a storage interface pattern:
- `IStorage` interface defining data access methods
- `MemStorage` class providing in-memory storage implementation
- Prepared for database migration with abstraction already in place

### Data Storage Solutions

**Current State: JSON File Storage**
- Data persisted in `data/` directory as JSON files
- Separate files for groups, todos, classes, and exams
- File operations using Node.js fs/promises API

**Migration Path: PostgreSQL with Drizzle ORM**
- Drizzle ORM configured in `drizzle.config.ts`
- Schema defined in `shared/schema.ts` with Zod validation
- Database URL configuration via environment variables
- Neon serverless PostgreSQL client ready for integration
- Session storage configured with connect-pg-simple

**Schema Design:**
Currently defined schema includes:
- Users table with username/password authentication structure
- UUID primary keys using PostgreSQL gen_random_uuid()
- Zod schemas for validation via drizzle-zod integration

### Authentication and Authorization

**Prepared Infrastructure:**
- User schema with username and password fields
- Session middleware ready (connect-pg-simple)
- No active authentication implementation yet
- Credentials-based approach planned for API requests

### Build and Deployment

**Development Workflow:**
- `npm run dev`: Runs tsx server with NODE_ENV=development
- Hot module replacement via Vite for frontend
- Automatic TypeScript checking

**Production Build:**
- Frontend: Vite builds to `dist/public`
- Backend: esbuild bundles server to `dist/index.js`
- Single production command: `npm start` runs bundled server

**Configuration Files:**
- TypeScript config with path aliases (@, @shared, @assets)
- PostCSS with Tailwind and Autoprefixer
- Vite config with Replit-specific plugins for development

## External Dependencies

### Database Services
- **Neon Serverless PostgreSQL:** Cloud PostgreSQL provider (@neondatabase/serverless)
- **Drizzle ORM:** Type-safe ORM for database operations with PostgreSQL dialect
- **connect-pg-simple:** PostgreSQL session store for Express sessions

### UI Framework and Components
- **Radix UI:** Comprehensive suite of unstyled, accessible component primitives
  - Dialog, Dropdown Menu, Popover, Tooltip, Tabs, Accordion, and 20+ other primitives
  - Full keyboard navigation and ARIA support
- **shadcn/ui:** Component configuration system built on Radix UI
- **Tailwind CSS:** Utility-first CSS framework with custom design tokens
- **class-variance-authority:** Component variant management
- **Lucide React:** Icon library

### State Management and Data Fetching
- **TanStack Query:** Server state management with automatic caching and refetching
- **React Hook Form:** Form state management with validation
- **Zod:** Schema validation integrated with forms via @hookform/resolvers

### Development Tools
- **Vite:** Development server and build tool with React plugin
- **Replit Plugins:** Development banner, cartographer, and runtime error overlay
- **tsx:** TypeScript execution for development
- **esbuild:** Production bundling for server code

### UI Enhancement Libraries
- **date-fns:** Date manipulation and formatting
- **embla-carousel-react:** Touch-friendly carousel component
- **cmdk:** Command palette component
- **vaul:** Drawer/bottom sheet component
- **input-otp:** One-time password input component

### Styling Dependencies
- **tailwindcss-animate:** Animation utilities for Tailwind
- **tailwind-merge + clsx:** Class name merging utilities