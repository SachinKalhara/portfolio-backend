import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email: string;
    message: string;
    date: Date;
    isReplied: boolean; // <-- අලුතින් එකතු කළ කොටස
}

const ContactSchema: Schema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isReplied: { type: Boolean, default: false } // <-- අලුතින් එකතු කළ කොටස
});

export default mongoose.model<IContact>('Contact', ContactSchema);