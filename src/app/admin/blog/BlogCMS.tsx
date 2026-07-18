'use client';

import React, { useState } from 'react';
import { saveBlogPost, deleteBlogPost } from '@/app/actions/blog';
import { useRouter } from 'next/navigation';

import { BlogPostData } from '@/types';

export default function BlogCMS({ initialPosts }: { initialPosts: any[] }) {
  const [posts] = useState(initialPosts);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPostData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleEditClick = (post: any) => {
    setCurrentPost({
      ...post,
      categories: Array.isArray(JSON.parse(post.categories || '[]')) 
        ? JSON.parse(post.categories).join(', ') 
        : post.categories,
      tags: Array.isArray(JSON.parse(post.tags || '[]')) 
        ? JSON.parse(post.tags).join(', ') 
        : post.tags,
    });
    setIsEditing(true);
    setError('');
  };

  const handleAddClick = () => {
    setCurrentPost({
      title: '',
      slug: '',
      contentMarkdown: '',
      categories: '',
      tags: '',
      isDraft: 1,
    });
    setIsEditing(true);
    setError('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCurrentPost((prev) => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formattedData = {
      ...currentPost,
      categories: (currentPost.categories as string)
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      tags: (currentPost.tags as string)
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const result = await saveBlogPost(formattedData);
    if (result.success) {
      setIsEditing(false);
      router.refresh();
      window.location.reload();
    } else {
      setError(result.error || 'Failed to save essay.');
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setLoading(true);
    const result = await deleteBlogPost(id);
    if (result.success) {
      router.refresh();
      window.location.reload();
    } else {
      setError(result.error || 'Failed to delete post.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">Writing Index</h1>
          <p className="text-sm text-gray-400">Write, edit, and publish technical markdown journal articles.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={handleAddClick}
            className="bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-wider px-5 py-3 rounded-lg hover:bg-[rgba(var(--accent-rgb),0.8)] transition-colors cursor-pointer"
          >
            + WRITE JOURNAL ESSAY
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-mono p-4 rounded-lg">
          $ TRANSACTION FAIL: {error}
        </div>
      )}

      {isEditing ? (
        /* Edit / Create Form Panel */
        <form onSubmit={handleFormSubmit} className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-8 flex flex-col gap-6">
          <h3 className="text-sm font-semibold tracking-wide border-b border-[#1a1a22] pb-4 mb-4">
            {currentPost.id ? `EDIT ESSAY: ${currentPost.title}` : 'WRITE NEW JOURNAL ESSAY'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Post Title</label>
              <input 
                type="text" 
                id="title" 
                required 
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
                value={currentPost.title} 
                onChange={handleFormChange}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Slug URL</label>
              <input 
                type="text" 
                id="slug" 
                required 
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
                value={currentPost.slug} 
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Categories (comma separated)</label>
              <input 
                type="text" 
                id="categories" 
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
                value={currentPost.categories} 
                onChange={handleFormChange}
                placeholder="Product, Architecture"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase">Tags (comma separated)</label>
              <input 
                type="text" 
                id="tags" 
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm"
                value={currentPost.tags} 
                onChange={handleFormChange}
                placeholder="UX, Machine Learning"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-gray-400 uppercase">Markdown Content</label>
            <textarea 
              id="contentMarkdown" 
              rows={15}
              required
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg p-4 font-mono text-xs leading-relaxed"
              value={currentPost.contentMarkdown || ''} 
              onChange={handleFormChange}
              placeholder="## Section Heading ... Write in markdown here"
            />
          </div>

          {/* Visibility Controls */}
          <div className="border-t border-[#1a1a22] pt-6 flex gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                id="isDraft" 
                checked={currentPost.isDraft === 1} 
                onChange={(e) => setCurrentPost(p => ({ ...p, isDraft: e.target.checked ? 1 : 0 }))}
              />
              <span className="text-xs font-mono uppercase text-gray-400">Save as Draft</span>
            </label>
          </div>

          {/* Form Trigger Buttons */}
          <div className="border-t border-[#1a1a22] pt-6 flex gap-4 justify-end">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="text-xs font-mono text-gray-500 hover:text-white px-5 py-3 rounded-lg border border-[rgba(255,255,255,0.06)]"
              disabled={loading}
            >
              CANCEL
            </button>
            <button 
              type="submit" 
              className="bg-[var(--accent)] text-white text-xs font-mono uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-[rgba(var(--accent-rgb),0.8)]"
              disabled={loading}
            >
              {loading ? 'SAVING...' : 'SAVE JOURNAL ENTRY'}
            </button>
          </div>
        </form>
      ) : (
        /* Blog Lists Panel */
        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            {posts.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-gray-500">
                NO JOURNAL ESSAYS CONFIGURED IN THE REPOSITORY
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1a1a22] text-[10px] font-mono uppercase text-gray-500">
                    <th className="py-4 px-6">Essay Title</th>
                    <th className="py-4 px-6">Slug</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-[#111116] hover:bg-[#111116] transition-colors last:border-b-0">
                      <td className="py-4 px-6">
                        <span className="font-medium text-white">{post.title}</span>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-gray-400">/{post.slug}</td>
                      <td className="py-4 px-6">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                          post.isDraft === 1 
                            ? 'bg-yellow-950/20 text-yellow-500 border border-yellow-500/20' 
                            : 'bg-green-950/20 text-green-500 border border-green-500/20'
                        }`}>
                          {post.isDraft === 1 ? 'DRAFT' : 'PUBLISHED'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-xs flex gap-4 justify-end">
                        <button 
                          onClick={() => handleEditClick(post)}
                          className="text-[var(--accent)] hover:text-white transition-colors"
                          disabled={loading}
                        >
                          [EDIT]
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(post.id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          disabled={loading}
                        >
                          [DELETE]
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
