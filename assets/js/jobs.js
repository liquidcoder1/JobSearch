import { createClient } from '@supabase/supabase-js'


(function () {
    "use strict";

    const options = {
        db: { schema: 'public' },
        auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
        global: { headers: { 'x-my-custom-header': 'my-app-name' } },
    }

    const supabase = createClient("https://vcwwqiizaifrxeowywri.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjd3dxaWl6YWlmcnhlb3d5d3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzAzNTQyMDQsImV4cCI6MTk4NTkzMDIwNH0.IcTDXl23rGv5qc2yWirOnLu-KGfrJrib19xbRjKE6tw", options)


    const isLoggedIn = async () => {
        const { data, error } = await supabase.auth.getSession()

        console.log("Result getting session: ", data.session)
        console.log("Getting session error: ", error)

        const { data: { user } } = await supabase.auth.getUser()

        console.log("Current user: ", user)

        return data.session !== null
    }

    const currentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    }

    const checkLoginStatus = async () => {
        console.log("is logged in: ", isLoggedIn())
        if (await isLoggedIn()) {
            let user = await currentUser()
            console.log(user.email)
        } else {
            window.location.href = "/pages/login.html" 
        }
    }

    checkLoginStatus()

    const apply = async (job) => {
        if (await isLoggedIn()) {
            let user = await currentUser()

            let application = {
                id: user.id + job.id,
                user_id: user.id,
                job_name: job.name,
                job_id: job.id,
                job_company: job.company.name,
                job_location: job.locations[0].name,
                job_category: job.categories[0].name,
                job_level: job.levels[0].name
            }
            console.log(application)
            const result = await supabase.from('applications').insert(application)
        } else {
            window.location.href = "/pages/account.html"
        }
    }

    const appliedJobs = async () => {
        let user = await currentUser()
        const { data, error } = await supabase
            .from('applications')
            .select()
            .eq('user_id', user.id)

        return data
    }

    const displayJobs = async () => {

        let jobs = await appliedJobs()

        fetch('https://www.themuse.com/api/public/jobs?page=1&descending=true', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(json => {

                json.results.forEach(job => {

                    let isApplied = false

                    jobs.forEach(j => {
                        if (j.job_id === job.id) {
                            isApplied = true;
                        }
                    });

                    let card = document.createElement("div")
                    card.className = "card shadow-lg p-3 bg-body rounded"

                    let jobTitle = document.createElement("h4")
                    jobTitle.className = "job_title fw-bold"
                    jobTitle.innerHTML = job.name

                    let jobCompany = document.createElement("h6")
                    jobCompany.className = "job_company fw-bold text-secondary"
                    jobCompany.innerHTML = job.company.name

                    let jobDescription = document.createElement("p")
                    jobDescription.className = "job_description text-secondary"
                    // jobDescription.innerHTML = job.contents

                    let jobDetails = document.createElement("p")
                    jobDetails.className = "job_details"

                    let jobLocation = document.createElement("span")
                    jobLocation.className = "job_location  me-2"

                    job.locations.forEach(loc => {

                        let location = document.createElement("span")
                        location.className = "job_location badge bg-success"
                        location.innerHTML = loc.name

                        jobLocation.append(location)
                    });

                    let jobCategory = document.createElement("span")
                    jobCategory.className = "job_category me-2"

                    job.categories.forEach(cat => {

                        let category = document.createElement("span")
                        category.className = "job_category px-2 badge bg-dark"
                        category.innerHTML = cat.name
                        jobCategory.append(category)

                    });

                    let jobLevel = document.createElement("span")
                    jobLevel.className = "job_level  me-2"

                    job.levels.forEach(lev => {

                        let level = document.createElement("span")
                        level.className = "job_level badge bg-warning"
                        level.innerHTML = lev.name

                        jobLevel.append(level)
                    });

                    let applyButton = document.createElement("button")
                    applyButton.className = isApplied ? "btn btn-secondary" : "btn btn-primary"
                    applyButton.textContent = isApplied ? "Applied" : "Apply"

                    applyButton.onclick = function () {
                        if (!isApplied) {
                            apply(job)   
                        }
                    }

                    jobDetails.append(jobLocation, jobCategory, jobLevel)

                    card.append(jobTitle, jobCompany, jobDescription, jobDetails, applyButton)

                    document.getElementById("jobContainer").appendChild(card)
                });
            })
    }

    displayJobs()

})()