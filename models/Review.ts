import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  name: string;
  email: string;
  rating: number;
  opinion: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [4, 'Rating must not exceed 4'],
  },
  opinion: {
    type: String,
    required: [true, 'Opinion is required'],
    trim: true,
    minlength: [10, 'Opinion must be at least 10 characters long'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  versionKey: false,
});

// Add indexes for better query performance
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ email: 1 });

export default mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);