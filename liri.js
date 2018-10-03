
// dependencies
require("dotenv").config()
const Spotify = require('node-spotify-api')
const request = require('request')
const moment = require('moment')
moment().format();
const keys = require('./keys.js')
const spotify = new Spotify(keys.spotify);


// concert-this function
const concertSearch = () => {
  return 'do a damned thing'
}

// spotify-this-song function
const spotifySearch = () => {
  console.log('search a song')
}

// concert-this function
const movieSearch = () => {
  console.log('search a movie')
}

// concert-this function
const randomSearch = () => {
  console.log('do a damned thang')
}



// App methods
const methods = {
  concert: concertSearch,
  spotify: spotifySearch,
  movie: movieSearch,
  do: randomSearch
}






let curMethod = process.argv[2].slice(0, process.argv[2].indexOf('-'))
console.log(methods[curMethod]())