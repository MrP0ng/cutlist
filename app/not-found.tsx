import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              404
            </h1>
            <CardTitle className="text-2xl">Page Not Found</CardTitle>
            <CardDescription className="mt-4">
              The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
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
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Error Code: 404 | Page Not Found
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
