-- ============================================================================
-- SECURITY FIXES FOR SUPABASE DATABASE LINTER ISSUES
-- ============================================================================

-- Fix for function_search_path_mutable: is_group_member
-- Remove pg_temp from search_path to prevent mutable search path
ALTER FUNCTION public.is_group_member(uuid) SET search_path = public;

-- Fix for function_search_path_mutable: check_budget_alert_for_transaction
-- Remove pg_temp from search_path to prevent mutable search path
ALTER FUNCTION public.check_budget_alert_for_transaction() SET search_path = public;

-- ============================================================================
-- INSTRUCTIONS FOR AUTH SECURITY FIXES
-- ============================================================================

-- These fixes need to be done in the Supabase Dashboard:

-- 1. Enable Leaked Password Protection:
--    - Go to Authentication > Settings in your Supabase Dashboard
--    - Scroll to "Password Security" section
--    - Enable "Leaked password protection"
--    - This prevents users from using passwords found in known data breaches

-- 2. Enable Additional MFA Options:
--    - Go to Authentication > Settings in your Supabase Dashboard
--    - Scroll to "Multi-Factor Authentication (MFA)" section
--    - Enable additional MFA methods like:
--      * TOTP (Time-based One-Time Password) - Authenticator apps
--      * SMS/Phone verification
--      * Email-based MFA
--    - At minimum, enable TOTP for better security

-- After applying these fixes, re-run the database linter to verify the issues are resolved.