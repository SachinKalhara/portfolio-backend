import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description?: string; // ? දැම්මම මේක අනිවාර්ය නෑ
    techStack?: string[]; // අනිවාර්ය නෑ
    link?: string;
    imageUrl: string;
    category: string;
    stars: number;
    hearts: number;
    createdAt: Date;
}

const ProjectSchema: Schema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String }, // required: true අයින් කළා
    techStack: { type: [String] }, // required: true අයින් කළා
    link: { type: String },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    stars: { type: Number, default: 0 },
    hearts: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProject>('Project', ProjectSchema);