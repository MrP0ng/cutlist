export const metadata = {
  title: 'Privacy Policy - Cutlist',
  description: 'Privacy policy and data handling practices for Cutlist.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Information We Collect
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              Cutlist is designed with privacy in mind. We collect minimal information necessary to provide our service:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Anonymous Usage:</strong> For free users, we don't require any personal information. Usage is tracked anonymously.</li>
              <li><strong>Payment Information:</strong> When purchasing a Pro Pass, we collect payment information through Stripe (our payment processor).</li>
              <li><strong>Project Data:</strong> Your cutting plans and projects are stored temporarily for optimization and can be saved if you have a Pro account.</li>
              <li><strong>Technical Data:</strong> We collect basic analytics about how the app is used to improve performance and features.</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            How We Use Your Information
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and optimize our cutting optimization service</li>
              <li>To process payments for Pro Pass purchases</li>
              <li>To enforce usage limits on the free tier</li>
              <li>To improve our algorithms and user experience</li>
              <li>To provide customer support when requested</li>
            </ul>
            <p>
              We do not sell, rent, or share your personal information with third parties for marketing purposes.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Data Storage and Security
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              Your data is stored securely using industry-standard practices:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Database Security:</strong> We use Supabase for data storage with row-level security (RLS) policies</li>
              <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
              <li><strong>Access Control:</strong> Only you can access your projects and data</li>
              <li><strong>Data Retention:</strong> Free tier data is automatically cleaned up. Pro users can manage their own data.</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Third-Party Services
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Supabase:</strong> Database and authentication services</li>
              <li><strong>Stripe:</strong> Payment processing for Pro Pass purchases</li>
              <li><strong>Vercel:</strong> Hosting and content delivery</li>
            </ul>
            <p>
              Each of these services has their own privacy policies and security measures.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Your Rights
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              You have the following rights regarding your data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> You can access all your stored project data through the app</li>
              <li><strong>Deletion:</strong> You can delete your projects and account data at any time</li>
              <li><strong>Portability:</strong> You can export your cutting plans as PDF files</li>
              <li><strong>Correction:</strong> You can edit and update your project data</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Cookies and Tracking
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              We use minimal cookies and tracking:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the app to function (authentication, preferences)</li>
              <li><strong>Analytics:</strong> Basic usage analytics to improve the service (anonymized)</li>
              <li><strong>No Advertising:</strong> We don't use advertising cookies or tracking pixels</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Children's Privacy
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              Cutlist is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Changes to This Policy
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              We may update this privacy policy from time to time. We will notify users of any material changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Contact Us
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              If you have any questions about this privacy policy or our data practices, please contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: <a href="mailto:privacy@cutlist.app" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@cutlist.app</a></li>
              <li>Support: <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact Page</a></li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
