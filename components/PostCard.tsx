import React from 'react';
import Link from 'next/link';
import ArrowRight from './icons/ArrowRight';
import Tag from './Tag';
import { Post } from '../lib/types';
import AuthorAttribution from './AuthorAttribution';
import AuthorAvatar from './AuthorAvatar';
import { sanitize } from 'isomorphic-dompurify';

export default function PostCard({ post }: { post: Post }) {
  const rawHero = post.metadata.hero?.imgix_url ?? '';
  // Determine a safe src for local files vs external image services (imgix).
  let heroSrc = '';
  if (rawHero) {
    const trimmed = rawHero.trim();
    const isExternal = /(^https?:)|imgix|:\/\//i.test(trimmed);

    if (isExternal) {
      // For external/CDN images keep query params used for optimization.
      heroSrc = `${trimmed}?w=1400&auto=compression,format`;
    } else {
      // Local files should be served from the public folder. Ensure leading '/'.
      heroSrc = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    }
  }

  return (
    <article className="flex flex-col h-full rounded-xl bg-zinc-50/2 dark:bg-zinc-900/40 p-6 shadow-sm hover:shadow-md transition-shadow duration-150">
      {/* image / hero */}
      {heroSrc ? (
        <Link href={`/posts/${post.slug}`} className="block w-full">
          <div className="overflow-hidden rounded-xl">
            <img
              className="w-full object-cover object-center transition-transform duration-200 ease-out hover:scale-[1.02] h-64 md:h-72 lg:h-80"
              src={heroSrc}
              alt={post.title}
            />
          </div>
        </Link>
      ) : (
        <div className="w-full rounded-xl bg-zinc-900/10 dark:bg-zinc-800/20 h-64 md:h-72 lg:h-80 mb-4" />
      )}

      {/* content */}
      <div className="flex flex-col flex-1 mt-4">
        <h2 className="mb-2 text-2xl font-bold leading-tight text-zinc-900 dark:text-zinc-100">
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h2>

        <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 mb-4">
          <AuthorAvatar post={post} />
          <AuthorAttribution post={post} />
        </div>

        <div className="text-zinc-600 dark:text-zinc-300 mb-4 overflow-hidden" style={{ maxHeight: 160 }}>
          {/* teaser area - capped height so cards remain similar size */}
          <div
            className="prose prose-sm max-w-none text-sm"
            dangerouslySetInnerHTML={{ __html: sanitize(post.metadata.teaser) ?? '' }}
          />
        </div>

        <div className="mt-auto flex items-center justify-between gap-4">
          <Link href={`/posts/${post.slug}`} className="inline-flex items-center gap-2 text-green-600 dark:text-green-200 font-medium">
            <span>Read article</span>
            <ArrowRight className="h-4 w-4 text-inherit" />
          </Link>

          <div className="hidden md:flex flex-wrap gap-2">
            {post.metadata.categories &&
              post.metadata.categories.map((category) => (
                <Tag key={category.title}>{category.title}</Tag>
              ))}
          </div>
        </div>
      </div>
    </article>
  );
}
