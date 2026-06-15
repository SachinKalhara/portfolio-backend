// src/routes/contactRoutes.ts
import express, { Request, Response } from 'express';
import Contact from '../models/Contact';
import Visitor from '../models/Visitor';
import auth from '../middleware/auth';

const router = express.Router();

// Get all messages
router.get('/messages', auth, async (req: Request, res: Response) => {
    try {
        const messages = await Contact.find().sort({ date: -1 });
        res.json(messages);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Delete message
router.delete('/:id', auth, async (req: Request, res: Response) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Toggle replied status
router.put('/:id', auth, async (req: Request, res: Response) => {
    try {
        const msg = await Contact.findById(req.params.id);
        if (msg) {
            msg.isReplied = !msg.isReplied;
            await msg.save();
            res.json(msg);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Add new message (Public Route)
router.post('/', async (req: Request, res: Response) => {
    try {
        const newContact = new Contact(req.body);
        const savedContact = await newContact.save();
        res.status(201).json(savedContact);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;