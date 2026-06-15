import express from 'express';
import Gig from '../models/Gig';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
    try { res.json(await Gig.find().sort({ createdAt: -1 })); }
    catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/', auth, async (req, res) => {
    try { res.status(201).json(await new Gig(req.body).save()); }
    catch (error: any) { res.status(500).json({ error: error.message }); }
});

// අලුතින් එකතු කළ Update (PUT) route එක
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedGig = await Gig.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedGig) return res.status(404).json({ message: 'Gig not found' });
        res.json(updatedGig);
    }
    catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.delete('/:id', auth, async (req, res) => {
    try { await Gig.findByIdAndDelete(req.params.id); res.json({ message: 'Gig Deleted' }); }
    catch (error: any) { res.status(500).json({ error: error.message }); }
});

export default router;