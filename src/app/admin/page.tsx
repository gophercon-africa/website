'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { AdminSubmissionsTable } from '@/src/app/admin/_components/AdminSubmissionsTable';
import { CollapsibleSection } from '@/src/app/admin/_components/CollapsibleSection';
import type { AdminStats, ReviewerProgress, AdminSubmission } from '@/src/types/admin';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Review system statistics and progress</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/selection"
              className="text-sm font-semibold text-white bg-brand hover:bg-brand-dark dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg px-4 py-2 transition-colors"
            >
              Selection Mode
            </Link>
            <Link href="/admin/users" className="text-sm font-medium text-brand dark:text-emerald-400 hover:underline">
              Manage Users
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
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
            title="Shortlisted"
            value={stats?.shortlisted || 0}
            color="sky"
          />
          <StatCard
            title="Waitlisted"
            value={stats?.waitlisted || 0}
            color="violet"
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

        <CollapsibleSection title="Reviewer Progress" storageKey="admin-section-reviewer-progress">
          {progress.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No reviewer data available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reviewer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completed</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {progress.map((reviewer) => (
                    <tr key={reviewer.reviewerEmail} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {reviewer.reviewerEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {reviewer.reviewsCompleted} / {reviewer.totalSubmissions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 min-w-[100px]">
                            <div
                              className="bg-brand h-2 rounded-full transition-all duration-500"
                              style={{ width: `${reviewer.percentageComplete}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem] text-right">
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
        </CollapsibleSection>

        <CollapsibleSection title="Submissions Overview" storageKey="admin-section-submissions">
          <AdminSubmissionsTable submissions={submissions} onChanged={loadData} />
        </CollapsibleSection>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
    yellow: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400',
    sky: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400',
    violet: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400',
    green: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400',
    red: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-black/40 p-6 border border-transparent dark:border-gray-800">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
      <p className={`text-3xl font-bold ${colors[color as keyof typeof colors]}`}>
        {value}
      </p>
    </div>
  );
}
