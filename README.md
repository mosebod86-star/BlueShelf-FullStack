# BlueShelf Library Management System — Full-Stack Starter

This starter is prepared for the assignment using:

- Frontend: React (Create React App), React Router, Fetch API
- Backend: Node.js + Express
- Database: MySQL through XAMPP / phpMyAdmin
- Styling: responsive CSS with a blue BlueShelf theme

## Project structure

```text
BlueShelf-FullStack-Starter/
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── .env.example
│   └── package.json
├── database/
│   └── blueshelf.sql
└── README.md
```

## Before running

1. Install Node.js.
2. Open XAMPP and start **Apache** and **MySQL**.
3. Open phpMyAdmin at `http://localhost/phpmyadmin`.
4. Import `database/blueshelf.sql`.
5. Configure `backend/.env` using `backend/.env.example`.
6. Install and start the backend.
7. Install and start the frontend.

We will do these steps together one at a time. Do not worry if you have not configured anything yet.

## Backend setup (later, step by step)

Open a terminal in `backend/`:

```powershell
npm install
```

Copy `.env.example` to `.env`, then update the values if your MySQL setup is different.

Start the API:

```powershell
npm run dev
```

The API should run at `http://localhost:5000`.

## Frontend setup (later, step by step)

Open another terminal in `frontend/`:

```powershell
npm install
npm start
```

The React app should open at `http://localhost:3000`.

## Demo administrator

After importing the SQL file, a demo admin account is created:

- Email: `admin@blueshelf.com`
- Password: `admin123`

Change this password before using the app beyond local coursework/testing.

## API routes included

- `POST /api/auth/login`
- `GET /api/books`
- `POST /api/books`
- `PUT /api/books/:id`
- `DELETE /api/books/:id`
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/transactions`
- `POST /api/transactions`

The transaction endpoint supports `ADD_STOCK`, `BORROW`, and `RETURN`, and updates book stock within a MySQL transaction.

## Important

This is a learning starter, not a production-ready library system. It uses a simple JWT login and role check. We will inspect and understand each part together before relying on it.
