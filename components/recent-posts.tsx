import Link from 'next/link';
import { PostMetadata } from '@/lib/posts';
import { Button } from '@/components/ui/button';

interface RecentPostsProps {
  posts: PostMetadata[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Recent Blog Posts
        </h2>
        <Link href="/post">
          <Button variant="outline" size="sm">
            View All Posts
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <Link href={`/post/${post.slug}`} className="group">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
              
              {post.excerpt && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
                
                {post.tags && post.tags.length > 0 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                    {post.tags[0]}
                  </span>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
