# API Reference

This document summarises the REST endpoints exposed by the AtomChat Backend. All responses are JSON encoded. Endpoints prefixed with `/api` require HTTPS in production.

## Authentication

### POST `/api/auth/login`
Authenticates a user by email.

- **Body**: `{ "email": "user@example.com" }`
- **Responses**:
  - `200 OK`: Returns `accessToken` and `user` data when the email exists.
  - `201 Created`: Returns `{ error, requireRegister: true }` when the email is unknown so the client can prompt registration.
  - `400 Bad Request`: Invalid email format.

### POST `/api/auth/register`
Registers a new user and issues an access token.

- **Body**: `{ "email": "user@example.com" }`
- **Responses**:
  - `201 Created`: Returns `accessToken` and `user` data.
  - `400 Bad Request`: Invalid email format or the email is already registered.

### POST `/api/auth/logout`
Stateless logout endpoint that allows the client to clear local session state.

### GET `/api/auth/me`
Returns the authenticated user profile.

- **Headers**: `Authorization: Bearer <token>`
- **Responses**:
  - `200 OK`: Returns the current user record.
  - `401 Unauthorized`: Missing or invalid token.
  - `404 Not Found`: Token is valid but the user no longer exists.

## Users

### POST `/api/users`
Creates a user record (primarily used internally by the auth flow).

- **Body**: `{ "email": "user@example.com" }`
- **Responses**:
  - `201 Created`: Returns the created user.
  - `409 Conflict`: Email is already registered.

### GET `/api/users/:id`
Fetches a user by identifier.

- **Responses**:
  - `200 OK`: Returns the user object.
  - `400 Bad Request`: Missing `id` parameter.
  - `404 Not Found`: User does not exist.

### GET `/api/users?email=<address>`
Looks up a user by email address.

- **Responses**:
  - `200 OK`: Returns the user object.
  - `404 Not Found`: No user with the provided email.

### PATCH `/api/users/:id`
Updates the email for a user.

- **Headers**: `Authorization: Bearer <token>`
- **Responses**:
  - `200 OK`: Returns the updated user.
  - `400 Bad Request`: Missing `id` parameter.
  - `403 Forbidden`: Authenticated user differs from the user being updated.
  - `404 Not Found`: User does not exist.
  - `409 Conflict`: Email already belongs to another user.

### DELETE `/api/users/:id`
Deletes a user record.

- **Headers**: `Authorization: Bearer <token>`
- **Responses**:
  - `204 No Content`: Deletion succeeded.
  - `400 Bad Request`: Missing `id` parameter.
  - `404 Not Found`: User does not exist.

## Tasks

All task endpoints require a bearer token. Task access is limited to the task owner.

### POST `/api/tasks`
Creates a task owned by the authenticated user.

- **Body**: `{ "title": "Write docs", "description": "Document the backend" }`
- **Responses**:
  - `201 Created`: Returns the created task.
  - `404 Not Found`: Associated user record is missing.

### GET `/api/tasks`
Returns tasks belonging to the authenticated user.

### GET `/api/tasks/:id`
Fetches a single task by identifier.

- **Responses**:
  - `200 OK`: Returns the task.
  - `400 Bad Request`: Missing `id` parameter.
  - `403 Forbidden`: Task belongs to another user.
  - `404 Not Found`: Task does not exist.

### GET `/api/tasks/user/:userId`
Administrative lookup for tasks by arbitrary user identifier.

- **Responses**:
  - `200 OK`: Returns matching tasks.
  - `400 Bad Request`: Missing `userId` parameter.

### PATCH `/api/tasks/:id`
Updates a task owned by the authenticated user.

- **Body**: Any subset of `{ title, description, completed }`.
- **Responses**:
  - `200 OK`: Returns the updated task.
  - `400 Bad Request`: Missing `id` parameter.
  - `403 Forbidden`: Task belongs to another user.
  - `404 Not Found`: Task does not exist.

### DELETE `/api/tasks/:id`
Deletes a task owned by the authenticated user.

- **Responses**:
  - `204 No Content`: Task removed.
  - `400 Bad Request`: Missing `id` parameter.
  - `403 Forbidden`: Task belongs to another user.
  - `404 Not Found`: Task does not exist.

## Health Check

### GET `/health`
Returns `{ status: "ok", timestamp: <ISO string> }` for monitoring.
