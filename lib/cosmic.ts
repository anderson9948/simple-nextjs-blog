import { createBucketClient } from '@cosmicjs/sdk';
import { Post, GlobalData, Author } from './types';

const cosmic = createBucketClient({
  // @ts-ignore
  bucketSlug: process.env.COSMIC_BUCKET_SLUG ?? '',
  // @ts-ignore
  readKey: process.env.COSMIC_READ_KEY ?? '',
});
export default cosmic;

export async function getGlobalData(): Promise<GlobalData> {
  // Get global data
  // If the COSMIC_BUCKET_SLUG is not configured, return a sensible default
  // instead of calling the API (which will log errors). This makes the
  // local dev experience smoother when env vars are not set.
  if (!process.env.COSMIC_BUCKET_SLUG) {
    return Promise.resolve({
      metadata: {
        site_title: 'BUMS ALLIANCE',
        site_tag: '',
      },
    } as GlobalData);
  }

  try {
    const data: any = await Promise.resolve(
      cosmic.objects
        .findOne({
          type: 'globals',
          slug: 'header',
        })
        .props('metadata.site_title,metadata.site_tag')
        .depth(1)
    );
    const siteData: GlobalData = data.object;
    return Promise.resolve(siteData);
  } catch (error) {
    console.log('Oof', error);
  }
  return Promise.resolve({} as GlobalData);
}

export async function getAllPosts(): Promise<Post[]> {
  // If no COSMIC_BUCKET_SLUG configured, read local posts from data/posts
  if (!process.env.COSMIC_BUCKET_SLUG) {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const dir = path.join(process.cwd(), 'data', 'posts');
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
      const posts = files.map((f) => {
        const content = fs.readFileSync(path.join(dir, f), 'utf-8');
        return JSON.parse(content);
      });
      return Promise.resolve(posts as Post[]);
    } catch (e) {
      console.log('Oof', e);
      return Promise.resolve([]);
    }
  }

  try {
    // Get all posts from Cosmic
    const data: any = await Promise.resolve(
      cosmic.objects
        .find({
          type: 'posts',
        })
        .props('id,type,slug,title,metadata,created_at')
        .depth(1)
    );
    const posts: Post[] = await data.objects;
    return Promise.resolve(posts);
  } catch (error) {
    console.log('Oof', error);
  }
  return Promise.resolve([]);
}

export async function getPost(slug: string): Promise<Post> {
  // If no COSMIC_BUCKET_SLUG configured, read local post file
  if (!process.env.COSMIC_BUCKET_SLUG) {
    try {
      const fs = await import('fs');
      const path = await import('path');
      // slug may be URL-encoded (eg. 'Guerra%20do%20capitolio') when coming from the route.
      // Decode it so local filenames with spaces are matched correctly.
      const safeSlug = decodeURIComponent(String(slug)).trim();
      const filePath = path.join(process.cwd(), 'data', 'posts', `${safeSlug}.json`);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content) as Post;
      }
      return Promise.resolve({} as Post);
    } catch (e) {
      console.log('Oof', e);
      return Promise.resolve({} as Post);
    }
  }

  try {
    // Get post from Cosmic
    const data: any = await Promise.resolve(
      cosmic.objects
        .findOne({
          type: 'posts',
          slug,
        })
        .props(['id', 'type', 'slug', 'title', 'metadata', 'created_at'])
        .depth(1)
    );
    const post = await data.object;
    return post;
  } catch (error) {
    console.log('Oof', error);
  }
  return Promise.resolve({} as Post);
}

export async function getRelatedPosts(slug: string): Promise<Post[]> {
  try {
    // Get suggested posts
    const data: any = await Promise.resolve(
      cosmic.objects
        .find({
          type: 'posts',
          slug: {
            $ne: slug,
          },
        })
        .props(['id', 'type', 'slug', 'title', 'metadata', 'created_at'])
        .sort('random')
        .depth(1)
    );
    const suggestedPosts: Post[] = await data.objects;
    return Promise.resolve(suggestedPosts);
  } catch (error) {
    console.log('Oof', error);
  }
  return Promise.resolve([]);
}

export async function getAuthor(slug: string): Promise<Author> {
  try {
    const data: any = await Promise.resolve(
      cosmic.objects
        .findOne({
          type: 'authors',
          slug,
        })
        .props('id,title')
        .depth(1)
    );
    const author = await data.object;
    return Promise.resolve(author);
  } catch (error) {
    console.log('Oof', error);
  }
  return Promise.resolve({} as Author);
}

export async function getAuthorPosts(id: string): Promise<Post[]> {
  try {
    // Get Author's posts
    const data: any = await Promise.resolve(
      cosmic.objects
        .find({
          type: 'posts',
          'metadata.author': id,
        })
        .props(['id', 'type', 'slug', 'title', 'metadata', 'created_at'])
        .sort('random')
        .depth(1)
    );
    const authorPosts: Post[] = await data.objects;
    return Promise.resolve(authorPosts);
  } catch (error) {
    console.log('Oof', error);
  }
  return Promise.resolve([]);
}
