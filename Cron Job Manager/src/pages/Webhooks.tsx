import React from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuthStore } from '../store/auth';

interface Webhook {
  _id: string;
  cronJobId: {
    _id: string;
    name: string;
  };
  data: any;
  headers: any;
  createdAt: string;
}

export function Webhooks() {
  const [webhooks, setWebhooks] = React.useState<Webhook[]>([]);
  const [selectedWebhook, setSelectedWebhook] = React.useState<Webhook | null>(null);
  const { token } = useAuthStore();

  const fetchWebhooks = async () => {
    try {
      const response = await axios.get('/api/webhooks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWebhooks(response.data);
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
    }
  };

  React.useEffect(() => {
    fetchWebhooks();
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Webhook Data</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Webhooks</h2>
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <div
                key={webhook._id}
                onClick={() => setSelectedWebhook(webhook)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedWebhook?._id === webhook._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{webhook.cronJobId.name}</span>
                  <span className="text-sm text-gray-600">
                    {format(new Date(webhook.createdAt), 'PPpp')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {JSON.stringify(webhook.data).substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </div>

        {selectedWebhook && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Webhook Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Headers</h3>
                <pre className="mt-1 p-4 bg-gray-50 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(selectedWebhook.headers, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Data</h3>
                <pre className="mt-1 p-4 bg-gray-50 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(selectedWebhook.data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}