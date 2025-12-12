# Sisoy Booking System - PHP Backend

## Setup Instructions

1. **Create Database**
   - Open phpMyAdmin or MySQL CLI
   - Run `backend/sql/schema.sql` to create database and tables
   - Admin login: username=`admin`, password=`admin`

2. **Configuration**
   - Edit `backend/config/database.php`
   - Update DB_HOST, DB_USER, DB_PASS with your MySQL credentials
   - DB_NAME should be `sisoy_booking`

3. **File Structure**
   \`\`\`
   backend/
   ├── config/
   │   └── database.php          # Database connection & utilities
   ├── api/
   │   ├── auth.php              # Authentication endpoints
   │   ├── accommodations.php    # CRUD for rooms/villas/cottages
   │   ├── bookings.php          # Booking management
   │   ├── customers.php         # Customer management
   │   ├── dashboard.php         # Stats and analytics
   │   ├── reports.php           # Revenue & occupancy reports
   │   └── payments.php          # Payment processing
   ├── sql/
   │   └── schema.sql            # Database schema
   └── README.md                 # This file
   \`\`\`

## API Endpoints

### Authentication
- POST `/api/auth.php?action=login`
  - Body: `{ "username": "admin", "password": "admin" }`

### Accommodations
- GET `/api/accommodations.php?action=list` - List all
- GET `/api/accommodations.php?action=get&id=1` - Get specific
- POST `/api/accommodations.php?action=create` - Create new
- PUT `/api/accommodations.php?action=update&id=1` - Update
- DELETE `/api/accommodations.php?action=delete&id=1` - Delete

### Bookings
- GET `/api/bookings.php?action=list` - List all
- GET `/api/bookings.php?action=list&status=confirmed` - Filter by status
- GET `/api/bookings.php?action=get&id=1` - Get specific
- POST `/api/bookings.php?action=create` - Create new
- PUT `/api/bookings.php?action=update&id=1` - Update
- DELETE `/api/bookings.php?action=delete&id=1` - Cancel booking

### Customers
- GET `/api/customers.php?action=list` - List all
- GET `/api/customers.php?action=search?term=john` - Search customers
- POST `/api/customers.php?action=create` - Create new

### Dashboard
- GET `/api/dashboard.php?action=stats` - Get dashboard stats
- GET `/api/dashboard.php?action=today-bookings` - Today's bookings

### Reports
- GET `/api/reports.php?action=daily?month=2024-01` - Daily revenue report
- GET `/api/reports.php?action=monthly?year=2024` - Monthly report
- GET `/api/reports.php?action=occupancy` - Room occupancy data

### Payments
- GET `/api/payments.php?action=get?booking_id=1` - Get booking payments
- POST `/api/payments.php?action=process` - Process payment
- PUT `/api/payments.php?action=refund&id=1` - Refund payment

## Database Credentials
- Host: localhost
- User: root
- Password: (empty/your password)
- Database: sisoy_booking

## CORS Configuration
All endpoints allow requests from any origin (*) for development. Restrict this in production using `header('Access-Control-Allow-Origin: yourdomain.com');`
