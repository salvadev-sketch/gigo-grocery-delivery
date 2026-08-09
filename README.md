# GIGO Grocery Delivery

An Instacart-style full-stack grocery delivery app with live order tracking, delivery-partner assignment, and an admin panel. Built as a new GIGO project, separate from [gigo-delivery](https://github.com/salvadev-sketch/gigo-delivery).

## Structure

```
frontend/   React + TypeScript + Tailwind + Vite (customer site, admin panel, delivery-partner portal)
backend/    Express + Prisma (PostgreSQL) API
```

## Status

This is an initial scaffold. It includes:
- Reference UI components/pages for checkout, order tracking (live map + timeline + OTP), delivery-partner dashboard, and admin panel
- The Prisma schema (User, Address, Product, Order, DeliveryPartner)
- TypeScript types matching the schema

Not yet implemented: Express API routes, authentication, Stripe integration, Inngest background jobs (order status simulation, low-stock/offer emails), and wiring the frontend pages up to a live backend.

## Getting started

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL, etc.
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL etc.
npm run dev
```
