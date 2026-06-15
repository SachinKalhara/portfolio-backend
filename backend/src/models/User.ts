import mongoose, { Document, Schema } from 'mongoose';

// User ගේ හැඩය (Interface)
export interface IUser extends Document {
    username: string;
    password?: string; 
}

const UserSchema: Schema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

export default mongoose.model<IUser>('User', UserSchema);