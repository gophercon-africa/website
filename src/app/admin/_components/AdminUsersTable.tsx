'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { AuthorizedUserDto } from '@/src/types/admin';

export function AdminUsersTable({
  users,
  onUsersChange,
}: {
  users: AuthorizedUserDto[];
  onUsersChange: (users: AuthorizedUserDto[]) => void;
}) {
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  async function toggleRole(user: AuthorizedUserDto, role: 'isAdmin' | 'isReviewer') {
    const nextValue = !user[role];
    const previousUsers = users;

    onUsersChange(users.map((u) => (u.id === user.id ? { ...u, [role]: nextValue } : u)));
    setPendingIds((prev) => new Set(prev).add(user.id));

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [role]: nextValue }),
      });

      if (!res.ok) {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      onUsersChange(previousUsers);
      toast.error('Failed to update user');
      console.error(error);
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
    }
  }

  async function deleteUser(user: AuthorizedUserDto) {
    if (!window.confirm(`Remove ${user.email}? They will lose admin/reviewer access.`)) {
      return;
    }

    const previousUsers = users;
    onUsersChange(users.filter((u) => u.id !== user.id));

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Failed to delete user');
      }
      toast.success(`Removed ${user.email}`);
    } catch (error) {
      onUsersChange(previousUsers);
      toast.error('Failed to delete user');
      console.error(error);
    }
  }

  if (users.length === 0) {
    return <div className="p-8 text-center text-gray-500">No authorized users yet</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewer</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={user.isAdmin}
                  disabled={pendingIds.has(user.id)}
                  onChange={() => toggleRole(user, 'isAdmin')}
                  className="rounded border-gray-300 text-[#006B3F] focus:ring-[#006B3F]"
                  aria-label={`${user.email} is admin`}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={user.isReviewer}
                  disabled={pendingIds.has(user.id)}
                  onChange={() => toggleRole(user, 'isReviewer')}
                  className="rounded border-gray-300 text-[#006B3F] focus:ring-[#006B3F]"
                  aria-label={`${user.email} is reviewer`}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => deleteUser(user)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
