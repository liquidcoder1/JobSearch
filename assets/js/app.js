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
   * Toggles the login/logout button
   */
  const toggleLoginButton = async () => {
    let loginButton = document.getElementById("loginButton")

    if (await isLoggedIn()) {
      loginButton.innerText = "Logout"
    } else {
      loginButton.innerText = "Login"
    }
  }

  toggleLoginButton()

})()