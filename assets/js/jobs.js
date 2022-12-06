(function () {
    "use strict";

    fetch('https://www.themuse.com/api/public/jobs?page=1&descending=true', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
        .then(response => response.json())
        .then(json => {

            console.log(json.results)

            json.results.forEach(job => {
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
                applyButton.className = "btn btn-primary"
                applyButton.textContent = "Apply"

                jobDetails.append(jobLocation, jobCategory, jobLevel)

                card.append(jobTitle, jobCompany, jobDescription, jobDetails, applyButton)

                document.getElementById("jobContainer").appendChild(card)
            });




        })

})()