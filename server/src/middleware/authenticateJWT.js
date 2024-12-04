import jwt from "jsonwebtoken";

export function authenticateJWT(req, res, next) {
  // Exclude the login route from authentication
  if (req.path === "/login") {
    return next();
  }

  // Get the token from the Authorization header
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    // Verify the token
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        // Token is not valid
        return res.status(403).json({ message: "Forbidden" });
      }

      // Token is valid, add user info to req.user
      req.user = {
        username: decodedToken.username,
        email: decodedToken.email,
        role: decodedToken.role,
        org_id: decodedToken.org_id,
      };

      next();
    });
  } else {
    // No token provided or incorrect format
    return res.status(403).json({ message: "Forbidden" });
  }
}
