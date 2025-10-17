import React, { useState, useEffect } from 'react';
import { supabase } from '@/store/auth';
import useAuthStore from '@/store/auth';

// Define the feedback type
interface Feedback {
  id: string;
  name: string;
  role: string;
  message: string;
  created_at: string;
  user_id: string;
}

export default function FeedbackComponent() {
  const [showForm, setShowForm] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');

  // Get auth state
  const { user, isAuthenticated } = useAuthStore();

  // Fetch feedback on component mount
  useEffect(() => {
    fetchFeedback();
  }, []);

  // Fetch feedback from Supabase
  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError('Failed to load feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Submit feedback
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError('You must be logged in to submit feedback.');
      return;
    }

    if (!name || !role || !message) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const { error } = await supabase.from('feedback').insert({
        name,
        role,
        message,
        user_id: user?.id,
        created_at: new Date().toISOString()
      });

      if (error) throw error;

      // Reset form
      setName('');
      setRole('');
      setMessage('');

      // Show success message
      setSuccess('Your feedback has been submitted. Thank you!');

      // Refresh feedback list
      fetchFeedback();

      // Toggle back to view mode
      setTimeout(() => {
        setShowForm(false);
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Feedback</h2>

        {isAuthenticated && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'View Feedback' : 'Leave Feedback'}
          </button>
        )}
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}

      {!isAuthenticated && !showForm && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
          Please sign in to leave feedback.
        </div>
      )}

      {showForm && isAuthenticated ? (
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-xl font-medium mb-4">Share Your Thoughts</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your role (e.g. Intern, Manager)"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Feedback
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Share your experience and suggestions..."
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                  submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <div key={feedback.id} className="p-4 border border-gray-200 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-lg">{feedback.name}</h4>
                    <p className="text-sm text-gray-600">{feedback.role}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(feedback.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{feedback.message}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No feedback available yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
