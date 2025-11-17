# API Documentation

**Version:** 1.0
**Base URL:** `https://api.img.pro`

## Quick Start

Welcome to the img.pro API! This playground provides an interactive way to explore and test all API endpoints. Here's how to get started:

### 1. Create Your Account

Visit [img.pro](https://img.pro) to create a free account. A new team will be created for you automatically - teams are how img.pro organizes media ownership and access.

### 2. Generate an API Token

Once logged in, visit your [API Keys page](https://img.pro/api-keys) to create a new API token. Copy the token immediately - it won't be shown again for security reasons.

### 3. Add Your Token to the Playground

Click the **🔒 Authentication** button in the top-right corner of this playground and paste your API token. It will be saved securely in your browser's local storage and automatically included in all requests.

### 4. Start Exploring

Select any endpoint from the sidebar or search icon to get started. Each endpoint provides:
- **Request tab** - Interactive form with parameter descriptions
- **Code tabs** (cURL, JavaScript, Python, PHP) - Copy-ready code that updates as you type
- **Run button** - Test the endpoint and see real responses instantly

---

## Using the Playground

### Interactive Testing

The playground sidebar organizes endpoints by function (Create, Read, Update, Delete):

1. **Select an endpoint** - Click any endpoint in the sidebar
2. **Fill in parameters** - Use the Request tab to enter values
3. **See live code** - Switch to language tabs to see generated code
4. **Run the request** - Click "Run" to test and see the response
5. **Debug issues** - Expand "Request Details" in responses to see exactly what was sent

All code examples update in real-time as you change parameters - no manual construction needed!

### Workflow Examples

**Quick Testing:**
1. Select "Upload Image" from the Create section
2. Click Browse to select an image file
3. Optionally add description, tags, or TTL
4. Click "Run" to upload and see the response

**Code Integration:**
1. Configure your request in the Request tab
2. Switch to your preferred language tab
3. Click "Copy" to grab ready-to-use code
4. Paste into your application

---

## Authentication

All API requests (except public media access) require authentication using Bearer tokens.

### How It Works

Include your token in the `Authorization` header of every request:

```http
Authorization: Bearer {your-token}
```

The playground handles this automatically - just add your token once using the 🔒 button.

### Token Formats

The API accepts two formats:
- **Plain format:** (default) `{plainTextToken}` (e.g., `abc123def456`)
- **Sanctum format:** `{id}|{plainTextToken}` (e.g., `3|abc123def456`)

### Token Security

Your token grants access to your team's media:
- **In the playground** - Token is hidden by default in the Request tab (click 👁️ to reveal)
- **In code examples** - Token is visible so you can copy working code
- **Storage** - Token is stored only in your browser's local storage, never sent to our servers

### Optional Authentication

The `GET /v1/media/{id}` endpoint works with or without authentication:
- **Without auth** - Returns only media marked as public
- **With auth** - Returns both public and private media owned by your team

---

## Glossary

Understanding these concepts will help you use the API effectively:

### Core Concepts

**Media**
A media item represents an uploaded or imported image. Each media item has a unique ID, belongs to a team, and contains metadata like dimensions, file size, tags, and visibility settings.

**Team**
A team is the primary organizational unit in img.pro. All media belongs to a team, and API tokens are scoped to a team. You can only access media owned by your team (unless it's public).

**API Token**
An authentication credential that identifies your team and grants access to the API. Tokens are created in your dashboard and use the Bearer authentication scheme.

**ID (Unique Identifier)**
Every media item gets a unique ID string (UID) used to reference it in API requests and URLs. Example: `abc123xyz`

### Media Properties

**Public vs Private**
Controls who can access your media:
- **Public (`public: 1`)** - Anyone with the UID can view the image, no authentication required
- **Private (`public: 0`)** - Only your team can access, requires authentication

**Status**
Indicates the processing state of your media:
- **`processing`** - Upload received, image being processed
- **`failed`** - Processing failed, check error details
- **`ready`** - Image processed and available (not returned).

**Source**
How the media was added:
- **`upload`** - Uploaded via `/v1/upload` endpoint
- **`url`** - Imported from a URL via `/v1/import` endpoint

**Tags**
Searchable keywords attached to media items. Tags are automatically lowercased, limited to 10 per item, and each tag can be up to 50 characters. Use tags to organize and filter your media.

### Advanced Features

**Ephemeral Media (TTL)**
Temporary images that automatically delete after a specified period. Perfect for temporary uploads, verification images, or time-limited content.

**TTL (Time To Live)**
The lifespan of ephemeral media, specified as a duration:
- Format: `{number}{unit}` - e.g., `5m`, `2h`, `7d`, `30d`
- Units: `m` (minutes), `h` (hours), `d` (days)
- Range: Minimum 5 minutes, maximum 90 days
- Default: No expiration (permanent media)

**Image Variants**
Automatically generated responsive versions of your images at different sizes. Variants are created on-demand when first accessed and cached for future requests.

**Cursor-Based Pagination**
An efficient pagination method that uses an opaque cursor token instead of page numbers. More reliable for real-time data than offset-based pagination.

**Batch Operations**
Update or delete up to 100 media items in a single API request. Batch operations are atomic per item - if one fails, others still succeed.

### Technical Terms

**Bearer Token**
An authentication method where the token itself grants access (like carrying a key). Include it in the `Authorization: Bearer {token}` header.

**MIME Type**
The media type identifier (e.g., `image/jpeg`, `image/png`). Used to determine how files are processed and served.

**Rate Limit**
The maximum number of API requests allowed per minute (1000 for img.pro). Prevents abuse and ensures fair resource usage.

**Storage Quota**
The total amount of storage available to your team based on your plan. Tracked separately from rate limits.

**Tag Mode**
Controls how tags are applied in update operations:
- **`replace`** (default) - Replace all existing tags with new ones
- **`add`** - Add new tags to existing tags
- **`remove`** - Remove specified tags from existing tags

**Dimensions**
The width and height of an image in pixels. Automatically detected during upload/import.

**File Hash**
A unique fingerprint of the file content, used for deduplication and integrity verification.

---

## Available Endpoints

The API is organized into four sections based on CRUD operations:

### Create
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/upload` | Upload an image file from your computer |
| POST | `/v1/import` | Import an image from a public URL |

### Read
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/media` | List your team's media with pagination and filtering |
| GET | `/v1/media/{id}` | Get details about a specific media item |

### Update
| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `/v1/media?ids=` | Update multiple media items at once (max 100) |
| PATCH | `/v1/media/{id}` | Update a single media item's metadata |

### Delete
| Method | Endpoint | Description |
|--------|----------|-------------|
| DELETE | `/v1/media?ids=` | Delete multiple media items at once (max 100) |
| DELETE | `/v1/media/{id}` | Delete a single media item permanently |

**→ Click any endpoint in the sidebar to explore it with interactive forms and live code examples!**

---

## Rate Limits & Quotas

**Rate Limits:**
- 1000 requests per minute per team
- Includes burst allowance for occasional spikes
- Applies to all authenticated requests

**Storage Quotas:**
- Based on your team's plan (Free, Launch, Growth, Business)
- Check current usage at [img.pro/billing](https://img.pro/billing)
- Quota resets monthly

**File Size Limits:**
- Maximum upload: 100 MB per file
- Maximum for SVG: 10 MB (tighter limit for security)
- Automatic optimization applied to reduce file sizes

---

## Supported File Formats

The API accepts and processes various image formats:

**Passthrough Formats** (stored as-is):
- JPEG/JPG
- PNG
- GIF
- WebP

**Converted Formats** (automatically converted to WebP):
- HEIC/HEIF (Apple photos)
- AVIF

**Special Handling:**
- SVG - Sanitized for security, stored as SVG
- Animated GIF - Preserved with animation
- Images with transparency - Preserved in WebP or PNG

File type detection uses content analysis (magic bytes), not just file extension.

---

## Response Format

All API responses use JSON with a consistent structure:

**Success Response:**
```json
{
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

Test any endpoint in the playground to see real response structures!

---

## Image Variants

Uploaded images automatically generate responsive variants optimized for different screen sizes:

| Variant | Max Dimension | Typical Use Case |
|---------|---------------|------------------|
| `s` | 640px | Thumbnails, small previews |
| `m` | 1024px | Mobile device displays |
| `l` | 1920px | Desktop displays (default) |
| `xl` | 2560px | Large desktop screens |
| `xxl` | 3840px | 4K displays, high-DPI |

**Access Variants:**

Variants are created on-demand when first requested and cached:

```
https://src.img.pro/{path}          → Original file
https://src.img.pro/{path}?size=s   → Small variant
https://src.img.pro/{path}?size=m   → Medium variant
https://src.img.pro/{path}?size=l   → Large variant
```

Upload an image using the `/v1/upload` endpoint and use the size parameter to request variants!

---

## Pagination

The API uses cursor-based pagination for efficient, reliable data access:

**How It Works:**
1. Make initial request: `GET /v1/media?limit=50`
2. Response includes `next_cursor` if more results exist
3. Fetch next page: `GET /v1/media?limit=50&cursor={next_cursor}`
4. Repeat until `has_more` is false

**Parameters:**
- `limit` - Items per page (1-100, default 50)
- `cursor` - Opaque pagination token from previous response

**Why Cursors?**

Cursor pagination is more reliable than offset pagination when data changes frequently. The cursor represents a specific point in your data, so you won't miss or see duplicate items even if media is added/deleted during pagination.

---

## Batch Operations

Efficiently update or delete multiple media items in a single request:

**Batch Update:** `PATCH /v1/media?ids=id1,id2,id3`

Update metadata for multiple items at once:
- Maximum 100 items per request
- All items receive the same updates
- Tag modes control tag application:
  - `replace` - Replace all tags
  - `add` - Add to existing tags
  - `remove` - Remove specified tags

**Batch Delete:** `DELETE /v1/media?ids=id1,id2,id3`

Permanently delete multiple items:
- Maximum 100 items per request
- Deletions are permanent and immediate
- Returns count of successfully deleted items

Try batch endpoints in the playground to see the generated code!

---

## Error Codes

Common errors you might encounter and how to resolve them:

| Code | HTTP Status | Description | How to Fix |
|------|-------------|-------------|------------|
| `unauthorized` | 401 | Missing or invalid API token | Add valid token via 🔒 button |
| `forbidden` | 403 | Token lacks required permissions | Check token abilities in dashboard |
| `not_found` | 404 | Resource doesn't exist or is deleted | Verify the media ID exists |
| `validation_error` | 422 | Invalid input parameters | Check parameter format and requirements |
| `quota_exceeded` | 429 | Monthly storage quota exceeded | Upgrade plan or delete unused media |
| `rate_limit_exceeded` | 429 | Too many requests per minute | Wait and retry, implement exponential backoff |
| `server_error` | 500 | Internal server error | Retry after brief delay, contact support if persists |

**Debugging Tip:** Expand "Request Details" in the response panel to see exactly what was sent to the API.

---

## Best Practices

### Security

**Never Expose Tokens**
- Keep tokens out of client-side code (JavaScript in browsers)
- Use environment variables in server-side applications
- Never commit tokens to version control

**Token Rotation**
- Rotate tokens regularly from your [API Keys page](https://img.pro/api-keys)
- Revoke compromised tokens immediately
- Use descriptive names to track token usage

**Access Control**
- Leave `public: 0` for API-first media
- Set appropriate TTL for temporary content
- Audit token access regularly

### Performance

**Use Cursor Pagination**
- More efficient than offset pagination for large datasets
- Prevents missed or duplicate items
- Better database performance

**Leverage Batch Operations**
- Update/delete up to 100 items per request
- Reduces API calls and improves performance
- Atomic operations per item

**Cache Public Media URLs**
- Public media URLs don't change
- Reduce API calls by caching responses
- Use CDN for media delivery

**Request Only What You Need**
- Filter results with `ids` or `tags` parameters
- Use appropriate `limit` values
- Avoid fetching unnecessary data

### Media Management

**Use Descriptive Tags**
- Makes media searchable and filterable
- Lowercase, max 50 chars each, max 10 per item
- Group related media with common tags

**Set Appropriate Visibility**
- Use `public: 1` only when necessary
- Private by default for security
- Consider team access requirements

**Leverage TTL for Temporary Content**
- Saves storage quota automatically
- Perfect for verification images, previews
- Range: 5 minutes to 90 days

**Clean Up Unused Media**
- Use batch delete for efficient cleanup
- Monitor storage quota usage
- Remove test uploads regularly

---

## Support & Resources

**Need Help?**
- **API Status:** [status.img.pro](https://status.img.pro) - Check service health
- **Email Support:** [inbox@img.pro](mailto:inbox@img.pro) - Get help from our team
- **Playground Issues:** [github.com/img-pro/play](https://github.com/img-pro/play) - Report bugs or request features

**Dashboard Links:**
- **API Keys:** [img.pro/api-keys](https://img.pro/api-keys) - Manage tokens
- **Usage:** [img.pro/billing](https://img.pro/billing) - Monitor quota
- **Account:** [img.pro](https://img.pro) - Manage your team

---

## Environments

**Production (Default):**
- Base URL: `https://api.img.pro`
- Use this for all production applications
- High availability and global CDN

**Custom Environment:**
- Click the **Custom** button to set a custom API URL
- Useful for testing against staging environments
- Automatically updates all code examples

The playground automatically includes the correct base URL in all generated code examples!

---

**Ready to start?** Select any endpoint from the sidebar to explore the API with interactive forms and live code examples. All the code you need is generated automatically as you fill in the forms!
