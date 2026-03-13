# Auth API Documentation

Base URL: `/api/auth`

All responses follow the standard envelope:

```json
// Success
{ "success": true, "data": { "statusCode": 200, "message": "...", "details": {} } }

// Error
{ "success": false, "error": { "statusCode": 400, "message": "...", "details": {} } }
```

JWT is stored in an **httpOnly cookie** (`access_token`) — no manual token handling needed.

---

## POST `/api/auth/register`

Create a new user account.

**Request Body**

| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | ✅ | 1–50 characters |
| `email` | string | ✅ | Valid email format |
| `password` | string | ✅ | Min 8 chars, 1 uppercase, 1 number, 1 special char |
| `phone` | string | ❌ | Exactly 10 digits |

**Example**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Secret@123",
  "phone": "9876543210"
}
```

**Responses**

| Status | Description |
|---|---|
| `201` | Account created — sets `access_token` cookie |
| `400` | Validation error |
| `409` | Email or phone already in use |

**201 Response**
```json
{
  "success": true,
  "data": {
    "statusCode": 201,
    "message": "Account created successfully",
    "details": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "user",
      "is_verified": false,
      "is_active": true,
      "created_at": "2026-03-13T06:00:00.000Z",
      "updated_at": "2026-03-13T06:00:00.000Z"
    }
  }
}
```

---

## POST `/api/auth/login`

Login with email and password.

**Request Body**

| Field | Type | Required |
|---|---|---|
| `email` | string | ✅ |
| `password` | string | ✅ |

**Example**
```json
{
  "email": "john@example.com",
  "password": "Secret@123"
}
```

**Responses**

| Status | Description |
|---|---|
| `200` | Login successful — sets `access_token` cookie |
| `400` | Validation error |
| `401` | Invalid email or password |
| `403` | Account is deactivated |

---

## GET `/api/auth/me`

> 🔒 Requires valid `access_token` cookie

Returns the profile of the currently authenticated user.

**Responses**

| Status | Description |
|---|---|
| `200` | User profile returned |
| `401` | Missing or invalid token |
| `403` | Account is deactivated |

**200 Response**
```json
{
  "success": true,
  "data": {
    "statusCode": 200,
    "message": "User profile retrieved",
    "details": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "is_verified": false,
      "is_active": true,
      "created_at": "...",
      "updated_at": "..."
    }
  }
}
```

---

## POST `/api/auth/logout`

> 🔒 Requires valid `access_token` cookie

Clears the `access_token` cookie and ends the session.

**Responses**

| Status | Description |
|---|---|
| `200` | Logged out successfully |
| `401` | Missing or invalid token |

---

## Using the `authenticate` Middleware

To protect any other route, import and apply the middleware:

```typescript
import { authenticate } from "../middlewares/authenticate.middleware.ts";

router.get("/some-protected-route", authenticate, yourController);
```

The middleware attaches the full user object (without `password_hash`) to `req.user`.
