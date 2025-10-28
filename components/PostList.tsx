import PostCard from '../components/PostCard';
import { getAllPosts, getAuthor, getAuthorPosts } from '../lib/cosmic';

export async function PostList({ authorSlug }: { authorSlug?: string }) {
  let posts = await getAllPosts();
  let author;
  if (authorSlug) {
    author = await getAuthor(authorSlug);
    posts = await getAuthorPosts(author.id);
  }
  return (
    <>
      {author && (
        <h1 className="my-4 text-4xl font-bold leading-tight tracking-tight text-zinc-700 dark:text-zinc-300">
          Posts by {author.title}
        </h1>
      )}
      {!posts && 'You must add at least one Post to your Bucket'}
      {posts && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post) => {
            return (
              // each grid cell stretches so PostCard can be full height
              <div key={post.id} className="flex items-stretch">
                <div className="w-full">
                  <PostCard post={post} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
