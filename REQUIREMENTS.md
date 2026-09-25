# B12-A11_category-AI / Botbari Platform
### Requirements Document & Project Specification

🚩 **We Will Notify Requirement update here if we made any**

## Botbari – AI & Software Solutions Platform
### Job Task

**Dear Candidates,**  
We are pleased to inform you that you have successfully passed the first round of the selection process!! 🎉  
Your application and skills have impressed us, and we are excited to move forward with you in the next stages.  
This project is designed to assess your skills, creativity, and problem-solving abilities. It will help us understand how you approach challenges and your ability to deliver high-quality solutions.

---

### Project Overview & Discussion

#### What is the Project?
**Botbari** is an AI & Software Solutions Agency platform where businesses/clients can explore cutting-edge AI services (AI Chatbots, Custom AI Assistants, AI SaaS, 3D Web/Apps), order custom AI products, schedule consultations, track active project milestones, and make secure digital payments, while administrators manage service catalogs, client orders, and platform revenue.

#### Why Should We Develop This Project?
- To bridge the gap between businesses and advanced AI automation solutions.
- To reduce friction in hiring AI specialists by providing transparent pricing, structured project milestones, and automated workflows.
- To enable seamless online consultation booking, transparent project tracking, and secure digital invoicing.
- To provide administrators with complete oversight of service offerings, client inquiries, financial analytics, and order fulfillment.

#### How the System Works (Workflow)
1. **Client (Business User)** registers, browses specialized AI chatbots and software services, and submits an order/inquiry or books a consultation.
2. **Admin** reviews client orders, assigns pricing/milestones, verifies requirements, and approves or rejects project requests.
3. **Client** reviews the approved project quote, completes payment via Stripe, and tracks real-time progress.
4. **Admin** monitors the entire platform, manages service catalogs, handles user roles, and oversees platform revenue analytics.

---

### ✅ Ensure the Following to Get 100% Marks
*(Exactly following the assignment standard)*

* At least **20 meaningful commits (client)** & **12 meaningful commits (server)**.
* **README** must contain project name, purpose, features, live URL, and packages used.
* **Firebase keys** must be stored in environment variables (`.env.local`).
* **MongoDB credentials** and **JWT secret / Stripe secret** must be secured using `.env`.
* **UI must be polished, aligned, and recruiter-friendly** (modern aesthetics, glassmorphism, consistent spacing).
* Any copied concept from assignments/modules = **0 marks**.
* Deployment must not show any **CORS / 404 / 504** issues.
* **Private routes must not redirect after reload** (must maintain auth state via loading/persisted session).
* Firebase authorized domain must be updated.

---

### 🖥️ Layout & Page Structure Requirements

#### Navbar Requirements
* Display **Logo & Website Name** (Botbari)
* Navigation links: **Home**, **Services**, **Work (Portfolio)**, **About**, **Contact**, **Blog**
* Multi-level dropdown menus for **Services** (AI Chatbot, Custom AI, AI SaaS, 3D Web) and **Resources** (Case Studies, Team, Partners)
* Auth-based navigation:
  * If logged out: **Login / Register**
  * If logged in: **Dashboard** + **Profile dropdown**
* Sticky navbar with DaisyUI / Tailwind Glassmorphism (`backdrop-blur-md`)
* Action buttons: **"Book Consultation"** & **"Get a Quote"** (WhatsApp direct action)
* Responsive on mobile/tablet/desktop (Hamburger drawer menu)

#### Footer Requirements
* About Botbari platform & capabilities
* Quick links (Services, Case Studies, About, Contact)
* Contact information (Email, Phone: `+8801754-958008`, Address: Mirpur, Dhaka)
* Social media icons (LinkedIn, Upwork, YouTube, Facebook, Instagram, and **new X logo**, not old Twitter bird)
* Legal & Compliance section (Trade License, Joint Stock link)
* Copyright section: `© 2026 Botbari. All rights reserved.`

#### Main Layout
* Full-width responsive layout
* Consistent luxury dark/light hybrid color theme
* Common layout for all public pages
* Dashboard layout fully separated (with sidebar navigation)

