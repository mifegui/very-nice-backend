# Backend Assessment Instructions

## Overview
This assessment will test your ability to work with Node.js, TypeScript, Express, PostgreSQL, and JWT authentication.  

Your task is to:
1. Set up the project locally with PostgreSQL.
2. Debug and fix the issues.
3. Demonstrate troubleshooting and debugging skills.

---

## Setup Instructions
1. Clone or extract the repo.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE assessment_db;
   ```
4. Run the migration:
   ```bash
   npm run migrate
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

---

## Tasks

### 1. Authentication (JWT)
- Users can register successfully.
- Users can log in and receive a valid JWT.
- Authenticated requests include the correct Authorization header.

### 2. Profile Route
- The `/profile` route should return the logged-in user’s information.

### 3. Database
- Ensure the schema is properly applied, and queries in routes work correctly.

### 4. Debugging & Troubleshooting
- Identify bugs in the codebase 
- Document the bugs and explain how you fixed them in a short write-up.

### 5. Controllers amd services are required

---

## Deliverables
- A working backend with authentication and `/profile` route functioning correctly.
- A short write-up (markdown or text file) describing:
  - The bugs you found.
  - How you debugged them.
  - The final fixes you applied.

---

## Bonus (Optional)
- Add unit tests for the auth and profile routes.
- Dockerize the application with PostgreSQL.

---

## How to provide the code

Please clone this repository and publish it publicly under your GitHub account.

Send us the link to your repository once you are done with coding. 

---

Good luck! 🚀
