//primero creo el cliente del supa
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();


//traigo las variables bien secretongas 
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || !anonKey) {
  throw new Error('Falta SUPABASE_URL o SUPABASE_KEY o SUPABASE_ANON_KEY en .env');
}

//  Cliente para autenticación (registro, login, etc.)
const supabaseAuth = createClient(supabaseUrl, anonKey);

//creo al cliente
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabaseAuth, supabase };

