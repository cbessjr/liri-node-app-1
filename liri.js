require("dotenv").config()
const Spotify = require('node-spotify-api')
const request = require('request')
const moment = require('moment')
moment().format();
const keys = require('./keys.js')

const spotify = new Spotify(keys.spotify);
console.log(spotify);
