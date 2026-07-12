const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("Testing connection to Supabase:", supabaseUrl);
  
  // 1. Check schemas/tables by selecting from assets
  const { data: assets, error: assetsError } = await supabase
    .from('assets')
    .select('*')
    .limit(1);
    
  if (assetsError) {
    console.error("Error querying 'assets' table:", assetsError);
  } else {
    console.log("Successfully connected and queried 'assets' table! Count of rows fetched:", assets.length);
  }

  // 2. Check profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (profilesError) {
    console.error("Error querying 'profiles' table:", profilesError);
  } else {
    console.log("Successfully queried 'profiles' table! Count of rows fetched:", profiles.length);
  }
}

testConnection();
