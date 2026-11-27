# MarketFlow (frontend)
Inventory, sales and business management for small businesses in Nigeria.

**Stack:** React, TypeScript, Vite, Tailwind CSS v4, Recharts, React Router, TanStack Query.

## Run
    npm install
    npm run dev

## Pages
Dashboard, Inventory (search, filter, CSV export), Point of sale (stock-checked cart, 7.5% VAT), Sales, Expenses, Suppliers, Reports (CSV), Settings, Login.

## Status
Talks to the Spring Boot API (`VITE_API_URL`, default http://localhost:8080). Suppliers are session-only until that backend module exists.
