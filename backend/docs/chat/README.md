# Chat API Documentation

Base URL: `/api/chat`

Conversations are uniquely identified by the combination of `publisher_id`, `item_id`, and `inquirer_id`.

---

## REST Endpoints

### GET `/api/chat/conversations`
> 🔒 Requires valid `access_token` cookie

Returns a list of all conversations the current user is involved in (as either a publisher or an inquirer).

**Success Response (Status 200)**
```json
{
  "success": true,
  "data": {
    "statusCode": 200,
    "message": "Conversations retrieved",
    "details": [
      {
        "publisher_id": "...",
        "item_id": "...",
        "inquirer_id": "...",
        "item_title": "Trek FX 3 Hybrid Bike",
        "other_user_name": "Jane Doe",
        "other_user_email": "jane@example.com",
        "last_message": {
          "sender_id": "...",
          "content": "Is it still available?",
          "sent_at": "2026-03-25T12:00:00Z"
        },
        "updated_at": "..."
      }
    ]
  }
}
```

### GET `/api/chat/conversations/:item_id/:other_user_id`
> 🔒 Requires valid `access_token` cookie

Returns the full message history for a specific conversation.

**Success Response (Status 200)**
```json
{
  "success": true,
  "data": {
    "statusCode": 200,
    "message": "Message history retrieved",
    "details": {
      "publisher_id": "...",
      "item_id": "...",
      "inquirer_id": "...",
      "messages": [
        {
          "sender_id": "...",
          "content": "Hi, I'm interested in the bike.",
          "sent_at": "2026-03-25T11:00:00Z"
        },
        {
          "sender_id": "...",
          "content": "Great! When would you like to see it?",
          "sent_at": "2026-03-25T11:05:00Z"
        }
      ]
    }
  }
}
```

---

## Real-time Communication (Socket.io)

### Connection
- **URL**: Server Root (e.g., `http://localhost:8000`)
- **Authentication**: Handled automatically via the `access_token` cookie. Ensure `withCredentials: true` is set in your socket client.

### Client-to-Server Events

#### `send_message`
Sends a message to another user regarding an item.

**Payload**
```json
{
  "item_id": "uuid",
  "receiver_id": "uuid",
  "content": "String (1-1000 characters)"
}
```

**Callback Response**
```json
{
  "success": true,
  "data": {
    "sender_id": "...",
    "content": "...",
    "sent_at": "ISO-Timestamp"
  }
}
```

### Server-to-Client Events

#### `new_message`
Fired when the current user receives a new message.

**Payload**
```json
{
  "item_id": "uuid",
  "sender_id": "uuid",
  "message": {
    "sender_id": "...",
    "content": "...",
    "sent_at": "ISO-Timestamp"
  }
}
```

---

## Offline Notifications
If a user is not currently connected to the WebSocket server when they receive a message, the system will automatically send an email notification to their registered email address with a preview of the message.
