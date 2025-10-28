import Link from 'next/link';
import { Post } from '../lib/types';

export default function AuthorAvatar({ post }: { post: Post }): JSX.Element {
  const author = post?.metadata?.author;
  const raw = author?.metadata?.image?.imgix_url ?? '';
  const trimmed = (raw || '').trim();
  const isExternal = /(^https?:)|imgix|:\/\//i.test(trimmed);
  const src = trimmed
    ? isExternal
      ? `${trimmed}?w=100&auto=format,compression`
      : trimmed.startsWith('/')
      ? trimmed
      : `/${trimmed}`
    : `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='3'></circle><path d='M6.5 20a6 6 0 0 1 11 0'></path></svg>`;

  const href = author?.slug ? `/author/${author.slug}` : '/';

  return (
    <Link href={href}>
      <img className="h-8 w-8 rounded-full" src={src} alt={post.title} />
    </Link>
  );
}
