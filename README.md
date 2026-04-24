# POS Bakery

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/Supabase-Postgres%20%26%20Storage-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-111111?logo=vercel&logoColor=white" alt="Deploy" />
</p>

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

## Screenshots

<p align="center">
  <strong>Products Page</strong><br>
  <img src="docs/screenshots/products-page.png" alt="Products Page" width="900" />
</p>

<p align="center">
  <strong>Sales and Checkout</strong><br>
  <img src="docs/screenshots/sales-page.png" alt="Sales Page" width="900" />
</p>

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

- Add your screenshots to `docs/screenshots/`
- Recommended files:
  - `products-page.png`
  - `sales-page.png`
- Recommended image size: same browser width and same viewport height for consistency
