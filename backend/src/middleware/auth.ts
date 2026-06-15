import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Request එකට user කියන කොටස අලුතින් එකතු කරනවා
export interface AuthRequest extends Request {
    user?: any;
}

const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header('x-auth-token');
    
    if (!token) {
        res.status(401).json({ message: "No token, authorization denied" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next(); 
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

export default auth;