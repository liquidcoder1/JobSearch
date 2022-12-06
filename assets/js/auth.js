import { createClient } from '@supabase/supabase-js'


(function () {
    "use strict";

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

        const result = await supabase.from('users').insert(data)

        console.log(response)
    }

    function getData(form) {
        var formData = new FormData(form);
        return Object.fromEntries(formData)
    }

    const signInForm = document.getElementById("signInForm")

    if (typeof signInForm !== 'undefined' && signInForm !== null) {
        signInForm.onsubmit = function (e) {
            e.preventDefault()
            console.log(getData(e.target))
        }        
    }
    
    const signUpForm = document.getElementById("signUpForm")

    if  ( typeof signInForm !== 'undefined' && signUpForm !== null) {
        document.getElementById("signUpForm").onsubmit = function (e) {
            e.preventDefault()
            console.log(getData(e.target))
        }   
    }

})()