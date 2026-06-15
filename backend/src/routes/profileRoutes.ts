import express from 'express';
import Profile from '../models/Profile';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
    try { res.json(await Profile.findOne() || new Profile()); }
    catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.put('/', auth, async (req, res) => {
    try { res.json(await Profile.findOneAndUpdate({}, req.body, { upsert: true, new: true })); }
    catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;