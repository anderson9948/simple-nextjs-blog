"use client";

import React, { useState, useEffect } from 'react';

export default function AdminPostList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      } else {
        setError('Failed to load posts');
      }
    } catch (err) {
      setError('Error loading posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deletePost(slug: string) {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const res = await fetch(`/api/posts?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        // Remove the deleted post from state
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
      } else {
        let msg = '';
        try {
          const json = await res.json();
          msg = json?.error || JSON.stringify(json);
        } catch (e) {
          msg = await res.text();
        }
        alert(`Failed to delete: ${msg}`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting post');
    }
  }

  if (loading) return <div className="p-4">Loading posts...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Posts</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="p-4 bg-zinc-900/60 rounded-lg flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium">{post.title}</h3>
              <p className="text-sm text-zinc-400">{post.slug}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => deletePost(post.slug)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-zinc-400">No posts yet. Create your first post above.</p>
        )}
      </div>
    </div>
  );
}
