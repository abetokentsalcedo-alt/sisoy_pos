# Code Documentation - Sisoy Resort Booking System

This document provides a detailed breakdown of each screen, its associated files, and key code snippets with explanations.

## 📋 Table of Contents

1. [Login Screen](#login-screen)
2. [Dashboard Screen](#dashboard-screen)
3. [Bookings List Screen](#bookings-list-screen)
4. [New Booking Screen](#new-booking-screen)
5. [Payment Screen](#payment-screen)
6. [Customers Screen](#customers-screen)
7. [Accommodations Screen](#accommodations-screen)
8. [Reports Screen](#reports-screen)
9. [API Routes](#api-routes)
10. [Database Layer](#database-layer)

---

## Login Screen

**Route:** `/login`  
**File:** `app/login/page.tsx`

### Purpose
Authentication screen where users enter credentials to access the system.

### Key Code Snippet

```tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  
  if (username === "admin" && password === "admin123") {
    localStorage.setItem("isLoggedIn", "true")
    router.push("/dashboard")
  } else {
    setError("Invalid credentials")
  }
}
```

**What it does:** 
- Validates username and password against hardcoded credentials
- Stores authentication state in localStorage
- Redirects to dashboard on success
- Shows error message on failure

---

## Dashboard Screen

**Route:** `/dashboard`  
**File:** `app/(dashboard)/dashboard/page.tsx`

### Purpose
Main overview screen showing key metrics and recent bookings.

### Key Code Snippet

```tsx
const syncBookingsFromServer = async () => {
  const apiBase = getApiBase()
  
  const res = await fetch(`${apiBase}/bookings?action=list`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  
  if (res.ok) {
    const json = await res.json()
    const bookingsData = json.data || []
    // Update state with server data
    setBookings(bookingsData)
  }
}
```

**What it does:**
- Fetches all bookings from the server API
- Uses `getApiBase()` to determine correct API URL
- Parses response and updates React state
- Displays bookings in dashboard cards

### Statistics Calculation

```tsx
const totalRevenue = bookings.reduce((sum, b) => {
  const amount = parseFloat(b.total_price) || 0
  return sum + amount
}, 0)

const occupancyRate = ((activeBookings / totalAccommodations) * 100).toFixed(1)
```

**What it does:**
- Calculates total revenue by summing all booking prices
- Computes occupancy rate based on active bookings vs total accommodations
- Formats percentages for display

---

## Bookings List Screen

**Route:** `/bookings`  
**File:** `app/(dashboard)/bookings/page.tsx`

### Purpose
Display all bookings with search, filter, and management options.

### Key Code Snippet

```tsx
const syncBookingsFromServer = async () => {
  const apiBase = getApiBase()
  const resp = await fetch(`${apiBase}/bookings?action=list`)
  
  if (resp.ok) {
    const data = await resp.json()
    const serverBookings = data.data || []
    
    // Merge with local storage for offline support
    const merged = [...localBookings, ...serverBookings]
    setBookings(merged)
  }
}
```

**What it does:**
- Fetches bookings from MySQL via API
- Merges server data with local storage data
- Supports offline functionality
- Updates UI with combined data

### Search Functionality

```tsx
const filtered = bookings.filter((booking) => {
  const searchLower = searchTerm.toLowerCase()
  return (
    booking.booking_number?.toLowerCase().includes(searchLower) ||
    customerName?.toLowerCase().includes(searchLower) ||
    accommodationName?.toLowerCase().includes(searchLower)
  )
})
```

**What it does:**
- Filters bookings based on search term
- Searches across booking number, customer name, and accommodation name
- Case-insensitive matching
- Updates filtered list in real-time

---

## New Booking Screen

**Route:** `/booking/new`  
**File:** `app/(dashboard)/booking/new/page.tsx`

### Purpose
Create new reservations by selecting customer, accommodation, and dates.

### Customer Selection

```tsx
const handleSelectClient = (client: Client) => {
  setSelectedClient(client)
  setSelectedAccommodation(null)
  setDateFrom(null)
  setDateTo(null)
}
```

**What it does:**
- Sets the selected customer for the booking
- Resets accommodation and date selections
- Ensures clean state for new booking flow

### Accommodation Selection with Availability

```tsx
const isAccommodationBooked = (accommodationId: string) => {
  if (!dateFrom || !dateTo) return false
  
  return bookings.some((b) => {
    if (b.accommodationId !== accommodationId) return false
    if (b.status === 'cancelled') return false
    
    const bookingStart = new Date(b.dateFrom)
    const bookingEnd = new Date(b.dateTo)
    
    return (
      (dateFrom >= bookingStart && dateFrom < bookingEnd) ||
      (dateTo > bookingStart && dateTo <= bookingEnd) ||
      (dateFrom <= bookingStart && dateTo >= bookingEnd)
    )
  })
}
```

**What it does:**
- Checks if an accommodation is already booked for selected dates
- Compares date ranges for conflicts
- Prevents double-booking
- Returns true if dates overlap with existing booking

### Price Calculation

```tsx
const calculateTotal = () => {
  if (!selectedAccommodation || !dateFrom || !dateTo) return 0
  
  const nights = Math.ceil(
    (new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / 
    (1000 * 60 * 60 * 24)
  )
  
  return selectedAccommodation.pricePerNight * nights
}
```

**What it does:**
- Calculates number of nights between check-in and check-out
- Multiplies nights by accommodation's nightly rate
- Returns total booking price
- Used for displaying cost before payment

---

## Payment Screen

**Route:** `/booking/payment`  
**File:** `app/(dashboard)/booking/payment/page.tsx`

### Purpose
Process payments and finalize bookings.

### Customer Creation

```tsx
// If customer doesn't exist in server, create them
if (!customerIdToUse || String(customerIdToUse).length > 10) {
  const createResp = await fetch(`${API_BASE}/customers?action=create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      first_name: clientObj.firstName,
      last_name: clientObj.lastName,
      email: clientObj.email || '',
      phone: clientObj.phoneNumber || '',
      address: clientObj.address || '',
    }),
  })
  
  if (createResp.ok) {
    const cjson = await createResp.json()
    customerIdToUse = String(cjson.id)
  }
}
```

**What it does:**
- Checks if customer exists in database
- Creates new customer record if needed
- Retrieves server-assigned customer ID
- Updates local storage with server ID

### Booking Creation

```tsx
const payload = {
  customer_id: customerIdToUse,
  accommodation_id: booking.accommodationId,
  accommodation_name: accommodationName,
  check_in: booking.dateFrom,
  check_out: booking.dateTo,
  guests: 1,
  total_price: booking.totalAmount,
  payment_method: paymentMethod,
}

const resp = await fetch(`${API_BASE}/bookings?action=create`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})
```

**What it does:**
- Constructs booking payload with all required fields
- Sends POST request to bookings API
- Server creates records in bookings, transactions, and payments tables
- Returns complete booking with transaction reference

### Transaction Recording

```tsx
if (json && json.transaction_reference) {
  serverBooking.transactionId = json.transaction_reference
}
```

**What it does:**
- Captures transaction reference from server response
- Links booking to payment transaction
- Enables receipt generation
- Stores in local booking object

---

## Customers Screen

**Route:** `/customers`  
**File:** `app/(dashboard)/customers/page.tsx`

### Purpose
Manage customer database with add, edit, search functionality.

### Loading Customers

```tsx
const loadCustomers = async () => {
  const apiBase = getApiBase()
  const resp = await fetch(`${apiBase}/customers?action=list`)
  
  if (resp.ok) {
    const data = await resp.json()
    setCustomers(data.data || [])
  }
}
```

**What it does:**
- Fetches all customers from MySQL database
- Populates customer list in UI
- Runs on component mount
- Refreshes after add/edit operations

### Creating Customer

```tsx
const handleSave = async () => {
  const apiBase = getApiBase()
  
  const payload = {
    first_name: form.firstName,
    last_name: form.lastName,
    email: form.email,
    phone: form.phone,
    address: form.address,
  }
  
  const resp = await fetch(`${apiBase}/customers?action=create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  
  if (resp.ok) {
    await loadCustomers() // Refresh list
    handleClose() // Close modal
  }
}
```

**What it does:**
- Validates and collects form data
- Sends POST request to create customer
- Inserts record into MySQL customers table
- Refreshes customer list on success

---

## Accommodations Screen

**Route:** `/accommodations`  
**File:** `app/(dashboard)/accommodations/page.tsx`

### Purpose
Display and manage all accommodations (rooms, cottages, villas).

### Loading Accommodations

```tsx
const loadAccommodations = async () => {
  const apiBase = getApiBase()
  const resp = await fetch(`${apiBase}/accommodations?action=list`)
  
  if (resp.ok) {
    const data = await resp.json()
    const serverAccommodations = data.data || []
    setAccommodations(serverAccommodations)
  }
}
```

**What it does:**
- Fetches all accommodations from database
- Includes rooms, cottages, and villas
- Displays with pricing and capacity info
- Filters by type for easy navigation

### Filtering by Type

```tsx
const filtered = accommodations.filter((acc) => {
  if (activeFilter === 'All') return true
  return acc.type === activeFilter
})
```

**What it does:**
- Filters accommodations by selected type (Room, Cottage, Villa)
- "All" shows everything
- Updates UI dynamically on filter change
- Maintains search functionality

---

## Reports Screen

**Route:** `/reports`  
**File:** `app/(dashboard)/reports/page.tsx`

### Purpose
Generate booking and revenue reports with date filtering.

### Revenue Calculation

```tsx
const totalRevenue = bookings
  .filter((b) => {
    const bookingDate = new Date(b.created_at || b.dateFrom)
    return bookingDate >= dateFrom && bookingDate <= dateTo
  })
  .reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0)
```

**What it does:**
- Filters bookings within selected date range
- Sums total_price for all matching bookings
- Displays formatted currency amount
- Updates when date range changes

### Booking Statistics

```tsx
const bookingsByStatus = bookings.reduce((acc, b) => {
  const status = b.status || 'pending'
  acc[status] = (acc[status] || 0) + 1
  return acc
}, {})
```

**What it does:**
- Groups bookings by status (confirmed, pending, cancelled)
- Counts occurrences of each status
- Displays breakdown in UI
- Useful for operational insights

---

## API Routes

All API routes are located in `app/api/` and follow REST conventions.

### Bookings API

**File:** `app/api/bookings/route.js`

#### List Bookings

```javascript
export async function GET(request) {
  const action = searchParams.get('action')
  
  if (action === 'list') {
    const results = await query(`
      SELECT b.*, c.first_name, c.last_name, a.name as accommodation_name,
        (SELECT t.transaction_reference FROM transactions t 
         WHERE t.booking_id = b.id ORDER BY t.id DESC LIMIT 1) AS transaction_reference
      FROM bookings b
      LEFT JOIN customers c ON b.customer_id = c.id
      LEFT JOIN accommodations a ON b.accommodation_id = a.id
      ORDER BY b.created_at DESC
    `)
    
    return Response.json({ data: results })
  }
}
```

**What it does:**
- Handles GET requests with action=list
- Joins bookings with customers and accommodations tables
- Includes latest transaction reference for each booking
- Returns JSON array of booking objects

#### Create Booking

```javascript
export async function POST(request) {
  const action = searchParams.get('action')
  
  if (action === 'create') {
    const body = await request.json()
    
    // Generate unique booking number
    const bookingNumber = `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    
    // Insert booking
    const results = await query(
      `INSERT INTO bookings (booking_number, customer_id, accommodation_id, 
        check_in, check_out, guests, total_price, status, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)`,
      [bookingNumber, customerId, accommodationId, body.check_in, 
       body.check_out, body.guests, body.total_price, body.notes]
    )
    
    const bookingId = results.insertId
    
    // Record transaction
    await query(
      `INSERT INTO transactions (booking_id, customer_id, amount, 
        payment_method, status, transaction_reference, description) 
       VALUES (?, ?, ?, ?, 'completed', ?, ?)`,
      [bookingId, customerId, body.total_price, body.payment_method, 
       `TXN-${bookingNumber}`, `Payment for booking ${bookingNumber}`]
    )
    
    return Response.json({ success: true, id: bookingId, booking_number: bookingNumber })
  }
}
```

**What it does:**
- Generates unique booking number (BK-YYYYMMDD-XXXX)
- Inserts booking record into MySQL
- Creates linked transaction record
- Also inserts into payments table
- Returns booking details with ID

### Customers API

**File:** `app/api/customers/route.js`

#### List Customers

```javascript
export async function GET(request) {
  const action = searchParams.get('action')
  
  if (action === 'list') {
    const results = await query('SELECT * FROM customers ORDER BY created_at DESC')
    return Response.json({ data: results })
  }
  
  if (action === 'search') {
    const term = searchParams.get('term') || ''
    const searchTerm = `%${term}%`
    
    const results = await query(
      `SELECT * FROM customers 
       WHERE first_name LIKE ? OR last_name LIKE ? 
          OR email LIKE ? OR phone LIKE ?
       LIMIT 10`,
      [searchTerm, searchTerm, searchTerm, searchTerm]
    )
    
    return Response.json({ data: results })
  }
}
```

**What it does:**
- Lists all customers for customer management page
- Provides search endpoint for booking flow
- Searches across name, email, and phone fields
- Returns limited results (10) for performance

#### Create Customer

```javascript
export async function POST(request) {
  const action = searchParams.get('action')
  
  if (action === 'create') {
    const body = await request.json()
    
    const results = await query(
      `INSERT INTO customers (first_name, last_name, email, phone, address) 
       VALUES (?, ?, ?, ?, ?)`,
      [body.first_name, body.last_name, body.email, body.phone, body.address]
    )
    
    // Fetch newly created customer
    const newCustomer = await query(
      'SELECT * FROM customers WHERE id = ?',
      [results.insertId]
    )
    
    return Response.json({ success: true, id: results.insertId, ...newCustomer[0] })
  }
}
```

**What it does:**
- Inserts new customer into MySQL
- Returns auto-incremented customer ID
- Fetches complete customer record
- Enables immediate use in booking flow

### Accommodations API

**File:** `app/api/accommodations/route.js`

```javascript
export async function GET(request) {
  const action = searchParams.get('action')
  
  if (action === 'list') {
    const results = await query(`
      SELECT * FROM accommodations 
      WHERE status = 'active' 
      ORDER BY type, name
    `)
    
    return Response.json({ data: results })
  }
}
```

**What it does:**
- Fetches active accommodations only
- Sorts by type then name for organized display
- Includes all accommodation details (price, capacity, etc.)
- Used by booking and accommodations pages

---

## Database Layer

**File:** `lib/db.js`

### Connection Pool

```javascript
let pool = null

export async function getConnection() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'sisoy_booking',
      port: parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }
  return pool
}
```

**What it does:**
- Creates MySQL connection pool (singleton pattern)
- Reuses connections for better performance
- Reads credentials from environment variables
- Limits to 10 concurrent connections

### Query Function

```javascript
export async function query(sql, values = []) {
  const pool = await getConnection()
  const connection = await pool.getConnection()
  
  try {
    const [results] = await connection.execute(sql, values)
    return results
  } finally {
    connection.release()
  }
}
```

**What it does:**
- Executes parameterized SQL queries
- Prevents SQL injection via prepared statements
- Automatically releases connection back to pool
- Handles errors gracefully

---

## API Helper

**File:** `lib/api.ts`

```typescript
export function getApiBase(): string {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  }
  
  // Client-side: use relative path (same origin)
  const relative = '/api'
  
  // Allow override for external backends
  const envUrl = (process.env.NEXT_PUBLIC_API_URL || '').trim()
  if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
    return envUrl
  }
  
  return relative
}
```

**What it does:**
- Determines correct API base URL for requests
- Server-side: uses absolute URL from env
- Client-side: uses relative `/api` to avoid CORS issues
- Supports external backend override if needed
- Prevents port mismatch errors

---

## Storage Layer

**File:** `lib/storage.ts`

### Local Storage Utilities

```typescript
export const storage = {
  getClients: (): Client[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('pos_clients')
    return data ? JSON.parse(data) : []
  },
  
  saveClient: (client: Client) => {
    const clients = storage.getClients()
    const index = clients.findIndex(c => c.id === client.id)
    
    if (index >= 0) {
      clients[index] = client
    } else {
      clients.push(client)
    }
    
    localStorage.setItem('pos_clients', JSON.stringify(clients))
  },
  
  getBookings: (): Booking[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('pos_bookings')
    return data ? JSON.parse(data) : []
  }
}
```

**What it does:**
- Provides offline-first data persistence
- Syncs with server when available
- Stores bookings, customers, and accommodations
- Enables app to work without internet

---

## Component Architecture

### Dashboard Layout

**File:** `app/(dashboard)/layout.tsx`

```tsx
export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

**What it does:**
- Wraps all dashboard pages with consistent layout
- Includes sidebar navigation
- Top navbar with user info
- Scrollable content area
- Responsive design

### Sidebar Component

**File:** `components/layout/sidebar.tsx`

```tsx
const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Bookings", href: "/bookings" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: Home, label: "Accommodations", href: "/accommodations" },
  { icon: DollarSign, label: "Transactions", href: "/transactions" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
]
```

**What it does:**
- Defines navigation structure
- Renders menu items with icons
- Highlights active route
- Provides logout functionality

---

## Summary

This booking system follows a modern full-stack architecture:

- **Frontend:** Next.js 16 with React Server Components
- **Backend:** Next.js API Routes with MySQL
- **State Management:** React hooks + localStorage for offline support
- **Database:** MySQL with connection pooling
- **Authentication:** Simple localStorage-based auth (can be enhanced)

Key features:
- Real-time booking creation and management
- Automatic transaction recording
- Offline-first design with server sync
- Responsive UI with shadcn/ui components
- Comprehensive reporting capabilities
