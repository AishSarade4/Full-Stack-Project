import { Request, Response } from 'express';
import { CronJob } from '../models/CronJob';
import { Webhook } from '../models/Webhook';
import { AppError } from '../lib/error';
import { AuthRequest } from '../types';

export async function createWebhook(req: AuthRequest, res: Response) {
  const cronJob = await CronJob.findOne({
    _id: req.params.cronJobId,
    userId: req.user!.id
  });

  if (!cronJob) {
    throw new AppError('Cron job not found', 404);
  }

  const webhook = await Webhook.create({
    cronJobId: cronJob._id,
    data: req.body,
    headers: req.headers
  });

  res.status(201).json(webhook);
}

export async function getWebhooks(req: AuthRequest, res: Response) {
  const webhooks = await Webhook.find()
    .populate('cronJobId')
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(webhooks);
}