# POS Bakery

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/Supabase-Postgres%20%26%20Storage-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-111111?logo=vercel&logoColor=white" alt="Deploy" />
</p>

A full-stack bakery Point of Sale system built around real retail workflows, from product and category management to checkout, inventory updates, and receipt generation.

## Overview
This project simulates the day-to-day workflow of a small bakery POS system. It covers product setup, order processing, stock updates, role-based access, and sales tracking in a full-stack architecture.

## Main Features

- Product and category management
- Sales cart and checkout flow
- Automatic inventory updates after checkout
- JWT authentication with role-based access (`ADMIN` / `STAFF`)
- Order history and dashboard analytics
- PromptPay QR receipt generation

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: Supabase Postgres
- Storage: Supabase Storage
- Deployment: Vercel, Render
- Tools: Docker, Postman, GitHub Actions

## Architecture

```txt
Frontend (React + Vite)
-> Express API
-> Supabase Postgres / Storage

Admin / Staff
-> Authentication + Role-Based Access
-> Product, Order, and Inventory Workflows
-> Dashboard and Receipt Features
```

## Screenshots

<p align="center">
  <strong>Dashboard</strong><br>
  <img src="docs/screenshots/dashBoard.png" alt="Dashboard" width="650" />
</p>

<p align="center">
  <strong>Product Management</strong><br>
  <img src="docs/screenshots/product.png" alt="Product Management" width="650" />
</p>

<p align="center">
  <strong>Order History</strong><br>
  <img src="docs/screenshots/Order History.png" alt="Order History" width="650" />
</p>

## Demo Accounts

These are the accounts used during project testing:

| Username | Password | Role | Access |
|---|---|---|---|
| `owner` | `1234` | `ADMIN` | dashboard, products, categories, sales, order history |
| `staff01` | `1234` | `STAFF` | sales, own order history |

## Main Features

- JWT authentication with role-based access
- Product and category management
- Sales cart and checkout flow
- Stock deduction after successful order
- Order history and receipt modal
- PromptPay QR generation
- Dashboard for revenue, VAT, and best sellers

## Project Structure

```txt
apps/
  frontend/
    src/
      app/         # router and protected route
      components/  # reusable UI components
      layouts/     # shared app layout
      pages/       # page screens
      services/    # frontend API layer
      types/       # frontend data types
  backend/
    src/
      lib/         # shared utilities such as Supabase client
      middleware/  # auth and upload middleware
      routes/      # Express routes
      services/    # business logic
      types/       # backend types
supabase/
  migrations/ # database schema and SQL
docs/
  screenshots/ # README images
```

### Structure Notes

- `apps/frontend` contains the React back-office UI
- `apps/backend` contains the Express API and business logic
- `supabase/migrations` contains schema and SQL functions used by the system
- `docs/screenshots` stores images used in the README

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: Supabase

## Technical Note
This project stores JWT tokens in localStorage for implementation simplicity. In a more security-sensitive production environment, httpOnly cookies would be a stronger choice.

