# MarketFlow backend
Spring Boot 3, Java 21, PostgreSQL, JWT. Modular monolith (one package per module).

    docker compose up -d        # Postgres
    mvn spring-boot:run
Swagger UI: http://localhost:8080/swagger-ui.html. Set `JWT_SECRET` (32+ chars) in production.

Key rules: stock only changes through `InventoryService` (always writes a movement); sales run in one transaction with row locks; every query is scoped by the businessId from the JWT.
