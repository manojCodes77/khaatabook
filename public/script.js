// script.js
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const elements = document.querySelectorAll('.container, .file, .nav, input[type="text"], textarea, input[type="submit"]');
    elements.forEach(element => {
        element.classList.toggle('dark-mode');
    });
}
