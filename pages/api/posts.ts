import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../app/api/auth/[...nextauth]/route';
import { Session } from 'next-auth';
import { isAllowedEmail } from '../../lib/auth';

const DATA_DIR = path.join(process.cwd(), 'data', 'posts');

// Support two modes:
// - local file writes (development): writes JSON to data/posts/*.json
// - Cosmic writes (production): if COSMIC_BUCKET_SLUG and COSMIC_WRITE_KEY are set,
//   attempt to write the post to Cosmic so the admin works on Vercel.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const files = fs.readdirSync(DATA_DIR);
      const posts = files.map((f) => {
        const content = fs.readFileSync(path.join(DATA_DIR, f), 'utf-8');
        return JSON.parse(content);
      });
      return res.status(200).json(posts);
    } catch (e) {
      return res.status(200).json([]);
    }
  }

  if (req.method === 'POST') {
    try {
      const session = (await getServerSession(req, res, authOptions)) as Session | null;
      const email = session?.user?.email;


    try {
      const body = req.body;
      if (!body) {
        return res.status(400).json({ error: 'Missing body' });
      }

      // ensure a slug exists; generate from title when missing
      if (!body.slug || String(body.slug).trim() === '') {
        const title = String(body.title || 'post');
        const generated = title
          .toString()
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') || `post-${Date.now()}`;
        body.slug = generated;
      }

      const useCosmic = Boolean(process.env.COSMIC_BUCKET_SLUG && process.env.COSMIC_WRITE_KEY);

      if (useCosmic) {
        // Lazy import the SDK to avoid dependency issues in dev when not used
        try {
          // @ts-ignore - dynamic import of the SDK
          const { createBucketClient } = await import('@cosmicjs/sdk');
          const cosmic = createBucketClient({
            // @ts-ignore
            bucketSlug: process.env.COSMIC_BUCKET_SLUG,
            // @ts-ignore
            writeKey: process.env.COSMIC_WRITE_KEY,
          });

          // Cosmic expects an `object` shape; pass metadata through
          const obj = {
            type: 'posts',
            slug: body.slug,
            title: body.title ?? body.slug,
            content: body.content ?? '',
            metadata: body.metadata ?? {},
          };

          const result: any = await cosmic.objects.insertOne(obj);

          return res.status(201).json({ ok: true, result });
        } catch (cosmicErr) {
          // Fall back to local write if Cosmic fails for some reason
          console.error('Cosmic write failed:', cosmicErr);
        }
      }

      // Default: write to local filesystem (development)
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const filePath = path.join(DATA_DIR, `${body.slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf-8');
      return res.status(201).json({ ok: true });
    } catch (e) {
      const errorMessage = typeof e === 'object' && e !== null && 'message' in e ? (e as { message: string }).message : String(e);
      return res.status(500).json({ error: errorMessage });
    }
    // Close the outer try block
    } catch (e) {
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'DELETE') {
    // protect deletion: require authenticated allowed user
    try {
      const session = (await getServerSession(req, res, authOptions)) as Session | null;
      const email = session?.user?.email ?? undefined;
      if (!isAllowedEmail(email)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    } catch (e) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const slug = String(req.query.slug || '').trim();
      if (!slug) return res.status(400).json({ error: 'Missing slug' });

      const filePath = path.join(DATA_DIR, `${slug}.json`);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Post not found' });
      }

      fs.unlinkSync(filePath);
      return res.status(200).json({ ok: true });
    } catch (e: any) {
      const errorMessage = typeof e === 'object' && e !== null && 'message' in e ? (e as { message: string }).message : String(e);
      return res.status(500).json({ error: errorMessage });
    }
  }

  return res.status(405).end();
}
