import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oavrmavdilphdqbhpdpi.supabase.co';  // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hdnJtYXZkaWxwaGRxYmhwZHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MTUyNzYsImV4cCI6MjA1ODE5MTI3Nn0.Oyz-HouzJl3pIDENfF94opRxcLO41e67ZwQ10DIeDyY';  // Replace with your Supabase public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
