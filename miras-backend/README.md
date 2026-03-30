# Miras Car Rental — Backend API

Express.js + MongoDB REST API powering the Miras Car Rental platform.

---

## Quick Start (5 minutes)

### Step 1 — Install dependencies
```bash
cd miras-backend
npm install
```

### Step 2 — Set up MongoDB (choose one option)

**Option A: Local MongoDB (easiest for dev)**
1. Download MongoDB Community from https://www.mongodb.com/try/download/community
2. Install and start it — it runs on `mongodb://localhost:27017` by default
3. No changes needed in `.env`

**Option B: MongoDB Atlas (free cloud, no install)**
1. Go to https://mongodb.com/atlas → Sign up free
2. Create a free cluster → Get your connection string
3. Replace `MONGODB_URI` in `.env` with your Atlas connection string

### Step 3 — Seed demo data
```bash
npm run seed
```
This adds 10 demo cars, 5 blog posts, testimonials, and sample inquiries.

### Step 4 — Start the server
```bash
npm run dev
```
Server runs at → **http://localhost:5000**

---

## API Endpoints

| Method | Endpoint                      | Auth    | Description                    |
|--------|-------------------------------|---------|--------------------------------|
| POST   | /api/auth/login               | Public  | Admin login → returns JWT      |
| GET    | /api/auth/me                  | Admin   | Verify token                   |
| GET    | /api/cars                     | Public  | List cars (filters available)  |
| GET    | /api/cars/:id                 | Public  | Single car by id or slug       |
| POST   | /api/cars                     | Admin   | Create new car                 |
| PUT    | /api/cars/:id                 | Admin   | Update car                     |
| DELETE | /api/cars/:id                 | Admin   | Delete car                     |
| GET    | /api/inquiries                | Admin   | List all inquiries             |
| POST   | /api/inquiries                | Public  | Submit inquiry (from website)  |
| PUT    | /api/inquiries/:id            | Admin   | Update status / notes          |
| DELETE | /api/inquiries/:id            | Admin   | Delete inquiry                 |
| GET    | /api/blog                     | Public  | Published posts only           |
| GET    | /api/blog/all                 | Admin   | All posts including drafts     |
| GET    | /api/blog/:slug               | Public  | Single post + increments views |
| POST   | /api/blog                     | Admin   | Create post                    |
| PUT    | /api/blog/:id                 | Admin   | Update post                    |
| DELETE | /api/blog/:id                 | Admin   | Delete post                    |
| GET    | /api/testimonials             | Public  | Visible testimonials           |
| POST   | /api/testimonials             | Admin   | Add testimonial                |
| PUT    | /api/testimonials/:id         | Admin   | Edit testimonial               |
| DELETE | /api/testimonials/:id         | Admin   | Delete testimonial             |
| GET    | /api/settings                 | Public  | Site settings                  |
| PUT    | /api/settings                 | Admin   | Update settings                |
| POST   | /api/upload/base64            | Admin   | Upload image (base64)          |
| GET    | /api/analytics/dashboard      | Admin   | Stats cards                    |
| GET    | /api/analytics/monthly        | Admin   | Monthly inquiries chart        |
| GET    | /api/analytics/top-cars       | Admin   | Most booked cars               |
| GET    | /api/analytics/status-breakdown | Admin | Inquiry status pie chart       |
| GET    | /api/analytics/category-breakdown | Admin | Bookings by car category    |
| GET    | /api/analytics/recent         | Admin   | Latest 5 inquiries             |

---

## Car Query Filters

```
GET /api/cars?category=SUV
GET /api/cars?featured=true
GET /api/cars?available=true
GET /api/cars?category=Hatchback&available=true
```

Categories: `Hatchback`, `Sedan`, `SUV`, `Motorbike`

---

## WhatsApp Notifications

When a customer submits an inquiry from the website, the API returns a `whatsappUrl`.
The frontend opens this URL to send a pre-formatted WhatsApp message to the owner's number.

Set your WhatsApp number in `.env`:
```
WHATSAPP_NUMBER=919876543210   # country code + number, no + or spaces
```

---

## Image Uploads

**Development mode (no Cloudinary needed):**
The upload endpoint returns a placeholder Unsplash URL so you can test without setting up Cloudinary.

**Production (real uploads):**
1. Sign up at https://cloudinary.com (free tier is enough)
2. Add your credentials to `.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Admin Credentials
```
Email:    admin@mirascarrental.com
Password: Miras@2024
```
Change these in `.env` before going live.

---

## Folder Structure
```
miras-backend/
├── config/
│   ├── db.js           MongoDB connection
│   └── cloudinary.js   Cloudinary setup
├── middleware/
│   └── auth.js         JWT protect middleware
├── models/
│   ├── Car.js
│   ├── Inquiry.js
│   ├── BlogPost.js
│   ├── Testimonial.js
│   └── SiteSettings.js
├── routes/
│   ├── auth.js
│   ├── cars.js
│   ├── inquiries.js
│   ├── blog.js
│   ├── testimonials.js
│   ├── settings.js
│   ├── upload.js
│   └── analytics.js
├── server.js           Entry point
├── seed.js             Demo data seeder
├── .env                Environment variables
└── package.json
```
