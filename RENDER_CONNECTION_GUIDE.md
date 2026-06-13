# Finding Your Render PostgreSQL Connection String

## Step-by-Step (with screenshots description)

### 1. Go to your Render Dashboard
- Visit: https://dashboard.render.com/
- Log in to your account

### 2. Find your database
- Look for **"PostgreSQL"** in your dashboard
- Click on your database name (e.g., `future-bright-db`)

### 3. Get the connection string
- On the database page, look for **"Connections"** section
- You'll see **"External Database URL"** or **"PSQL Command"**
- The connection string looks like:
  ```
  postgresql://username:password@host.render.com:5432/database_name
  ```

### 4. Copy the full string
- Click the copy button next to **"External Database URL"**
- This is your `POSTGRES_URL`

---

## Visual Guide

```
Render Dashboard
├── Services
│   └── future-bright-db (PostgreSQL)  ← CLICK THIS
│
└── Click on it → Opens database page

Database Page:
├── Info
│   ├── Database: future_bright_db
│   ├── User: future_bright_db_user
│   └── Port: 5432
│
├── Connections  ← LOOK HERE
│   ├── PSQL Command: psql postgresql://...  ← COPY THIS URL
│   └── External Database URL: postgresql://...  ← OR COPY THIS
│
└── Status: Available
```

---

## What it should look like

```
postgresql://future_bright_db_abc123:your_password_xyz789@dpg-abc12345-a.oregon-postgres.render.com:5432/future_bright_db
```

**This entire string is your `POSTGRES_URL`.**

---

## Alternative: Build it manually

If you can see the individual fields, you can build the string:

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

From the Render dashboard, find:
- **User**: usually something like `future_bright_db_user`
- **Password**: click **"Show"** or **"Reveal"** to see it
- **Host**: something like `dpg-abc123-a.oregon-postgres.render.com`
- **Port**: usually `5432`
- **Database**: usually `future_bright_db`

---

## Still can't find it?

If your database hasn't been created yet:
1. Go to https://dashboard.render.com/new/database
2. Fill in:
   - **Name**: `future-bright-db`
   - **Region**: Pick closest to you
   - **PostgreSQL Version**: 15
   - **Instance Type**: Free
3. Click **Create Database**
4. Wait 2-3 minutes
5. The connection string will appear on the database page

---

## Quick Check

After you copy it, the string should:
- Start with `postgresql://`
- Contain a username and password
- End with a database name
- Be one long line (no spaces)

**Example:**
```
postgresql://user:pass@host:5432/dbname
```
