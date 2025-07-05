import Link from 'next/link';

export default function PostNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Post Not Found
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        The blog post you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
