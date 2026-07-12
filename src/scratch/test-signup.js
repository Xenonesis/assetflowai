const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignupFlow() {
  const testEmail = `testuser-${Math.random().toString(36).substring(7)}@test.com`;
  const testPassword = 'Password123!';
  const testName = 'Test User';
  
  console.log(`Attempting to sign up user: ${testEmail}`);
  
  // 1. Sign up user via auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: testName,
      }
    }
  });
  
  if (authError) {
    console.error("Sign up error:", authError);
    return;
  }
  
  const userId = authData.user.id;
  console.log(`Auth user created successfully! ID: ${userId}`);
  
  // 2. Wait 2 seconds and check if profile is created in profiles table
  console.log("Waiting to check profiles table...");
  await new Promise(r => setTimeout(r, 2000));
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (profileError) {
    console.log("Profile not found in profiles table! Error:", profileError.message);
  } else {
    console.log("Success! Profile found in profiles table:", profile);
  }
  
  // 3. Cleanup
  console.log("Cleaning up test auth user...");
  const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
  if (deleteError) {
    console.error("Error deleting test user:", deleteError.message);
  } else {
    console.log("Cleaned up test user successfully.");
  }
}

testSignupFlow();
