import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Hash password
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password
export const verifyPassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

// Generate JWT
export const generateToken = (user) => {
  const SECRET_KEY = process.env.SECRET_KEY;
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY not set in env file");
  }
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      org_id: user.org_id,
    },
    SECRET_KEY,
<<<<<<< HEAD
    { expiresIn: "1d" } // Token expires in 1 hour
=======
    { expiresIn: "365d" }
>>>>>>> cbef87c (updated flask server)
  );
};
