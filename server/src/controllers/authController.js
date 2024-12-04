import { db } from "../models/db.js";
import { verifyPassword, generateToken } from "../utils/hashUtils.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  const sql = `SELECT * FROM users WHERE username = ?`;
  db.get(sql, [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Database error" + err });
    }
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const passwordMatch = await verifyPassword(password, user.hashed_password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    // Fetch the organization based on org_id
    const orgSql = `SELECT name FROM orgs WHERE id = ?`;
    db.get(orgSql, [user.org_id], (orgErr, org) => {
      if (orgErr) {
        return res.status(500).json({
          error: "Database error while fetching organization" + orgErr,
        });
      }
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }

      const token = generateToken(user);
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          org_id: user.org_id,
        },
        token,
      });
    });
  });
};
