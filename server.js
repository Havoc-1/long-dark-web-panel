
const express = require('express');
const basicAuth = require('express-basic-auth');
const Docker = require('dockerode');
//const docker = new Docker({socketPath: '/var/run/docker.sock'});
const app = express();
const fs = require('fs');
const path = require('path');

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(basicAuth({
    users : {'username' : 'password'},
    challenge: true
}));

let realWorldTime = 0;
let inGameTime = 0;
let intervalId = null;

app.get('/', async (req, res) => {
    //const container = docker.getContainer('skycoop_container');
    //const data = await container.inspect();
    //const isRunning = data.State.Running;
    const isRunning = false;
    const realWorldDays = Math.floor(realWorldTime / 60 / 24);
    const realWorldHours = Math.floor(realWorldTime / 60 % 24);
    const realWorldMinutes = realWorldTime % 60;
    const inGameDays = Math.floor(inGameTime / 60 / 24);
    const inGameHours = Math.floor(inGameTime / 60 % 24);
    const inGameMinutes = inGameTime % 60;
    const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    const filledHtmlContent = htmlContent.replace('${isRunning}', isRunning ? 'running' : 'not running')
                                         .replace('${realWorldTime}', `${realWorldDays}:${realWorldHours}:${realWorldMinutes}`)
                                         .replace('${inGameTime}', `${inGameDays}:${inGameHours}:${inGameMinutes}`);
    res.send(filledHtmlContent);
});

app.get('/start', async (req, res) => {
    //const container = docker.getContainer('skycoop_container');
    //await container.start();
    res.send('Started');
});

app.get('/stop', async (req, res) => {
    //const container = docker.getContainer('skycoop_container');
    //await container.stop();
    res.send('Stopped');
});

app.listen(4000, () => console.log('Server running on port 4000'));


//FUNCTIONALITY
// 1. Output console

//DESIGN
//fire effect when server has started