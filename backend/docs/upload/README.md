# Upload API Documentation

Base URL: `/api/upload`

This service handles file uploads using ImageKit.io. It supports both single and multiple file uploads.

All responses follow the standard envelope:

```json
// Success
{ "success": true, "data": { "statusCode": 200, "message": "...", "details": {} } }

// Error
{ "success": false, "error": { "statusCode": 400, "message": "...", "details": {} } }
```

---

## POST `/api/upload/single`

Upload a single image file.

**Authentication**
> 🔒 Requires valid `access_token` cookie (Currently commented out in routes for testing, but intended for production).

**Request Body (Multipart/form-data)**

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | ✅ | The image file to upload (Max 10MB) |
| `folder` | string | ❌ | Target folder in ImageKit (Default: `/uploads`) |

**Example (cURL)**
```bash
curl -X POST http://localhost:8000/api/upload/single \
  -F "file=@/path/to/your/image.jpg" \
  -F "folder=/user_profiles"
```

**Responses**

| Status | Description |
|---|---|
| `200` | File uploaded successfully |
| `400` | No file provided or invalid file type |
| `401` | Unauthorized (if authentication is enabled) |

**200 Response**
```json
{
  "success": true,
  "data": {
    "statusCode": 200,
    "message": "File uploaded successfully",
    "details": {
      "url": "https://ik.imagekit.io/your_id/uploads/image_name.jpg",
      "fileId": "642d...",
      "name": "image_name.jpg"
    }
  }
}
```

---

## POST `/api/upload/multiple`

Upload multiple image files (up to 4).

**Authentication**
> 🔒 Requires valid `access_token` cookie.

**Request Body (Multipart/form-data)**

| Field | Type | Required | Description |
|---|---|---|---|
| `files` | File[] | ✅ | Array of image files (Max 10MB each) |
| `folder` | string | ❌ | Target folder in ImageKit (Default: `/uploads`) |

**Responses**

| Status | Description |
|---|---|
| `200` | Files uploaded successfully |
| `400` | No files provided or too many files |

**200 Response**
```json
{
  "success": true,
  "data": {
    "statusCode": 200,
    "message": "Files uploaded successfully",
    "details": [
      {
        "url": "https://ik.imagekit.io/your_id/uploads/img1.jpg",
        "fileId": "...",
        "name": "img1.jpg"
      },
      {
        "url": "https://ik.imagekit.io/your_id/uploads/img2.jpg",
        "fileId": "...",
        "name": "img2.jpg"
      }
    ]
  }
}
```

---

## Allowed File Types
- `image/jpeg`
- `image/png`
- `image/webp`
- `image/gif`
- `image/svg+xml`

Maximum file size: **10MB** per file.
