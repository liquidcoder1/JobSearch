import { createClient } from '@supabase/supabase-js'


(function () {
    "use strict";

    // Create a single supabase client for interacting with your database
    const options = {
        db: { schema: 'public' },
        auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
        global: { headers: { 'x-my-custom-header': 'my-app-name' } },
    }

    const supabase = createClient("https://vcwwqiizaifrxeowywri.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjd3dxaWl6YWlmcnhlb3d5d3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzAzNTQyMDQsImV4cCI6MTk4NTkzMDIwNH0.IcTDXl23rGv5qc2yWirOnLu-KGfrJrib19xbRjKE6tw", options)


    const isLoggedIn = async () => {
        const { data, error } = await supabase.auth.getSession()

        console.log("Result signing up user: ", data.session)
        console.log("Getting session error: ", error)

        const { data: { user } } = await supabase.auth.getUser()

        console.log("Current user: ", user)

        return data.session !== null
    }

    const redirectToAccount = () => {
        if (isLoggedIn) {
            window.location.href = "/pages/account.html"
        }
    }

    redirectToAccount()

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        console.log("Result signin user: ", data)

        console.log("Error signin user: ", error)
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        console.log("Error signing out: ", error)
    }


    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })

        console.log("Result signing up user: ", data.user.id)

        console.log("Error creating user: ", error)

        const result = await supabase.from('users').insert({user_id: data.user.id})

        console.log("Result saving user",result)
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
            let user = getData(e.target)
            signIn(user.username, user.password)
        }        
    }

    const signUpForm = document.getElementById("signUpForm")

    if  ( typeof signUpForm !== 'undefined' && signUpForm !== null) {
        signUpForm.onsubmit = function (e) {
            e.preventDefault()
            let user = getData(e.target)
            signUp(user.username, user.password)
        }   
    }

})()