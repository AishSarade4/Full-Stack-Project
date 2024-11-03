import cron from 'node-cron';
import axios from 'axios';
import { CronJob } from '../models/CronJob';
import { JobHistory } from '../models/JobHistory';
import { logger } from './logger';

class CronManager {
  private jobs: Map<string, cron.ScheduledTask>;

  constructor() {
    this.jobs = new Map();
  }

  async initialize() {
    const activeJobs = await CronJob.find({ isActive: true });
    activeJobs.forEach(job => this.scheduleJob(job));
  }

  scheduleJob(job: any) {
    if (this.jobs.has(job._id.toString())) {
      this.jobs.get(job._id.toString())?.stop();
    }

    const task = cron.schedule(job.schedule, async () => {
      try {
        const response = await axios.get(job.triggerUrl, {
          headers: {
            'Authorization': `Bearer ${job.apiKey}`
          }
        });

        await JobHistory.create({
          cronJobId: job._id,
          executionTime: new Date(),
          status: 'success',
          responseData: response.data
        });

        logger.info(`Job ${job.name} executed successfully`);
      } catch (error: any) {
        await JobHistory.create({
          cronJobId: job._id,
          executionTime: new Date(),
          status: 'failure',
          error: error.message
        });

        logger.error(`Job ${job.name} failed: ${error.message}`);
      }
    });

    this.jobs.set(job._id.toString(), task);
  }

  stopJob(jobId: string) {
    const task = this.jobs.get(jobId);
    if (task) {
      task.stop();
      this.jobs.delete(jobId);
    }
  }

  updateJob(job: any) {
    this.stopJob(job._id.toString());
    if (job.isActive) {
      this.scheduleJob(job);
    }
  }
}

export const cronManager = new CronManager();