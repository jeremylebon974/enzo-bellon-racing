import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : createClient('https://psofzkfalxnesqgpfvmp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzb2Z6a2ZhbHhuZXNxZ3Bmdm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3OTk2ODMsImV4cCI6MjA5NTM3NTY4M30.HoUlETyAZ-Rxn0SCW30u2JvYtfEbl7NN-yU4WcLpD0c')