// Start the server


// Fetch dynamic content from the server
async function loadDynamicContent() {
    const response = await fetch('views/dynamic-part.ejs');
    const html = await response.text();
    document.getElementById('dynamicContainer').innerHTML = html;
}

// Load dynamic content when the page loads
window.addEventListener('load', loadDynamicContent);