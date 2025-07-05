import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe only if we have the secret key
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
    })
  : null;

// Create a Supabase client with service role key for admin operations
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

export async function POST(req: NextRequest) {
  if (!stripe || !supabaseAdmin) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;

      if (!userId) {
        console.error('No user ID found in checkout session');
        return NextResponse.json({ error: 'No user ID' }, { status: 400 });
      }

      // Get the line items to determine the subscription duration
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0]?.price?.id;

      let duration = 7; // Default to 7 days
      
      // Determine duration based on price ID or amount
      // You'll need to configure these price IDs in your Stripe dashboard
      if (priceId === process.env.STRIPE_30_DAY_PRICE_ID) {
        duration = 30;
      } else if (priceId === process.env.STRIPE_7_DAY_PRICE_ID) {
        duration = 7;
      }

      // Calculate expiration date
      const proUntil = new Date();
      proUntil.setDate(proUntil.getDate() + duration);

      // Update the user's profile
      const { error } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          role: 'pro',
          pro_until: proUntil.toISOString(),
        });

      if (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      console.log(`Updated user ${userId} to pro until ${proUntil.toISOString()}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
