
let isExpanded = false

document.getElementById("menuToggler").onclick = function () {
    document.getElementById("navbar").className = isExpanded ? "navbar" : "navbar-mobile"
    isExpanded = !isExpanded
}