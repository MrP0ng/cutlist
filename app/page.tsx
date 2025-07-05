import { Button } from "@/components/ui/button"
import { getAllPosts } from '@/lib/posts'
import Link from 'next/link'

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
            Optimize Your{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Sheet Cutting
            </span>{" "}
            Layouts
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Maximize material usage and minimize waste with intelligent layout algorithms. 
            Perfect for woodworking, fabrication, and manufacturing projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/workbench">
              <Button size="lg" className="text-lg px-8">
                Start Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need to optimize your cutting layouts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Optimization</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced algorithms minimize waste and maximize material usage across multiple sheets.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Money</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Reduce material costs by up to 20% with optimized cutting patterns and waste reduction.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Export Ready</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate professional PDF cut lists ready for your workshop or fabrication team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="py-20 px-4">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Latest Articles
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Tips, tutorials, and insights on optimization and cutting techniques
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article key={post.slug} className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <Link href={`/blog/${post.slug}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/blog">
                <Button variant="outline" size="lg">
                  View All Articles
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
