//primero creo el cliente del supa
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

//traigo las variables bien secretongas 
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Falta SUPABASE_URL o SUPABASE_KEY en .env');
}

//creo al cliente
const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase;

