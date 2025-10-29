// lib/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill';

const supabaseUrl = "https://dxlbyqkrcfkwrtyidpsn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4bGJ5cWtyY2Zrd3J0eWlkcHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDYzNTgsImV4cCI6MjA3Njk4MjM1OH0.SNtQ65-c0tEWfFhXVRVUKh6Ov9tKsiySE9XYFy6h8_o";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});