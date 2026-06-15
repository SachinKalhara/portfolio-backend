import mongoose, { Document, Schema } from 'mongoose';

// Profile එකේ හැඩය (Interface)
export interface IProfile extends Document {
  email: string;
  phone: string;
  location: string;
  socialLinks: {
    linkedin: string;
    github: string;
    instagram: string;
    pinterest: string;
    youtube: string;
  };
}

// Database Schema එක
const profileSchema: Schema = new mongoose.Schema({
  email: { type: String, default: "hello@sachinkalhara.com" },
  phone: { type: String, default: "+94 7X XXX XXXX" },
  location: { type: String, default: "Peradeniya, Sri Lanka" },
  socialLinks: {
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    instagram: { type: String, default: "" },
    pinterest: { type: String, default: "" },
    youtube: { type: String, default: "" } // මේක හිස්ව තියෙනකම් සයිට් එකේ පේන්නේ නෑ
  }
});

export default mongoose.model<IProfile>('Profile', profileSchema);