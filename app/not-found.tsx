import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">
              Go Home
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/blog">
              Browse Blog
            </Link>
          </Button>
          
          <Button variant="ghost" asChild className="w-full">
            <Link href="/contact">
              Contact Support
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-500">
          <p>
            Error Code: 404 | Page Not Found
          </p>
        </div>
      </div>
    </div>
  );
}
