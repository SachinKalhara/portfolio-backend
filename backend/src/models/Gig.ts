import mongoose, { Document, Schema } from 'mongoose';

export interface IGig extends Document {
  title: string;
  category: string;
  price: string;
  images: string[];     // 🔴 imageUrl වෙනුවට images (Array) එකක් දැම්මා
  badge: string;        // 🔴 අලුත් Badge field එක
  link: string;
  sellerName: string;
  sellerLevel: string;
  sellerImage: string;
  reviewCount: string;
}

const gigSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  images: { type: [String], default: [] },        // 🔴 Array of Strings
  badge: { type: String, default: 'None' },       // 🔴 Default අගය 'None'
  link: { type: String, required: true },
  sellerName: { type: String, default: 'sachin_kalhara' },
  sellerLevel: { type: String, default: 'Level 2 Seller' },
  sellerImage: { type: String, default: '' },
  reviewCount: { type: String, default: '1k+' }
}, { timestamps: true });

export default mongoose.model<IGig>('Gig', gigSchema);