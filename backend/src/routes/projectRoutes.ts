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
// src/routes/projectRoutes.ts
router.post('/', auth, async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, techStack, link, githubLink, category, imageUrl } = req.body;
        
        const newProject = new Project({
            title, description, techStack, link, githubLink, category, imageUrl
        });
        
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
// 3. Update Project (Admin Only)
router.put('/:id', auth, async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, techStack, link, githubLink, category, imageUrl } = req.body;
        
        // 1. මුලින්ම project එක හොයන්න
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // 2. අතින් අගයන් Set කරන්න (Explicit update)
        project.title = title;
        project.description = description;
        project.techStack = techStack;
        project.link = link;
        project.githubLink = githubLink; // 🟢 මෙතනදී අනිවාර්යයෙන්ම Assign වෙනවා
        project.category = category;
        project.imageUrl = imageUrl;

        // 3. Save කරන්න
        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error: any) {
        console.error("Update Error:", error);
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