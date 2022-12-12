import { createClient } from '@supabase/supabase-js'


(function () {
    "use strict";

    /**
     * Supabase options
     */
    const options = {
        db: { schema: 'public' },
        auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
        global: { headers: { 'x-my-custom-header': 'my-app-name' } },
    }

    /**
     * Create a single supabase client for interacting with your database
     */
    const supabase = createClient("https://vcwwqiizaifrxeowywri.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjd3dxaWl6YWlmcnhlb3d5d3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzAzNTQyMDQsImV4cCI6MTk4NTkzMDIwNH0.IcTDXl23rGv5qc2yWirOnLu-KGfrJrib19xbRjKE6tw", options)

    /**
     * Checks whether the current user is logged in
     * @returns a boolean value indicating whether the user is logged in or not by checking if the session is not null
     */
    const isLoggedIn = async () => {
        const { data, error } = await supabase.auth.getSession()
        const { data: { user } } = await supabase.auth.getUser()
        return data.session !== null
    }

    /**
     * Redirects the user the accouont page
     */
    const redirectToAccount = async () => {
        if (await isLoggedIn()) {
            window.location.href = "/pages/account.html"
        }
    }

    redirectToAccount()

    /**
     * Logs the user in
     * @param {String} email user's email address
     * @param {String} password user's password
     */
    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
    }

    /**
     * Signs the user up
     * @param {String} email user's email
     * @param {*} password user's password
     */
    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })

        const result = await supabase.from('users').insert({user_id: data.user.id})
        console.log("Result saving user",result)
    }

    /**
     * Creates and returns an object from the form data values.
     * @param {FormData} form form data
     * @returns an object created from the form values
     */
    function getData(form) {
        var formData = new FormData(form);
        return Object.fromEntries(formData)
    }

    /**
     * Get the signIn form element
     */
    const signInForm = document.getElementById("signInForm")

    /**
     * Checks whether we have a vaid signInForm and handle submission
     */
    if (typeof signInForm !== 'undefined' && signInForm !== null) {
        signInForm.onsubmit = function (e) {
            e.preventDefault()
            let user = getData(e.target)
            signIn(user.username, user.password)
        }        
    }

    /**
     * Get the signIn form element
     */
    const signUpForm = document.getElementById("signUpForm")

    /**
     * Checks whether we have a vaid signInForm and handle submission
     */
    if  ( typeof signUpForm !== 'undefined' && signUpForm !== null) {
        signUpForm.onsubmit = function (e) {
            e.preventDefault()
            let user = getData(e.target)
            signUp(user.username, user.password)
        }   
    }

})()