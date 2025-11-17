import jwt from 'jsonwebtoken';
import ExpressError from './ExpressError.js';

export const VerifyAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return next(new ExpressError(401, "Access denied. No token provided."));
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        next(new ExpressError(401, "Invalid token."));
    }
};

export default VerifyAuth;