import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICandidate extends Document {
  name: string;
  email: string;
  role: string;
  status: 'Applied' | 'Screening' | 'Interviewing' | 'Offered' | 'Rejected' | 'Hired';
  experience: number;
  location: string;
  skills: string[];
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    status: {
      type: String,
      enum: ['Applied', 'Screening', 'Interviewing', 'Offered', 'Rejected', 'Hired'],
      default: 'Applied',
    },
    experience: { type: Number, required: true },
    location: { type: String, required: true },
    skills: { type: [String], default: [] },
    resumeUrl: { type: String },
  },
  { timestamps: true }
);

const Candidate: Model<ICandidate> =
  mongoose.models.Candidate || mongoose.model<ICandidate>('Candidate', CandidateSchema);

export default Candidate;