#### Possible Pages
1. Home
2. Services Listing (`/services`)
3. Service Details (`/services/:id` or `/services/:slug`)
4. Portfolio / Case Studies Listing (`/new-work`)
5. Case Study Details (`/new-work/:id`)
6. Order / Custom Project Request (`/order`)
7. Schedule Consultation (`/schedule`)
8. About Us (`/about`)
9. Contact (`/contact`)
10. Login
11. Register
12. Dashboard (Admin, Client)
13. Payment / Checkout (`/checkout/:orderId`)
14. Payment History
15. Profile Settings
16. Error Page (404)

---

### 🔐 Authentication System Requirements

#### Register Features
* Register as **Client (Business)**
* Form fields:
  * Name
  * Email
  * Password (with validation: min 6 chars, uppercase, special character)
  * Phone Number
  * Company Name (Optional)
* Data stored in MongoDB
* Firebase authentication (Email & Password)
* Save user profile to database with default role: `client`

#### Login / Social Login
* Email & password login
* **Google login** (must be implemented, default role: `client`)
* JWT token generation upon login (stored in HTTP-only cookie or local storage)
* Role-based routing:
  * Clients → **Client Dashboard**
  * Admins → **Admin Dashboard**

---

### 🏠 Home Page Requirements

#### Must Include:
1. **Hero section**:
   * Catchy headline with modern gradient text, dynamic 3D/AI graphics, and dual CTAs ("Explore Services", "Schedule Consultation").
2. **Dynamic section: Core AI Services & Pricing** (Auto fetch from backend):
   * 4 main category cards: AI Chatbot (From $259), AI SaaS (From $450), Custom AI Assistant (From $650), AI & 3D Web/Apps (From $450).
   * Hover lift animation, "Learn More" & "Order Now" triggers.
3. **Dynamic section: Specialized AI Solutions & Chatbots** (Auto fetch from backend):
   * Highlighting active specialized AI bots (Healthcare Bot, Sales Bot, Lead Gen Bot, Finance Bot, Auto-Order Bot) with real-time pricing and delivery timeline badges.
   *(Note: The "Unique Digital Solutions for a Better Tomorrow" / SUSTHO Card blog section is completely excluded).*
4. **Animation with Framer Motion**:
   * Minimum 2 distinct animations (e.g., hero element fade-and-slide, interactive service card hover glow/lift).

#### Two Extra Sections:
1. **How the Platform Works (3 Steps Visual Grid)**:
   * Step 1: *Choose Your AI Solution or Consultation*
   * Step 2: *Custom Engineering & Milestone Tracking*
   * Step 3: *Instant Deployment & 24/7 Automation*
2. **Why Choose Us (Features Section)**:
   * Highlighting Creative Thinking, Strategic Business Consultation, Multilingual Reach, and Scalable Infrastructure.

---

### 📊 Dashboard Layout (Admin & Client)

---

#### 1. Client Dashboard Requirements

##### Dashboard Pages:
* **My Orders / Projects**: (Clients can view their submitted service requests and project status)
* **Custom Project Request**: (Clients can submit a new custom AI project or chatbot specification)
* **Project Milestones**: (Clients can track the progress of ongoing active projects)
* **Payments & Invoices**: (Clients can view their transaction history and pay pending invoices)
* **Profile Settings**: (Clients can update their name, company, phone, and photoURL)

##### Client Functionalities:
1. **Create / Update / Delete Project Orders**:
   * 📝 **Submit Project Request**:
     * Client fills out a form (Service category, sub-bot type, budget range, requirements description, delivery timeframe).
     * Click *Submit Order*.
     * System saves in MongoDB with status: `Pending` (for admin review).
   * ✏️ **Update Project Order**:
     * Allows client to edit order requirements while status is still `Pending` (shows default saved values).
   * ❌ **Cancel / Delete Order**:
     * Allows client to delete an order if it has not yet been approved.
     * Confirmation popup appears before deletion.
2. **Approve Quote & Complete Payment**:
   * When Admin approves the order and assigns the final quotation/milestone amount, the client receives an **"Accept & Pay"** button.
   * Clicking redirects to the checkout page (**Stripe payment integration**).
   * After successful payment:
     * Order status changes to `In Progress` / `Paid`.
     * Payment record is generated and visible under *Payments & Invoices*.

