import mongoose from 'mongoose';

const cronJobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  triggerUrl: {
    type: String,
    required: true,
    trim: true
  },
  apiKey: {
    type: String,
    required: true
  },
  schedule: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const CronJob = mongoose.model('CronJob', cronJobSchema);