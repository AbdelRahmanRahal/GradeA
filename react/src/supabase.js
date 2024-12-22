import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ikekubvnwtyeclezjqhv.supabase.co';
// Finally filling in the key safely after configuring the RLS :p
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZWt1YnZud3R5ZWNsZXpqcWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NzQ0MjIsImV4cCI6MjA0OTM1MDQyMn0.LvfXnEbyRgWn6CY29AsoK2nhIV7rHCIfVhVW4ZK9PcE';
export const supabase = createClient(supabaseUrl, supabaseKey);