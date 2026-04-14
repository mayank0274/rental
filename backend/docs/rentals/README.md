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

Public listing. Filters by category and returns only `available` items. Supports
optional pagination.

**Query Params**

| Param | Type | Required |
|---|---|---|
| `category` | string | ❌ |
| `title` | string | ❌ |
| `city` | string | ❌ |
| `page` | number | ❌ |
| `limit` | number | ❌ |

Notes:
`category` may be omitted or set to `all`/empty to return all categories.
`title` performs a partial, case-insensitive search on the item title.
`city` performs a partial, case-insensitive search on the location city.
`limit` must be between 1 and 100 when provided.
Pagination is applied only when `page` or `limit` is provided.
Allowed categories: `bikes`, `cars`, `tools`, `cameras`, `electronics`,
`furniture`, `sports`, `outdoor`, `party`, `baby`, `music`, `costumes`,
`books`, `other`.

**Example**
```
/api/rentals?category=bikes
```

**Example (paginated)**
```
/api/rentals?page=2&limit=20
```

**Responses**

| Status | Description |
|---|---|
| `200` | List returned |

**Response Details**

```json
{
  "items": [
    {
      "id": "...",
      "user_id": "...",
      "title": "Trek FX 3 Hybrid Bike",
      "description": "...",
      "slug": "trek-fx-3",
      "price_per_day": 25,
      "images": ["https://cdn.example.com/bike-1.jpg"],
      "category": "bikes",
      "status": "available",
      "location_city": "Austin",
      "location_state": "TX",
      "location_country": "USA",
      "created_at": "2026-03-25T10:00:00.000Z",
      "updated_at": "2026-03-25T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 123,
    "totalPages": 7,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

## GET `/api/rentals/:slug`

Get a single rental item by its slug. Includes publisher contact details.

**Responses**

| Status | Description |
|---|---|
| `200` | Item returned |
| `404` | Item not found |

**Response Details**

```json
{
  "success": true,
  "data": {
    "statusCode": 200,
    "message": "Rental item details retrieved",
    "details": {
      "id": "...",
      "user_id": "...",
      "title": "Trek FX 3 Hybrid Bike",
      "description": "...",
      "slug": "trek-fx-3",
      "price_per_day": 25,
      "images": ["https://cdn.example.com/bike-1.jpg"],
      "category": "bikes",
      "status": "available",
      "location_city": "Austin",
      "location_state": "TX",
      "location_country": "USA",
      "created_at": "2026-03-25T10:00:00.000Z",
      "updated_at": "2026-03-25T10:00:00.000Z",
      "publisher": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890"
      }
    }
  }
}
```

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
| `title` | string | ✅ | Max 120 chars |
| `description` | string | ✅ | Required |
| `slug` | string | ✅ | Unique; lowercase letters, numbers, hyphens |
| `price_per_day` | number | ✅ | Minimum 1 |
| `images` | string[] | ✅ | Must be valid URLs |
| `category` | string | ✅ | One of: `bikes`, `cars`, `tools`, `cameras`, `electronics`, `furniture`, `sports`, `outdoor`, `party`, `baby`, `music`, `costumes`, `books`, `other` |
| `status` | string | ❌ | `available` \| `unavailable` \| `paused` |
| `location_city` | string | ❌ | 1–80 chars |
| `location_state` | string | ❌ | 1–80 chars |
| `location_country` | string | ❌ | 1–80 chars |

**Example**
```json
{
  "title": "Trek FX 3 Hybrid Bike",
  "description": "Trek FX 3, great condition.",
  "slug": "trek-fx-3",
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
