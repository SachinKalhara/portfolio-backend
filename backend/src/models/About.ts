import mongoose, { Document, Schema } from 'mongoose';

// Timeline සඳහා හැඩය
export interface ITimeline {
  year: string;
  title: string;
  company: string;
  description: string;
  icon: string; // උදා: "Palette", "Code", "Calendar"
}

// About එකේ ප්‍රධාන හැඩය
export interface IAbout extends Document {
  heroDescription: string;
  bioParagraphs: string[]; // ඡේද කිහිපයක් සඳහා Array එකක්
  quickFacts: {
    age: string;
    location: string;
    education: string;
    role: string;
  };
  skills: string[];
  timeline: ITimeline[];
}

const aboutSchema: Schema = new mongoose.Schema({
  heroDescription: { 
    type: String, 
    default: "Bridging the gap between logical problem-solving and creative digital expression." 
  },
  bioParagraphs: { 
    type: [String], 
    default: [
      "I am an undergraduate student at the Faculty of Science, University of Peradeniya, where I specialize in Computer Science and Statistics. My passion lies at the intersection of analytical thinking and creative design.",
      "As a Full Stack Developer, I enjoy building robust web applications using the MERN stack. I love bringing complex ideas to life through clean code, automated scripts, and intuitive user interfaces.",
      "Beyond the world of coding, I am a dedicated Digital Creator. I work as a freelancer on platforms like Fiverr, crafting unique pattern designs. Whether I am writing an automation script or designing a seamless graphic pattern, I am always eager to learn, innovate, and create something impactful."
    ] 
  },
  quickFacts: {
    age: { type: String, default: "25 years old" },
    location: { type: String, default: "Sri Lanka" },
    education: { type: String, default: "University of Peradeniya" },
    role: { type: String, default: "Dev & Designer" }
  },
  skills: { 
    type: [String], 
    default: ["React", "Node.js", "MongoDB", "Express.js", "JavaScript", "Python", "Java", "Pattern Design", "Adobe Illustrator", "Photoshop", "Tailwind CSS", "C Programming"] 
  },
  timeline: {
    type: [{
      year: String,
      title: String,
      company: String,
      description: String,
      icon: { type: String, default: "Circle" }
    }],
    default: [
      { year: "2023 - Present", title: "Digital Creator & Freelancer", company: "Fiverr", description: "Providing creative pattern design services...", icon: "Palette" },
      { year: "2022 - Present", title: "Full Stack Web Developer", company: "Personal Projects", description: "Building responsive web applications...", icon: "Code" },
      { year: "2021 - Present", title: "Undergraduate Student", company: "University of Peradeniya", description: "Pursuing a degree...", icon: "Calendar" },
      { year: "2020 - 2021", title: "Start of Tech Journey", company: "Self-Taught", description: "Began exploring the world of programming...", icon: "Award" }
    ]
  }
});

export default mongoose.model<IAbout>('About', aboutSchema);