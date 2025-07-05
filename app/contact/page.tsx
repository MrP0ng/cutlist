import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Contact Us - Cutlist',
  description: 'Get in touch with the Cutlist team for support, feedback, or questions.',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          We'd love to hear from you. Get in touch with our team.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Get in Touch
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Support & Questions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Having trouble with Cutlist? Need help with your cutting optimization? We're here to help.
              </p>
              <Button asChild>
                <a href="mailto:support@cutlist.app">
                  Email Support
                </a>
              </Button>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Feature Requests & Feedback
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Have ideas for improving Cutlist? We value your feedback and suggestions.
              </p>
              <Button variant="outline" asChild>
                <a href="mailto:feedback@cutlist.app">
                  Share Feedback
                </a>
              </Button>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Business & Partnerships
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Interested in partnering with us or have business inquiries?
              </p>
              <Button variant="outline" asChild>
                <a href="mailto:business@cutlist.app">
                  Business Inquiries
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                How does the free tier work?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The free tier allows you to optimize up to 50 parts per month. Perfect for small projects and trying out Cutlist.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                What's included in the Pro Pass?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The Pro Pass gives you unlimited optimizations, PDF exports, project saving, and priority support for one month.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Can I use Cutlist for commercial projects?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! Both free and Pro tiers can be used for commercial projects. Check our <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">privacy policy</Link> for more details.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                How accurate are the optimizations?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Cutlist uses advanced bin-packing algorithms to minimize waste. While we can't guarantee the absolute optimal solution for every case, our algorithms typically achieve 85-95% material efficiency.
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Quick Links
            </h3>
            <div className="space-y-2">
              <Link href="/pricing" className="block text-blue-600 dark:text-blue-400 hover:underline">
                View Pricing
              </Link>
              <Link href="/blog" className="block text-blue-600 dark:text-blue-400 hover:underline">
                Read Our Blog
              </Link>
              <Link href="/privacy" className="block text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
