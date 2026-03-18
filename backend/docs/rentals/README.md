# Rental Items API Documentation

Base URL: `/api/rentals`

All responses follow the standard envelope:

```json
// Success
{ "success": true, "data": { "statusCode": 200, "message": "...", "details": {} } }

// Error
{ "success": false, "error": { "statusCode": 400, "message": "...", "details": {} } }
```

---

## GET `/api/rentals`

Public listing. Filters by category and returns only `available` items.

**Query Params**

| Param | Type | Required |
|---|---|---|
| `category` | string | ❌ |

**Example**
```
/api/rentals?category=bikes
```

**Responses**

| Status | Description |
|---|---|
| `200` | List returned |

---

## GET `/api/rentals/me`

> 🔒 Requires valid `access_token` cookie

List of rental items created by the current user.

**Responses**

| Status | Description |
|---|---|
| `200` | List returned |
| `401` | Missing or invalid token |

---

## POST `/api/rentals`

> 🔒 Requires valid `access_token` cookie

Create a rental item.

**Request Body**

| Field | Type | Required | Rules |
|---|---|---|---|
| `description` | string | ✅ | Required |
| `price_per_day` | number | ✅ | Minimum 1 |
| `images` | string[] | ✅ | Must be valid URLs |
| `category` | string | ✅ | 1–50 chars |
| `status` | string | ❌ | `available` \| `unavailable` \| `paused` |
| `location_city` | string | ❌ | 1–80 chars |
| `location_state` | string | ❌ | 1–80 chars |
| `location_country` | string | ❌ | 1–80 chars |

**Example**
```json
{
  "description": "Trek FX 3, great condition.",
  "price_per_day": 25,
  "images": [
    "https://cdn.example.com/bike-1.jpg",
    "https://cdn.example.com/bike-2.jpg"
  ],
  "category": "bikes",
  "status": "available",
  "location_city": "Austin",
  "location_state": "TX",
  "location_country": "USA"
}
```

**Responses**

| Status | Description |
|---|---|
| `201` | Created |
| `400` | Validation error |
| `401` | Missing or invalid token |

---

## PUT `/api/rentals/:id`

> 🔒 Requires valid `access_token` cookie

Update a rental item. Provide at least one field.

**Request Body**

Same fields as create, all optional.

**Responses**

| Status | Description |
|---|---|
| `200` | Updated |
| `400` | Validation error |
| `401` | Missing or invalid token |
| `403` | Not owner |
| `404` | Not found |

---

## DELETE `/api/rentals/:id`

> 🔒 Requires valid `access_token` cookie

Delete a rental item.

**Responses**

| Status | Description |
|---|---|
| `200` | Deleted |
| `401` | Missing or invalid token |
| `403` | Not owner |
| `404` | Not found |

