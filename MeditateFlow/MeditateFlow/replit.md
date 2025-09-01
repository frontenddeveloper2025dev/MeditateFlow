# Overview

This is a meditation application called "Serenity" built with React, Express, and TypeScript. The app provides guided meditation sessions with ambient sounds, breathing animations, interval bells, and session tracking. Users can customize their meditation experience with various breathing patterns, ambient sounds (rain, ocean, forest, wind), and session durations. The application tracks meditation history and provides statistics on daily goals and streaks.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React SPA**: Single-page application using React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks for local state, TanStack Query for server state
- **UI Framework**: Radix UI primitives with shadcn/ui components for consistent design
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Express Server**: Node.js with Express framework for REST API
- **Storage**: In-memory storage implementation with interface for future database integration
- **Session Management**: Basic session handling without authentication (demo user approach)
- **API Design**: RESTful endpoints for meditation sessions and user preferences

## Data Storage
- **Schema Definition**: Drizzle ORM schema with PostgreSQL dialect for type-safe database operations
- **Current Storage**: In-memory Map-based storage for development/demo purposes
- **Database Ready**: Schema defined for users, meditation_sessions, and user_preferences tables
- **Migration Support**: Drizzle-kit configured for database migrations

## Key Features
- **Audio Management**: Custom audio manager for ambient sounds and interval bells
- **Breathing Animation**: Synchronized visual breathing guide with customizable timing
- **Session Timer**: Configurable meditation sessions with progress tracking
- **Statistics**: Session history, daily goals, and streak tracking
- **Responsive Design**: Mobile-first approach with adaptive layouts

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database client for serverless environments
- **drizzle-orm**: Type-safe ORM with schema validation
- **@tanstack/react-query**: Server state management and caching
- **express**: Node.js web framework for API server

### UI and Styling
- **@radix-ui/***: Headless UI components for accessibility and functionality
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management for components
- **lucide-react**: Consistent icon library

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Type safety and enhanced developer experience
- **drizzle-kit**: Database migration and schema management
- **wouter**: Lightweight client-side routing

### Audio and Media
- **embla-carousel-react**: Touch-friendly carousel component
- Web Audio API (built-in): For ambient sound playback and management

The application is configured for deployment on Replit with development-specific plugins and error handling. The architecture supports easy scaling from in-memory storage to full PostgreSQL database integration.