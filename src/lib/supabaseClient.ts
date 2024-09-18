import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  'https://htwnzkiehjbpzjehiuyj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0d256a2llaGpicHpqZWhpdXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2NzY3ODUsImV4cCI6MjA0MjI1Mjc4NX0.EUks9ef2RCXg1u3CxNYbd5RF1ljH2AFMXRKo7BqAjVk'
);
