import { createClient } from '@supabase/supabase-js'

(function () {

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
        return data.session !== null
    }

    /**
     * fetches and returns the current user
     * @returns the current user
     */
    const currentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user === null) {
            const { error } = await supabase.auth.signOut()
            checkLoginStatus()
        }
        return user        
    }

    /**
     * Checks whether the user is logged in, if not redirect him to the login page
     */
    const checkLoginStatus = async () => {
        if (await isLoggedIn()) {
            let user = await currentUser()
        } else {
            window.location.href = "/pages/login.html" 
        }
    }

    checkLoginStatus()

    document.getElementById("logoutButton").onclick =  async () => {
        const { error } = await supabase.auth.signOut()
    }

    const fetchJobs = async () => {
        let user = await currentUser()
        const { data, error } = await supabase
            .from('applications')
            .select()
            .eq('user_id', user.id)

        return data
    }

    /**
     * Display users applied jobs
     */
    const displayJobs = async () => {
        let jobs = await fetchJobs()

        jobs.forEach(job => {
            let card = document.createElement("div")
            card.className = "card shadow-lg p-3 bg-body rounded"

            let jobTitle = document.createElement("h4")
            jobTitle.className = "job_title fw-bold"
            jobTitle.innerHTML = job.job_name

            let jobCompany = document.createElement("h6")
            jobCompany.className = "job_company fw-bold text-secondary"
            jobCompany.innerHTML = job.job_company
            
            let jobDetails = document.createElement("p")
            jobDetails.className = "job_details"

            let jobLocation = document.createElement("span")
            jobLocation.className = "job_location me-2 badge bg-success"
            jobLocation.innerHTML = job.job_location

            let jobCategory = document.createElement("span")
            jobCategory.className = "job_category me-2 badge bg-dark"
            jobCategory.innerHTML = job.job_category

            let jobLevel = document.createElement("span")
            jobLevel.className = "job_level badge bg-warning"
            jobLevel.innerHTML = job.job_level

            let applyButton = document.createElement("button")
            applyButton.className =  "btn btn-primary"
            applyButton.textContent =  "See more"

            applyButton.onclick = function () {
              
            }

            jobDetails.append(jobLocation, jobCategory, jobLevel)

            card.append(jobTitle, jobCompany, jobDetails, applyButton)

            document.getElementById("jobContainer").appendChild(card)
        });
    }
    
    displayJobs()

})()