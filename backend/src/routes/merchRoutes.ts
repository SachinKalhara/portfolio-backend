import express from 'express';
import Merch from '../models/Merch';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
    try { res.json(await Merch.findOne() || new Merch()); }
    catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.put('/', auth, async (req, res) => {
    try { res.json(await Merch.findOneAndUpdate({}, req.body, { upsert: true, new: true })); }
    catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;