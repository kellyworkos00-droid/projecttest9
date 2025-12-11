'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, TrendingUp } from 'lucide-react';

interface Playbook {
  id: string;
  slug: string;
  title: string;
  description: string;
  domain: string;
  effort: string;
  timeMinutes: number;
  views: number;
  downloads: number;
  published: boolean;
  createdAt: string;
}

export default function AdminPlaybooksPage() {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaybooks();
  }, []);

  const fetchPlaybooks = async () => {
    try {
      const res = await fetch('/api/admin/playbooks?published=all');
      const data = await res.json();
      setPlaybooks(data.playbooks);
    } catch (error) {
      console.error('Failed to fetch playbooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this playbook?')) return;

    try {
      await fetch(`/api/admin/playbooks/${id}`, {
        method: 'DELETE',
      });
      fetchPlaybooks();
    } catch (error) {
      alert('Failed to delete playbook');
    }
  };

  const togglePublished = async (id: string, published: boolean) => {
    try {
      await fetch(`/api/admin/playbooks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      });
      fetchPlaybooks();
    } catch (error) {
      alert('Failed to update playbook');
    }
  };

  return (
    <div className="min-h-screen bg-sand-light">
      <header className="bg-white border-b border-sand-dark/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold text-primary">BiashaDrive Admin</span>
            </Link>
            <Link
              href="/admin/playbooks/new"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Playbook
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-heading font-bold text-charcoal mb-8">Playbooks</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-charcoal/60">Loading...</div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-sand-dark/20 overflow-hidden">
            <table className="w-full">
              <thead className="bg-sand-light border-b border-sand-dark/20">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Domain</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Stats</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-charcoal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-dark/20">
                {playbooks.map((playbook) => (
                  <tr key={playbook.id} className="hover:bg-sand-light/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-charcoal">{playbook.title}</div>
                        <div className="text-sm text-charcoal/60">{playbook.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {playbook.domain}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal/60">
                      {playbook.views} views · {playbook.downloads} downloads
                    </td>
                    <td className="px-6 py-4">
                      {playbook.published ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => togglePublished(playbook.id, playbook.published)}
                          className="p-2 hover:bg-sand-light rounded-lg transition-colors"
                          title={playbook.published ? 'Unpublish' : 'Publish'}
                        >
                          {playbook.published ? (
                            <EyeOff className="w-4 h-4 text-charcoal/60" />
                          ) : (
                            <Eye className="w-4 h-4 text-charcoal/60" />
                          )}
                        </button>
                        <Link
                          href={`/admin/playbooks/${playbook.id}`}
                          className="p-2 hover:bg-sand-light rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-charcoal/60" />
                        </Link>
                        <button
                          onClick={() => handleDelete(playbook.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
