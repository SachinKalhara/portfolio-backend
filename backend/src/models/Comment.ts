import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  name: string;
  role: string;
  text: string;
  rating: number;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IComment>('Comment', CommentSchema);