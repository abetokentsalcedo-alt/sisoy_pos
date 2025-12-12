# Project Flowcharts - Sisoy Resort Booking System

Visual diagrams illustrating the application flow and architecture.

## 📊 Table of Contents

1. [System Architecture](#system-architecture)
2. [User Authentication Flow](#user-authentication-flow)
3. [Booking Creation Flow](#booking-creation-flow)
4. [Data Sync Flow](#data-sync-flow)
5. [Database Schema](#database-schema)
6. [API Request Flow](#api-request-flow)

---

## System Architecture

```mermaid
graph TB
    subgraph "Client Browser"
        A[Next.js Frontend<br/>React Components]
        B[Local Storage<br/>Offline Data]
    end
    
    subgraph "Next.js Server"
        C[API Routes<br/>Node.js Backend]
        D[Database Pool<br/>mysql2]
    end
    
    subgraph "XAMPP"
        E[MySQL Database<br/>sisoy_booking]
    end
    
    A -->|HTTP Requests| C
    A -->|Read/Write| B
    C -->|SQL Queries| D
    D -->|Connection Pool| E
    B -.->|Sync When Online| C
```

**Components:**
- **Frontend:** Next.js 16 pages with React 19
- **Backend:** Next.js API routes (serverless functions)
- **Database:** MySQL via XAMPP with connection pooling
- **Storage:** LocalStorage for offline capability

---

## User Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Login Page
    participant LocalStorage
    participant Dashboard

    User->>Login Page: Enter credentials
    Login Page->>Login Page: Validate (admin/admin123)
    
    alt Valid Credentials
        Login Page->>LocalStorage: Store isLoggedIn=true
        Login Page->>Dashboard: Redirect to /dashboard
        Dashboard->>User: Show dashboard content
    else Invalid Credentials
        Login Page->>User: Show error message
    end
```

**Authentication Steps:**
1. User enters username and password
2. Client-side validation checks credentials
3. Success: Store auth token in localStorage
4. Redirect to dashboard
5. All dashboard routes check localStorage for auth

---

## Booking Creation Flow

```mermaid
graph TD
    A[Start: User Clicks 'New Booking'] --> B[Select Customer]
    B --> C{Customer Exists?}
    C -->|No| D[Create New Customer]
    C -->|Yes| E[Load Customer Data]
    D --> E
    
    E --> F[Select Dates]
    F --> G[Check Availability]
    G --> H{Available?}
    
    H -->|No| I[Show Error]
    I --> F
    
    H -->|Yes| J[Select Accommodation]
    J --> K[Calculate Total Price]
    K --> L[Review Booking]
    L --> M[Proceed to Payment]
    
    M --> N[Select Payment Method]
    N --> O[Process Payment]
    
    O --> P{API Request}
    P --> Q[Create Customer Record]
    Q --> R[Create Booking Record]
    R --> S[Create Transaction Record]
    S --> T[Create Payment Record]
    
    T --> U[Generate Receipt]
    U --> V[Show Completion Modal]
    V --> W[Return to Dashboard]
```

**Key Points:**
- Linear flow with validation at each step
- Automatic availability checking
- Atomic transaction (all records created together)
- Receipt generation upon success

---

## Data Sync Flow

```mermaid
sequenceDiagram
    participant UI as Frontend UI
    participant LS as LocalStorage
    participant API as Next.js API
    participant DB as MySQL Database

    Note over UI,DB: Page Load / Refresh
    
    UI->>LS: Read local data
    LS-->>UI: Return cached data
    UI->>UI: Display local data immediately
    
    UI->>API: Fetch latest from server
    API->>DB: SELECT query
    DB-->>API: Return records
    API-->>UI: JSON response
    
    UI->>UI: Merge local + server data
    UI->>LS: Update local cache
    UI->>UI: Re-render with fresh data
    
    Note over UI,DB: Create New Booking
    
    UI->>LS: Save temporarily
    UI->>API: POST /api/bookings
    API->>DB: INSERT booking
    API->>DB: INSERT transaction
    API->>DB: INSERT payment
    DB-->>API: Return IDs
    API-->>UI: Success + booking details
    UI->>LS: Update with server IDs
    UI->>UI: Show success message
```

**Sync Strategy:**
- **Optimistic UI:** Show local data immediately
- **Background sync:** Fetch server data asynchronously
- **Merge:** Combine local and server data (deduplication)
- **Write-through:** All mutations go to server first

---

## Database Schema

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : creates
    CUSTOMERS ||--o{ BOOKINGS : makes
    ACCOMMODATIONS ||--o{ BOOKINGS : "booked for"
    BOOKINGS ||--|| TRANSACTIONS : has
    BOOKINGS ||--|| PAYMENTS : has
    
    USERS {
        int id PK
        string username UK
        string password
        string full_name
        string email UK
        enum role
        timestamp created_at
    }
    
    CUSTOMERS {
        int id PK
        string first_name
        string last_name
        string email
        string phone
        text address
        timestamp created_at
    }
    
    ACCOMMODATIONS {
        int id PK
        string name
        enum type
        int capacity
        decimal price_per_night
        text description
        enum status
        timestamp created_at
    }
    
    BOOKINGS {
        int id PK
        string booking_number UK
        int customer_id FK
        int accommodation_id FK
        date check_in
        date check_out
        int guests
        decimal total_price
        enum status
        text notes
        timestamp created_at
    }
    
    TRANSACTIONS {
        int id PK
        int booking_id FK
        int customer_id FK
        decimal amount
        string payment_method
        enum status
        string transaction_reference UK
        timestamp created_at
    }
    
    PAYMENTS {
        int id PK
        int booking_id FK
        decimal amount
        enum payment_method
        enum status
        string transaction_id
        timestamp created_at
    }
```

**Relationships:**
- One customer can have many bookings
- One accommodation can have many bookings
- Each booking has one transaction
- Each booking has one payment record
- Users create bookings (audit trail)

---

## API Request Flow

### GET Request (Fetch Bookings)

```mermaid
sequenceDiagram
    participant Browser
    participant API Route
    participant DB Pool
    participant MySQL

    Browser->>API Route: GET /api/bookings?action=list
    API Route->>API Route: Parse query params
    API Route->>DB Pool: Get connection
    DB Pool->>MySQL: Execute SELECT with JOIN
    MySQL-->>DB Pool: Return result set
    DB Pool->>DB Pool: Release connection
    DB Pool-->>API Route: Return results
    API Route->>API Route: Format as JSON
    API Route-->>Browser: Response.json({ data: [...] })
    Browser->>Browser: Update React state
    Browser->>Browser: Re-render UI
```

### POST Request (Create Booking)

```mermaid
sequenceDiagram
    participant Browser
    participant API Route
    participant DB Pool
    participant MySQL

    Browser->>API Route: POST /api/bookings?action=create
    Note right of Browser: Body: customer_id, dates, etc.
    
    API Route->>API Route: Validate request body
    API Route->>API Route: Generate booking_number
    
    API Route->>DB Pool: Get connection
    
    API Route->>MySQL: BEGIN TRANSACTION
    
    API Route->>MySQL: INSERT INTO bookings
    MySQL-->>API Route: Return booking_id
    
    API Route->>MySQL: INSERT INTO transactions
    MySQL-->>API Route: Success
    
    API Route->>MySQL: INSERT INTO payments
    MySQL-->>API Route: Success
    
    API Route->>MySQL: COMMIT TRANSACTION
    
    DB Pool->>DB Pool: Release connection
    
    API Route->>MySQL: SELECT booking details
    MySQL-->>API Route: Return complete record
    
    API Route-->>Browser: Response.json({ success: true, id, ... })
    Browser->>Browser: Update UI
    Browser->>Browser: Show success modal
```

---

## Page Navigation Flow

```mermaid
graph LR
    A[Login Page] -->|Success| B[Dashboard]
    B --> C[Bookings List]
    B --> D[New Booking]
    B --> E[Customers]
    B --> F[Accommodations]
    B --> G[Transactions]
    B --> H[Reports]
    B --> I[Settings]
    
    D --> J[Payment Page]
    J --> K[Receipt Page]
    K --> B
    
    C --> L[Edit Booking]
    L --> C
    
    E --> M[Add/Edit Customer]
    M --> E
```

**Navigation:**
- All routes under `/dashboard` require authentication
- Booking flow: New → Payment → Receipt → Dashboard
- CRUD operations return to list view

---

## Component Hierarchy

```mermaid
graph TD
    A[Root Layout] --> B[Dashboard Layout]
    B --> C[Sidebar]
    B --> D[Navbar]
    B --> E[Page Content]
    
    E --> F[Dashboard Page]
    E --> G[Bookings Page]
    E --> H[New Booking Page]
    E --> I[Payment Page]
    E --> J[Customers Page]
    
    H --> K[Customer Form]
    H --> L[Room Grid]
    H --> M[Availability Grid]
    
    I --> N[Billing Panel]
    I --> O[Booking Complete Modal]
    
    J --> P[Customer Table]
    J --> Q[Customer Dialog]
```

**Component Structure:**
- **Layout components:** Shared UI (sidebar, navbar)
- **Page components:** Route-specific views
- **Feature components:** Booking flow, customer management
- **UI components:** Reusable buttons, inputs, modals

---

## Booking State Machine

```mermaid
stateDiagram-v2
    [*] --> Pending: Create Booking
    Pending --> Confirmed: Payment Processed
    Confirmed --> CheckedIn: Customer Arrives
    CheckedIn --> Completed: Customer Leaves
    
    Pending --> Cancelled: Cancel Before Payment
    Confirmed --> Cancelled: Cancel After Payment
    
    Cancelled --> [*]
    Completed --> [*]
    
    note right of Confirmed
        Payment recorded
        Transaction created
    end note
    
    note right of CheckedIn
        Customer on property
        Room occupied
    end note
```

**Booking States:**
1. **Pending:** Initial state, awaiting payment
2. **Confirmed:** Payment complete, reservation active
3. **Checked-in:** Customer arrived, using accommodation
4. **Completed:** Stay finished, ready for checkout
5. **Cancelled:** Booking cancelled (refund may apply)

---

## Error Handling Flow

```mermaid
graph TD
    A[User Action] --> B{Client Validation}
    B -->|Invalid| C[Show Form Error]
    C --> A
    
    B -->|Valid| D[Send API Request]
    D --> E{Server Reachable?}
    
    E -->|No| F[Show Connection Error]
    F --> G[Save to LocalStorage]
    G --> H[Retry Later]
    
    E -->|Yes| I{Request Valid?}
    I -->|No| J[Show Validation Error]
    J --> A
    
    I -->|Yes| K{DB Operation OK?}
    K -->|No| L[Show Database Error]
    L --> M[Log Error]
    M --> A
    
    K -->|Yes| N[Success Response]
    N --> O[Update UI]
    O --> P[Show Success Message]
```

**Error Handling:**
- **Client-side:** Form validation before submission
- **Network errors:** Save locally, retry when online
- **Server errors:** Display user-friendly messages
- **Database errors:** Log for debugging, show generic error

---

## Data Flow Summary

```mermaid
graph LR
    subgraph "Client"
        A[User Input] --> B[React Component]
        B --> C[State Management]
        C --> D[LocalStorage]
    end
    
    subgraph "API Layer"
        E[Next.js API Route]
        F[SQL Query Builder]
    end
    
    subgraph "Database"
        G[MySQL Tables]
    end
    
    C -->|HTTP POST/GET| E
    E --> F
    F -->|Prepared Statement| G
    G -->|Result Set| F
    F --> E
    E -->|JSON Response| C
    D -.->|Sync| E
```

**Flow:**
1. User interacts with React components
2. State updates trigger API calls
3. API routes execute database queries
4. Results flow back to frontend
5. UI updates with new data
6. LocalStorage syncs for offline use

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Server"
        A[Next.js App<br/>Port 3000]
        B[MySQL Database<br/>Port 3306]
    end
    
    subgraph "External Services"
        C[CDN<br/>Static Assets]
    end
    
    subgraph "Clients"
        D[Web Browser]
        E[Mobile Browser]
    end
    
    D -->|HTTPS| A
    E -->|HTTPS| A
    A -->|SQL| B
    A -->|Static Files| C
    C -->|Cached Assets| D
    C -->|Cached Assets| E
```

**Production Setup:**
- Next.js server handles all API + SSR
- MySQL database on same or separate server
- Static assets served via CDN
- HTTPS for secure communication

---

## Quick Reference: Key Files

| Component | File Path | Purpose |
|-----------|-----------|---------|
| Database Connection | `lib/db.js` | MySQL pool & query function |
| API Helper | `lib/api.ts` | Determine API base URL |
| Bookings API | `app/api/bookings/route.js` | CRUD for bookings |
| Customers API | `app/api/customers/route.js` | CRUD for customers |
| Dashboard Page | `app/(dashboard)/dashboard/page.tsx` | Main overview screen |
| New Booking | `app/(dashboard)/booking/new/page.tsx` | Create reservations |
| Payment Flow | `app/(dashboard)/booking/payment/page.tsx` | Process payments |
| Login | `app/login/page.tsx` | Authentication |

---

## Technology Stack Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React 19]
        B[Next.js 16]
        C[TypeScript]
        D[Tailwind CSS]
        E[shadcn/ui]
    end
    
    subgraph "Backend Layer"
        F[Next.js API Routes]
        G[Node.js]
        H[mysql2]
    end
    
    subgraph "Data Layer"
        I[MySQL 10.4]
        J[LocalStorage]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    
    B --> F
    F --> G
    G --> H
    H --> I
    
    A --> J
```

---

## Summary

This booking system uses a modern, scalable architecture:

- **Full-stack JavaScript:** Next.js handles both frontend and backend
- **Type-safe:** TypeScript for better developer experience
- **Responsive:** Tailwind CSS + shadcn/ui components
- **Real-time:** Direct MySQL queries via API routes
- **Offline-capable:** LocalStorage fallback
- **Secure:** Parameterized queries prevent SQL injection

For detailed code explanations, see [CODE_DOCUMENTATION.md](CODE_DOCUMENTATION.md)
