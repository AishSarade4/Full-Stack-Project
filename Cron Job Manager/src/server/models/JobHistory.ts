import mongoose from 'mongoose';

const jobHistorySchema = new mongoose.Schema({
  cronJobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CronJob',
    required: true
  },
  executionTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failure'],
    required: true
  },
  responseData: mongoose.Schema.Types.Mixed,
  error: String
}, {
  timestamps: true
});

export const JobHistory = mongoose.model('JobHistory', jobHistorySchema);