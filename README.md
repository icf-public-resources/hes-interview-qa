# Census App for QA Testing

This is a full stack QA Testing Challenge. It has nothing to do with a real Census project. The sole intention of this application is to facilitate QA testing across all 3 layers: UI, API, and Database. When creating new demographic records, please don't use any PII (Personal Identifiable Information). Instead, create records for fictional people. A good QA practice for dummy data is to include the word `FAKE` in first and last names and emails.

## Overview

You are expected to arrive at the interview with:

- A locally running Census app and PostgreSQL database
- An automation framework with test scenarios
- A database client connected to PostgreSQL (pgAdmin or DBeaver)
- [Postman](https://www.postman.com/) with API requests to the Census app

## Contents

- [1. Deploy the Application](#1-deploy-the-application)
- [2. Connect to the Database](#2-connect-to-the-database)
- [3. UI Test Preconditions](#3-ui-test-preconditions)
- [4. Framework Setup](#4-framework-setup)
- [5. Create Automated Tests](#5-create-automated-tests)
- [API Documentation](#api-documentation)

## 1. Deploy the Application

### Prerequisites

Install **Docker Desktop** from https://www.docker.com/ and ensure it is running.

### Start All Containers

The deployment is simple — just one command! The `docker-compose.yml` file will be provided to you separately.

From your terminal, run:

```bash
docker compose up -d
```

Docker will build and start **four containers**:

| Container    | Purpose                               | Port |
| ------------ | ------------------------------------- | ---- |
| `postgres`   | PostgreSQL 16 database                | 5432 |
| `census_app` | Next.js application                   | 3000 |
| `pgadmin`    | pgAdmin 4 — browser-based DB admin UI | 5050 |
| `swagger_ui` | Swagger UI — interactive API docs     | 5051 |

The app container automatically runs Prisma migrations on first start, so the database schema is created for you.

### Access the Application

Once all containers are running, open these URLs in your browser:

- **Application** → http://localhost:3000
- **Swagger UI** (API docs) → http://localhost:5051
- **pgAdmin 4** (database admin) → http://localhost:5050

### Stop and Clean Up

To stop all containers:

```bash
docker compose down
```

To stop and wipe all data volumes (full reset):

```bash
docker compose down -v
```

## 2. Connect to the Database

Choose one of the two options below to access your database.

### Option A: pgAdmin 4 (Browser-based)

pgAdmin 4 is already included in the Docker stack and requires no additional installation.

1. Open http://localhost:5050
2. Log in with:
   - Email: `admin@admin.com`
   - Password: `admin`
3. Click **Add New Server**
4. Fill in the connection details:
   - **General → Name**: `census_app`
   - **Connection → Host**: `postgres`
   - **Connection → Port**: `5432`
   - **Connection → Username**: `postgres`
   - **Connection → Password**: `postgres`
5. Click **Save**

### Option B: DBeaver (Desktop Client)

If you prefer a desktop application, install DBeaver Community from https://dbeaver.io/ and connect with:

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `census_app`
- **Username**: `postgres`
- **Password**: `postgres`

## 3. UI Test Preconditions

Before you start creating automated tests, perform these manual steps to set up test data:

1. Open http://localhost:3000 in your browser
2. Register a new user and log in (use `FAKE` in your email, e.g., `fake-user@example.com`)
3. Add a household (do not use real addresses)
4. Add a record with relationship = `SELF` (do not use any PII; use `FAKE` in names)

## 4. Framework Setup

Programming language and framework is up to your. Please use you are most experienced and confident in. Below are recommended tech stacks:

### For Java

- IntelliJ IDE
- Java
- Maven
- Cucumber (BDD) or JUnit / TestNG (TDD)
- Selenium
- RestAssured (API testing)
- JDBC (database testing)
- Cucumber HTML Reporting (optional)
- Screenshot library (optional)

### For Other Languages (Playwright, Cypress, etc.)

Ensure your framework can test all 3 layers: UI, API, and Database.

## 5. Create Automated Tests

Create reusable, parameterized test scenarios using your chosen framework to test the requirements below. Use `configuration.properties` or `.env` files for environment variables.

### Acceptance Criteria

1. **User should be able to add a new person record to a household on the UI**
   - Create your own Cucumber steps (BDD) or test scripts (TDD) to achieve this goal
   - Optional: Save the added personal demographic info to storage as a POJO object or other data format

2. **Added person's record should be returned in an API call**
   - Validate that the API returns the correct data for the added person
   - Verify all submitted values match the data returned by the API
   - See [API Documentation](#api-documentation) below

3. **Added person's record should be found in the database**
   - Use your database client (pgAdmin or DBeaver) to review the database schema and table relationships
   - Use JDBC to validate that the new record was saved with correct data
   - Optional: Use [jackson-databind](https://github.com/FasterXML/jackson-databind) to create and compare POJO objects

4. **Bonus: Update and delete records on the UI**
   - Optional: Create automation scenarios for updating and deleting records

## API Documentation

### 1. Login

**POST** `http://localhost:3000/api/auth/login`

Request body:

```json
{
  "email": "example@example.com",
  "password": "123456"
}
```

On Postman the authentication token is saved in cookies and automatically available for subsequent API calls. Token expiration: 4 hours.

### 2. Get Records for User by Email

**GET** `http://localhost:3000/api/record/user/email/[email]`

Replace `[email]` with the user's email address.

Example: `http://localhost:3000/api/record/user/email/fake-user@example.com`

### 3. Get Records for User by Query Parameters

**GET** `http://localhost:3000/api/record/user`

Use at least one query parameter. Supported parameters (in order of preference):

- `email` (string, email format)
- `id` (number)

## License

Licensed under the [MIT license](LICENSE.md).
