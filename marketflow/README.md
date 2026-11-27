# MarketFlow
Inventory, sales and business management for SMEs in Nigeria.
- `frontend/` React + TypeScript + Vite (see its README)
- `backend/` Spring Boot + PostgreSQL (see its README)

## Run locally
1. `cd backend && docker compose up -d && mvn spring-boot:run`
2. `cd frontend && cp .env.example .env && npm install && npm run dev`
3. Open http://localhost:5173 and create an account.
