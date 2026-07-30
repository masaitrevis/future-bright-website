# API Documentation

All examples use placeholders (`<...>`) — substitute your real values locally.
Never commit real credentials, tokens, or connection strings.

## Base URL

```
<APP_BASE_URL>/api
```

`APP_BASE_URL` is the canonical public origin configured via environment
variable (e.g. `https://future-bright-website.onrender.com`). The server never
derives absolute URLs from the Host header.

## Authentication

Admin authentication is fully environment-based (no credentials in code):

- `ADMIN_USERNAME` — admin login username
- `ADMIN_PASSWORD_HASH` — scrypt hash `saltHex:hashHex` (preferred)
- `ADMIN_PASSWORD` — plaintext fallback (timing-safe compare, logs a warning)
- `ADMIN_TOKEN_SECRET` — HMAC secret used to sign admin tokens

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "<admin username>",
  "password": "<admin password>"
}
```

**Success response (200):**
```json
{
  "token": "<base64url-payload>.<base64url-hmac-sha256-signature>",
  "expiresAt": "2024-06-14T18:30:00.000Z"
}
```

Tokens are HMAC-SHA256 signed and expire after 8 hours. Errors are generic
(`401 {"error":"Invalid credentials"}`; `429` after 5 failed attempts per IP
within 5 minutes). Send the token on all admin write requests:

```
Authorization: Bearer <token>
```

---

## Products

### List Products (public)
```
GET /api/products
```
Returns an array of active products.

### Get Product (public)
```
GET /api/products/<id>
```
Returns a single active product, or `404 {"error":"Product not found"}`.

### Create Product (admin only)
```
POST /api/products
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Driving Course",
  "author": "Future Bright",
  "description": "5-day intensive driving course",
  "price": 15000,
  "category": "course",
  "cover_image": null,
  "file_path": null
}
```
Categories: `service`, `course`, `book`, `publication`, `digital`, `physical`,
`consultancy`, `training`, `other`.

**Responses:** `201` created product · `401 {"error":"Unauthorized"}` ·
`400 {"error":"Title and price are required"}`

### Update Product (admin only)
```
PUT /api/products/<id>
Content-Type: application/json
Authorization: Bearer <token>

{ "title": "...", "author": "...", "description": "...", "price": 15000, "category": "course", "cover_image": null, "file_path": null }
```
**Responses:** `200` updated product · `401 {"error":"Unauthorized"}` · `404 {"error":"Product not found"}`

### Delete Product (admin only, soft delete)
```
DELETE /api/products/<id>
Authorization: Bearer <token>
```
**Response:**
```json
{ "success": true }
```
(Sets `status = 'inactive'`; the row is kept.)

---

## Payments (NCBA)

Payments are handled by NCBA Bank's C2B API. The client never sends an amount —
the server looks up `products.price`.

### Initiate STK Push
```
POST /api/payments/stkpush
Content-Type: application/json

{
  "phoneNumber": "0712345678",
  "productId": 1
}
```

Accepted phone formats: `07…`, `01…`, `+254…`, `254…` — normalized to
`254XXXXXXXXX` (validated against `^254[17]\d{8}$`).

**Success response:**
```json
{
  "success": true,
  "orderId": 42,
  "pollToken": "<opaque-poll-token>",
  "message": "STK push sent. Check your phone."
}
```

Errors are always generic (`{"error":"..."}`). Rate limited (5 requests/min/IP,
max 3 pending orders per phone).

### Poll Payment Status
```
GET /api/payments/status/<orderId>?token=<pollToken>
```
Returns `404 {"error":"Not found"}` unless the order id and poll token match.

**Response:**
```json
{
  "status": "pending | paid | failed",
  "receipt": "<ncba-transaction-id>",
  "downloadToken": "<download-token>",
  "downloadUrl": "<APP_BASE_URL>/api/download/<download-token>",
  "productTitle": "Driving Course",
  "category": "course",
  "hasFile": true
}
```

### NCBA Webhook (called by NCBA, not by browsers)
```
POST /api/payments/notify
Content-Type: application/json

{ "TransType": "...", "TransID": "...", "TransTime": "...", "TransAmount": "...", "BusinessShortCode": "...", "BillRefNumber": "...", "Mobile": "...", "name": "...", "Hash": "..." }
```

Authenticates via `NCBA_NOTIFY_USERNAME` / `NCBA_NOTIFY_PASSWORD` /
`NCBA_NOTIFY_SECRET` (constant-time compares; hash verified per NCBA guide).
Always responds in NCBA format:

```json
{ "ResultCode": "0", "ResultDesc": "Success" }
```

- Auth failure → HTTP 401 + `ResultCode: "1"`
- Non-JSON body → HTTP 415 + `ResultCode: "1"`
- Success (including duplicate `TransID` — idempotent) → HTTP 200 + `ResultCode: "0"`

---

## Download

```
GET /api/download/<downloadToken>
```
Serves the purchased file for a paid order. Errors are generic
(`404 {"error":"Not found"}` / `410` for expired/invalid tokens).

---

## Error Conventions

- Client-facing errors are always generic: `{"error":"..."}`. Internal details
  (DB errors, stack traces) are logged server-side only.
- Missing required environment variables fail at use time with a clear server
  log and a generic client error — there are no credential fallbacks in code.

## Testing with curl

```bash
BASE=<APP_BASE_URL>

# List products (public)
curl $BASE/api/products

# Admin login
curl -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"<admin username>","password":"<admin password>"}'

# Create product (use token from login)
curl -X POST $BASE/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Driving Course","price":15000,"category":"course"}'

# Initiate payment
curl -X POST $BASE/api/payments/stkpush \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"0712345678","productId":1}'

# Poll status
curl "$BASE/api/payments/status/<orderId>?token=<pollToken>"
```

## Important Notes

1. **Database sleeps**: Render free tier sleeps after 15 min. First request may take 10-30s.
2. **Tokens**: Admin tokens expire after 8h; re-login to get a fresh one.
3. **Security headers**: All responses include CSP, HSTS, X-Frame-Options, etc. (see `next.config.js`).
