# AtomChat Backend Overview

## Purpose
AtomChat Backend powers the collaboration features of AtomChat by exposing RESTful APIs for user management, task tracking, and authentication. It is designed to run as a Firebase Function while still supporting local execution for development and testing.

## Technology Stack
- Node.js 18 with TypeScript and Express
- Firebase Functions v2 for serverless hosting
- Firebase Admin SDK with Firestore for persistence
- JSON Web Tokens (JWT) for authentication
- Jest for automated testing

## High-Level Architecture
1. **Interfaces Layer** exposes HTTP controllers, middleware, and route builders that translate HTTP requests to application commands.
2. **Application Layer** contains services and data-transfer objects that orchestrate workflows and enforce business rules.
3. **Domain Layer** models core entities and repository contracts, keeping business logic independent of infrastructure details.
4. **Infrastructure Layer** provides Firestore-backed repository implementations and database configuration helpers.

## Request Lifecycle
1. The Express application boots in `src/app.ts`, wiring repositories, services, controllers, middleware, and routes.
2. Incoming requests pass through Helmet, CORS, JSON parsing, and authentication middleware when needed.
3. Controllers validate input, call the appropriate application service, and shape API responses.
4. Services coordinate domain operations, delegating persistence to repository abstractions in the infrastructure layer.
5. Errors propagate to the central `errorHandler`, which normalises responses and hides sensitive details in production.

## Key Features
- User registration and login with JWT-based sessions.
- Task CRUD operations scoped by authenticated user.
- Health endpoint for uptime monitoring.
- Structured architecture that keeps Firebase-specific code isolated to the infrastructure layer.

## Related Documentation
- [`api.md`](./api.md) documents endpoints and payloads.
- [`development.md`](./development.md) explains local setup, deployment, and testing workflows.
