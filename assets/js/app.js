import { createClient } from '@supabase/supabase-js'

(function() {
  "use strict";

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

  const customiseLoginButton = () => {
    let loginButton = document.getElementById("loginButton")

    if (isLoggedIn) {
      loginButton.innerText = "Logout"
    } else {
      loginButton.innerText = "Login"
    }
  }

  customiseLoginButton()

})()