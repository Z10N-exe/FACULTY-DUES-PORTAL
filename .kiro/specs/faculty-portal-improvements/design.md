# Design Document: Faculty Portal Improvements

## Overview

This document describes the technical design for upgrading the NACOS UNIPORT Faculty of Computing portal. The existing codebase has a working Paystack payment flow, receipt PDF generation, and a basic admin dashboard. The improvements add student authentication, a student dashboard, announcements, a Paystack verification page, level/session fields, and a visual redesign matching the clean white + green professional theme shown in the reference.

The stack remains: React + Tailwind CSS (client & admin), Node.js + Express (server), MongoDB (database).

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT (Vite + React)             │
│  /           Home (announcements, about, features)       │
│  /pay        PaymentForm (level + session fields)        │
│  /verify     VerifyPage (Paystack callback handler)      │
│  /receipt/:id Receipt (PDF download)                     │
│  /login      StudentLogin                                │
│  /register   StudentRegister                             │
│  /dashboard  StudentDashboard (protected)                │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / REST
┌────────────────────────▼────────────────────────────────┐
│                     SERVER (Express)                     │
│  /api/payments    initialize, verify, receipt            │
│  /api/students    register, login, me                    │
│  /api/announcements  list, create, delete (admin)        │
│  /api/admin       login, payments                        │
└────────────────────────┬────────────────────────────────┘
                         │ Mongoose
┌────────────────────────▼────────────────────────────────┐
│                     MongoDB                              │
│  Collections: Payment, Student, Announcement            │
└─────────────────────────────────────────────────────────┘
```

---

## Visual Design System

### Color Palette
- Primary green: `#16a34a` (Tailwind `green-600`)
- Primary hover: `#15803d` (Tailwind `green-700`)
- Background: `#ffffff` white
- Surface/subtle: `#f9fafb` (Tailwind `gray-50`)
- Border: `#e5e7eb` (Tailwind `gray-200`)
- Text primary: `#111827` (Tailwind `gray-900`)
- Text muted: `#6b7280` (Tailwind `gray-500`)
- Text label: `#9ca3af` (Tailwind `gray-400`)

### Typography
- Headings: mix of `font-bold` (sans) with italic green span for accent word
  - Example: `About <span class="text-green-600 italic">Us</span>`
- Body: `text-gray-500 text-sm leading-relaxed`
- Labels: `text-[11px] font-bold text-gray-400 uppercase tracking-widest`

### Buttons
- Primary: `bg-green-600 text-white rounded-full px-6 py-2 hover:bg-green-700` (pill shape)
- Secondary: `border border-green-600 text-green-600 rounded-full px-6 py-2 hover:bg-green-50`
- Danger: `text-red-500 hover:text-red-700`

### Layout
- Max width: `max-w-6xl mx-auto px-6`
- Sections: generous vertical padding `py-16 md:py-24`
- Cards: white background, `border border-gray-100 rounded-2xl shadow-sm`

---

## Components and Interfaces

### Client Pages

#### Home Page (redesigned)
- Navbar with logo left, nav links right (Home, Pay Dues, Sign In)
- Hero / About section: centered heading `About Us` with green italic "Us", NACOS logo in circular frame left, descriptive text right, green pill CTA button
- Features row: 3 columns, icon + bold title + one-line description, no card borders
- Announcements section: latest 3 announcements as simple list items with date
- Stats bar: green background, 4 stats
- Footer: minimal, logos + copyright

#### PaymentForm (updated)
- Add `level` dropdown: 100L, 200L, 300L, 400L, 500L
- Add `session` dropdown: 2023/2024, 2024/2025, 2025/2026
- Pre-fill fields if student is logged in
- Softer copy: "Complete your dues" button

#### VerifyPage (new — `/verify`)
- Reads `?reference=` from URL on mount
- Calls `GET /api/payments/verify?reference=xxx`
- Shows spinner while loading
- On success → redirect to `/receipt/:id`
- On failure → error message + link back to `/pay`

#### StudentLogin (`/login`)
- Email + password form
- On success: store JWT in localStorage, redirect to `/dashboard`

#### StudentRegister (`/register`)
- Fields: firstName, surname, middleName, email, matric number, department, level, password
- On success: auto-login and redirect to `/dashboard`

#### StudentDashboard (`/dashboard`, protected)
- Shows student profile card
- Payment status badge: green "Dues Paid ✓" or amber "Dues Pending"
- If unpaid: "Complete your dues" pill button → `/pay`
- Shows 3 latest announcements

