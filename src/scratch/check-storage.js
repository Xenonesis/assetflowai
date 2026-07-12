const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorage() {
  console.log("Checking Supabase Storage Buckets...");
  
  // 1. List buckets
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error("Error listing buckets:", listError.message);
    return;
  }
  
  console.log("Existing buckets:", buckets.map(b => b.name));
  
  const bucketName = 'asset-documents';
  const hasBucket = buckets.some(b => b.name === bucketName);
  
  if (!hasBucket) {
    console.log(`Bucket '${bucketName}' does not exist. Creating it...`);
    const { data: createData, error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/*', 'application/pdf'],
      fileSizeLimit: 10485760 // 10MB
    });
    
    if (createError) {
      console.error("Failed to create bucket:", createError.message);
    } else {
      console.log(`Bucket '${bucketName}' created successfully!`);
    }
  } else {
    console.log(`Bucket '${bucketName}' already exists.`);
  }

  // 2. Set up RLS policies for storage objects if not already configured
  // Note: Standard storage policies in Supabase can be managed via SQL.
  // We can verify if we can upload/download files.
}

checkStorage();
