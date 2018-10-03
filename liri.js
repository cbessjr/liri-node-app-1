
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
const spotifySearch = (song = 'The Sign Ace of Base') => {
  // call the node-spotify-api module
  spotify
    // search for the given song
    .search(
      {
        type: 'track',
        query: song
      },
      (err, data) => {
        // handle errors
        if (err) {
          return console.log(`Error occurred: ${err}`)
        }
        // bind the first result, could return multiple, however spotify tends to give a whole lot of irrelevant results
        let firstResult = data['tracks']['items'][0];
        // if no results are found, inform user and return
        if (!firstResult) return console.log('No results found.')
        // build a list of artists
        let artists = firstResult['artists']
          // grab the artist name from the object, add it on to the list
          .reduce((list, artist) => {
            return list += artist['name'] + ', '
            },''
          )
          // remove the final comma and space from the string
          .slice(0, -2)
        // grab the song name and album
        let songName = firstResult['name']
        let album = firstResult['album']['name']        
        // If a preview url is available, get that. Otherwise, get the full song url
        let prevUrl = firstResult['preview_url'] ? 'Preview: ' + firstResult['preview_url'] : 'Listen here (requires account): ' + firstResult['external_urls']['spotify']
        // display result to user
        console.log(`Song: ${songName}\nArtist(s): ${artists}\nAlbum: ${album}\n${prevUrl}`)
      }
    )
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