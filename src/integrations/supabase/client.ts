// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pfrbamnjpqmfguetphto.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcmJhbW5qcHFtZmd1ZXRwaHRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NzI4NDgsImV4cCI6MjA1OTA0ODg0OH0.tHLLJ1JH_Y6Ad63j7UM46kAvkAv9dRt8HSQhWyHckgc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);