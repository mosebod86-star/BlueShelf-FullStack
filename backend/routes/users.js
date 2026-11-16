const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, membership_id AS membershipId, role, email, phone, created_at AS createdAt FROM users ORDER BY name"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load users." });
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, membershipId, role, email, password, phone } = req.body;
    if (!name || !membershipId || !role || !email || !password) {
      return res.status(400).json({ message: "Name, membership ID, role, email and password are required." });
    }
    if (!["ADMIN", "LIBRARIAN", "MEMBER"].includes(role)) {
      return res.status(400).json({ message: "Choose a valid role." });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      `INSERT INTO users (name, membership_id, role, email, password_hash, phone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name.trim(), membershipId.trim(), role, email.trim().toLowerCase(), passwordHash, phone || null]
    );
    res.status(201).json({ id: result.insertId, name, membershipId, role, email, phone: phone || "" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Email or membership ID already exists." });
    console.error(error);
    res.status(500).json({ message: "Could not add user." });
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, membershipId, role, email, phone, password } = req.body;
    if (!name || !membershipId || !role || !email) {
      return res.status(400).json({ message: "Name, membership ID, role and email are required." });
    }
    if (!["ADMIN", "LIBRARIAN", "MEMBER"].includes(role)) {
      return res.status(400).json({ message: "Choose a valid role." });
    }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await db.execute(
        "UPDATE users SET name=?, membership_id=?, role=?, email=?, phone=?, password_hash=? WHERE id=?",
        [name.trim(), membershipId.trim(), role, email.trim().toLowerCase(), phone || null, hash, req.params.id]
      );
    } else {
      await db.execute(
        "UPDATE users SET name=?, membership_id=?, role=?, email=?, phone=? WHERE id=?",
        [name.trim(), membershipId.trim(), role, email.trim().toLowerCase(), phone || null, req.params.id]
      );
    }
    const [rows] = await db.execute(
      "SELECT id, name, membership_id AS membershipId, role, email, phone FROM users WHERE id=?",
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: "User not found." });
    res.json(rows[0]);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Email or membership ID already exists." });
    console.error(error);
    res.status(500).json({ message: "Could not update user." });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  if (Number(req.params.id) === Number(req.user.id)) {
    return res.status(400).json({ message: "You cannot delete the account currently signed in." });
  }
  try {
    const [result] = await db.execute("DELETE FROM users WHERE id=?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: "User not found." });
    res.json({ message: "User deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not delete user." });
  }
});

module.exports = router;
