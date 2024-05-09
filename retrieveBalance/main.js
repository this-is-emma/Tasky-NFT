// main.js

// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the button element
    var button = document.querySelector('button');

    // Get the element where you want to display "Hello"
    var displayElement = document.getElementById('display');

    // Add click event listener to the button
    button.addEventListener('click', function() {
        // Display "Hello" inside the <p> or <h> tag
        displayElement.textContent = "Hello";
    });
});
