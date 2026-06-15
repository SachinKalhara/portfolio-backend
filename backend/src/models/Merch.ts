import mongoose, { Document, Schema } from 'mongoose';

export interface IMerch extends Document {
  shopLink: string;
  items: { title: string; type: string; originalImg: string; mockupImg: string; tag: string; }[];
}

const merchSchema: Schema = new mongoose.Schema({
  shopLink: { type: String, default: "https://www.redbubble.com/people/SCreative10/shop?asc=u" },
  items: { type: Array, default: [] }
});

export default mongoose.model<IMerch>('Merch', merchSchema);