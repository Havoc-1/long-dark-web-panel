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

let realWorldTime = 0;
let inGameTime = 0;


//Update timer every second
setInterval(() => {
    realWorldTime++;
    inGameTime += 12 //1 in-game minute is 5 seconds irl
}, 1000);

app.get('/time', (req, res) => {
    try {
        const realWorldDays = Math.floor(realWorldTime / 60 / 24);
        const realWorldHours = Math.floor(realWorldTime / 60 % 24);
        const realWorldMinutes = realWorldTime % 60;
        const inGameDays = Math.floor(inGameTime / 60 / 24);
        const inGameHours = Math.floor(inGameTime / 60 % 24);
        const inGameMinutes = inGameTime % 60;
        res.json({ 
            realWorldTime: `${realWorldDays}:${realWorldHours}:${realWorldMinutes}`,
            inGameTime: `${inGameDays}:${inGameHours}:${inGameMinutes}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Create new route for appLogs every 5 seconds
app.get('/logs', async (req, res) => {
    //console.log('Fetching logs...');
    const container = docker.getContainer('skycoop_container');
    const logBuffer = await container.logs({
        follow: false,
        stdout: true,
        stderr: true,
        tail: 100 // Fetch the last 100 lines of logs
    });

    const logs = logBuffer.toString('utf8');
    //console.log('Logs:', logs);
    res.send(logs);
});


//Server status 
app.get('/start', async (req, res) => {
    const container = docker.getContainer('skycoop_container');
    await container.start();
    res.send('Started');
});

app.get('/stop', async (req, res) => {
    const container = docker.getContainer('skycoop_container');
    await container.stop();
    res.send('Stopped');
});

app.get('/status', async (req, res) => {
    const container = docker.getContainer('skycoop_container');
    const data = await container.inspect();
    const isRunning = data.State.Running;
    res.json({ isRunning });
});


app.listen(4000, () => console.log('Server running on port 4000'));

