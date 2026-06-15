import express, { Request, Response } from 'express';
import Project from '../models/Project';
import auth, { AuthRequest } from '../middleware/auth';

const router = express.Router();

// 1. Get All Projects (Public)
router.get('/', async (req: Request, res: Response) => {
    try {
        const projects = await Project.find().sort({ _id: -1 });
        res.json(projects);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Add New Project (Admin Only)
router.post('/', auth, async (req: AuthRequest, res: Response) => {
    try {
        const newProject = new Project(req.body);
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Update Project (Admin Only)
router.put('/:id', auth, async (req: AuthRequest, res: Response) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProject);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Delete Project (Admin Only)
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Toggle Star or Heart
router.put('/:id/react', async (req: Request, res: Response) => {
    try {
        const { type, action } = req.body; 
        const incrementValue = action === 'add' ? 1 : -1;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (type === 'star') project.stars = Math.max(0, (project.stars || 0) + incrementValue);
        else project.hearts = Math.max(0, (project.hearts || 0) + incrementValue);

        await project.save();
        res.json(project);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;