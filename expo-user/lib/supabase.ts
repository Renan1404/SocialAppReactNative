import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wxrirdmcxklaejdftcww.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4cmlyZG1jeGtsYWVqZGZ0Y3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ2NjQ0MDIsImV4cCI6MjAzMDI0MDQwMn0.xzP7WoAbAttR1K4JTcDYySkfnKy1JPXavFJZkFifnZA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})