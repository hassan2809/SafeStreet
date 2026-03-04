import crypto from "crypto";

// Simple stateless CSRF check: server issues a deterministic token per user id
// computed as HMAC(userId) with JWT secret, and client must echo it in header.
export const requireCsrf = (req, res, next) => {
  try {
    const provided = req.header("x-csrf-token");
    const user = req.user; // set by authenticateUser
    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!provided) {
      return res.status(403).json({ message: "Missing CSRF token" });
    }
    const expected = crypto
      .createHmac("sha256", process.env.JWT_SECRET)
      .update(String(user.id))
      .digest("hex");
    if (provided !== expected) {
      return res.status(403).json({ message: "Invalid CSRF token" });
    }
    next();
  } catch (e) {
    return res.status(403).json({ message: "CSRF verification failed" });
  }
};

export default requireCsrf;


