import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSideProps } from '../../evenements/page';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set proper headers
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');

  // Base URL
  const baseUrl = process.env.NEXTAUTH_URL || 'https://cccz-portal.com';

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/espaces',
    '/faq',
    '/actualites',
    '/evenements',
    '/artistes',
    '/galerie',
    '/billetterie',
    '/contact',
    '/directions',
    '/partenaires',
    '/projets'
  ];

  // Get dynamic event pages
  let eventPages: string[] = [];
  try {
    // This would ideally fetch from your database
    // For now, we'll use static event slugs
    eventPages = [
      '/evenements/festival-culturel-2024',
      '/evenements/exposition-art-contemporain',
      '/evenements/concert-jazz-nuit'
    ];
  } catch (error) {
    console.error('Error fetching events for sitemap:', error);
  }

  // Get dynamic artist pages
  let artistPages: string[] = [];
  try {
    // This would fetch from your database
    artistPages = [
      '/artistes/artist-1',
      '/artistes/artist-2'
    ];
  } catch (error) {
    console.error('Error fetching artists for sitemap:', error);
  }

  // Combine all pages
  const allPages = [...staticPages, ...eventPages, ...artistPages];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : page.startsWith('/evenements/') ? '0.8' : '0.6'}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.status(200).send(sitemap);
}