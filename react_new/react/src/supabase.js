import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://omdpgnhflouzknikcpky.supabase.co';
// Finally filling in the key safely after configuring the RLS :p
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tZHBnbmhmbG91emtuaWtjcGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4OTQ4MTAsImV4cCI6MjA0ODQ3MDgxMH0.ZO6m8tZC5ewqLZqqpFfqjxMxm-Tz7IPPx9AqDtJsVAI';
export const supabase = createClient(supabaseUrl, supabaseKey);