# Database Setup Guide

## What Was Added

1. **PostgreSQL database schema** (`db/schema.ts`) - Products table
2. **Database connection** (`db/index.ts`) - Using `postgres` driver + Drizzle ORM
3. **API Routes**:
   - `GET /api/products` - List all products
   - `POST /api/products` - Create new product
   - `GET /api/products/[id]` - Get single product
   - `DELETE /api/products/[id]` - Delete product
   - `POST /api/auth/login` - Admin login
4. **Frontend updated** - Now calls `/api` instead of external backend

## Step-by-Step Setup

### 1. Create PostgreSQL on Render

1. Go to [render.com](https://render.com) and log in
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in:
   - **Name**: `future-bright-db`
   - **Region**: `Frankfurt (EU Central)` (closest to Africa/Europe) or `Oregon (US West)`
   - **PostgreSQL Version**: `15`
   - **Instance Type**: **Free** (or `Starter` for backups)
4. Click **Create Database**
5. Wait ~2 minutes for it to provision

### 2. Get Connection String

Once created, Render shows an **"External Connection String"** like:

```
postgresql://future_bright_db_user:password@dpg-xxxxxxxx.render.com:5432/future_bright_db
```

Copy this full string.

### 3. Set Environment Variables on Vercel

Go to [vercel.com](https://vercel.com) → your project → **Settings** → **Environment Variables**

Add:

| Name | Value |
|------|-------|
| `POSTGRES_URL` | `postgresql://future_bright_db_user:password@dpg-xxxxxxxx.render.com:5432/future_bright_db` |

Click **Save**.

### 4. Push Schema to Database (One-time)

You need to run this locally or from any machine with Node.js:

```bash
# Clone your repo
git clone https://github.com/masaitrevis/future-bright-website.git
cd future-bright-website

# Install dependencies
npm install

# Set the database URL temporarily
export POSTGRES_URL="postgresql://future_bright_db_user:password@dpg-xxxxxxxx.render.com:5432/future_bright_db"

# Push schema to database
npx drizzle-kit push
```

This creates the `products` table in your Render database.

### 5. Deploy on Vercel

Push any changes to GitHub, Vercel will auto-deploy.

Or manually: Go to Vercel dashboard → your project → **Deployments** → **Redeploy**.

### 6. Test the API

After deployment, test:

```bash
# Get all products
curl https://your-site.vercel.app/api/products

# Login (returns token)
curl -X POST https://your-site.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Add a product (use token from above)
curl -X POST https://your-site.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -d '{"title":"Driving Course","price":15000,"category":"course","description":"5-day intensive driving course"}'
```

## Admin Login

- **Username**: `admin`
- **Password**: `admin123`
- Go to `/admin` on your site

## What's NOT Included (Yet)

These features still need the separate backend (or future work):

1. **File uploads** (cover images, product files) - Currently not handled. Consider using Cloudinary, AWS S3, or Uploadcare for image hosting.
2. **M-Pesa payments** - The STK push and callback logic needs a backend with persistent storage for payment states.
3. **Proper JWT auth** - Currently using hardcoded token.

## Next Steps

1. **Images**: For product images, use Cloudinary (free tier) or upload to `/public/images/products/` manually.
2. **M-Pesa**: If you need payments, deploy the separate backend on Render with the same database URL.
3. **Auth**: Add a proper users table with bcrypt passwords instead of hardcoded login.

## Troubleshooting

### "Failed to fetch products" error
- Check that `POSTGRES_URL` is set in Vercel environment variables
- Check that `drizzle-kit push` was run successfully
- Check Render dashboard - is the database "Available"?

### "Authentication failed"
- The hardcoded login is `admin` / `admin123`
- Make sure you're sending JSON: `Content-Type: application/json`

### Database connection errors
- Render free tier databases sleep after 15 min of inactivity. First request may take 10-30 seconds to wake up.
- Consider upgrading to Render's `Starter` plan ($7/month) for always-on database.
