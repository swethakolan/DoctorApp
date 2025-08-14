import { createClient } from '@supabase/supabase-js';


// Read environment variables


// Create a single Supabase client instance
export const supabase = createClient(
  'https://biavmoirjlyhcsrhaxjm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpYXZtb2lyamx5aGNzcmhheGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjQwMzUsImV4cCI6MjA2OTU0MDAzNX0.t8Hpo9Nm2VXmn09JLmvK-0PDaRjeALMD4On8t1BuNk4'
);