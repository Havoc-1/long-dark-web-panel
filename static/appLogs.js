function addLogMessage(message) {
    var consoleDiv = document.getElementById('console');
    // Add the new message
    consoleDiv.innerHTML += '<p>' + message + '</p>';
    // Scroll to the bottom of the div every time
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

// Fetch logs every 5 seconds
setInterval(function() {
    fetch('/logs')
        .then(response => response.text())
        .then(data => {
            // Add the fetched logs to the console div
            addLogMessage(data);
        });
}, 5000);