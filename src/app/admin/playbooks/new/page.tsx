'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const DOMAINS = ['cashflow', 'compliance', 'marketing', 'operations', 'legal'];
const EFFORTS = ['low', 'medium', 'high'];

export default function NewPlaybookPage() {
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    titleSw: '',
    description: '',
    descriptionSw: '',
    content: '',
    contentSw: '',
    domain: 'cashflow',
    sector: '',
    county: '',
    effort: 'medium',
    timeMinutes: 10,
    templateUrl: '',
    published: false,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/playbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create playbook');

      router.push('/admin/playbooks');
    } catch (error) {
      alert('Failed to create playbook');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-light">
      <header className="bg-white border-b border-sand-dark/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/admin/playbooks" className="flex items-center gap-2 text-charcoal hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Playbooks</span>
            </Link>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Playbook'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-heading font-bold text-charcoal mb-8">Create New Playbook</h1>

        <form className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-sand-dark/20">
            <h2 className="text-xl font-heading font-bold text-charcoal mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="kra-pin-registration"
                  className="w-full px-4 py-2 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Title (English)</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Title (Kiswahili)</label>
                  <input
                    type="text"
                    value={formData.titleSw}
                    onChange={(e) => setFormData({ ...formData, titleSw: e.target.value })}
                    className="w-full px-4 py-2 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Description (English)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Description (Kiswahili)</label>
                <textarea
                  value={formData.descriptionSw}
                  onChange={(e) => setFormData({ ...formData, descriptionSw: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-sand-dark/20">
            <h2 className="text-xl font-heading font-bold text-charcoal mb-4">Content</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Content (English - Markdown)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-2 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                  placeholder="## Step 1&#10;Content here..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Content (Kiswahili - Markdown)</label>
                <textarea
                  value={formData.contentSw}
                  onChange={(e) => setFormData({ ...formData, contentSw: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-2 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-sand-dark/20">
            <h2 className="text-xl font-heading font-bold text-charcoal mb-4">Metadata</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Domain</label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-4 py-2 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Effort</label>
                <select
                  value={formData.effort}
                  onChange={(e) => setFormData({ ...formData, effort: e.target.value })}
                  className="w-full px-4 py-2 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {EFFORTS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Time (minutes)</label>
                <input
                  type="number"
                  value={formData.timeMinutes}
                  onChange={(e) => setFormData({ ...formData, timeMinutes: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Template URL</label>
                <input
                  type="url"
                  value={formData.templateUrl}
                  onChange={(e) => setFormData({ ...formData, templateUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm font-medium text-charcoal">Publish immediately</span>
              </label>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
