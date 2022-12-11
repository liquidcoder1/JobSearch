function displayJobseekerForm(){
	var showDiv = document.getElementById("JobseekerForm");
	showDiv.style.display = "block";
	
	var showDiv2 = document.getElementById("EmployerForm");
	showDiv2.style.display = "none";
}
	
function displayEmployerForm(){
	var showDiv = document.getElementById("EmployerForm");
	showDiv.style.display = "block";
	
	var showDiv2 = document.getElementById("JobseekerForm");
	showDiv2.style.display = "none";

}

function submit(){
	var showDiv = document.getElementById("JobseekerForm");
	showDiv.style.display = "none";
	
	var showDiv2 = document.getElementById("EmployerForm");
	showDiv2.style.display = "none";
	
	alert("Thank you for contacting us. We will follow up as soon as possible");	

}
