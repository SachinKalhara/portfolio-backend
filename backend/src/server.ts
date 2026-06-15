// src/server.ts
import express, { Request, Response, NextFunction } from 'express'; // 🟢 අලුතින් Types import කර ඇත
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import helmet from 'helmet'; // 🛡️ ආරක්ෂක කබාය
import rateLimit from 'express-rate-limit'; // 🛑 DDoS ප්‍රහාර වැළැක්වීමට
import mongoSanitize from 'express-mongo-sanitize'; // 💉 NoSQL Injection වැළැක්වීමට

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

// 2. CORS සීමා කිරීම (Production වලදී .env හරහා URL එක දීම වඩාත් ආරක්ෂිතයි)
const allowedOrigins = process.env.FRONTEND_URL 
    ? [process.env.FRONTEND_URL, 'http://localhost:8080', 'http://localhost:5173']
    : ['http://localhost:8080', 'http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// 3. DDoS ආරක්ෂාව (Rate Limiting)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // විනාඩි 15ක්
    max: 100, // එක් IP එකකට විනාඩි 15ට උපරිම 100 requests
    message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// 4. Data Parsing
app.use(express.json({ limit: '2mb' })); // Payload size 2mb දක්වා අඩු කිරීම
app.use(express.urlencoded({ limit: '2mb', extended: true }));

// 🟢 5. Express 5 සඳහා අනිවාර්ය විසඳුම (TypeError එක වළක්වා ගැනීමට)
app.use((req: Request, res: Response, next: NextFunction) => {
    Object.defineProperty(req, 'query', {
        value: req.query,
        writable: true,
        configurable: true,
        enumerable: true,
    });
    next();
});

// 6. දත්ත පවිත්‍ර කිරීම (Injection ආරක්ෂාව)
app.use(mongoSanitize({
  replaceWith: '_'
}));

// Cloudinary & DB Connection
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log('✅ Connected to MongoDB...'))
    .catch(err => console.error('❌ MongoDB error:', err));

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

// 🟢 7. Global Error Handler (මෙහිදී Server එක crash වීම වළක්වයි)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("🔥 Server Error:", err.message);
    res.status(500).json({ 
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal Server Error' 
            : err.message 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));