import express from 'express';
import About from '../models/About';
import auth from '../middleware/auth';

const router = express.Router();

// Get About Data
router.get('/', async (req, res) => {
    try {
        res.json(await About.findOne() || new About());
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update About Data
router.put('/', auth, async (req, res) => {
    try {
        res.json(await About.findOneAndUpdate({}, req.body, { upsert: true, new: true }));
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;