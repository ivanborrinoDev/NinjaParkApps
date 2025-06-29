# NinjaPark - Smart Parking Solutions

## Overview

NinjaPark is a modern parking marketplace application that connects parking spot hosts with drivers looking for convenient parking. The application is built as a full-stack web application using React for the frontend, Express.js for the backend, and PostgreSQL with Drizzle ORM for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and build processes
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: React Context API for global state (Auth, App contexts)
- **Data Fetching**: TanStack Query for server state management
- **Authentication**: Firebase Authentication for user management

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for API server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Session-based authentication with PostgreSQL store
- **API Design**: RESTful API with JSON responses

### Database Schema
The application uses three main entities:
- **Users**: Stores user profiles with roles (host/guest) and Firebase integration
- **Parking Spots**: Contains parking location data, pricing, and availability
- **Bookings**: Manages reservations between guests and parking spots

## Key Components

### Authentication System
- Firebase Authentication handles user login/signup
- Support for Google OAuth and email/password authentication
- Role-based access control (host vs guest users)
- Seamless integration between Firebase auth and internal user management

### Map Integration
- Google Maps integration for displaying parking locations
- Real-time location services using geolocation API
- Interactive markers for public and private parking spots
- Custom map styling with dark theme support

### Booking System
- Real-time availability checking
- Price calculation based on duration
- Booking status management (confirmed, cancelled, completed)
- Modal-based booking interface

### User Interface
- Mobile-first responsive design
- Dark theme with custom "ninja" color palette
- Progressive Web App (PWA) capabilities
- Touch-friendly interactions with gesture support

## Data Flow

1. **User Authentication**: Firebase handles authentication, user data synced to PostgreSQL
2. **Location Services**: Browser geolocation provides user position for map centering
3. **Parking Discovery**: API serves parking spots based on location queries
4. **Booking Process**: Users select spots, create bookings through API endpoints
5. **Real-time Updates**: TanStack Query manages cache invalidation and data synchronization

## External Dependencies

### Frontend Dependencies
- **Firebase SDK**: Authentication and potentially future real-time features
- **Google Maps**: Location services and mapping functionality
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework

### Backend Dependencies
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **Express.js**: Web application framework
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast JavaScript bundling for production

## Deployment Strategy

The application is configured for deployment on Replit with:
- **Build Process**: Vite builds frontend assets, ESBuild bundles server code
- **Production Server**: Node.js serves both API and static assets
- **Database**: Neon Database provides managed PostgreSQL
- **Environment**: Autoscale deployment target for production traffic

The deployment uses a monorepo structure where both client and server code are built and served from a single process in production, with Vite handling development hot-reloading.

## Changelog
- June 26, 2025. Initial setup
- June 26, 2025. Completed parking management system with add/book functionality

## Recent Features Added

### Parking Management System
- **Add Parking Modal**: Complete form for hosts to add private parking spots with location, pricing, availability schedules, and features
- **Booking System**: Modal for guests to book private parking spots with date/time selection and price calculation
- **My Parking Page**: Management interface for hosts to view/edit/delete their parking spots and for guests to view booking history
- **Visual Map**: Interactive map showing public (blue) and private (green) parking spots without requiring Google Maps API
- **Real-time Data**: Integration with backend API for authentic parking data storage and retrieval

### Authentication Bypass
- Implemented authentication bypass system for cost-free operation
- Users can still experience full role-based functionality (host vs guest)
- Automatic role selection and user creation in database

### Backend API Enhancements
- Extended parking spots schema with availability schedules, accessibility options, and multiple image support
- Added booking creation and management endpoints
- Host-specific parking spot retrieval
- User booking history tracking

## User Preferences

Preferred communication style: Simple, everyday language.