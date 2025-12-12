# Sisoy POS Booking System - Complete Setup Guide

## Table of Contents
1. [System Requirements](#system-requirements)
2. [XAMPP Installation & Setup](#xampp-installation--setup)
3. [Database Setup](#database-setup)
4. [PHP Backend Configuration](#php-backend-configuration)
5. [Connecting Frontend to Backend](#connecting-frontend-to-backend)
6. [Testing the System](#testing-the-system)

---

## System Requirements

- **XAMPP** (Apache + MySQL + PHP)
- **PHP 7.4 or higher** (comes with XAMPP)
- **MySQL 5.7 or higher** (comes with XAMPP)
- **Node.js & npm** (for Next.js frontend)
- **Web Browser** (Chrome, Firefox, Safari, Edge)

---

## XAMPP Installation & Setup

### Step 1: Download XAMPP
1. Go to https://www.apachefriends.org/download.html
2. Download XAMPP for your operating system (Windows/Mac/Linux)
3. Run the installer and follow the prompts

### Step 2: Install XAMPP
- **Windows**: Use the .exe installer
- **Mac**: Use the .dmg installer
- **Linux**: Follow the specific instructions for your distro

Default installation path:
- **Windows**: `C:\xampp`
- **Mac**: `/Applications/XAMPP`
- **Linux**: `/opt/lampp`

### Step 3: Start XAMPP Services
1. Open XAMPP Control Panel
2. Click **Start** for:
   - Apache (web server)
   - MySQL (database server)
3. Verify both show **green indicators** = Running

---

## Database Setup

### Step 1: Access phpMyAdmin
1. Open your browser
2. Go to: `http://localhost/phpmyadmin`
3. You should see the phpMyAdmin dashboard

### Step 2: Create the Database
1. Click **New** (left sidebar)
2. Enter Database name: `sisoy_booking`
3. Select Collation: `utf8mb4_unicode_ci`
4. Click **Create**

### Step 3: Import the SQL Schema

#### Option A: Using phpMyAdmin (Easiest)
1. Navigate to the `sisoy_booking` database (click on it)
2. Click the **Import** tab
3. Click **Choose File**
4. Select `backend/sql/schema.sql` from your project
5. Click **Import** button
6. You should see success message: "Import has been successfully finished"

#### Option B: Using Command Line (Advanced)
\`\`\`bash
# Navigate to XAMPP directory
cd C:\xampp\mysql\bin  # Windows
# or
cd /Applications/XAMPP/bin  # Mac
# or
cd /opt/lampp/bin  # Linux

# Import the schema
mysql -u root sisoy_booking < /path/to/backend/sql/schema.sql
\`\`\`

### Step 4: Verify Database Tables
1. In phpMyAdmin, click `sisoy_booking` database
2. You should see these tables:
   - `users` (with 1 admin user: admin/admin)
   - `accommodations`
   - `customers`
   - `bookings`
   - `payments`
   - `daily_revenue`

---

## PHP Backend Configuration

### Step 1: Place Backend Files in XAMPP
1. Copy your entire `backend` folder to:
   - **Windows**: `C:\xampp\htdocs\sisoy-backend`
   - **Mac**: `/Applications/XAMPP/htdocs/sisoy-backend`
   - **Linux**: `/opt/lampp/htdocs/sisoy-backend`

### Step 2: Update Database Config

Edit `backend/config/database.php`:

\`\`\`php
<?php
$db_host = 'localhost';
$db_user = 'root';
$db_password = '';  // XAMPP uses empty password by default
$db_name = 'sisoy_booking';

$mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);

if ($mysqli->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $mysqli->connect_error]));
}

mysqli_set_charset($mysqli, "utf8mb4");
?>
\`\`\`

### Step 3: Verify PHP is Running
1. Open browser
2. Go to: `http://localhost/sisoy-backend/api/accommodations.php`
3. You should see JSON response with accommodation list

---

## Connecting Frontend to Backend

### Step 1: Update API Base URL

In your Next.js project, create a `.env.local` file:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost/sisoy-backend/api
\`\`\`

### Step 2: Update Frontend API Calls

Replace all localStorage calls with API calls. Example:

\`\`\`typescript
// OLD (localStorage)
const accommodations = JSON.parse(localStorage.getItem('accommodations') || '[]')

// NEW (PHP Backend)
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accommodations.php`)
const accommodations = await response.json()
\`\`\`

### Step 3: Update All API Endpoints

Replace in your components:

| Endpoint | Old | New |
|----------|-----|-----|
| Get Accommodations | localStorage | `/api/accommodations.php` |
| Create Booking | localStorage | `/api/bookings.php?action=create` |
| Get Bookings | localStorage | `/api/bookings.php?action=get` |
| Process Payment | localStorage | `/api/payments.php?action=process` |
| Get Reports | localStorage | `/api/reports.php?action=daily` |

---

## Testing the System

### Step 1: Test Database Connection
\`\`\`bash
curl http://localhost/sisoy-backend/api/accommodations.php
\`\`\`
Expected: JSON array of 35 accommodations

### Step 2: Test Authentication
\`\`\`bash
curl -X POST http://localhost/sisoy-backend/api/auth.php \
  -H "Content-Type: application/json" \
  -d '{"action":"login","username":"admin","password":"admin"}'
\`\`\`
Expected: Success response with user data

### Step 3: Test Creating a Booking
\`\`\`bash
curl -X POST http://localhost/sisoy-backend/api/bookings.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "customer_id": 1,
    "accommodation_id": 1,
    "check_in": "2024-12-01",
    "check_out": "2024-12-03",
    "guests": 2,
    "total_price": 160
  }'
\`\`\`

### Step 4: Run Full Frontend
\`\`\`bash
npm run dev
\`\`\`
Go to: `http://localhost:3000`

---

## Common Issues & Troubleshooting

### Issue: "Connection refused" error
**Solution**: 
- Verify Apache and MySQL are running (green in XAMPP Control Panel)
- Check if port 3306 (MySQL) and 80 (Apache) are not in use by other apps

### Issue: "Database not found" error
**Solution**:
- Verify database was created: `http://localhost/phpmyadmin`
- Check database name matches: `sisoy_booking`

### Issue: "Access denied for user" error
**Solution**:
- Verify database credentials in `backend/config/database.php`
- Default XAMPP: user=`root`, password=`` (empty)

### Issue: CORS errors in browser console
**Solution**:
Add CORS headers to `backend/config/database.php`:
\`\`\`php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
\`\`\`

### Issue: PHP files showing as download instead of executing
**Solution**:
- Verify Apache is running
- Check files are in `/htdocs` directory
- Restart Apache from XAMPP Control Panel

---

## File Structure

\`\`\`
sisoy-backend/
├── config/
│   └── database.php          # Database connection
├── api/
│   ├── auth.php              # Authentication endpoints
│   ├── accommodations.php    # Accommodation CRUD
│   ├── bookings.php          # Booking management
│   ├── customers.php         # Customer management
│   ├── payments.php          # Payment processing
│   ├── dashboard.php         # Dashboard stats
│   ├── reports.php           # Reports & analytics
│   └── receipt.php           # Receipt generation
└── sql/
    └── schema.sql            # Database schema
\`\`\`

---

## Security Notes

1. **Change Default Password**
   - After setup, update admin password in phpMyAdmin
   - Update it in database: `UPDATE users SET password = PASSWORD('newpassword') WHERE id = 1`

2. **Use Environment Variables**
   - Never hardcode database credentials
   - Use `.env` files in production

3. **Enable SSL/HTTPS**
   - Use HTTPS in production
   - Update CORS headers accordingly

4. **Validate & Sanitize Input**
   - All API endpoints should validate input
   - Use prepared statements (already implemented)

---

## Next Steps

1. Test all endpoints using the Testing section above
2. Connect Next.js frontend to PHP backend
3. Run both services simultaneously
4. Deploy to production server when ready

For issues, check XAMPP logs:
- Apache: `C:\xampp\apache\logs\error.log`
- MySQL: `C:\xampp\mysql\data\*.err`
