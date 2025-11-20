# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

## dotenv

This application uses the `dotenv` module to secure sensitive database credentials and other environment variables.

### How it works

Instead of storing database credentials in the code (which would expose them if the repository is public), we use environment variables defined in a `.env` file:

- **`.env` file**: Contains your actual credentials (e.g., `DB_PASSWORD=qwertyuiop`). This file is **never committed** to version control.
- **`.env.example` file**: A template showing which environment variables are needed. This **is committed** to the repository so other developers know what to set up.
- **`.gitignore`**: Contains `.env` so Git will ignore it and prevent accidental commits of sensitive data.

## Audit

This application implements a comprehensive login audit system to track and monitor user authentication attempts, both successful and failed.

### How it works

The audit system logs every login attempt (successful or failed) into the `login_audit` table with the following information:

- **Username**: Who attempted to log in
- **Login Time**: When the attempt occurred (timestamp automatically recorded)
- **Status**: Whether the login was `success` or `failed`
- **Reason**: Why the login failed (e.g., "Username not found", "Incorrect password", or "Login successful")

