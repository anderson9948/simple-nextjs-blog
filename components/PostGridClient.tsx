"use client";

import React, { useEffect, useMemo, useState } from 'react';
import PostCard from './PostCard';

type Post = any;

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'guides', label: 'Guides' },
  { key: 'announcements', label: 'Announcements' },
  { key: 'tips', label: 'Tips' },
];

export default function PostGridClient(): JSX.Element {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/posts')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!mounted) return;
        setPosts([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!posts) return [];
    if (filter === 'all') return posts;
    return posts.filter((p) => {
      const cats = p?.metadata?.categories ?? [];
      return cats.some((c: any) => (c.title || '').toLowerCase() === filter);
    });
  }, [posts, filter]);

  return (
    <section>
      <div className="w-full">
        <div className="mb-6 px-4 lg:px-0">
          <div className="overflow-x-auto">
            <div className="inline-flex gap-3">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    filter === f.key ? 'bg-teal-600 text-white' : 'bg-zinc-800 text-zinc-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && <div className="text-left py-8 px-4">Loading posts…</div>}

        {!loading && (!filtered || filtered.length === 0) && (
          <div className="text-left py-8 px-4 text-zinc-500">No posts found for "{FILTERS.find(x=>x.key===filter)?.label}"</div>
        )}

        {!loading && filtered && filtered.length > 0 && (
          <div className="px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((post: any) => (
                <div key={post.id} className="flex items-stretch">
                  <div className="w-full">
                    <PostCard post={post} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
