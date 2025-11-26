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

## Access control (extension Task 5)

I added simple session-based access control to several routes using a small `redirectLogin` middleware. The middleware checks `req.session.userId` and redirects unauthenticated requests to the login page.

Protected routes (require login):

- `GET /users/list` — viewing the list of registered users (in `routes/users.js`).
- `GET /audit` — viewing the login audit log (in `routes/users.js`).
- `GET /books/addbook` — the add-book form (in `routes/main.js`).
- `POST /bookadded` — adding a book to the database (in `routes/books.js`).
- `GET /logout` — logging out destroys the session (in `routes/main.js`).

Public routes (no login required):

- `GET /` — home page (`views/index.ejs`).
- `GET /about` — about page.
- `GET /books/search` and `GET /books/search-result` — book search and results (search is public).
- `GET /users/register` and `POST /users/registered` — user registration (public).
- `GET /users/login` and `POST /users/loggedin` — login page and login processing (must be public so users can authenticate).

## Validation added (Task 3 & 4)

I added server-side validation using `express-validator` to several routes and updated the relevant views to display validation errors and preserve non-sensitive form inputs when validation fails.

Where validation was applied:

- `POST /users/registered` (registration) — checks added:
	- `email` must be a valid email address
	- `username` required, length 5-20
	- `first` and `last` are required
	- `password` must be at least 8 characters
	- `passwordConfirm` must match `password`
	- On failure, `views/register.ejs` displays error list and repopulates non-sensitive fields.

- `POST /users/loggedin` (login) — checks added:
	- `username` and `password` must be provided
	- On failure, `views/login.ejs` displays errors and repopulates the username field.

- `GET /books/search-result` (search) — checks added:
	- `keyword` required (1-100 chars)
	- `searchType` must be either `basic` or `advanced` if present
	- On failure, `views/search.ejs` displays errors and repopulates the search inputs.

- `POST /books/bookadded` (add book) — checks added:
	- `name` (book name) is required
	- `price` must be a positive number
	- On failure, `views/addbook.ejs` displays errors and repopulates the inputs.

Where validation was intentionally not added:

- Some simple public pages (`/`, `/about`, listings) are read-only and do not accept user input, so no validation is required there.
- The login route enforces presence of username/password but does not enforce password length on login (only on registration) — this keeps login UX tolerant of existing accounts created with differing password rules.





