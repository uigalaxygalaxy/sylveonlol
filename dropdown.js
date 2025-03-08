// Add event listener to the document to handle all dropdown toggles
document.addEventListener("click", function (event) {
    // Check if the clicked element is a dropdown button
    if (event.target.matches(".dropbtn")) {
        const dropdownId = event.target.getAttribute("data-dropdown");
        const dropdownContent = document.querySelector(
            `[data-dropdown-content="${dropdownId}"]`
        );

        // Toggle the dropdown content
        dropdownContent.classList.toggle("show");
    }

    // Close dropdowns if clicking outside
    if (!event.target.matches(".dropbtn")) {
        const dropdowns = document.querySelectorAll(".dropdown-content");
        dropdowns.forEach((dropdown) => {
            if (dropdown.classList.contains("show")) {
                dropdown.classList.remove("show");
            }
        });
    }
});