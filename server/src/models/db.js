import sqlite3 from "sqlite3";
import { hashPassword } from "../utils/hashUtils.js";

// Connect to SQLite database
export const db = new sqlite3.Database("./smart-demand.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");

    // Create org and users tables
    db.run(`
      CREATE TABLE IF NOT EXISTS orgs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        hashed_password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        org_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (org_id) REFERENCES org(id)
      );
    `);
  }
});

export const seedData = async () => {
  // Check if any organizations already exist
  db.get(`SELECT COUNT(*) as count FROM orgs`, (err, row) => {
    if (err) {
      console.error("Error querying orgs count:", err.message);
      return;
    }

    if (row?.count === 0) {
      // Only seed organizations if none exist
      db.run(
        `INSERT INTO orgs (name) VALUES ('Org1'), ('Org2'), ('Org3')`,
        function (err) {
          if (err) {
            console.error(err);
          }
        }
      );
    } else {
      console.log("Orgs already seeded.");
    }
  });

  // Check if any users already exist
  db.get(`SELECT COUNT(*) as count FROM users`, async (err, row) => {
    if (err) {
      console.error("Error querying users count:", err.message);
      return;
    }

    if (row?.count === 0) {
      const hashedPasswordAdmin = await hashPassword("Admin@123");
      const hashedPasswordUser1 = await hashPassword("User1@123");
      const hashedPasswordUser2 = await hashPassword("User2@123");
      const hashedPasswordUser3 = await hashPassword("User3@123");

      db.run(
        `INSERT INTO users (username, email, hashed_password, role, org_id) VALUES (?, ?, ?, ?, ?)`,
        ["admin", "admin@smartdemand.com", hashedPasswordAdmin, "admin", 1],
        function (err) {
          if (err) {
            console.error(err);
          }
        }
      );
      db.run(
        `INSERT INTO users (username, email, hashed_password, role, org_id) VALUES (?, ?, ?, ?, ?)`,
        ["user1", "user1@smartdemand.com", hashedPasswordUser1, "user", 1],
        function (err) {
          if (err) {
            console.error(err);
          }
        }
      );
      db.run(
        `INSERT INTO users (username, email, hashed_password, role, org_id) VALUES (?, ?, ?, ?, ?)`,
        ["user2", "user2@smartdemand.com", hashedPasswordUser2, "user", 2],
        function (err) {
          if (err) {
            console.error(err);
          }
        }
      );
      db.run(
        `INSERT INTO users (username, email, hashed_password, role, org_id) VALUES (?, ?, ?, ?, ?)`,
        ["user3", "user3@smartdemand.com", hashedPasswordUser3, "user", 3],
        function (err) {
          if (err) {
            console.error(err);
          }
        }
      );
    } else {
      console.log("Users already seeded.");
    }
  });
};
