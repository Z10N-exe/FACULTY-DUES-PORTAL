# Requirements Document

## Introduction

This document defines the improvements for the NACOS UNIPORT Faculty of Computing web platform. The platform currently supports dues payment via Paystack and a basic admin dashboard. The improvements focus on adding a student authentication system, announcements management, a student dashboard with payment status, level/session support, a verification page, and overall UX polish — making the platform a complete, production-ready faculty portal.

## Glossary

- **Student**: A registered member of the Faculty of Computing at the University of Port Harcourt
- **Admin**: An authorized faculty official who manages the portal
- **Payment**: A dues transaction initiated and completed via Paystack
- **Announcement**: A notice or update posted by an Admin for all students to see
- **Dashboard**: The authenticated student view showing profile and payment status
- **Receipt**: A downloadable PDF document confirming a successful dues payment
- **Matric_No**: A unique student registration/matriculation number (e.g. CSC/2021/001)
- **Session**: The academic year for which dues are being paid (e.g. 2024/2025)
- **Level**: The student's current academic year level (100L, 200L, 300L, 400L, 500L)
- **Paystack**: The third-party payment gateway used to process dues transactions
- **Verification_Page**: A page that handles the Paystack callback and confirms payment status

---

## Requirements

### Requirement 1: Student Registration and Authentication

**User Story:** As a student, I want to register and log in to the portal, so that I can access my personal dashboard and payment history.

#### Acceptance Criteria

1. WHEN a student submits a registration form with valid matric number, name, email, department, level, and password, THE System SHALL create a new student account and redirect to the dashboard
2. WHEN a student attempts to register with a matric number that already exists, THE System SHALL reject the registration and display a descriptive error message
3. WHEN a student submits a login form with valid credentials, THE System SHALL authenticate the student and issue a JWT token stored in localStorage
4. WHEN a student submits a login form with invalid credentials, THE System SHALL return an error message without revealing which field is incorrect
5. WHEN a student's JWT token is expired or invalid, THE System SHALL redirect the student to the login page
6. THE Student_Auth_System SHALL hash all passwords using bcrypt before storing them in the database

---

### Requirement 2: Student Dashboard

**User Story:** As a student, I want a personal dashboard, so that I can view my profile, payment status, and access the dues payment form.

#### Acceptance Criteria

1. WHEN an authenticated student visits the dashboard, THE Dashboard SHALL display the student's full name, matric number, department, and level
2. WHEN a student has a payment with status "paid" for the current session, THE Dashboard SHALL display a "Dues Paid" badge with the payment reference
3. WHEN a student has no payment or a "pending" payment for the current session, THE Dashboard SHALL display a "Dues Pending" badge and a friendly "Complete Your Dues" button
4. WHEN a student clicks the "Complete Your Dues" button, THE System SHALL pre-fill the payment form with the student's existing profile data
5. THE Dashboard SHALL display the three most recent announcements from the Announcements collection

---

### Requirement 3: Dues Payment Flow

**User Story:** As a student, I want to pay my dues online, so that I can fulfill my membership obligation and receive an official receipt.

#### Acceptance Criteria

1. WHEN a student submits the payment form with all required fields, THE Payment_System SHALL initialize a Paystack transaction and redirect the student to the Paystack checkout page
2. WHEN a student attempts to pay dues for a matric number that already has a "paid" status for the current session, THE Payment_System SHALL reject the request and display a message indicating dues have already been paid
3. WHEN Paystack redirects the student back to the verification page with a valid reference, THE Verification_Page SHALL call the backend to verify the transaction and update the payment status to "paid"
4. WHEN payment verification succeeds, THE System SHALL redirect the student to their receipt page at `/receipt/:id`
5. WHEN payment verification fails, THE System SHALL display an error message and provide a link back to the payment form
6. THE Payment_System SHALL store the Paystack transaction reference, amount, student matric number, and timestamp in the Payment collection upon successful verification

---

### Requirement 4: Receipt Generation

**User Story:** As a student, I want to download an official PDF receipt after paying, so that I have proof of payment.

#### Acceptance Criteria

1. WHEN a student visits `/receipt/:id` with a valid payment ID, THE Receipt_Page SHALL display the student's full name, matric number, department, level, amount paid, payment reference, and academic session
2. WHEN a student visits `/receipt/:id` with an invalid or non-existent payment ID, THE Receipt_Page SHALL display a clear error message
3. WHEN a student clicks the "Download PDF" button, THE Receipt_Page SHALL generate and download a PDF of the receipt using html2pdf
4. THE Receipt_Page SHALL display the student's passport photo on the receipt

---

### Requirement 5: Announcements

**User Story:** As a student, I want to view announcements from the faculty, so that I stay informed about events and updates.

