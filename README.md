# BlueShelf – Full Stack Library Management System

## 1. Project Overview

BlueShelf is a full-stack Library Management System developed using React.js, Express.js and MySQL.

The application helps librarians manage books, monitor inventory, manage library users and record borrowing and returning transactions.

The system provides a responsive interface and communicates with a REST API to store and retrieve information from a MySQL database.

## 2. Technologies Used

### Frontend
- React.js
- React Hooks (`useState`, `useEffect`)
- React Router
- Fetch API
- CSS

### Backend
- Node.js
- Express.js
- REST API
- JSON Web Tokens (JWT)
- bcryptjs
- CORS

### Database
- MySQL
- XAMPP
- phpMyAdmin

## 3. Main Features

### Dashboard
- Displays library statistics.
- Shows book availability.
- Displays user and transaction information.
- Identifies low-stock books.

### Book Management
- Add new books.
- View available books.
- Edit book information.
- Delete books.

### Inventory and Transactions
- Add stock to existing books.
- Borrow books and automatically deduct stock.
- Return books and automatically increase stock.
- Maintain transaction history.

### User Management
- Register and manage users.
- Update user information.
- Delete users.
- Support different user roles.

### Authentication
- User login.
- Password hashing.
- JWT-based authentication.
- Protected application routes.

## 4. Project Structure

```text
BlueShelf-FullStack/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── database/
│   └── blueshelf.sql
│
├── .gitignore
└── README.md
```

## 5. Requirements

Before running the application, install:

- Node.js and npm
- Git
- XAMPP
- MySQL
- A modern web browser

## 6. Database Setup

1. Open XAMPP Control Panel.
2. Start Apache and MySQL.
3. Open phpMyAdmin at `http://localhost/phpmyadmin`.
4. Select the Import option.
5. Choose `database/blueshelf.sql`.
6. Click Import.

The SQL file creates the `blueshelf_db` database and the required tables.

## 7. Backend Installation

Open a terminal in the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory using `.env.example` as a guide.

Configure the database connection:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=blueshelf_db
JWT_SECRET=your_own_long_random_secret
```

Start the backend:

```bash
npm run dev
```

The API should run at:

`http://localhost:5000`

## 8. Frontend Installation

Open another terminal in the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

Open the application at:

`http://localhost:3000`

## 9. Demo Login

When the database has no users, the backend creates a default administrator account.

**Email:** `admin@blueshelf.com`

**Password:** `admin123`

Change the default credentials and secret before using the application in a public or production environment.

## 10. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | User login |
| GET | `/api/books` | Retrieve books |
| POST | `/api/books` | Add a book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |
| GET | `/api/users` | Retrieve users |
| POST | `/api/users` | Add a user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |
| GET | `/api/transactions` | Retrieve transactions |
| POST | `/api/transactions` | Record a transaction |

## 11. Testing

The following functionality was tested during development:

- User authentication and login.
- Adding, viewing, editing and deleting books.
- Adding stock.
- Borrowing books.
- Returning books.
- User management.
- Dashboard statistics.
- Low-stock notifications.
- Responsive interface.
- Frontend and backend communication.

## 12. Security and Configuration

Environment variables are stored in `.env` files and excluded from Git using `.gitignore`.

The application uses password hashing and JWT authentication.

Never upload actual `.env` files, passwords or private authentication secrets to GitHub.

## 13. GitHub Repository

Source code:

https://github.com/mosebod86-star/BlueShelf-FullStack

---

**BlueShelf – Full Stack Library Management System**

Developed as an academic full-stack web development project.