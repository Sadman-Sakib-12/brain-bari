# Backend Team Work Distribution (২ জন ডেভেলপারের কাজের ভাগ)
### Botbari Platform – Server Side Task Breakdown & Collaboration Plan

এই গাইড অনুযায়ী আপনি আপনার ২ জন ব্যাকএন্ড ডেভেলপারকে সুনির্দিষ্টভাবে কাজ ভাগ করে দিতে পারবেন, যাতে কোনো কনফ্লিক্ট ছাড়া দ্রুততম সময়ে প্রজেক্ট সম্পন্ন হয়।

---

## 👥 টিম রোল ও দায়িত্বের সারসংক্ষেপ

```
                            [ MongoDB Atlas Database ]
                                        ▲
                                        │
           ┌────────────────────────────┴────────────────────────────┐
           │                                                         │
   [ Backend Dev 1 ]                                         [ Backend Dev 2 ]
   • Server & DB Setup                                       • Order Management (CRUD)
   • Auth & JWT Verification (Challenge 3)                   • Stripe Payment Integration
   • User Management API                                     • Consultation Bookings API
   • Services API (Search, Sort, Filter, Pagination)         • Financial Analytics & Reports
   • Chatbots & Portfolio CMS APIs
```

---

## 💻 Backend Developer 1: Core Architecture, Auth & Dynamic CMS

> **দায়িত্বের সারসংক্ষেপ:** সার্ভারের মূল সেটআপ, অথেনটিকেশন, সিকিউরিটি এবং অ্যাডমিন থেকে ফ্রন্টএন্ডে পুশ করার মতো সার্ভিস ও কন্টেন্ট ম্যানেজমেন্ট API।

### নির্দিষ্ট কাজসমূহ (Tasks):

#### ১. প্রজেক্ট সেটআপ ও ডাটাবেজ কানেকশন:
- Express.js, CORS, Dotenv, Cookie-Parser এবং MongoDB কানেকশন সেটআপ করা।
- `.env.example` তৈরি করা (যাতে Dev 2 সহজেই একই কনফিগ ব্যবহার করতে পারে)।

#### ২. Authentication & JWT Middleware (Challenge 3):
- `POST /api/auth/jwt`: ইউজার লগইন করলে সিক্রেট কি দিয়ে JWT টোকেন জেনারেট করা।
- `POST /api/auth/logout`: লগআউট হলে টোকেন ক্লিয়ার করা।
- **Middleware তৈরি:**
  - `verifyToken`: রিকোয়েস্ট হেডারের Bearer টোকেন যাচাই করবে।
  - `verifyAdmin`: ডাটাবেজ চেক করে ইউজারের রোল `admin` কি না তা নিশ্চিত করবে (ভুল হলে 403 Forbidden)।

#### ৩. User Management APIs:
- `POST /api/users`: Firebase থেকে রেজিস্টার্ড ইউজারের প্রোফাইল MongoDB-তে সেভ করা (ডিফল্ট রোল: `client`)।
- `GET /api/users`: অ্যাডমিনের জন্য সব রেজিস্টার্ড ইউজারের তালিকা ফেচ করা (Admin Only)।
- `PATCH /api/users/:id/role`: ইউজারের রোল পরিবর্তন করা (`client` থেকে `admin` বা ভাইস-ভার্সা)।
- `DELETE /api/users/:id`: কোনো ক্ষতিকর অ্যাকাউন্ট ডিলিট করা।

#### ৪. Services API (Challenge 1, 2, 4 বাস্তবায়ন):
- `GET /api/services`:
  - **Search:** নাম বা ক্যাটাগরি দিয়ে ফিল্টার (`?search=ai`).
  - **Sort:** প্রাইস ও ডেলিভারি টাইম অনুযায়ী সর্টিং (`?sort=price_asc`, `?sort=price_desc`).
  - **Filter:** ক্যাটাগরি ও প্রাইস রেঞ্জ অনুযায়ী ফিল্টারিং (`?category=ai-chatbot&minPrice=200&maxPrice=500`).
  - **Pagination:** পেজ নম্বর ও লিমিট হ্যান্ডলিং (`?page=1&limit=6`).
- `GET /api/services/:id`: একটি নির্দিষ্ট সার্ভিসের ডিটেইলস।
- `POST /api/services`: অ্যাডমিন প্যানেল থেকে নতুন সার্ভিস তৈরি (Admin Only)।
- `PATCH /api/services/:id`: সার্ভিস এডিট বা প্রাইস আপডেট (Admin Only)।
- `DELETE /api/services/:id`: সার্ভিস রিমুভ করা (Admin Only)।