#### Acceptance Criteria

1. THE Home_Page SHALL display the three most recent announcements in a dedicated section, showing title, a short excerpt, and date
2. WHEN no announcements exist, THE Home_Page SHALL display a placeholder message indicating no announcements are available
3. WHEN an admin posts a new announcement with a title and body, THE Announcement_System SHALL save it to the database with a timestamp
4. WHEN an admin deletes an announcement, THE Announcement_System SHALL remove it from the database and it SHALL no longer appear on the home page

---

### Requirement 6: Admin Announcements Management

**User Story:** As an admin, I want to create and delete announcements, so that I can keep students informed.

#### Acceptance Criteria

1. WHEN an authenticated admin submits a new announcement form with a title and body, THE Admin_Panel SHALL save the announcement and display it in the announcements list
2. WHEN an authenticated admin clicks delete on an announcement, THE Admin_Panel SHALL prompt for confirmation and then remove the announcement
3. WHEN an unauthenticated request is made to the announcements management endpoints, THE Admin_Auth_System SHALL return a 401 Unauthorized response
4. THE Admin_Panel SHALL display all existing announcements in a list with title, date, and a delete button

---

### Requirement 7: Admin Payments Dashboard

**User Story:** As an admin, I want to view and filter all student payments, so that I can monitor dues collection.

#### Acceptance Criteria

1. WHEN an authenticated admin visits the dashboard, THE Admin_Panel SHALL display a table of all paid payments including student name, matric number, department, level, amount, date, and reference
2. WHEN an admin filters by department, THE Admin_Panel SHALL display only payments from that department
3. WHEN an admin searches by name or matric number, THE Admin_Panel SHALL display only matching records in real time
4. WHEN an admin clicks "Export CSV", THE Admin_Panel SHALL download a CSV file containing all currently filtered payment records
5. THE Admin_Panel SHALL display summary statistics: total number of paid students and total amount collected

---

### Requirement 8: Verification Page

**User Story:** As a student, I want to be automatically redirected to my receipt after payment, so that I don't have to manually check my payment status.

#### Acceptance Criteria

1. WHEN Paystack redirects to `/verify` with a `reference` query parameter, THE Verification_Page SHALL automatically call the backend verification endpoint
2. WHEN verification succeeds, THE Verification_Page SHALL redirect the student to `/receipt/:id`
3. WHEN verification fails or the reference is invalid, THE Verification_Page SHALL display an error state with a retry or home link
4. WHILE verification is in progress, THE Verification_Page SHALL display a loading indicator

---

### Requirement 9: Level and Session Support

**User Story:** As a student, I want to specify my academic level when paying dues, so that the receipt and records accurately reflect my year of study.

#### Acceptance Criteria

1. THE Payment_Form SHALL include a required dropdown for academic level with options: 100L, 200L, 300L, 400L, 500L
2. THE Payment_Form SHALL include a required dropdown for academic session (e.g. 2024/2025, 2025/2026)
3. WHEN a payment is saved, THE Payment_System SHALL store the selected level and session alongside the other payment fields
4. THE Receipt_Page SHALL display the student's level and academic session on the generated receipt

---

### Requirement 10: UI and UX Polish

**User Story:** As a user, I want a clean, professional, and responsive interface, so that the platform feels trustworthy and is easy to use on any device.

#### Acceptance Criteria

1. THE Platform SHALL be fully responsive and usable on mobile screens with a minimum width of 320px
2. WHEN a form is submitted, THE Platform SHALL display a loading state on the submit button to prevent duplicate submissions
3. WHEN an API error occurs, THE Platform SHALL display a human-readable error message to the user
4. THE Header SHALL include navigation links to the Home page and a "Pay Dues" page, using calm and welcoming label text rather than all-caps or aggressive call-to-action language
5. THE Platform SHALL use friendly, conversational button and label copy throughout (e.g. "Complete your dues", "View receipt", "Sign in" rather than "PAY NOW", "SUBMIT", "ACCESS PORTAL")
6. THE Platform SHALL use a white background with green (#16a34a) as the primary accent color for buttons, links, and highlights
7. THE Home_Page SHALL use a centered layout with a mixed serif/sans-serif heading style where the second word or phrase is styled in green italic to create visual contrast (e.g. "About *Us*", "Pay *Dues*")
8. THE Home_Page SHALL display the NACOS logo prominently in a circular frame with a soft shadow, positioned beside descriptive text in an "About" section
9. THE Platform SHALL use small outlined or filled green rounded buttons (pill shape) for primary calls to action
10. THE Features_Section SHALL display icons above short titles and one-line descriptions in a centered three-column row with no card borders — clean and minimal
5. THE Home_Page SHALL include an announcements section, a features section, and a stats section
