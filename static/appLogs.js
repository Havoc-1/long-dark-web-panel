function fetchLogs() {
    fetch('/logs')
        .then(response => response.text())
        .then(data => {
            document.getElementById('logs').innerText = data;
        });
}

// Fetch logs every 5 seconds
setInterval(fetchLogs, 5000);
