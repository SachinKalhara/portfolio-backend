// src/routes/authRoutes.ts
import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios'; // 🟢 අලුතින් එක් කළ Import එක (OAuth2Client වෙනුවට)
import User from '../models/User';
import auth, { AuthRequest } from '../middleware/auth';

const router = express.Router();

// 1. Admin Login (Manual)
router.post('/login', async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password as string))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id, role: 'admin' }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Google Login (🟢 නිවැරදි කළ කොටස - axios හරහා Access Token පරීක්ෂා කිරීම)
router.post('/google', async (req: Request, res: Response): Promise<any> => {
    try {
        // Frontend එකෙන් දැන් එවන්නේ Google 'access_token' එකයි
        const { token } = req.body; 
        
        console.log("Received Token:", token ? "Token present" : "Token missing");

        if (!token) {
            return res.status(400).json({ message: "No token provided!" });
        }

        // 🟢 verifyIdToken වෙනුවට axios හරහා Google UserInfo endpoint එකට කතා කිරීම
        const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const payload = googleResponse.data;

        if (!payload || !payload.email) {
            return res.status(401).json({ message: "Invalid Google Token!" });
        }

        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

        // Admin Email එක ගැලපෙනවාදැයි පරීක්ෂා කිරීම
        if (payload.email === ADMIN_EMAIL) {
            const authToken = jwt.sign(
                { email: payload.email, role: 'admin' }, 
                process.env.JWT_SECRET as string, 
                { expiresIn: '1d' }
            );
            return res.json({ token: authToken, user: { email: payload.email, role: 'admin' } });
        } else {
            return res.status(403).json({ message: "Unauthorized Account! Access Denied." });
        }
    } catch (error: any) {
        console.error("Google Auth Error:", error.message);
        // Error එක මොකක්ද කියලා හරියටම බලාගන්න Error Message එක යවනවා
        return res.status(500).json({ message: "Internal Server Error", details: error.message });
    }
});

// 3. Image Upload
router.post('/upload', auth, async (req: AuthRequest, res: Response) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, { folder: 'portfolio' });
        res.json({ url: uploadResponse.secure_url });
    } catch (err) {
        res.status(500).json({ err: 'Cloudinary upload failed' });
    }
});

// 4. Delete Image from Cloudinary
router.delete('/image', auth, async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) return res.status(400).json({ message: "No image URL provided" });

        // Cloudinary URL එකෙන් public_id එක වෙන් කර ගැනීම
        const matches = imageUrl.match(/\/v\d+\/([^/]+(?:\/[^/]+)*)\.[a-z]+$/);
        const publicId = matches ? matches[1] : null;

        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
            res.json({ message: "Old image deleted from Cloudinary successfully" });
        } else {
            res.status(400).json({ message: "Invalid Cloudinary URL" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;