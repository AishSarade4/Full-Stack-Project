import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Clock, Plus, Trash2, Edit2, History } from 'lucide-react';
import { cn } from '../lib/utils';

const cronJobSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  triggerUrl: z.string().url('Must be a valid URL'),
  apiKey: z.string().min(1, 'API Key is required'),
  schedule: z.string().min(1, 'Schedule is required'),
  startDate: z.string().min(1, 'Start date is required'),
});

type CronJob = z.infer<typeof cronJobSchema> & {
  id: string;
  status: 'active' | 'inactive';
  lastRun?: string;
  nextRun?: string;
};

type CronJobForm = z.infer<typeof cronJobSchema>;

export function CronJobs() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CronJobForm>({
    resolver: zodResolver(cronJobSchema)
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockJobs: CronJob[] = [
        {
          id: '1',
          name: 'Daily Backup',
          triggerUrl: 'https://api.example.com/backup',
          apiKey: 'sk_test_123',
          schedule: '0 0 * * *',
          startDate: '2024-03-01',
          status: 'active',
          lastRun: '2024-03-14T00:00:00Z',
          nextRun: '2024-03-15T00:00:00Z',
        },
      ];
      setJobs(mockJobs);
    } catch (err) {
      setError('Failed to fetch cron jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CronJobForm) => {
    try {
      if (isEditing) {
        // TODO: Replace with actual API call
        setJobs(jobs.map(job => 
          job.id === isEditing 
            ? { ...job, ...data }
            : job
        ));
        setIsEditing(null);
      } else {
        // TODO: Replace with actual API call
        const newJob: CronJob = {
          id: Date.now().toString(),
          ...data,
          status: 'active',
        };
        setJobs([...jobs, newJob]);
      }
      reset();
    } catch (err) {
      setError('Failed to save cron job');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      setJobs(jobs.filter(job => job.id !== id));
    } catch (err) {
      setError('Failed to delete cron job');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Clock className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cron Jobs</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing('')}
            className="inline-flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>New Job</span>
          </button>
        )}
      </div>

      {isEditing !== null && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              {...register('name')}
              type="text"
              className={cn(
                "mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                errors.name ? "border-red-300" : "border-gray-300"
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="triggerUrl" className="block text-sm font-medium text-gray-700">
              Trigger URL
            </label>
            <input
              {...register('triggerUrl')}
              type="url"
              className={cn(
                "mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                errors.triggerUrl ? "border-red-300" : "border-gray-300"
              )}
            />
            {errors.triggerUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.triggerUrl.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              API Key
            </label>
            <input
              {...register('apiKey')}
              type="text"
              className={cn(
                "mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                errors.apiKey ? "border-red-300" : "border-gray-300"
              )}
            />
            {errors.apiKey && (
              <p className="mt-1 text-sm text-red-600">{errors.apiKey.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">
              Schedule (Cron Expression)
            </label>
            <input
              {...register('schedule')}
              type="text"
              placeholder="0 0 * * *"
              className={cn(
                "mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                errors.schedule ? "border-red-300" : "border-gray-300"
              )}
            />
            {errors.schedule && (
              <p className="mt-1 text-sm text-red-600">{errors.schedule.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              {...register('startDate')}
              type="date"
              className={cn(
                "mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                errors.startDate ? "border-red-300" : "border-gray-300"
              )}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsEditing(null);
                reset();
              }}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {isEditing ? 'Update' : 'Create'} Job
            </button>
          </div>
        </form>
      )}

      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No cron jobs</h3>
          <p className="mt-2 text-sm text-gray-600">Get started by creating your first cron job.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Run
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Run
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.name}</div>
                    <div className="text-sm text-gray-500">{job.triggerUrl}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.schedule}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      job.status === 'active' 
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    )}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.lastRun ? new Date(job.lastRun).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.nextRun ? new Date(job.nextRun).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setShowHistory(job.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <History className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setIsEditing(job.id)}
                        className="text-blue-400 hover:text-blue-500"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Execution History</h2>
              <button
                onClick={() => setShowHistory(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              {/* TODO: Replace with actual history data */}
              <div className="text-sm text-gray-500">No history available</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}