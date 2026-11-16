require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://10.11.3.26:3000"
  ],
  credentials: false
}));
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok", message: "BlueShelf API and MySQL are connected." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "API is running, but MySQL connection failed." });
  }
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/books", require("./routes/books"));
app.use("/api/users", require("./routes/users"));
app.use("/api/transactions", require("./routes/transactions"));

app.use((req, res) => res.status(404).json({ message: "API route not found." }));

async function createDemoAdminIfNeeded() {
  const bcrypt = require("bcryptjs");
  const [rows] = await db.execute("SELECT id FROM users WHERE email = ?", ["admin@blueshelf.com"]);
  if (!rows.length) {
    const [countRows] = await db.execute("SELECT COUNT(*) AS total FROM users");
    if (Number(countRows[0].total) === 0) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      await db.execute(
        `INSERT INTO users (name, membership_id, role, email, password_hash)
         VALUES (?, ?, ?, ?, ?)`,
        ["BlueShelf Administrator", "ADMIN-001", "ADMIN", "admin@blueshelf.com", passwordHash]
      );
      console.log("Created demo admin: admin@blueshelf.com / admin123");
    }
  }
}

app.listen(PORT, async () => {
  console.log(`BlueShelf API running at http://localhost:${PORT}`);
  try {
    await createDemoAdminIfNeeded();
  } catch (error) {
    console.error("Could not create demo admin. Check your MySQL connection and database setup.", error.message);
  }
});
