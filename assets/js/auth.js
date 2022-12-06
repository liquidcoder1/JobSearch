import { createClient } from '@supabase/supabase-js'


(function () {
    "use strict";

    // fetch('https://www.themuse.com/api/public/jobs?page=1&descending=true', {
    //     method: 'GET',
    //     headers: {
    //         'Accept': 'application/json',
    //     },
    // })
    //     .then(response => response.text())
    //     .then(text => console.log(text))

    // Create a single supabase client for interacting with your database

    const options = {
        db: { schema: 'public' },
        auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
        global: { headers: { 'x-my-custom-header': 'my-app-name' } },
    }

    const supabase = createClient("https://xyzcompany.supabase.co", "public-anon-key", options)
    
    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,        
            password: password,        
          })
    }

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password 
        })
    }
    
})()