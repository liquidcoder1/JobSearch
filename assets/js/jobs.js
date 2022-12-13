import { createClient } from '@supabase/supabase-js'


(function () {
    "use strict";

    /*
        Supabase options
    */
    const options = {
        db: { schema: 'public' },
        auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
    }

    /**
     * Create a single supabase client for interacting with your database
     */
    const supabase = createClient("https://vcwwqiizaifrxeowywri.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjd3dxaWl6YWlmcnhlb3d5d3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzAzNTQyMDQsImV4cCI6MTk4NTkzMDIwNH0.IcTDXl23rGv5qc2yWirOnLu-KGfrJrib19xbRjKE6tw", options)

    /**
     * Tracks current page index of the jobs rest api
     */
    let currentPageIndex = 1

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
        return user
    }

    /**
     * Applies to the given job by saving the details in the database
     * @param {JobObject} job job object 
     */
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
            window.location.href = "/pages/login.html"
        }
    }

    /**
     * Fetches and returns applied jobs for the current user
     * @returns An array of jobs that the current user has applied to
     */
    const appliedJobs = async () => {
        if (await isLoggedIn()) {
            let user = await currentUser()
            const { data, error } = await supabase
                .from('applications')
                .select()
                .eq('user_id', user.id)

            return data
        }

        return []
    }

    /**
     * Fetch a single jobs page from the rest api
     */
    const fetchJobPage = async () => {

        let usersJobs = await appliedJobs()
        $("#loadingElement").loading();

        const opts = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        }

        const response = await fetch('https://www.themuse.com/api/public/jobs?page=' + currentPageIndex + '&descending=true', opts)
        const jobs = await response.json()

        $("#loadingElement").loading('stop')
        $("#loadingElement").hide()

        jobs.results.forEach(job => {

            let isApplied = false

            usersJobs.forEach(j => {
                if (j.job_id === job.id) {
                    isApplied = true;
                }
            });

            const card = document.createElement("div")
            card.className = "card shadow-lg p-3 bg-body d-flex flex-column rounded"

            const cardBody = document.createElement("div")
            cardBody.className = "card-body d-flex flex-column"

            const jobTitle = document.createElement("h4")
            jobTitle.className = "card-title job_title fw-bold"
            jobTitle.innerHTML = job.name

            const jobCompany = document.createElement("h6")
            jobCompany.className = "job_company fw-bold text-secondary"
            jobCompany.innerHTML = job.company.name

            const jobDetails = document.createElement("p")
            jobDetails.className = "job_details"

            const jobLocation = document.createElement("span")
            jobLocation.className = "job_location badge bg-success  me-2"
            jobLocation.innerHTML = job.locations[0].name

            const jobCategory = document.createElement("span")
            jobCategory.className = "job_category px-2 badge bg-dark me-2"
            jobCategory.innerHTML = job.categories[0].name

            const jobLevel = document.createElement("span")
            jobLevel.className = "job_level badge bg-warning me-2"
            jobLevel.innerHTML = job.levels[0].name

            const applyButton = document.createElement("button")
            applyButton.className = isApplied ? "btn me-2 col btn-secondary" : "btn me-2 col btn-info"
            applyButton.textContent = isApplied ? "Applied" : "Apply"

            const learnMoreButton = document.createElement("button")
            learnMoreButton.type = "button"
            learnMoreButton.innerHTML = "Learn more"
            learnMoreButton.className = "btn  col btn-outline-info"
            learnMoreButton.setAttribute("data-bs-toggle", "modal");
            learnMoreButton.setAttribute("data-bs-target", "#jobContentModal");
            learnMoreButton.setAttribute("data-bs-jobid", job.id);

            const buttons = document.createElement("div")
            buttons.className = "row  m-3"

            applyButton.onclick = function () {
                if (!isApplied) {
                    apply(job)
                }
            }

            document.getElementById("jobContentModal").addEventListener('show.bs.modal', function (event) {                            
                var button = event.relatedTarget
                var jobID = button.getAttribute('data-bs-jobid')
                
                if (""+job.id === jobID) {
                    const modalBody = document.getElementById("modelBody")
                    modalBody.innerHTML = job.contents
                    const modalTitle = document.getElementById("modalTitle")
                    modalTitle.innerHTML = job.name                        
                }
            })

            buttons.append(applyButton, learnMoreButton)
            jobDetails.append(jobLocation, jobCategory, jobLevel)
            cardBody.append(jobTitle, jobCompany, jobDetails)
            card.append(cardBody, buttons)

            document.getElementById("jobContainer").appendChild(card)

        });

    }

    /**
     * Initiates and processes jobs pagination
     */
    const pagination = async () => {

        const nextPage = document.getElementById("nextPage")

        fetchJobPage()

        nextPage.onclick = async () => {
            currentPageIndex += 1
            fetchJobPage()
        }
    }

    pagination()

})()