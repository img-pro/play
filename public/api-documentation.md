# Img.pro API Documentation

**Version:** 1.0
**Base URL:** `https://api.img.pro`

## Quick Start

Welcome to the Img.pro API! This playground provides an interactive way to explore and test all API endpoints. Here's how to get started in 3 steps:

### 1. Get Your API Token

Visit your [API Keys page](https://img.pro/api-keys) to create a new API token. Copy the token immediately - it won't be shown again.

### 2. Add Your Token

Click the **🔑 Authentication** button in the top-right corner and paste your API token. It will be saved locally in your browser.

### 3. Start Exploring

Switch to the **Endpoints** tab to see all available endpoints. Each endpoint shows:
- **Request tab** - Interactive form to fill in parameters
- **cURL, JavaScript, Python, PHP tabs** - Live code examples that update as you type
- **Execute button** - Test the endpoint and see real responses

---

## Using the Playground

### Interactive Endpoints

The **Endpoints** tab is your main workspace. Select any endpoint from the sidebar to:

1. **Fill in parameters** - Use the Request tab to input values
2. **See live code** - Switch to language tabs to see generated code
3. **Copy & paste** - Click the copy button on any code example
4. **Execute requests** - Test endpoints and inspect responses
5. **View request details** - Debug by expanding "Request Details" in responses

All code examples update in real-time as you change parameters. No need to manually construct requests!

### Testing Workflow

**For Quick Tests:**
1. Select an endpoint (e.g., "GET /v1/media")
2. Add your token (automatically included in code examples)
3. Fill in any required parameters
4. Click "Execute Request"

**For Code Integration:**
1. Set up your parameters in the Request tab
2. Switch to your preferred language tab (cURL, JavaScript, Python, or PHP)
3. Click "Copy" to grab the ready-to-use code
4. Paste into your application

---

## Authentication

All API requests (except public media access) require authentication using Bearer tokens.

### Token Format

Include your token in the `Authorization` header:

```http
Authorization: Bearer {your-token}
```

The API accepts two token formats:
- **Sanctum format:** `{id}|{plainTextToken}` (e.g., `3|abc123def456`)
- **Plain format:** `{plainTextToken}` (e.g., `abc123def456`)

### Token Privacy

Your token is sensitive! In the playground:
- **Request tab** - Token is hidden by default (click 👁️ to show/hide)
- **Code examples** - Token is visible so you can copy working code
- **Storage** - Token is stored only in your browser's localStorage

### Optional Authentication

The `GET /v1/media/{uid}` endpoint supports optional authentication:
- **Without auth:** Returns only public media
- **With auth:** Returns both public and private media owned by your team

---

## Key Concepts

### Media Ownership

- Each media item belongs to a **team**
- You can only access media owned by your team (unless it's public)
- System admins (Team ID 1) can access all media

### Public vs Private Media

Control who can access your media:
- **Public (`public: 1`)** - Anyone with the UID can access
- **Private (`public: 0`)** - Only your team can access (requires auth)

Set this when uploading/importing, or update it later with PATCH.

### Ephemeral Images (TTL)

Upload temporary images that auto-delete after a period:

**TTL Format:** `{number}{unit}`
- Units: `m` (minutes), `h` (hours), `d` (days)
- Examples: `5m`, `2h`, `7d`, `30d`
- Constraints: Min 5 minutes, Max 90 days
- Default: No expiration (permanent)

Try the `/v1/upload` endpoint with a `ttl` parameter to see it in action!

### Pagination

The API uses **cursor-based pagination** for efficient listing:

- **`limit`** - Items per page (max 100, default 50)
- **`cursor`** - Pagination cursor from previous response

**Example workflow:**
1. Request: `GET /v1/media?limit=50`
2. Response includes: `next_cursor: "1704067200_123"`
3. Next page: `GET /v1/media?limit=50&cursor=1704067200_123`

Cursors are more efficient than offset pagination for large datasets.

### Batch Operations

Update or delete up to 100 media items in a single request:

**Batch Update** - `PATCH /v1/media?ids=uid1,uid2,uid3`
- Add tags: `tag_mode: "add"`
- Remove tags: `tag_mode: "remove"`
- Replace tags: `tag_mode: "replace"`

**Batch Delete** - `DELETE /v1/media?ids=uid1,uid2,uid3`

Try the batch endpoints in the playground to see the code examples!

---

## Available Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Service information |
| POST | `/v1/upload` | Yes | Upload an image file |
| POST | `/v1/import` | Yes | Import image from URL |
| GET | `/v1/media` | Yes | List your media with pagination |
| GET | `/v1/media/{uid}` | Optional | Get single media item |
| PATCH | `/v1/media/{uid}` | Yes | Update single media item |
| DELETE | `/v1/media/{uid}` | Yes | Delete single media item |
| PATCH | `/v1/media?ids=` | Yes | Batch update multiple items |
| DELETE | `/v1/media?ids=` | Yes | Batch delete multiple items |

**→ Go to the Endpoints tab to explore each endpoint with interactive forms and live code examples!**

---

## Rate Limits & Quotas

**Rate Limits:**
- 1000 requests per minute per team
- Includes a burst allowance for occasional spikes

**Storage Quotas:**
- Based on your team's plan
- Check your current usage at [img.pro/dashboard](https://img.pro/dashboard)

**File Size Limits:**
- Maximum upload size: 100 MB per file
- Automatic optimization for smaller files

---

## Response Format

All API responses use JSON format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "error": "error_code",
  "message": "Human readable error message"
}
```

**Pagination Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "next_cursor": "1704067200_123",
    "has_more": true
  }
}
```

Test any endpoint to see real response structures!

---

## Image Variants

Uploaded images automatically generate responsive variants:

| Size | Max Dimension | Use Case |
|------|---------------|----------|
| `s` | 640px | Thumbnails |
| `m` | 1024px | Mobile displays |
| `l` | 1920px | Desktop displays |
| `xl` | 2560px | Large screens |
| `xxl` | 3840px | 4K displays |
| `original` | No limit | Original file |

**Access variants via URL:**
```
https://img.pro/{uid}/s
https://img.pro/{uid}/m
https://img.pro/{uid}/original
```

Upload an image using the `/v1/upload` endpoint to see the variants in the response!

---

## Error Codes

Common error codes you might encounter:

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `unauthorized` | 401 | Missing or invalid API token |
| `forbidden` | 403 | Token lacks required permissions |
| `not_found` | 404 | Resource doesn't exist |
| `validation_error` | 422 | Invalid input parameters |
| `quota_exceeded` | 429 | Monthly storage quota exceeded |
| `rate_limit_exceeded` | 429 | Too many requests |
| `server_error` | 500 | Internal server error |

**Debugging tip:** Enable "Request Details" in the response panel to inspect exactly what was sent.

---

## Best Practices

### Security
- **Never expose tokens** in client-side code
- Use **environment variables** for tokens in production
- Rotate tokens regularly from your [API Keys page](https://img.pro/api-keys)

### Performance
- Use **cursor pagination** instead of offset for large lists
- Request only the **fields you need**
- Use **batch operations** when updating/deleting multiple items
- Cache public media URLs (they don't change)

### Media Management
- Add **descriptive tags** to make media searchable
- Use **TTL for temporary images** to save storage quota
- Set **appropriate public/private** flags for security
- Use **batch delete** to clean up multiple items efficiently

---

## Support & Resources

- **API Status:** [status.img.pro](https://status.img.pro)
- **Changelog:** [img.pro/changelog](https://img.pro/changelog)
- **Support:** [support@img.pro](mailto:support@img.pro)
- **GitHub Issues:** [github.com/img-pro/api](https://github.com/img-pro/api)

---

## Environments

**Production (Default):**
- Base URL: `https://api.img.pro`
- Use this for all production applications

**Development:**
- Click the **Environment** button to set a custom API URL
- Useful for testing against staging environments

The playground automatically includes the correct base URL in all code examples!

---

**Ready to start?** Head to the **Endpoints** tab to explore the API with interactive examples. All the code you need is generated automatically as you fill in the forms!
