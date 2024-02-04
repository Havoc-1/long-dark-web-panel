const express = require('express');
const basicAuth = require('express-basic-auth');
const Docker = require('dockerode');
const docker = new Docker({socketPath: '/var/run/docker.sock'});
const app = express();
const fs = require('fs');
const path = require('path');

app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', async (req, res) => {
    const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    res.send(htmlContent);
});

app.use(basicAuth({
    users : {'username' : 'password'},
    challenge: true
}));

let realWorldSeconds = 0;
let inGameMinutes = 0;
let intervalId = null;

// Update real world time every second
setInterval(() => {
    realWorldSeconds++;
}, 1000);

// Update in-game time every 5 seconds
setInterval(() => {
    inGameMinutes++; // 1 in-game minute is 5 irl seconds
}, 5000);

app.get('/time', (req, res) => {
    const realWorldDays = Math.floor(realWorldSeconds / 60 / 60 / 24);
    const realWorldHours = Math.floor(realWorldSeconds / 60 / 60 % 24);
    const realWorldMinutes = Math.floor(realWorldSeconds / 60 % 60);
    const realWorldSecs = realWorldSeconds % 60;
    const inGameDays = Math.floor(inGameMinutes / 60 / 24);
    const inGameHours = Math.floor(inGameMinutes / 60 % 24);
    const inGameMins = inGameMinutes % 60;
    res.json({ 
        realWorldTime: `${realWorldDays}:${realWorldHours}:${realWorldMinutes}:${realWorldSecs}`,
        inGameTime: `${inGameDays}:${inGameHours}:${inGameMins}`
    });
});

//Create route for appLogs
app.get('/logs', async (req, res) => {
    //console.log('Fetching logs...');
    const container = docker.getContainer('skycoop_container');
    const logBuffer = await container.logs({
        follow: false,
        stdout: true,
        stderr: true,
        tail: 100 // Fetch this amount of lines from log
    });

    let logs = logBuffer.toString('utf8');
    // Remove characters between newline and [ because of unprintable characters from Docker
    logs = logs.replace(/(\r?\n)[^\r\n[]*/g, '$1');
    //console.log('Logs:', logs);
    res.send(logs);
});


//Server status 
app.get('/start', async (req, res) => {
    const container = docker.getContainer('skycoop_container');
    await container.start();
    // Start the timers when server first starts up
    intervalId = setInterval(() => {
        realWorldTime++;
        inGameTime += 12; // 1 in-game minute is 5 irl seconds
        fs.writeFileSync(path.join(__dirname, 'times.json'), JSON.stringify({ realWorldTime, inGameTime }));
    }, 1000);
    res.send('Started');
});

app.get('/stop', async (req, res) => {
    const container = docker.getContainer('skycoop_container');
    await container.stop();
    // Stop the timers and reset them to 0 when the server stops
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    realWorldTime = 0;
    inGameTime = 0;
    fs.writeFileSync(path.join(__dirname, 'times.json'), JSON.stringify({ realWorldTime, inGameTime }));
    res.send('Stopped');
});

app.get('/status', async (req, res) => {
    const container = docker.getContainer('skycoop_container');
    const data = await container.inspect();
    const isRunning = data.State.Running;
    res.json({ isRunning });
});


app.listen(4000, () => console.log('Server running on port 4000'));

