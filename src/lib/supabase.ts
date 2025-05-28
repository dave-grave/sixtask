import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jnnnzjivyiuzekcqdgnh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impubm56aml2eWl1emVrY3FkZ25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MDM5MjYsImV4cCI6MjA2Mzk3OTkyNn0.1nHQD3cTOOlEFJFfe4t1mxOK6CWShtq68AxoqAzx_kA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
