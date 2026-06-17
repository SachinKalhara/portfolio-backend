// src/server.ts
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import helmet from 'helmet'; 
import rateLimit from 'express-rate-limit'; 
import mongoSanitize from 'express-mongo-sanitize'; 

// Routes Imports
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import gigRoutes from './routes/gigRoutes';
import commentRoutes from './routes/commentRoutes';
import contactRoutes from './routes/contactRoutes';
import aboutRoutes from './routes/aboutRoutes';
import heroRoutes from './routes/heroRoutes';
import profileRoutes from './routes/profileRoutes';
import merchRoutes from './routes/merchRoutes';

dotenv.config();
const app = express();

// 1. HTTP Headers ආරක්ෂාව (Helmet)
app.use(helmet());

// 2. CORS සීමා කිරීම
const allowedOrigins = process.env.FRONTEND_URL 
    ? [process.env.FRONTEND_URL, 'http://localhost:8080', 'http://localhost:5173']
    : ['http://localhost:8080', 'http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// 3. DDoS ආරක්ෂාව (Rate Limiting)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// 4. Data Parsing
app.use(express.json({ limit: '2mb' })); 
app.use(express.urlencoded({ limit: '2mb', extended: true }));

// 5. Express 5 සඳහා අනිවාර්ය විසඳුම
app.use((req: Request, res: Response, next: NextFunction) => {
    Object.defineProperty(req, 'query', {
        value: req.query,
        writable: true,
        configurable: true,
        enumerable: true,
    });
    next();
});

// 6. දත්ත පවිත්‍ර කිරීම
app.use(mongoSanitize({ replaceWith: '_' }));

// Cloudinary Config
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// 🔴 7. Vercel Serverless සඳහා MongoDB Connection Caching (වඩාත්ම සාර්ථක විසඳුම)
const connectDB = async () => {
    // දැනටමත් සම්බන්ධ වී ඇත්නම්, නැවත සම්බන්ධ වීම වළක්වයි
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('✅ Connected to MongoDB...');
    } catch (err) {
        console.error('❌ MongoDB error:', err);
    }
};

// හැම API Request එකකදීම Database සම්බන්ධතාවය පරීක්ෂා කර තහවුරු කිරීම
app.use(async (req: Request, res: Response, next: NextFunction) => {
    await connectDB();
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/merch', merchRoutes);

// 8. Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("🔥 Server Error:", err.message);
    res.status(500).json({ 
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal Server Error' 
            : err.message 
    });
});


// Server එක ධාවනය කිරීම (Railway විසින් ස්වයංක්‍රීයව PORT එකක් ලබාදෙයි)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
// Vercel Serverless Functions සඳහා අනිවාර්ය වේ
export default app;