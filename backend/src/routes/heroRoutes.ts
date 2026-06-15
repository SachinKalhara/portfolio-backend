import express from 'express';
import Hero from '../models/Hero';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
    try { res.json(await Hero.findOne() || new Hero()); }
    catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.put('/', auth, async (req, res) => {
    try { res.json(await Hero.findOneAndUpdate({}, req.body, { upsert: true, new: true })); }
    catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;