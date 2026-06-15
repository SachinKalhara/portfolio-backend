import express, { Request, Response } from 'express';
import Comment from '../models/Comment';
import auth, { AuthRequest } from '../middleware/auth';

const router = express.Router();

// 1. Get All Comments (Public)
router.get('/', async (req: Request, res: Response) => {
    try { 
        const comments = await Comment.find().sort({ createdAt: -1 });
        res.json(comments); 
    } catch (error: any) { 
        res.status(500).json({ error: error.message }); 
    }
});

// 2. Add New Comment (Admin Only)
router.post('/', auth, async (req: AuthRequest, res: Response) => {
    try { 
        const newComment = new Comment(req.body);
        const savedComment = await newComment.save();
        res.status(201).json(savedComment); 
    } catch (error: any) { 
        res.status(500).json({ error: error.message }); 
    }
});

// 3. Delete Comment (Admin Only)
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
    try { 
        await Comment.findByIdAndDelete(req.params.id); 
        res.json({ message: 'Comment Deleted' }); 
    } catch (error: any) { 
        res.status(500).json({ error: error.message }); 
    }
});

export default router;