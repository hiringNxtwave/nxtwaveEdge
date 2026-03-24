# TalentConnect India

## Overview

TalentConnect India is a full-stack talent marketplace platform that connects companies with skilled students and professionals in India. The platform enables companies to browse talent profiles, filter candidates by skills and criteria, and manage their recruitment activities through a comprehensive dashboard. Students can showcase their skills, projects, and educational background to potential employers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **Vite Build System**: Fast development and build tooling with hot module replacement
- **Wouter Router**: Lightweight client-side routing solution for navigation
- **Shadcn/ui Component Library**: Comprehensive UI component system built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system variables
- **TanStack Query**: Server state management for data fetching, caching, and synchronization

### Backend Architecture
- **Express.js Server**: RESTful API server with middleware for logging and error handling
- **TypeScript**: Type-safe server-side development
- **Session-based Authentication**: Express sessions with PostgreSQL session storage
- **Storage Layer**: Abstracted data access layer with comprehensive CRUD operations
- **API Route Structure**: Organized routes for authentication, company management, and student browsing

### Database Design
- **PostgreSQL with Drizzle ORM**: Type-safe database operations with schema-first approach
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Relational Schema**: Well-designed relationships between users, companies, students, skills, and projects
- **Session Management**: Dedicated session storage table for authentication persistence

### Authentication System
- **Custom Auth (no OAuth)**: Session-based login — collects name, work email, and mobile number
- **Business Email Validation**: Personal email domains (Gmail, Yahoo, Hotmail, Outlook, Rediffmail etc.) are blocked; only corporate/company emails are accepted
- **Session Management**: Express sessions stored in PostgreSQL (connect-pg-simple), TTL 7 days
- **User Management**: Automatic user creation (upsert by email) on first login; name/mobile updated on subsequent logins
- **Role-based Access**: All authenticated users are set as "recruiter" role; B2B platform only

### State Management
- **React Query**: Server state caching and synchronization
- **React Hooks**: Local component state management
- **Form Handling**: React Hook Form with Zod validation schemas
- **Toast Notifications**: User feedback system for actions and errors

### Development Workflow
- **Monorepo Structure**: Shared types and schemas between client and server
- **Hot Reloading**: Development server with instant updates
- **Type Safety**: End-to-end TypeScript coverage
- **Build Process**: Separate client and server build pipelines

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18 with TypeScript, Vite, and modern tooling
- **Express.js**: Node.js web framework for API development
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL

### Database Services
- **Neon Database**: Serverless PostgreSQL with connection pooling
- **connect-pg-simple**: PostgreSQL session store for Express

### Authentication Services
- **Custom OTP Auth**: Two-step flow — Step 1 collects name, work email, mobile; Step 2 verifies a 6-digit OTP sent to the work email
- **OTP Store**: In-memory Map with 10-min expiry, 5-attempt limit, 30-second resend cooldown, auto-cleanup every 15 min
- **Email Delivery**: Uses `@sendgrid/mail`. Requires `SENDGRID_API_KEY` secret to be set for real email sending. Without it, OTPs are printed to the server console in a formatted dev box (safe for internal testing). NOTE: SendGrid Replit integration was dismissed by the user — to enable real emails, ask the user to provide a `SENDGRID_API_KEY` and store it via the environment secrets tool.

### UI and Styling
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Typography with Inter, DM Sans, and Geist fonts

### Development Tools
- **TypeScript**: Static type checking across the entire stack
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Replit Plugins**: Development environment integration and error handling

### Utility Libraries
- **Zod**: Schema validation for forms and API data
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional CSS class utilities
- **nanoid**: Unique ID generation for entities