#### ৫. Full Frontend CMS APIs (ফ্রন্টএন্ডের সবকিছু কন্ট্রোল করার API):
Admin Panel থেকে ফ্রন্টএন্ডের প্রতিটি সেকশন যেন ডায়নামিকালি কন্ট্রোল করা যায়, তার জন্য Dev 1 নিচের CMS এন্ডপয়েন্টগুলো তৈরি করবে:

* **Site Settings & Hero Section API (`/api/cms/settings`):**
  - `GET /api/cms/settings`: ফ্রন্টএন্ডে হিরো সেকশনের হেডলাইন, সাব-হেডিং, ট্যাগস, ফোন নম্বর, ইমেইল এবং সোশ্যাল লিংক শো করানোর জন্য।
  - `PATCH /api/cms/settings`: অ্যাডমিন প্যানেল থেকে হোমপেজের টেক্সট, কন্টাক্ট ইনফো এবং সেটিংস আপডেট করা (Admin Only)।

* **Specialized Chatbots CMS (`/api/cms/chatbots`):**
  - `GET /api/cms/chatbots`: হোমপেজের বিশেষায়িত চ্যাটবট কার্ডস ফেচ করা।
  - `POST /api/cms/chatbots`: অ্যাডমিন নতুন চ্যাটবট অ্যাড করবে (Name, Delivery Time, Price, Tags, Desc)।
  - `PATCH /api/cms/chatbots/:id`: চ্যাটবট এডিট বা প্রাইস পরিবর্তন করা।
  - `DELETE /api/cms/chatbots/:id`: চ্যাটবট রিমুভ করা।

* **Portfolio & Case Studies CMS (`/api/cms/portfolio`):**
  - `GET /api/cms/portfolio`: প্রজেক্টস ও কেস স্টাডিজ ফেচ করা।
  - `POST /api/cms/portfolio`: অ্যাডমিন নতুন প্রজেক্ট (ABC24, TaxBot ইত্যাদি) ইমেজ ও লাইভ লিংকসহ অ্যাড করবে।
  - `PATCH /api/cms/portfolio/:id`: প্রজেক্ট এডিট করা।
  - `DELETE /api/cms/portfolio/:id`: প্রজেক্ট ডিলিট করা।

* **Blog & Resources CMS (`/api/cms/blogs`):**
  - `GET /api/cms/blogs`: ব্লগের আর্টিকেলের তালিকা।
  - `POST /api/cms/blogs`: অ্যাডমিন নতুন ব্লগ আর্টিকেল লিখবে ও পাবলিশ করবে।
  - `PATCH /api/cms/blogs/:id` & `DELETE /api/cms/blogs/:id`: ব্লগ এডিট বা ডিলিট।

* **Why Choose Us & FAQs CMS (`/api/cms/faqs`):**
  - `GET /api/cms/faqs` ও `POST /api/cms/faqs`: কন্টাক্ট পেজের FAQ এবং হোমপেজের ফিচার পিলার্স অ্যাড ও এডিট করার API।

---

## 💻 Backend Developer 2: Order Lifecycle, Stripe Payments & Analytics

> **দায়িত্বের সারসংক্ষেপ:** ক্লায়েন্টের অর্ডার সাবমিশন, অ্যাডমিনের কোটেশন অ্যাপ্রুভাল, Stripe পেমেন্ট গেটওয়ে এবং অ্যাডমিনের আয়ের রিপোর্ট/চার্টস।

### নির্দিষ্ট কাজসমূহ (Tasks):

#### ১. Order Management APIs (ক্লায়েন্ট ও অ্যাডমিন ফ্লো):
- `POST /api/orders`: ক্লায়েন্ট নতুন প্রজেক্ট/চ্যাটবট অর্ডার রিকোয়েস্ট সাবমিট করবে (ডাটাবেজে স্ট্যাটাস থাকবে: `Pending`)।
- `GET /api/orders/my-orders`: নির্দিষ্ট ক্লায়েন্টের ইমেইল অনুযায়ী তার পূর্বের সব অর্ডার লিস্ট দেখাবে।
- `PATCH /api/orders/:id`: অর্ডার পেন্ডিং থাকা অবস্থায় ক্লায়েন্ট তার চাহিদা এডিট করতে পারবে।
- `DELETE /api/orders/:id`: পেন্ডিং অর্ডার ক্লায়েন্ট চাইলে ক্যানসেল করতে পারবে।
- `GET /api/orders/admin`: অ্যাডমিনের জন্য সকল ক্লায়েন্টের অর্ডারের তালিকা ফেচ করা (Admin Only)।
- `PATCH /api/orders/:id/quote`:
  - অ্যাডমিন অর্ডারটি পর্যালোচনা করে কোটেশন প্রাইস ($) বসাবে এবং স্ট্যাটাস `Approved` করবে (বা রিজেক্ট নোটসহ `Rejected` করবে)।

