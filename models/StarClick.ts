import mongoose, { Document, Schema } from 'mongoose';

export interface IStarClick extends Document {
  clickedAt: Date;
}

const starClickSchema = new Schema<IStarClick>({
  clickedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  versionKey: false,
});

// Add index for better query performance
starClickSchema.index({ clickedAt: -1 });

export default mongoose.models.StarClick || mongoose.model<IStarClick>('StarClick', starClickSchema);