---

#### 2. Admin Dashboard Requirements

##### Dashboard Pages:
* **Service Management Page**:
  * Admin can create new AI services, update pricing and delivery timelines, or deactivate services.
* **Order & Inquiry Management Page**:
  * Admin can review all incoming client orders and consultation requests.
  * Admin can **Approve** (set final quote price and mark as approved) or **Reject** orders with reason notes.
* **User Management Page**:
  * Admin can view all registered users (Name, email, avatar, role, registration date).
  * Admin can modify user roles (e.g., switch between `Client` and `Admin`).
  * Admin can delete accounts in case of spam or violations.
* **Frontend Content Management (Full CMS Control)**:
  * Admin can manage all content displayed on the frontend:
    * **Hero & Site Settings**: Edit hero text, announcement tagline, contact info (phone, email, WhatsApp).
    * **Services Catalog**: Create, edit, delete core AI services with pricing, features, and delivery days.
    * **Specialized Chatbots**: Add and modify chatbot product cards (Healthcare, Sales, Auto Order).
    * **Portfolio / Projects**: Add, update, delete client case studies (ABC24, TaxBot, CCcalculator) with status badges and live URLs.
    * **Blogs & FAQs**: Write, publish, edit blog posts and manage FAQ accordions.
* **Reports & Financial Analytics Page**:
  * Admin can view total platform revenue and earnings.
  * Visual interactive charts (e.g., Recharts) showing monthly revenue breakdown and service order distribution.
  * Full transaction table displaying all successful Stripe payments.

---

### 🛠️ Additional Requirements

#### Loading Page Requirements
* Full-screen spinner / branded pulsing loader.
* Must be shown during data fetch and authentication state verification.

#### Error Page Requirements
* 404 design with clean illustration/vector.
* Button to navigate back to Home.
* Recruiter-friendly, polished UI.

#### Other Requirements
* Protected routes for all dashboard pages.
* JWT role verification (prevents unauthorized URL access).
* Fully responsive across mobile, tablet, and desktop devices.

---

### 🎨 UI Design Requirements
* **Unique design** (modern AI aesthetic, deep slate/indigo accents, glassmorphism cards).
* Consistent typography and heading styles across all pages.
* Equal image aspect ratios for services and case studies.
* Unified button styling across sections.
* Clean spacing, padding, and alignment.
* Interactive charts & graphs for the Admin Dashboard.
* Profile sidebar section included in all dashboards.

---

### 🧩 Challenge Requirements
*(All 4 challenges must be implemented)*

1. **Search & Sort Features**:
   * Search services by name or category (Apply in `/services` listing page).
   * Sort services by price (Low to High / High to Low) or delivery timeframe.
2. **Pagination (1 page only)**:
   * Implement backend/frontend pagination on the Services or Case Studies listing page.
3. **Token Verification**:
   * JWT middleware verifying:
     * Role (Client vs. Admin)
     * Access level
     * Token expiration (auto-logout on expired token)
4. **Advanced Filter**:
   * Filter services by Price Range slider/presets, Bot Category (Website, Healthcare, FinTech, Automation), and Delivery Days.

---

### ⭐ Optional Requirements (2–5)
* **Live AI Chatbot Widget**: Interactive chat assistant floating on the website.
* **Consultation Booking System**: Interactive time-slot scheduler syncing with calendar.
* **Direct WhatsApp Integration**: Floating button with dynamically pre-filled inquiry text.
* **Customer Reviews & Ratings**: Client rating and testimonial submission for completed projects.
* **PDF Invoice Generation**: Downloadable receipt/invoice for completed Stripe payments.

---

### 📤 What to Submit
* **Admin Email**: `admin@botbari.com` (or registered demo admin email)
* **Admin Password**: `Admin123!` (or designated demo password)
* **Live Site Link**: Client live URL (Vercel / Firebase Hosting)
* **GitHub Repository (Client)**: Link to Client repo (min. 20 meaningful commits)
* **GitHub Repository (Server)**: Link to Server repo (min. 12 meaningful commits)
