"use client";

import React, { useState } from 'react';

export default function AdminFormClient() {
  const [title, setTitle] = useState('');
  // slug is auto-generated from the title
  // teaser is derived automatically from content
  const [content, setContent] = useState('');
  const [hero, setHero] = useState('');
  const [uploading, setUploading] = useState(false);
  const [author, setAuthor] = useState('');
  // categories stored as an array of strings (multi-select)
  const [categories, setCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState('');
  const [status, setStatus] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // generate a URL-safe slug from the title
    const generatedSlug = title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `post-${Date.now()}`;

    // derive teaser from start of content (strip HTML and limit to ~160 chars)
    const computedTeaser = (content || '').replace(/<[^>]+>/g, '').slice(0, 160).trim();

    const post = {
      type: 'posts',
      title,
      slug: generatedSlug,
      id: generatedSlug,
      metadata: {
        published_date: new Date().toISOString(),
        teaser: computedTeaser,
        content: content || computedTeaser,
        hero: { imgix_url: hero },
        author: { title: author },
        categories: categories.map((c) => ({ title: c.trim() })),
      },
    };

    setStatus('saving...');

    const res = await fetch('/api/posts', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });

    if (res.ok) {
      setStatus('Saved! Refresh homepage to see it.');
    } else {
      setStatus('Error saving');
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      const dataUrl: string = await new Promise((resolve, reject) => {
        reader.onerror = () => reject(new Error('File read error'));
        reader.onload = () => resolve(String(reader.result));
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, data: dataUrl }),
      });

      if (res.ok) {
        const json = await res.json();
        // set hero to the public path returned by the server
        setHero(json.url);
      } else {
        console.error('Upload failed', await res.text());
        alert('Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-bold mb-4">Admin — Create Post</h1>
      <form onSubmit={submit} className="flex flex-col space-y-4 bg-zinc-900/60 p-6 rounded-md">
        <label className="text-sm font-medium text-zinc-200">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-white text-black placeholder-zinc-500 rounded px-3 py-2 border border-zinc-700"
        />

        {/* slug is generated automatically from the Title - hidden from the user */}

        <label className="text-sm font-medium text-zinc-200">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Full post content (optional). A short teaser will be generated automatically from the start of this content."
          className="w-full bg-white text-black placeholder-zinc-500 rounded px-3 py-2 border border-zinc-700 min-h-[120px]"
        />

        
        <label className="text-sm text-zinc-400">Or upload a local image</label>
        {/* file input must remain uncontrolled; give it a stable ref and key so React won't flip its controlled state */}
        <input
          key={hero ? `file-${hero}` : 'file-none'}
          ref={null as any}
          className="text-zinc-200"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
  {uploading && <div className="text-sm text-zinc-200">Uploading...</div>}
        {hero && (
          <div className="pt-2">
            <div className="text-xs text-zinc-400">Current hero path:</div>
            <div className="text-sm break-words text-zinc-200">{hero}</div>
            <img src={hero} alt="hero preview" className="mt-2 max-h-40 rounded" />
          </div>
        )}

        <label className="text-sm font-medium text-zinc-200">Author</label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author name"
          className="w-full bg-white text-black placeholder-zinc-500 rounded px-3 py-2 border border-zinc-700"
        />

        <label className="text-sm font-medium text-zinc-200">Categories</label>
        <select
          multiple
          value={categories}
          onChange={(e) => {
            const opts = Array.from(e.target.selectedOptions).map((o) => o.value);
            setCategories(opts);
          }}
          className="w-full bg-white text-black rounded p-2 border border-zinc-700"
        >
          <option value="Guides">Guides</option>
          <option value="Announcements">Announcements</option>
          <option value="Tips">Tips</option>
        </select>

        <div className="flex items-center gap-2 mt-2">
          <input
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Add custom tag"
            className="flex-1 bg-white text-black border border-zinc-700 rounded p-2"
          />
          <button
            type="button"
            onClick={() => {
              const v = customCategory.trim();
              if (!v) return;
              if (!categories.includes(v)) setCategories((s) => [...s, v]);
              setCustomCategory('');
            }}
            className="rounded bg-zinc-800 px-3 py-2 text-sm"
          >
            Add
          </button>
        </div>
        <button className="rounded bg-sky-600 text-white p-2" type="submit">Save</button>
      </form>
      <div className="mt-4 text-sm text-zinc-300">{status}</div>
    </main>
  );
}
