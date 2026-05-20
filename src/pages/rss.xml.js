import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  return rss({
    title: 'FUTURE SYNTHESIS',
    description: 'AI・文明・建築・国家・資本の未来を考察する知的メディア',
    site: 'https://phity-j.github.io/future_synthesis/',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/future_synthesis/posts/${post.slug}/`,
    })),
    customData: `<language>ja-jp</language>`,
  });
}
