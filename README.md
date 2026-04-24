# POS Bakery

A full-stack Point of Sale system for a bakery shop, built to simulate a real business workflow from product management to checkout and receipt generation.

## Overview

This project covers the core flow of a small retail POS system:

- manage products and categories
- create orders and deduct stock
- generate receipts with PromptPay QR
- view order history and dashboard analytics
- control access by role (`ADMIN` / `STAFF`)

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: Supabase Postgres
- Storage: Supabase Storage
- Deployment: Vercel, Render
- Tools: Docker, Postman, GitHub Actions

## Architecture

```txt
Frontend (Vercel)
-> Backend API (Render)
-> Supabase Postgres / Storage
```

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
  frontend/   # React frontend
  backend/    # Express backend
supabase/
  migrations/ # database schema and SQL
```

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: Supabase

## Notes

This project uses JWT stored in localStorage for simplicity.
For a more security-sensitive production system, httpOnly cookies would be a stronger approach.

## Screenshots

- Login
- Products
- Sales
- Order History
- Dashboard
- Receipt
