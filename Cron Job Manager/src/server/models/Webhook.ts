import mongoose from 'mongoose';

const webhookSchema = new mongoose.Schema({
  cronJobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CronJob',
    required: true
  },
  data: mongoose.Schema.Types.Mixed,
  headers: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

export const Webhook = mongoose.model('Webhook', webhookSchema);