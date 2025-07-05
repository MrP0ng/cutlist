import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Get in Touch
          </h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Support & Questions</CardTitle>
                <CardDescription>
                  Having trouble with Cutlist? Need help with your cutting optimization? We're here to help.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href="mailto:support@cutlist.app">
                    Email Support
                  </a>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Feature Requests & Feedback</CardTitle>
                <CardDescription>
                  Have ideas for improving Cutlist? We value your feedback and suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <a href="mailto:feedback@cutlist.app">
                    Share Feedback
                  </a>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business & Partnerships</CardTitle>
                <CardDescription>
                  Interested in partnering with us or have business inquiries?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <a href="mailto:business@cutlist.app">
                    Business Inquiries
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does the free tier work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  The free tier allows you to optimize up to 50 parts per month. Perfect for small projects and trying out Cutlist.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's included in the Pro Pass?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  The Pro Pass gives you unlimited optimizations, PDF exports, project saving, and priority support for one month.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I use Cutlist for commercial projects?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes! Both free and Pro tiers can be used for commercial projects. Check our <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">privacy policy</Link> for more details.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How accurate are the optimizations?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Cutlist uses advanced bin-packing algorithms to minimize waste. While we can't guarantee the absolute optimal solution for every case, our algorithms typically achieve 85-95% material efficiency.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-gray-50 dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/pricing" className="block text-blue-600 dark:text-blue-400 hover:underline">
                View Pricing
              </Link>
              <Link href="/blog" className="block text-blue-600 dark:text-blue-400 hover:underline">
                Read Our Blog
              </Link>
              <Link href="/privacy" className="block text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
