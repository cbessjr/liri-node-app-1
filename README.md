# liri-node-app
A node.js app for discovering entertainment options.

## Overview
This app allows a user to choose from one of four search options to fulfill their entertainment needs.

Method | Description
------ | ----------
`concert-this <artist name>` | Returns information on upcoming concerts for the given artist from [Bandsintown](https://www.bandsintown.com/).
`spotify-this-song <song name>` | Returns information and a [Spotify](https://www.spotify.com) link for the given song.
`movie-this <movie name>` | Returns information for the given movie from the [OMDB](https://www.omdbapi.com).
`do-whatever` | Returns a random result from above.

The result of a given method is logged out to the console, and also stored locally in a log file.

## Setting up the app
### 1. Clone or download this repository

![Clone or Download Image](https://i.imgur.com/ZP8N719.png)

### 2. Install npm if you dont have it

Instructions found at [npmjs.com](https://docs.npmjs.com/getting-started/installing-node)

### 3. Install required dependencies

In terminal (Mac) or bash (PC), navigate to the folder where you have this app. Then install dependencies:  
  `npm i`  
The following dependencies will be installed:
* node-spotify-api
* moment
* require
* dotenv

### 4. Obtain Spotify API Key
Navigate to the [Spotify Developer](https://developer.spotify.com/dashboard/login) page. Login, or if you don't already have a Spotify account, you can create one for free. Once there, head over to the [dashboard](https://developer.spotify.com/dashboard/applications).

![Spotify Developer Dashboard Image](https://i.imgur.com/H81Ehgw.png)

Create a new app, calling it whatever you'd like. Then, from the page for the app, copy your Client ID and Client Secret.

![API Keys Image](https://i.imgur.com/DV6dMFI.png)

You will need these later.

