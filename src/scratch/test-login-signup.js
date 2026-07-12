const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuthFlow() {
  const testEmail = `user-${Math.random().toString(36).substring(7)}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Test User';
  
  console.log(`Testing SignUp for: ${testEmail}`);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: testName,
      }
    }
  });
  
  if (signUpError) {
    console.error("SignUp failed:", signUpError.message);
    return;
  }
  
  console.log("SignUp response user ID:", signUpData.user ? signUpData.user.id : "null");
  console.log("SignUp response session:", signUpData.session ? "Active Session" : "No Session (requires email confirmation?)");
  
  if (!signUpData.session) {
    console.log("Checking if we can log in with the new account...");
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    
    if (signInError) {
      console.error("Login failed:", signInError.message);
      if (signInError.message.includes("Email not confirmed")) {
        console.error("CRITICAL: The remote Supabase instance requires email confirmation! All new signups will be blocked and unable to access the dashboard.");
      }
    } else {
      console.log("Login succeeded after signup!");
    }
  } else {
    console.log("Session is active immediately after signup.");
  }
}

testAuthFlow();
