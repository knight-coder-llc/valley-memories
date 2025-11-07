import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uitfocdovcicgkxmoqmf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpdGZvY2RvdmNpY2dreG1vcW1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTcxNzMsImV4cCI6MjA3NzM5MzE3M30.Gsw7Zbvof0R-t_TRS3x_qPD6-_ahmHUC2GXyCy6_KtE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;