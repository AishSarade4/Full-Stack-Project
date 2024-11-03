import { Request, Response } from 'express';
import { CronJob } from '../models/CronJob';
import { JobHistory } from '../models/JobHistory';
import { cronManager } from '../lib/cronManager';
import { AppError } from '../lib/error';
import { AuthRequest } from '../types';

export async function createCronJob(req: AuthRequest, res: Response) {
  const cronJob = await CronJob.create({
    ...req.body,
    userId: req.user!.id
  });

  if (cronJob.isActive) {
    cronManager.scheduleJob(cronJob);
  }

  res.status(201).json(cronJob);
}

export async function getCronJobs(req: AuthRequest, res: Response) {
  const cronJobs = await CronJob.find({ userId: req.user!.id });
  res.json(cronJobs);
}

export async function getCronJob(req: AuthRequest, res: Response) {
  const cronJob = await CronJob.findOne({
    _id: req.params.id,
    userId: req.user!.id
  });

  if (!cronJob) {
    throw new AppError('Cron job not found', 404);
  }

  res.json(cronJob);
}

export async function updateCronJob(req: AuthRequest, res: Response) {
  const cronJob = await CronJob.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!.id },
    req.body,
    { new: true }
  );

  if (!cronJob) {
    throw new AppError('Cron job not found', 404);
  }

  cronManager.updateJob(cronJob);
  res.json(cronJob);
}

export async function deleteCronJob(req: AuthRequest, res: Response) {
  const cronJob = await CronJob.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!.id
  });

  if (!cronJob) {
    throw new AppError('Cron job not found', 404);
  }

  cronManager.stopJob(cronJob._id.toString());
  res.status(204).send();
}

export async function getCronJobHistory(req: AuthRequest, res: Response) {
  const cronJob = await CronJob.findOne({
    _id: req.params.id,
    userId: req.user!.id
  });

  if (!cronJob) {
    throw new AppError('Cron job not found', 404);
  }

  const history = await JobHistory.find({ cronJobId: cronJob._id })
    .sort({ executionTime: -1 })
    .limit(100);

  res.json(history);
}