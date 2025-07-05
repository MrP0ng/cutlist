'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const PRICING_PLANS = [
  {
    name: '7-Day Pass',
    price: '$9.99',
    duration: '7 days',
    priceId: process.env.NEXT_PUBLIC_STRIPE_7_DAY_PRICE_ID,
    features: [
      'Unlimited projects',
      'Unlimited sheets per project',
      'Unlimited parts per project',
      'PDF export',
      '7 days of access',
    ],
  },
  {
    name: '30-Day Pass',
    price: '$19.99',
    duration: '30 days',
    priceId: process.env.NEXT_PUBLIC_STRIPE_30_DAY_PRICE_ID,
    popular: true,
    features: [
      'Unlimited projects',
      'Unlimited sheets per project',
      'Unlimited parts per project',
      'PDF export',
      '30 days of access',
      'Priority support',
    ],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const { user, usage, isPro } = useAuth();

  const handlePurchase = async (priceId: string | undefined, planName: string) => {
    if (!priceId) {
      alert('Price ID not configured');
      return;
    }

    if (!user) {
      alert('Please wait for authentication to complete');
      return;
    }

    setLoading(planName);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to start checkout process');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Upgrade to unlock unlimited usage and advanced features
          </p>
        </div>

        {isPro && usage?.pro_until && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-800">
                You're Pro! 🎉
              </h3>
              <p className="text-green-600">
                Your pro access expires on{' '}
                {new Date(usage.pro_until).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg shadow-lg ${
                plan.popular
                  ? 'border-2 border-blue-500 bg-white'
                  : 'border border-gray-200 bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-lg text-gray-500">/{plan.duration}</span>
                </div>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-3"
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
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full mt-8 ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  onClick={() => handlePurchase(plan.priceId, plan.name)}
                  disabled={loading === plan.name}
                >
                  {loading === plan.name ? 'Loading...' : `Get ${plan.name}`}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Free Tier Limits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-gray-900">5</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-gray-900">5</div>
              <div className="text-sm text-gray-600">Sheets total</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-gray-900">50</div>
              <div className="text-sm text-gray-600">Parts per project</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
