import { SinglePost } from '../../../components/SinglePost';
import { getPost } from '../../../lib/cosmic';
import { Suspense } from 'react';
import { Loader } from '../../../components/Loader';

export async function generateMetadata({
  params,
}: {
  params: any;
}) {
  // Unwrap slug early to avoid "sync-dynamic-apis" error (params may be a Promise)
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post?.title ? `${post.title} | BUMS ALLIANCE` : 'Post | BUMS ALLIANCE',
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  // Do NOT await `params` at the top level (that blocks rendering).
  // Instead await it inside a suspended child so the page can stream.
  return (
    <Suspense fallback={<Loader />}>
      <SinglePostWrapper params={params} />
    </Suspense>
  );
}

async function SinglePostWrapper({ params }: { params: any }) {
  const { slug } = await params;
  return <SinglePost slug={slug} />;
}
// Note: `revalidate` removed for Next 16+ with `cacheComponents` enabled
