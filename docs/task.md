# Test Assignment: Product Management System for Bloggers

## Task Context

Create a simple system for fitness bloggers where they can **add products for promotion** and **track their sales stats**.

## Task

Build a **full‑stack web application** with basic affiliate‑product management functionality.

## Example frontend design

[https://v0-fullstack-test-design.vercel.app/](https://v0-fullstack-test-design.vercel.app/)

## Functional Requirements

### 🎯 Core Features

1. **Product Management**

   * Add a product (title, description, category, price, commission %)
   * View product list
   * Edit/delete products
   * Filter by categories

2. **Referral Link Generation**

   * Create a unique link for each product
   * Display generated links

3. **Simple Analytics**

   * Click counter for links (emulation)
   * Potential earnings calculation
   * Simple charts/metrics

## Technical Requirements

### 💻 Tech Stack

**Frontend:**

* React (Next.js)
* CSS (Tailwind CSS)
* Axios for API requests

**Backend:**

* Node.js + Express (or Nest.js)
* MongoDB (with Mongoose)

### 🤖 AI Tools (must use!)

* **Cursor IDE** or **Windsurf**, **Claude Code** for writing code
  (not required to use)
* **V0.dev** for creating UI components

## Data Structure

### Product

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // owner
  title: String,
  description: String,
  category: String, // "sports nutrition", "equipment", "clothing", "gadgets"
  price: Number,
  commissionPercent: Number, // commission percentage
  referralLink: String, // unique link
  clicks: Number, // number of clicks (emulation)
  createdAt: Date
}
```

### Click (Link Click — for analytics)

```javascript
{
  _id: ObjectId,
  productId: ObjectId,
  userId: ObjectId,
  clickedAt: Date,
  ip: String // to emulate uniqueness
}
```

## Main Pages/Routes

### Frontend Routes

* `/dashboard` — blogger’s personal dashboard
* `/products` — product list
* `/products/add` — add a product
* `/products/edit/:id` — edit a product (same component as /add — it’s populated with data for edit)
* `/stats` — analytics
* `/settings` — Settings — can be basic: name, email, avatar

### API Endpoints

```
GET /api/products - get user’s products
POST /api/products - create a product
PUT /api/products/:id - update a product
DELETE /api/products/:id - delete a product
GET /api/stats - get analytics
POST /api/click/:productId - record a click (emulation)
```

## Evaluation Criteria

### 🏆 Main Criteria

1. **Functionality (40%)**

   * All core features work
   * CRUD operations for products

2. **Code & Architecture (30%)**

   * Code cleanliness
   * Proper project structure
   * Error handling

3. **AI Usage (20%)**

   * Built quickly
   * Demonstrates use of AI tools
   * Effective use of AI

4. **UI/UX (10%)**

   * Simple, easy‑to‑understand interface
   * Responsive design

## Deliverables

### 📦 What to Provide

1. **Code repository**

   * Frontend and Backend in one repo
   * README with run instructions
   * `.env.example` with sample variables

2. **Database**

   * MongoDB (local)
   * Seed data for demonstration (migrations optional)

3. **Process Documentation**

   * A short `DEVELOPMENT_PROCESS.md` file:

     * Which AI tools were used
     * Example prompts that helped
     * Challenges and how they were solved

## Sample Data for Testing

### Demo products:

```javascript
[
  {
    title: "Whey Protein 2kg",
    description: "High‑quality protein for muscle gain",
    category: "sports nutrition",
    price: 2500,
    commissionPercent: 15
  },
  {
    title: "Resistance Bands Set",
    description: "A set of bands for home workouts",
    category: "equipment",
    price: 1200,
    commissionPercent: 20
  },
  {
    title: "Mi Band Fitness Tracker",
    description: "Smart band for activity tracking",
    category: "gadgets",
    price: 3500,
    commissionPercent: 8
  }
]
```

## Timeframe

**Completion time**: 8–24 hours

## Bonus Features (optional)

* Product search by title
* Product sorting (by price, commission, date)
* Simple analytics charts (Chart.js)
* Export analytics to CSV
* Dark/Light theme

## Run Instructions

The README should include:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend  
cd frontend
npm install
npm start

# MongoDB
Connect to the database (local or Atlas)
```

## What NOT to Do

❌ Microservice architecture
❌ Complex DevOps setup

## Questions?

If anything is unclear—ask! We’re ready to clarify the details.

---

*Show how to efficiently build full‑stack applications using modern AI tools! 🚀*
