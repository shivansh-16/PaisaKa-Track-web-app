const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jtntqpeibauiqelkpzog.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bnRxcGVpYmF1aXFlbGtwem9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQ3Mzk2NiwiZXhwIjoyMDc1MDQ5OTY2fQ.AIkvy2F0j2sxlQ768OXBB1xcsDxds0i8tRH0RzkCVw4';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupTrigger() {
  console.log('Setting up profiles for existing users...\n');
  
  // Get all users who don't have profiles
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('Error listing users:', usersError.message);
    return;
  }

  console.log(`Found ${users.users.length} total users`);
  
  for (const user of users.users) {
    // Check if profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();
    
    if (!profile) {
      // Create profile
      const fullName = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
      const language = user.user_metadata?.language || 'en';
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: fullName,
          language: language,
          created_at: user.created_at,
          updated_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error(`Failed to create profile for ${user.email}:`, insertError.message);
      } else {
        console.log(`✓ Created profile for ${user.email} (${fullName})`);
      }
    } else {
      console.log(`- Profile already exists for ${user.email}`);
    }
  }
  
  console.log('\n✨ Profile setup complete!');
  console.log('\nNote: The trigger must be created via Supabase SQL Editor:');
  console.log('Go to: https://supabase.com/dashboard/project/jtntqpeibauiqelkpzog/sql/new');
  console.log('\nAnd run the SQL from: /app/supabase/complete-setup.sql');
}

setupTrigger().catch(console.error);
