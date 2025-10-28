import React from 'react';
import Link from 'next/link';
import helpers from '../helpers';
import { Post } from '../lib/types';

export default function PostCard({ post }: { post: Post }) {
  return (
    <div>
      {(() => {
        const rawHero = post.metadata.hero?.imgix_url ?? '';
        if (!rawHero) return null;
        const trimmed = rawHero.trim();
        const isExternal = /(^https?:)|imgix|:\/\//i.test(trimmed);
        const heroSrc = isExternal ? `${trimmed}?w=1400&auto=format,compression` : trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
        return (
          <Link href={`/posts/${post.slug}`}>
            <img
              className="mb-5 h-[240px] rounded-xl bg-no-repeat object-cover object-center transition-transform duration-200 ease-out hover:scale-[1.02]"
              src={heroSrc}
              alt={post.title}
            />
          </Link>
        );
      })()}
      <h2 className="pb-3 text-xl font-semibold text-zinc-800 dark:text-zinc-200">
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      <div className="flex items-center space-x-2 text-zinc-500 dark:text-zinc-400">
        <Link href={`/author/${post.metadata.author?.slug}`}>
          {(() => {
            const raw = post.metadata.author?.metadata.image?.imgix_url ?? '';
            const trimmed = (raw || '').trim();
            const isExternal = /(^https?:)|imgix|:\/\//i.test(trimmed);
            const src = trimmed
              ? isExternal
                ? `${trimmed}?w=100&auto=format,compression`
                : trimmed.startsWith('/')
                ? trimmed
                : `/${trimmed}`
              : `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='3'></circle><path d='M6.5 20a6 6 0 0 1 11 0'></path></svg>`;

            return <img className="h-8 w-8 rounded-full" src={src} alt={post.title} />;
          })()}
        </Link>
        <div>
          <span>
            by{' '}
            <a
              href={`/author/${post.metadata.author?.slug}`}
              className="font-semibold text-green-600 dark:text-green-200"
            >
              {post.metadata.author?.title}
            </a>{' '}
            on {helpers.stringToFriendlyDate(post.metadata.published_date)}
          </span>
        </div>
      </div>
    </div>
  );
}
