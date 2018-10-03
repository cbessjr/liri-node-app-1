
// dependencies
require("dotenv").config()
const Spotify = require('node-spotify-api')
const request = require('request')
const moment = require('moment')
moment().format();
const keys = require('./keys.js')
const spotify = new Spotify(keys.spotify);


// concert-this function
const concertSearch = (artist = 'LCD Soundsystem') => {
  console.log(`Looking up concerts for ${artist}, this may take a moment!`)
  // call the bandsintown API
  request('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp', (err, resp, body) => {
    // check for success
    if (!err && resp.statusCode === 200) {
      // Inform user whether any concerts are upcoming
      console.log(!!JSON.parse(body)[0] ? `Here are the upcoming concerts for ${artist}` : `No concerts scheduled for ${artist} at this time.`)
      // for each entry
      JSON.parse(body).forEach(entry => {
        // grab venue name, city/region/country
        let name = entry['venue']['name']
        let city = entry['venue']['city']
        let region = entry['venue']['region']
        let country = entry['venue']['country']
        // grab date, format it
        let date = moment(entry['datetime']).format('dddd, MMMM Do YYYY, h:mmA');
        // if there's a region, log out this way
        if (region) {
          console.log('------\n', name+'\n', `${city}, ${region}, ${country}\n`, date)
        }
        // else log out this way
        else {
          console.log('------\n', name+'\n', `${city}, ${country}\n`, date)
        }
      })     
    }
  })
}

// spotify-this-song function
const spotifySearch = (song = 'The Sign') => {
  console.log('search a song')
}

// concert-this function
const movieSearch = (movie = 'Mr. Nobody') => {
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
methods[curMethod](process.argv[3])