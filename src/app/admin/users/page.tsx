'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { AdminUsersTable } from '@/src/app/admin/_components/AdminUsersTable';
import type { AuthorizedUserDto } from '@/src/types/admin';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AuthorizedUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReviewer, setIsReviewer] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to load users');
      setUsers(await res.json());
    } catch (error) {
      toast.error('Failed to load users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!isAdmin && !isReviewer) {
      toast.error('Select at least one role');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), isAdmin, isReviewer }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? 'Failed to add user');
      }

      const newUser: AuthorizedUserDto = await res.json();
      setUsers((prev) => [...prev, newUser].sort((a, b) => a.email.localeCompare(b.email)));
      setEmail('');
      setIsAdmin(false);
      setIsReviewer(true);
      toast.success(`Added ${newUser.email}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add user');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-gray-600 mt-2">Configure who has reviewer and admin access</p>
          </div>
          <Link href="/admin" className="text-sm font-medium text-[#006B3F] hover:underline">
            Back to dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Add user</h2>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-4 flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[240px]">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/20 focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-1.5 text-sm text-gray-700 pb-2">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="rounded border-gray-300 text-[#006B3F] focus:ring-[#006B3F]"
              />
              Admin
            </label>
            <label className="flex items-center gap-1.5 text-sm text-gray-700 pb-2">
              <input
                type="checkbox"
                checked={isReviewer}
                onChange={(e) => setIsReviewer(e.target.checked)}
                className="rounded border-gray-300 text-[#006B3F] focus:ring-[#006B3F]"
              />
              Reviewer
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#006B3F] hover:bg-[#005a34] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add user
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Authorized users</h2>
          </div>
          <AdminUsersTable users={users} onUsersChange={setUsers} />
        </div>
      </div>
    </div>
  );
}
