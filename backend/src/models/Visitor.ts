import mongoose, { Document, Schema } from 'mongoose';

// 1. TypeScript Interface එක (Type Safety සඳහා)
export interface IVisitor extends Document {
  name: string;
  count: number;
}

// 2. Mongoose Schema එක
const visitorSchema: Schema = new mongoose.Schema({
  name: { 
    type: String, 
    default: 'portfolio_stats' 
  },
  count: { 
    type: Number, 
    default: 0 
  }
});

// 3. Model එක Export කිරීම
export default mongoose.model<IVisitor>('Visitor', visitorSchema);