import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const protectedRoute = (req, res, next) => {

    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;
        next();
    } catch (err) {
        console.error("❌ JWT verification error:", err);
        return res.status(403).json({ message: "Forbidden access" });
    }
};

export { protectedRoute };