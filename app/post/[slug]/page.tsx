import { notFound } from 'next/navigation';
import { getPostBySlug, getPostSlugs } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || `Blog post: ${post.title}`,
    authors: post.author ? [{ name: post.author }] : undefined,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <time dateTime={post.date} className="flex items-center gap-1">
            <span>📅</span>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          
          {post.author && (
            <span className="flex items-center gap-1">
              <span>👤</span>
              {post.author}
            </span>
          )}
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <span>🏷️</span>
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXRemote 
          source={post.content} 
          components={{
            Button,
            Link,
          }}
        />
      </div>
    </article>
  );
}
