# Miras Frontend - Car Rental & Travel Platform

A modern React-based frontend for Miras Car Rental showcasing featured
vehicles, travel guides, and booking capabilities.

## Features

- **Home Page**: Hero section, featured cars, recent blogs,
  call-to-actions
- **Cars Listing**: Browse all cars with filtering by category and
  search
- **Car Details**: Detailed view with images gallery, specifications,
  features, pricing
- **Blogs**: Travel guides and articles with category filtering
- **Blog Details**: Full article view with related vehicles
- **Contact Form**: Inquiry submission with date selection
- **About Page**: Company information and values
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Tech Stack

- React 18
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Lucide Icons
- date-fns

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Building

```bash
npm run build
npm run preview
```

## API Integration

Connects to backend API at `http://localhost:5000/api`

### Available Endpoints

- `GET /cars` - List all cars
- `GET /cars/:id` - Get car details
- `GET /cars?featured=true` - Get featured cars
- `GET /blog` - List blog posts
- `GET /blog/:slug` - Get blog post
- `POST /inquiries` - Submit inquiry

## Environment

Backend API should be running on `localhost:5000` (configured in
`vite.config.js`)

## Project Structure

```
src/
├── pages/          # Route pages
├── components/     # Reusable components
├── utils/          # API calls and utilities
├── App.jsx         # Main routing
├── index.css       # Global styles
└── main.jsx
```

## Features

✓ Featured cars carousel ✓ Advanced search & filtering ✓ Social
sharing (WhatsApp, link copy) ✓ Image galleries ✓ Responsive
navigation ✓ Form validation ✓ SEO meta tags ✓ Dark theme with gold
accents
