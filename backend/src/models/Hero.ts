import mongoose, { Document, Schema } from 'mongoose';

export interface ISlide {
  greeting: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

export interface IStat {
  label: string;
  val: string;
  icon: string;
  color: string;
}

export interface IHero extends Document {
  slides: ISlide[];
  techStack: string[];
  stats: IStat[];
}

const slideSchema = new Schema<ISlide>({
  greeting: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

const statSchema = new Schema<IStat>({
  label: { type: String, required: true },
  val: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true }
});

const heroSchema: Schema = new mongoose.Schema({
  slides: {
    type: [slideSchema],
    default: [
      { greeting: "Hi, I'm", title: "Sachin Kalhara", subtitle: "A Digital Creator merging tech with art.", imageUrl: "" }
    ]
  },
  techStack: {
    type: [String],
    default: ["React", "Node.js", "MongoDB", "Illustrator", "Fiverr Pro", "TailwindCSS"]
  },
  stats: {
    type: [statSchema],
    default: [
      { label: 'Completed Projects', val: '50+', icon: 'FolderOpen', color: 'text-blue-500' },
      { label: 'Client Satisfaction', val: '100%', icon: 'Heart', color: 'text-red-500' },
      { label: 'On-time Delivery', val: '100%', icon: 'Zap', color: 'text-yellow-500' },
      { label: 'Response Time', val: '< 1 Hour', icon: 'MessageSquare', color: 'text-green-500' }
    ]
  }
});

export default mongoose.model<IHero>('Hero', heroSchema);