#### ২. Stripe Payment Gateway Integration:
- `POST /api/payments/create-payment-intent`:
  - ক্লায়েন্ট যখন অ্যাডমিনের দেওয়া কোটেশন অ্যাপ্রুভ করবে, তখন Stripe SDK ব্যবহার করে ক্লায়েন্ট সিক্রেট (`clientSecret`) জেনারেট করবে।
- `POST /api/payments`:
  - পেমেন্ট সফল হওয়ার পর পেমেন্টের রেকর্ড সংরক্ষণ করা (`transactionId`, `amount`, `orderId`, `clientEmail`, `date`)।
  - সংশ্লিষ্ট অর্ডারের স্ট্যাটাস স্বয়ংক্রিয়ভাবে `In Progress` অথবা `Paid` এ আপডেট করে দেওয়া।
- `GET /api/payments/history`: ক্লায়েন্টের নিজের পেমেন্ট হিস্ট্রি।
- `GET /api/payments/admin-all`: অ্যাডমিনের জন্য প্ল্যাটফর্মের সমস্ত লেনদেনের হিস্ট্রি।

#### ৩. Consultation Booking API:
- `POST /api/bookings`: `/schedule` পেজ থেকে ক্লায়েন্টের মিটিং শিডিউল টাইম-স্লট ও ডিটেইলস ডাটাবেজে সংরক্ষণ করা।
- `GET /api/bookings`: অ্যাডমিন তার ক্যালেন্ডারের সব বুকিং দেখতে পারবে।

#### ৪. Reports & Financial Analytics API:
- `GET /api/analytics/admin-stats` (MongoDB Aggregation ব্যবহার করে):
  - প্ল্যাটফর্মের মোট আয় (Total Revenue)।
  - মোট কমপ্লিট হওয়া অর্ডার ও পেন্ডিং অর্ডারের সংখ্যা।
  - মাসভিত্তিক আয়ের চার্ট ডাটা (Monthly Revenue Breakdown — যা Recharts-এ শো হবে)।

---

## 🤝 দুই ডেভেলপারের সমন্বয়ের নিয়মাবলি (Collaboration Rules)

### ১. গিট ব্রাঞ্চ স্ট্র্যাটেজি (Git Workflow):
* **মেইন ব্রাঞ্চ (`main`):** শুধুমাত্র টেস্টেড ও রান হওয়া কোড থাকবে।
* **Developer 1 ব্রাঞ্চ:** `feature/auth-services-cms`
* **Developer 2 ব্রাঞ্চ:** `feature/orders-stripe-analytics`
* একে অপরের কোডে সরাসরি কাজ করবে না; কাজ শেষ হলে পুল রিকোয়েস্ট (PR) দিয়ে মার্জ করবে।

### ২. শেয়ার্ড ডাটাবেজ (Shared Database):
* MongoDB Atlas-এ একটি সিঙ্গেল ক্লাস্টার তৈরি করে দুজনকে অ্যাক্সেস দিন (অথবা IP Whitelist `0.0.0.0/0` রাখুন)।
* ডাটাবেজ নাম: `botbari_db`
* কালেকশনস: `users`, `services`, `chatbots`, `portfolio`, `orders`, `payments`, `bookings`।

### ৩. কমন রেসপন্স ফরম্যাট (Standard API Response):
উভয় ডেভেলপার একই ধরনের JSON রেসপন্স পাঠাবে:
```json
{
  "success": true,
  "message": "Action completed successfully",
  "data": { ... }
}
```
এর ফলে ফ্রন্টএন্ডে ডেভলপ করা খুবই সহজ হবে।

### ৪. শেয়ার্ড `.env` কনফিগারেশন:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/botbari_db
JWT_SECRET=your_super_secret_jwt_key
STRIPE_SECRET_KEY=sk_test_51...
```