#### Receipt (updated)
- Add level and session fields to the displayed receipt
- Keep existing PDF download functionality

### Admin Pages

#### AdminDashboard (updated)
- Add "Announcements" tab alongside payments table
- Announcement form: title + body textarea + "Post Announcement" button
- Announcement list with delete button per item
- Softer copy throughout

---

## Data Models

### Student (new)
```js
{
  firstName:  String, required
  surname:    String, required
  middleName: String
  email:      String, required, unique
  regNo:      String, required, unique   // matric number
  department: String, required
  level:      String, required           // '100L' | '200L' | ...
  password:   String, required           // bcrypt hashed
  createdAt:  Date, default: Date.now
}
```

### Payment (updated — add level, session)
```js
{
  regNo:             String, required, unique
  email:             String, required
  firstName:         String, required
  surname:           String, required
  middleName:        String
  level:             String, required    // NEW
  session:           String, required    // NEW e.g. '2024/2025'
  department:        String, required
  passportUrl:       String, required
  amount:            Number, default: 2000
  paymentReference:  String
  status:            'pending' | 'paid', default: 'pending'
  createdAt:         Date, default: Date.now
}
```

### Announcement (new)
```js
{
  title:     String, required
  body:      String, required
  createdAt: Date, default: Date.now
}
```

---

## API Endpoints

### Students
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/students/register` | None | Register new student |
| POST | `/api/students/login` | None | Login, returns JWT |
| GET | `/api/students/me` | Student JWT | Get current student profile + payment status |

### Payments (existing, updated)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/payments/initialize` | None | Init Paystack transaction |
| GET | `/api/payments/verify` | None | Verify Paystack reference |
| GET | `/api/payments/receipt/:id` | None | Get receipt by payment ID |

### Announcements
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/announcements` | None | Get latest 10 announcements |
| POST | `/api/announcements` | Admin JWT | Create announcement |
| DELETE | `/api/announcements/:id` | Admin JWT | Delete announcement |

### Admin (existing)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/admin/login` | None | Admin login |
| GET | `/api/admin/payments` | Admin JWT | Get all paid payments |

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Property 1: Duplicate payment rejection
*For any* matric number that already has a payment with status "paid", submitting a new payment initialization request for that same matric number should always be rejected with an error response.
**Validates: Requirements 3.2**

Property 2: Password never stored in plaintext
*For any* student registration, the password field stored in the database should never equal the plaintext password submitted in the registration form.
**Validates: Requirements 1.6**

Property 3: Unauthenticated admin routes always return 401
*For any* request to a protected admin endpoint (announcements POST/DELETE, payments GET) made without a valid JWT, the response status should always be 401.
**Validates: Requirements 6.3**

Property 4: Verification redirect consistency
*For any* successful Paystack verification, the payment record's status in the database should be "paid" and the response should include the payment ID used to construct the receipt URL.
**Validates: Requirements 3.3, 3.4, 3.6**

Property 5: Receipt completeness
*For any* paid payment record, the receipt page should display all required fields: full name, matric number, department, level, session, amount, and payment reference.
**Validates: Requirements 4.1, 9.4**

---

## Error Handling

- All API routes wrap logic in try/catch and return structured `{ message: string }` JSON errors
- MongoDB duplicate key errors (code 11000) on `regNo` return 400 with a clear message
- Invalid JWT returns 401; expired JWT returns 401 with redirect hint
- Paystack API failures return 502 with a user-friendly message
- Client-side: all axios calls catch errors and display `err.response?.data?.message` in a red alert box

---

## Testing Strategy

### Unit Tests
- Password hashing: verify bcrypt.compare returns true for correct password
- Duplicate regNo: verify 400 response when same matric number pays twice
- Receipt fetch: verify 404 for non-existent payment ID
- Announcement CRUD: verify create returns 201, delete returns 200, list returns array

### Property-Based Tests
Using **fast-check** (JavaScript PBT library), minimum 100 runs per property:

- **Property 1**: Generate random regNo strings, create a paid payment, then attempt a second initialization — always expect 400
- **Property 2**: Generate random password strings, register a student, fetch the DB record — stored password should never equal input
- **Property 3**: Generate random tokens (invalid JWTs), hit protected endpoints — always expect 401
- **Property 4**: For any valid Paystack reference flow, after verify the DB status equals "paid"
- **Property 5**: For any payment record with all fields populated, the receipt endpoint returns all required fields

Tag format: `// Feature: faculty-portal-improvements, Property N: <property text>`
