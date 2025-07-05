'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth-modal';
import { signOut } from '@/lib/supabase';
import Link from 'next/link';

function AccountContent() {
  const { user, usage, isPro, loading, isAnonymous } = useAuth();
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    if (searchParams.get('success')) {
      setShowSuccess(true);
      // Hide success message after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    // Set a timeout for loading state
    const timer = setTimeout(() => {
      if (loading) {
        setLoadingTimeout(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timer);
  }, [loading]);

  const handleSignOut = async () => {
    try {
      await signOut();
      // The user will be redirected to anonymous state automatically
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading account information...</p>
          {loadingTimeout && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md">
              <p className="text-sm text-yellow-800">
                Taking longer than expected. If this continues, try refreshing the page.
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-blue-600 underline text-sm"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {showSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  Payment Successful!
                </h3>
                <p className="text-green-600">
                  Your pro features have been activated. Welcome to Cutlist Pro!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage your subscription and view usage statistics
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Authentication Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Authentication
            </h2>
            
            <div className="space-y-4">
              {isAnonymous ? (
                <>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">Anonymous Session</h3>
                        <p className="text-sm text-yellow-700">
                          Sign in to save your projects and access them from any device.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setAuthModalOpen(true)}
                    className="w-full"
                  >
                    Sign In / Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="text-sm font-medium text-green-800">Signed In</h3>
                        <p className="text-sm text-green-700">
                          {user?.email ? `Signed in as ${user.email}` : 'You are signed in with a permanent account.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Account Status
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">User ID:</span>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {user?.id ? `${user.id.slice(0, 8)}...` : 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Account Type:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isPro
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {isPro ? 'Pro' : 'Free'}
                </span>
              </div>

              {isPro && usage?.pro_until && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expires:</span>
                  <span className="text-gray-900">
                    {new Date(usage.pro_until).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Anonymous User:</span>
                <span className="text-gray-900">
                  {user?.is_anonymous ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {!isPro && (
              <div className="mt-6">
                <Link href="/pricing">
                  <Button className="w-full">Upgrade to Pro</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Usage Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Usage Statistics
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Projects</span>
                  <span className="text-gray-900">
                    {usage?.projects ?? 0}
                    {!isPro && usage?.limits.projects && ` / ${usage.limits.projects}`}
                  </span>
                </div>
                {!isPro && usage?.limits.projects && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          ((usage?.projects ?? 0) / usage.limits.projects) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total Sheets</span>
                  <span className="text-gray-900">
                    {usage?.sheets ?? 0}
                    {!isPro && usage?.limits.sheets && ` / ${usage.limits.sheets}`}
                  </span>
                </div>
                {!isPro && usage?.limits.sheets && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          ((usage?.sheets ?? 0) / usage.limits.sheets) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total Parts</span>
                  <span className="text-gray-900">{usage?.parts ?? 0}</span>
                </div>
                {!isPro && usage?.limits.parts_per_project && (
                  <p className="text-sm text-gray-500">
                    Limit: {usage.limits.parts_per_project} parts per project
                  </p>
                )}
              </div>
            </div>

            {isPro && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 text-sm font-medium">
                  🎉 Unlimited usage with your Pro account!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Auth Management */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Auth Management
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email:</span>
              <span className="text-gray-900">{user?.email ?? 'N/A'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Password:</span>
              <span className="text-gray-900">********</span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => signOut()}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Sign Out
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/workbench" className="text-blue-600 hover:text-blue-700">
            ← Back to Workbench
          </Link>
        </div>
      </div>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
