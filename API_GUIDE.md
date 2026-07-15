# API Documentation

## Base URL

When deployed on Vercel, your API is at:
```
https://your-site.vercel.app/api
```

## Endpoints

### 1. List All Products
```
GET /api/products
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Driving Course",
    "author": "Future Bright",
    "description": "5-day intensive driving course",
    "price": "15000.00",
    "category": "course",
    "cover_image": null,
    "file_path": null,
    "status": "active",
    "created_at": "2024-06-14T10:30:00.000Z"
  }
]
```

---

### 2. Get Single Product
```
GET /api/products/1
```

**Response:**
```json
{
  "id": 1,
  "title": "Driving Course",
  "author": "Future Bright",
  "description": "5-day intensive driving course",
  "price": "15000.00",
  "category": "course",
  "cover_image": null,
  "file_path": null,
  "status": "active",
  "created_at": "2024-06-14T10:30:00.000Z"
}
```

---

### 3. Create Product (Admin Only)
```
POST /api/products
Content-Type: application/json
Authorization: Bearer admin-token-12345

{
  "title": "Driving Course",
  "author": "Future Bright",
  "description": "5-day intensive driving course",
  "price": 15000,
  "category": "course"
}
```

**Categories:** `service`, `course`, `book`, `publication`, `digital`, `physical`, `consultancy`, `training`, `other`

**Response:**
```json
{
  "id": 1,
  "title": "Driving Course",
  "price": "15000.00",
  "category": "course",
  "status": "active",
  "created_at": "2024-06-14T10:30:00.000Z"
}
```

---

### 4. Delete Product (Admin Only)
```
DELETE /api/products/1
Authorization: Bearer admin-token-12345
```

**Response:**
```json
{
  "success": true
}
```

---

### 5. Admin Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "admin-token-12345",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

---

## Testing with Browser

### View all products:
Simply visit:
```
https://your-site.vercel.app/api/products
```

### Test login:
Use the browser console (F12 → Console):
```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
})
.then(r => r.json())
.then(data => console.log(data))
```

---

## Testing with curl

```bash
# Get products
curl https://your-site.vercel.app/api/products

# Login
curl -X POST https://your-site.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Add product (replace TOKEN with actual token from login)
curl -X POST https://your-site.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-token-12345" \
  -d '{"title":"Driving Course","price":15000,"category":"course","description":"5-day intensive course"}'
```

---

## Frontend Integration

Your frontend pages already use these APIs:
- `/products` → calls `GET /api/products`
- `/admin` → calls `POST /api/auth/login` and `POST /api/products`
- `/products/[id]` → calls `GET /api/products/[id]`

## Important Notes

1. **Database sleeps**: Render free tier sleeps after 15 min. First request may take 10-30s.
2. **Token**: Currently hardcoded as `admin-token-12345`. In production, implement proper JWT.
3. **Images**: File uploads not yet implemented. Use external URLs for `cover_image` field.
