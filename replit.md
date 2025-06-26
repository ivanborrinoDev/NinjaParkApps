# NinjaPark - Smart Urban Parking Application

## Overview

NinjaPark is a smart urban parking application that helps users discover and book parking spots effortlessly. The application consists of a React frontend with Firebase authentication and a Node.js/Express backend with PostgreSQL database integration using Drizzle ORM. The app features real-time parking availability, interactive maps, and secure user management.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend concerns:

- **Frontend**: React with TypeScript, utilizing shadcn/ui components and Tailwind CSS for styling
- **Backend**: Express.js server with TypeScript support
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Firebase Authentication for user management
- **Maps**: Google Maps integration for location services
- **Build System**: Vite for frontend bundling and development
- **Deployment**: Replit with autoscale deployment target

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript and modern hooks
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and React Context for global state
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **Authentication**: Firebase Auth with Google OAuth and email/password authentication

### Backend Architecture
- **Server**: Express.js with TypeScript support
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild for server bundling

### Database Schema
The application uses PostgreSQL with the following main entities:
- **Users**: Stores user information with Firebase UID integration
- **Private Parkings**: Manages privately owned parking spots with location, pricing, and availability data

### Authentication Flow
- Firebase Authentication handles user sign-up and sign-in
- Google OAuth integration for streamlined authentication
- Email/password authentication as fallback option
- User data synchronized between Firebase and PostgreSQL database

## Data Flow

1. **User Authentication**: Users authenticate via Firebase (Google OAuth or email/password)
2. **Location Services**: App requests user location for nearby parking search
3. **Map Integration**: Google Maps displays user location and available parking spots
4. **Real-time Updates**: TanStack Query manages server state and caching
5. **Booking Process**: Users can view parking details and initiate booking through modal interfaces

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: PostgreSQL connection handling
- **firebase**: Authentication and potentially future real-time features
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database operations
- **wouter**: Lightweight routing solution

### UI Components
- **@radix-ui/***: Accessible UI primitives
- **lucide-react**: Modern icon library
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management

### Development Tools
- **vite**: Frontend build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

- **Development**: `npm run dev` runs both frontend and backend in development mode
- **Build Process**: 
  - Frontend: Vite builds static assets to `dist/public`
  - Backend: esbuild bundles server code to `dist/index.js`
- **Production**: `npm run start` serves the built application
- **Database**: PostgreSQL module configured in Replit environment
- **Port Configuration**: Application runs on port 5000 with external port 80 mapping

### Environment Configuration
- Firebase configuration via environment variables
- Database connection via `DATABASE_URL` environment variable
- Automatic database migrations via Drizzle push commands

## Changelog

```
Changelog:
- June 24, 2025. Initial setup
- June 24, 2025. Updated branding from ParkNinja to NinjaPark
- June 24, 2025. Implemented complete React parking app with Firebase auth, Google Maps integration, dark theme
- June 24, 2025. Added login page, map view, parking markers, details modal, profile dropdown
- June 24, 2025. Removed Firebase authentication, implemented simple local auth system
- June 24, 2025. Added private parking creation functionality with photo upload, accessibility options
- June 24, 2025. Created "My Parkings" management interface for users to manage their listings
- June 24, 2025. Implemented complete booking system with date/time selection, availability checking, and payment integration
- June 24, 2025. Added booking confirmation screen and booking history management with cancellation options
- June 24, 2025. Created comprehensive user profile system with reviews, parking management, and user statistics
- June 24, 2025. Added review system for completed bookings and parking edit functionality
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```