# Implementation Plan: Faculty Portal Improvements

## Overview

Incremental implementation of all improvements to the NACOS UNIPORT portal. Each task builds on the previous. Backend changes come first, then client pages, then admin panel updates.

## Tasks

- [x] 1. Update Payment model and server routes
  - Add `session` (required, string e.g. '2024/2025') field to `server/models/Payment.js` — `level` already exists
  - Update `initializePayment` in `server/controllers/paymentController.js` to read and save `session` from `req.body`
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 2. Create Announcement model and API routes
  - [x] 2.1 Create `server/models/Announcement.js` with `title`, `body`, `createdAt` fields
    - _Requirements: 5.3_
  - [x] 2.2 Create `server/controllers/announcementController.js` with `getAnnouncements`, `createAnnouncement`, `deleteAnnouncement`
    - `getAnnouncements`: return latest 10, sorted by createdAt desc, no auth required
    - `createAnnouncement`: admin JWT required, return 201
    - `deleteAnnouncement`: admin JWT required, return 200
    - _Requirements: 5.3, 5.4, 6.1, 6.2_
  - [x] 2.3 Create `server/routes/announcementRoutes.js` — GET public, POST/DELETE protected by `authMiddleware`
    - Register route in `server/index.js` as `/api/announcements`
    - _Requirements: 6.3_

- [x] 3. Create Student model and auth routes
  - [x] 3.1 Create `server/models/Student.js` with `firstName`, `surname`, `middleName`, `email`, `regNo`, `department`, `level`, `password` (bcrypt hashed)
    - _Requirements: 1.6_
  - [x] 3.2 Create `server/controllers/studentController.js` with `registerStudent`, `loginStudent`, `getMe`
    - `registerStudent`: hash password with bcrypt, reject duplicate regNo/email with 400
    - `loginStudent`: compare password, return JWT
    - `getMe`: return student profile + latest payment status for current session
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6_
  - [x] 3.3 Create `server/middleware/studentAuthMiddleware.js` — verify student JWT, attach student to `req.student`
    - _Requirements: 1.5_
  - [x] 3.4 Create `server/routes/studentRoutes.js` and register in `server/index.js` as `/api/students`
    - _Requirements: 1.1, 1.3_

- [x] 4. Checkpoint — ensure server starts and all routes respond correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Add Verify page to client
  - Create `client/src/pages/Verify.jsx`
    - On mount, read `?reference=` from URL using `useSearchParams`
    - Call `GET /api/payments/verify?reference=xxx`
    - Show spinner while loading
    - On success redirect to `/receipt/:id` using `payment._id` from response
    - On failure show error message with link back to `/pay`
  - Register route `/verify` in `client/src/App.jsx`
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 6. Add Student Login and Register pages to client
  - [x] 6.1 Create `client/src/pages/StudentLogin.jsx`
    - Email + password form, POST to `/api/students/login`
    - Store JWT in localStorage as `studentToken`
    - Redirect to `/dashboard` on success
    - Show inline error on failure
    - _Requirements: 1.3, 1.4_
  - [x] 6.2 Create `client/src/pages/StudentRegister.jsx`
    - Fields: firstName, surname, middleName, email, regNo, department, level, password
    - POST to `/api/students/register`
    - Store JWT in localStorage as `studentToken`, redirect to `/dashboard` on success
    - _Requirements: 1.1, 1.2_
  - [x] 6.3 Register `/login` and `/register` routes in `client/src/App.jsx`

- [x] 7. Create Student Dashboard page
  - Create `client/src/pages/StudentDashboard.jsx`
    - Fetch `/api/students/me` with `studentToken` from localStorage
    - If no token, redirect to `/login`
    - Display profile card: name, matric number, department, level
    - Payment status badge: green "Dues Paid ✓" if paid, amber "Dues Pending" if not
    - If unpaid: pill button "Complete your dues" → `/pay`
    - Display 3 latest announcements fetched from `/api/announcements`
  - Register `/dashboard` route in `client/src/App.jsx`
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 8. Update PaymentForm with level, session fields and pre-fill
  - Add `level` dropdown (100L–500L) to `client/src/pages/PaymentForm.jsx`
  - Add `session` dropdown (2023/2024, 2024/2025, 2025/2026)
  - If `studentToken` exists in localStorage, fetch `/api/students/me` and pre-fill name, email, regNo, department, level
  - Update form submission to include `level` and `session` in FormData
  - Change submit button copy to "Complete your dues"
  - _Requirements: 3.1, 9.1, 9.2, 2.4_

- [x] 9. Update Receipt page with level and session
  - Add `level` field to the details grid in `client/src/pages/Receipt.jsx`
  - Replace hardcoded "2023 / 2024" with `payment.session` from the API response
  - _Requirements: 4.1, 9.4_

- [x] 10. Redesign Home page to match reference style
  - Rewrite `client/src/pages/Home.jsx`:
    - Navbar: logo left, nav links right (Home, Pay Dues, Sign In) — pill-shaped "Pay Dues" green button
    - About section: centered heading `About <span italic green>Us</span>`, NACOS logo in circular shadow frame left, text + green pill CTA right
    - Features row: 3 columns, icon + bold title + one-line description, no card borders, centered
    - Announcements section: fetch `/api/announcements`, display latest 3 as simple list with date; show placeholder if empty
    - Stats bar: green background, 4 stats
    - Footer: minimal
  - _Requirements: 5.1, 5.2, 10.1, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10_

- [x] 11. Update Header component
  - Update `client/src/components/Header.jsx` to add nav links: Home, Pay Dues (pill button), Sign In
  - If `studentToken` exists in localStorage show "Dashboard" link instead of "Sign In"
  - _Requirements: 10.4_

- [x] 12. Add Announcements tab to Admin panel
  - [x] 12.1 Add announcements state and fetch to `admin/src/pages/AdminDashboard.jsx`
    - Fetch `GET /api/announcements` on mount
    - _Requirements: 6.4_
  - [x] 12.2 Add announcement form (title input + body textarea + "Post Announcement" button)
    - POST to `/api/announcements` with admin JWT
    - Refresh list on success
    - _Requirements: 6.1_
  - [x] 12.3 Add announcement list with delete button per item
    - DELETE `/api/announcements/:id` with admin JWT on click, with confirmation
    - _Requirements: 6.2_
  - [x] 12.4 Soften all button copy in admin panel (e.g. "Sign out", "Export records", "Access portal")
    - _Requirements: 10.5_

- [x] 13. Register AdminLogin route in admin App.jsx
  - Update `admin/src/App.jsx` to add `/login` route pointing to `AdminLogin` page and keep `*` fallback pointing to `AdminDashboard`
  - _Requirements: 6.3_

- [x] 14. Final checkpoint — ensure all features work end to end
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- All protected client routes check localStorage for a token and redirect if missing
- The `session` field on Payment defaults to the current academic year
- Paystack callback URL in `.env` must be set to `CLIENT_URL/verify`
- `level` field already exists in the Payment model — only `session` needs to be added in Task 1
