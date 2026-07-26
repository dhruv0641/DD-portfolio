import { MetadataRoute } from 'next';
import { projectService } from '@/services/projectService';
import { blogService } from '@/services/blogService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vance.engineering';

  try {
    const [projects, blogs] = await Promise.all([
      projectService.getProjects(false),
      blogService.getBlogPosts(false)
    ]);

    const projectUrls = projects.map((p) => ({
      url: `${baseUrl}/#work`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    const blogUrls = blogs.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      },
      ...projectUrls,
      ...blogUrls,
    ];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1.0,
      },
    ];
  }
}
