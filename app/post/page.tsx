import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
          Blog Posts
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Thoughts, tutorials, and insights on web development and more.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            No blog posts found.
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Create your first post by adding an MDX file to the posts directory.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border-b border-gray-200 dark:border-gray-700 pb-8"
            >
              <Link
                href={`/post/${post.slug}`}
                className="group block hover:bg-gray-50 dark:hover:bg-gray-900 -mx-4 px-4 py-4 rounded-lg transition-colors"
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                
                {post.excerpt && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
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
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-gray-400 text-xs">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  Read more →
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
