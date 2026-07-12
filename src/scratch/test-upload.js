const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !anonKey || !serviceKey) {
  console.error("Missing credentials in environment");
  process.exit(1);
}

const supabaseAnon = createClient(supabaseUrl, anonKey);
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

async function testStorageUpload() {
  const testEmail = `storage-user-${Math.random().toString(36).substring(7)}@example.com`;
  const testPassword = 'Password123!';
  
  console.log("Creating test user for storage validation...");
  const { data: authData, error: signUpError } = await supabaseAnon.auth.signUp({
    email: testEmail,
    password: testPassword,
  });
  
  if (signUpError) {
    console.error("SignUp failed:", signUpError.message);
    return;
  }
  
  const userClient = createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
  
  // Sign in to get active session on userClient
  const { data: signInData, error: signInError } = await userClient.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });
  
  if (signInError) {
    console.error("SignIn failed:", signInError.message);
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    return;
  }
  
  console.log("Logged in test user. Attempting file upload to 'asset-documents'...");
  
  const fileName = `test-file-${Date.now()}.png`;
  const fileBody = 'Dummy PNG image data';
  const fileBuffer = Buffer.from(fileBody, 'utf-8');
  
  const { data: uploadData, error: uploadError } = await userClient.storage
    .from('asset-documents')
    .upload(fileName, fileBuffer, {
      contentType: 'image/png',
      cacheControl: '3600',
    });
    
  if (uploadError) {
    console.error("UPLOAD FAILED! RLS policies for storage are likely missing.");
    console.error("Error Details:", uploadError.message);
  } else {
    console.log("UPLOAD SUCCEEDED! Storage policies are properly configured. Path:", uploadData.path);
    
    // Cleanup uploaded file
    console.log("Cleaning up uploaded file...");
    await supabaseAdmin.storage.from('asset-documents').remove([fileName]);
  }
  
  // Cleanup user
  console.log("Cleaning up test user...");
  await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
}

testStorageUpload();
