function getCurrentYear() {
    return new Date().getFullYear();
}

const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
    currentYearElement.textContent = getCurrentYear();
}
