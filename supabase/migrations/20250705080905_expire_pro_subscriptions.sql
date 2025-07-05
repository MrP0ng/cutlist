-- Create a function to expire pro subscriptions
CREATE OR REPLACE FUNCTION expire_pro_subscriptions()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE profiles 
  SET role = 'free', pro_until = NULL
  WHERE role = 'pro' 
    AND pro_until IS NOT NULL 
    AND pro_until < NOW();
$$;

-- Note: To set up a scheduled job, you'll need to enable the pg_cron extension 
-- in your Supabase project settings and then run:
-- SELECT cron.schedule('expire-pro-subscriptions', '0 0 * * *', 'SELECT expire_pro_subscriptions();');
