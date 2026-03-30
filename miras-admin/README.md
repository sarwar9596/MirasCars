# Miras Admin Panel — Phase 2

React + Vite admin dashboard for Miras Car Rental (Kashmir).
Runs on `http://localhost:3001`

---

## 🚀 Setup & Run

```bash
# 1. Enter the admin folder
cd miras-admin

# 2. Install dependencies
npm install

# 3. Start the admin panel
npm run dev
```

Admin opens at → http://localhost:3001

> ⚠️ Make sure your backend (miras-backend) is running on port 5000 first!
> The admin proxies all /api calls to localhost:5000 automatically.

---

## 🔐 Login

Default credentials (set in your backend seed):
- Email: admin@mirasrentals.com
- Password: admin123

---

## 📦 Pages & Features

| Page | Route | Features |
|------|-------|---------|
| Dashboard | / | Stats cards, recent inquiries, recent bookings |
| Fleet/Cars | /cars | Grid view with category filter, add/edit/delete |
| Add/Edit Car | /cars/add or /cars/edit/:id | Full form: name, category, specs, 4 photos, features, booked-until |
| Bookings | /bookings | Status filter, add booking modal, WhatsApp link, status update |
| Inquiries | /inquiries | Expandable list, status update, WhatsApp reply, delete |
| Blog Posts | /blogs | Card grid, publish/unpublish toggle, delete |
| Add/Edit Blog | /blogs/add or /blogs/edit/:id | Rich editor, cover image, tags, SEO fields, live preview |
| Analytics | /analytics | 5 charts: monthly trend, top cars, status pie, category pie, revenue line |
| Settings | /settings | Business info, WhatsApp config, notification toggles, password change |

---

## 🔔 Live Notifications

The admin polls the backend every 30 seconds. When a new inquiry or booking
comes in, you'll see:
- A toast popup in the top-right corner
- A badge counter on the bell icon
- The item listed in the notification dropdown

---

## 🔗 WhatsApp Integration

When a customer submits an inquiry or booking:
1. A WhatsApp link is auto-generated using your number from Settings
2. Click "Reply on WhatsApp" in Inquiries or Bookings to open a pre-filled chat

---

## 📁 Project Structure

```
miras-admin/
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Cars.jsx
│   │   ├── AddEditCar.jsx       ← All car fields: 4 pics, mileage, year, service, seats, transmission, booked-until
│   │   ├── Bookings.jsx         ← Full order management + add booking modal
│   │   ├── Inquiries.jsx        ← Expandable inquiry list + WhatsApp reply
│   │   ├── Blogs.jsx
│   │   ├── AddEditBlog.jsx      ← Rich text editor with preview mode
│   │   ├── Analytics.jsx        ← 5 recharts: bar, line, pie, horizontal bar
│   │   └── Settings.jsx
│   ├── components/
│   │   ├── Layout.jsx           ← Main wrapper
│   │   ├── Sidebar.jsx          ← Collapsible nav
│   │   └── Topbar.jsx           ← Notification bell + header
│   ├── context/
│   │   ├── AuthContext.jsx      ← JWT auth
│   │   └── NotificationContext.jsx  ← Real-time polling
│   └── utils/
│       └── api.js               ← All API calls (cars, bookings, inquiries, blogs, analytics, auth)
```

---

## ⚙️ Tech Stack

- React 18 + Vite
- React Router v6
- Tailwind CSS (dark gold theme)
- Recharts (analytics charts)
- Axios (API calls)
- react-hot-toast (notifications)
- date-fns (date formatting)
- lucide-react (icons)

---

## 🔄 Next Step: Phase 3 — Frontend Website

The public-facing customer website (localhost:3000) connects to the same backend.
It shows the cars, blogs, booking form, and inquiry form dynamically.
