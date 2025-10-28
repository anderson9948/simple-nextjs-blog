const fs = require('fs');
const path = require('path');

const sample = {
  id: 'exploring-the-wonders',
  type: 'posts',
  slug: 'exploring-the-wonders',
  title: "Exploring the World's Natural Wonders: A Nature Lover's Journey",
  metadata: {
    published_date: '2025-10-24',
    teaser: 'A short intro about exploring the world\'s natural wonders.',
    content:
      '<p>As someone who loves nature, there\'s nothing quite like the thrill of exploring the world\'s most beautiful landscapes.</p>',
    hero: { imgix_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' },
    categories: [{ title: 'Environment' }, { title: 'Travel' }],
    author: { title: 'Jane Doe', slug: 'jane-doe' },
  },
};

const dir = path.join(process.cwd(), 'data', 'posts');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, sample.slug + '.json');
fs.writeFileSync(file, JSON.stringify(sample, null, 2));
console.log('Wrote sample post to', file);
