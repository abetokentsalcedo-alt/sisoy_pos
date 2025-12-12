# Sisoy Resort Booking System

A modern, full-stack booking management system built with Next.js and MySQL for managing accommodations, reservations, customers, and transactions.

## 🚀 Features

- **Accommodation Management** - Manage rooms, cottages, and villas
- **Booking System** - Create and track reservations with real-time availability
- **Customer Management** - Store and search customer information
- **Transaction Tracking** - Complete payment history and receipts
- **Dashboard Analytics** - View bookings, revenue, and occupancy stats
- **Reports** - Generate booking and financial reports

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **XAMPP** (for MySQL) - [Download](https://www.apachefriends.org/)
- **Git** (optional, for cloning) - [Download](https://git-scm.com/)

## 🛠️ Installation

### 1. Clone or Download the Project

```bash
git clone https://github.com/abetokentsalcedo-alt/sisoy_pos.git
cd sisoy_pos
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup MySQL Database

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Click "Start" for **Apache** and **MySQL** modules

2. **Import Database Schema**
   - Open browser and go to http://localhost/phpmyadmin
   - Click "New" to create a database
   - Name it `sisoy_booking`
   - Click "Import" tab
   - Choose `sisoy_booking.sql` file from the project root
   - Click "Go" to import

   **OR via command line:**
   ```bash
   cd C:\xampp\mysql\bin
   mysql -u root -p sisoy_booking < path\to\sisoy_booking.sql
   ```
   (Press Enter when prompted for password if it's empty)

### 4. Configure Environment Variables

The project comes pre-configured with `.env` file. Verify these settings match your MySQL setup:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=sisoy_booking
DB_PORT=3306
```

If your MySQL settings are different, update the values accordingly.

## 🚀 Running the Application

### Start Development Server

```bash
npm run dev
```

The application will start on http://localhost:3000

### Default Login Credentials

```
Username: admin
Password: admin123
```

## 📁 Project Structure

```
sisoy_pos/
├── app/                      # Next.js app directory
│   ├── (dashboard)/         # Dashboard pages (protected routes)
│   │   ├── accommodations/  # Manage rooms/cottages/villas
│   │   ├── bookings/        # View all bookings
│   │   ├── booking/         # Create new bookings
│   │   ├── customers/       # Customer management
│   │   ├── dashboard/       # Main dashboard
│   │   ├── reports/         # Generate reports
│   │   ├── settings/        # System settings
│   │   └── transactions/    # View transactions
│   ├── api/                 # API routes (backend)
│   │   ├── accommodations/  # Accommodation CRUD
│   │   ├── bookings/        # Booking CRUD
│   │   ├── customers/       # Customer CRUD
│   │   ├── transactions/    # Transaction history
│   │   └── test_db_conn/    # Database connection test
│   ├── login/               # Login page
│   └── layout.tsx           # Root layout
├── components/              # Reusable React components
│   ├── booking/            # Booking-related components
│   ├── layout/             # Navigation and sidebar
│   └── ui/                 # UI components (buttons, inputs, etc.)
├── lib/                     # Utility libraries
│   ├── api.ts              # API helper functions
│   ├── db.js               # MySQL connection pool
│   └── storage.ts          # Local storage utilities
├── public/                  # Static assets
├── .env                     # Environment variables
├── package.json            # Dependencies
└── sisoy_booking.sql       # Database schema

```

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm build

# Start production server
npm start

# Export current database
node export-db.js

# Run schema migration
node migrate-schema.mjs

# Verify database schema
node verify-schema.mjs
```

## 🎯 How to Use

### Creating a Booking

1. Login with admin credentials
2. Click "Booking" in the sidebar
3. Select customer (or create new)
4. Choose accommodation and dates
5. Review total and confirm
6. Process payment
7. Generate receipt

### Managing Accommodations

1. Navigate to "Accommodations"
2. View all rooms, cottages, and villas
3. Add new accommodations or edit existing ones
4. Set prices and availability status

### Viewing Reports

1. Go to "Reports" page
2. Select date range
3. Choose report type (bookings, revenue, etc.)
4. View or export data

## 🗄️ Database Schema

The system uses the following main tables:

- **accommodations** - Rooms, cottages, villas with pricing
- **bookings** - Reservation records
- **customers** - Customer information
- **transactions** - Payment records
- **payments** - Payment details
- **users** - System users (admin/staff)

## 🔐 Security Notes

- Default password uses bcrypt hashing
- Database credentials in `.env` should be secured in production
- Use HTTPS in production deployment
- Change default admin password immediately

## 🐛 Troubleshooting

### Port Already in Use
The system automatically finds available ports. If issues occur:
```bash
npm run dev:no-port
```

### Database Connection Failed
1. Ensure MySQL is running in XAMPP
2. Check `.env` credentials match your MySQL setup
3. Test connection: http://localhost:3000/api/test_db_conn

### Cannot Create Bookings
1. Verify database is imported successfully
2. Check browser console for errors
3. Ensure all accommodations exist in database

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

Update `.env` with production values:
```env
DB_HOST=your-production-host
DB_USER=your-db-user
DB_PASS=your-secure-password
DB_NAME=sisoy_booking
```

## 📝 Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes (Node.js)
- **Database:** MySQL (via XAMPP)
- **ORM:** mysql2 (connection pooling)

## 📄 License

This project is private and proprietary.

## 👥 Authors

- **Development Team** - Initial work

## 🙏 Acknowledgments

- Built with Next.js App Router
- UI components from shadcn/ui
- Icons from Lucide React

---

For more detailed documentation, see [CODE_DOCUMENTATION.md](CODE_DOCUMENTATION.md)
