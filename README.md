# The Long Dark Web Panel

## Description
The Long Dark Web Panel is a web-based server manager for The Long Dark Sky Co-op mod's dedicated server by Filigrani and RED1cat. Made for Ubuntu


## Features
- Real-time server status updates
- Start/Stop server controls
- Docker container logs retrieval
- Parallax effect

## Tech Stack

Node, Express, PM2, Docker, HTML, CSS
## Installation

Setup and build [SkyCoopDedicatedServer](https://github.com/RED1cat/SkyCoopDedicatedServer/)

Run and join the server and do some player actions (drop an item, loot from a container) so that a save file is generated and to ensure there are no issues with the server.json

Clone repository 

```bash
  git clone https://github.com/Havoc-1/long-dark-web-panel.git
```

Install dependencies and PM2
```bash
npm install
npm install pm2
```

#### Docker
To use the Docker container/image
```bash
docker pull bonfireactual/skycoop-dedicatedweb
```
Adjust the `dockerFile` to include your save folder. Your save folder's name is listed in `server.json`, under `"Seed": XXXX` section and **include** it as a `COPY` in the `dockerFile`

```bash
//Example
COPY 444456 /app/444456
```

Be sure to **delete** the folder `/444456` with as this is a placeholder for the dockerFile.
## Deployment

To deploy this project run. Make sure the docker is not running

```bash
  pm2 start server.js
```


## Acknowledgements
The team at SkyCoop for making this experience possible
 - [Filigrani](https://github.com/Filigrani)
 - [RED1cat](https://github.com/RED1cat)
 - [SkyCoop](https://github.com/RED1cat/SkyCoopInstaller)
