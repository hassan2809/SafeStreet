import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const cookieToken = req.cookies?.access_token; 

  if (!authHeader && !cookieToken) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    let token = cookieToken;
    if (!token && authHeader) {
      const tokenParts = authHeader.split(" ");
      if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(401).json({ error: "Invalid token format" });
      }
      token = tokenParts[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user || decoded; // support both payload shapes
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authenticateUser;