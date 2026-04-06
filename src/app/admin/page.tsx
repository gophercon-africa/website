'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AdminStats {
  total: number;
  pending: number;
  reviewed: number;
  accepted: number;
  rejected: number;
}

interface ReviewerProgress {
  reviewerEmail: string;
  reviewsCompleted: number;
  totalSubmissions: number;
  percentageComplete: number;
}

interface AdminSubmission {
  id: string;
  talkTitle: string;
  fullName: string;
  talkCategory: string;
  averageRating: number | null;
  reviewCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [progress, setProgress] = useState<ReviewerProgress[]>([]);
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [statsRes, progressRes, submissionsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/progress'),
        fetch('/api/admin/submissions'),
      ]);

      if (!statsRes.ok) {
        throw new Error('Failed to load dashboard data');
      }

      const statsData = await statsRes.json();
      
      let progressData = { reviewers: [] };
      if (progressRes.ok) {
         try {
           progressData = await progressRes.json();
         } catch(e) {
           console.warn("Failed to parse progress data", e)
         }
      }

      let submissionsData: AdminSubmission[] = [];
      if (submissionsRes.ok) {
        try {
          submissionsData = await submissionsRes.json();
        } catch(e) {
          console.warn("Failed to parse submissions data", e);
        }
      }

      setStats(statsData);
      setProgress(progressData.reviewers || []);
      setSubmissions(submissionsData);
    } catch (error) {
      toast.error('Failed to load dashboard');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Review system statistics and progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Submissions"
            value={stats?.total || 0}
            color="blue"
          />
          <StatCard
            title="Pending Review"
            value={stats?.pending || 0}
            color="yellow"
          />
          <StatCard
            title="Reviewed"
            value={stats?.reviewed || 0}
            color="purple"
          />
          <StatCard
            title="Accepted"
            value={stats?.accepted || 0}
            color="green"
          />
          <StatCard
            title="Rejected"
            value={stats?.rejected || 0}
            color="red"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Reviewer Progress</h2>
          </div>
          
          {progress.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No reviewer data available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {progress.map((reviewer) => (
                    <tr key={reviewer.reviewerEmail} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reviewer.reviewerEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {reviewer.reviewsCompleted} / {reviewer.totalSubmissions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 w-full bg-gray-200 rounded-full h-2 min-w-[100px]">
                            <div
                              className="bg-[#006B3F] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${reviewer.percentageComplete}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-right">
                            {reviewer.percentageComplete}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Submissions Overview</h2>
          </div>
          {submissions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No submissions found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speaker</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Rating</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.talkTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{submission.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{submission.talkCategory}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {submission.averageRating !== null ? submission.averageRating.toFixed(1) : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{submission.reviewCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    purple: 'bg-purple-50 text-purple-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className={`text-3xl font-bold ${colors[color as keyof typeof colors]}`}>
        {value}
      </p>
    </div>
  );
}
