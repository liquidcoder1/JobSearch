import { createClient } from '@supabase/supabase-js'

(function () {

    const options = {
        db: { schema: 'public' },
        auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
        global: { headers: { 'x-my-custom-header': 'my-app-name' } },
    }

    const supabase = createClient("https://vcwwqiizaifrxeowywri.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjd3dxaWl6YWlmcnhlb3d5d3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzAzNTQyMDQsImV4cCI6MTk4NTkzMDIwNH0.IcTDXl23rGv5qc2yWirOnLu-KGfrJrib19xbRjKE6tw", options)

    const isLoggedIn = async () => {
        const { data, error } = await supabase.auth.getSession()
        return data.session !== null
    }

    const currentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        return user        
    }


    const checkLoginStatus = async () => {
        if (!isLoggedIn) {
            window.location.href = "/pages/login.html"
        } else {
            let user = await currentUser()
            console.log(user.email)
        }
    }

    checkLoginStatus()

    document.getElementById("logoutButton").onclick = function async () {
        // Implement me
        console.log("To be implemeted")
    }

})()