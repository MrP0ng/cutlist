import { Button } from "@/components/ui/button"
import { FrameworkSelector } from "@/components/framework-selector"
import { getAllPosts } from '@/lib/posts'
import { RecentPosts } from "@/components/recent-posts"
import { ClientComponents } from "@/components/client-components"

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header section with existing components */}
      <div className="flex flex-col items-center justify-center py-16">
        <ClientComponents />
      </div>

      {/* Main content section */}
      <div className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome section */}
          <div className="text-center mb-16">
            <div className="w-full max-w-2xl mx-auto prose dark:prose-invert">
              <h1>Welcome to Vibing!</h1>
              <h2>Features</h2>
              <ul>
                <li>Reusable UI components</li>
                <li>Easy framework selection</li>
                <li>Modern design system</li>
                <li>Accessible dialogs and alerts</li>
                <li>MDX-powered blog system</li>
              </ul>
              <blockquote>
                "Good design is as little design as possible." – Dieter Rams
              </blockquote>
              <h3>Get Started</h3>
              <p>
                Explore the components above and start building your next project with confidence!
              </p>
              <p>
                Vibing provides a robust set of UI elements designed to help you move fast without sacrificing quality or accessibility.
              </p>
              <p>
                Each component is customizable and follows best practices, ensuring your app looks great on any device.
              </p>
              <p>
                Check out the documentation for usage examples, or dive right in by experimenting with the buttons and dialogs above.
              </p>
              <p>
                If you have feedback or feature requests, feel free to contribute or open an issue on our GitHub repository.
              </p>
            </div>
          </div>

          {/* Recent blog posts section */}
          <RecentPosts posts={recentPosts} />
        </div>
      </div>
    </div>
  )
}
