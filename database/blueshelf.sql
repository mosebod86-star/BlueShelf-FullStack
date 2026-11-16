CREATE DATABASE IF NOT EXISTS blueshelf_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE blueshelf_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  membership_id VARCHAR(50) NOT NULL UNIQUE,
  role ENUM('ADMIN', 'LIBRARIAN', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  author VARCHAR(140) NOT NULL,
  genre VARCHAR(80) NOT NULL,
  isbn VARCHAR(30) NOT NULL UNIQUE,
  quantity INT NOT NULL DEFAULT 0,
  available_quantity INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_book_quantity CHECK (quantity >= 0),
  CONSTRAINT chk_book_available CHECK (available_quantity >= 0 AND available_quantity <= quantity)
);

CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  user_id INT NULL,
  transaction_type ENUM('ADD_STOCK', 'BORROW', 'RETURN') NOT NULL,
  quantity INT NOT NULL,
  notes VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transaction_book FOREIGN KEY (book_id) REFERENCES books(id),
  CONSTRAINT fk_transaction_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- The backend creates a demo administrator automatically on first startup
-- if the users table is empty. Demo login: admin@blueshelf.com / admin123
