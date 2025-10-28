import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../app/api/auth/[...nextauth]/route';
import { isAllowedEmail } from '../../lib/auth';

export const config = {
  api: {
    bodyParser: {
      // allow reasonably large images for local uploads
      sizeLimit: '20mb',
    },
  },
};

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // protect upload: require authenticated allowed user
  try {
    const session = await getServerSession(req, res, authOptions);
    const email = session?.user?.email ?? undefined;
    if (!isAllowedEmail(email)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { filename, data } = req.body as { filename?: string; data?: string };
    if (!filename || !data) {
      return res.status(400).json({ error: 'filename and data are required' });
    }

    // data expected as data URL: data:<mime>;base64,<base64data>
    const matches = data.match(/^data:([a-zA-Z0-9/+-_.]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid data URL' });
    }

    const mime = matches[1];
    const base64 = matches[2];

    const ext = path.extname(filename) || '';
    const safeName = sanitizeFileName(path.basename(filename, ext));
    const uniqueName = `${Date.now()}-${safeName}${ext || ''}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, uniqueName);
    const buffer = Buffer.from(base64, 'base64');

    await fs.promises.writeFile(filePath, buffer);

    // return the public URL path
    const publicUrl = `/uploads/${uniqueName}`;
    return res.status(200).json({ url: publicUrl, mime });
  } catch (err: any) {
    console.error('upload error', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
