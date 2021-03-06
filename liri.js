// dependencies
require("dotenv").config()
const Spotify = require('node-spotify-api')
const request = require('request')
const moment = require('moment')
moment().format();
const keys = require('./keys.js')
const spotify = new Spotify(keys.spotify);
const fs = require('fs');
const inquirer = require('inquirer')


// function to log
const logger = (content) => {
  fs.appendFile('log.txt', `\n ${content}`, 'utf8', err => {
    if(err) throw err;
  })
}



// concert-this function
const concertSearch = (artist = 'LCD Soundsystem') => {
  console.log(`Looking up concerts for ${artist}, this may take a moment!`)
  // call the bandsintown API
  request('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp', (err, resp, body) => {
    // check for success
    if (!err && resp.statusCode === 200) {
      // Inform user whether any concerts are upcoming, checking whether any results are returned first
      let informString = !!JSON.parse(body)[0] ? `Here are the upcoming concerts for ${artist}` : `No concerts scheduled for ${artist} at this time.`
      console.log(informString)
      logger(`${informString}\n`)     
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
          logger(`${name}\n ${city}, ${region}, ${country}\n ${date}\n`)
        }
        // else log out this way
        else {
          console.log('------\n', name+'\n', `${city}, ${country}\n`, date)
          logger(`${name}\n ${city}, ${country}\n ${date}\n`)
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
        logger(`Song: ${songName}\nArtist(s): ${artists}\nAlbum: ${album}\n${prevUrl}\n`)
      }
    )
}

// movie-this function
const movieSearch = (movie = 'Mr. Nobody') => {
  console.log('Searching for your film...')
  request(`http://www.omdbapi.com/?apikey=trilogy&t=${movie}`, (err, resp, body) => {
    // check for errors
    if (err) return console.log(err)
    // if successful
    if (resp.statusCode === 200) {      
      let film = JSON.parse(body);
      // if it found a film
      if (film.Response === 'True') {         
        let output = `\n* Title: ${film.Title}\n* Released: ${film.Year}\n* IMDB Rating: ${film.Ratings[0]['Value']}\n* Rotten Tomatoes Rating: ${film.Ratings[1]['Value']}\n* Produced In: ${film.Country}\n* Language(s): ${film.Language}\n* Plot: ${film.Plot}\n* Actors: ${film.Actors}\n`
        console.log(output)
        logger(output)
      }
      // inform user if it found no film
      else {
        console.log(film.Error)
        logger(film.Error)
      }
    }    
  })
}

// do-what-it-says function
const randomSearch = () => {

  // // This is the way the homework wanted us to do it, but I changed random.txt to allow for a true random experience
  // fs.readFile('random.txt', 'utf8', (err, data) => {
  //   if (err) throw err;
  //   let parsed = data.split(',');
  //   let method = parsed[0].slice(0, parsed[0].indexOf('-'));
  //   methods[method](parsed[1])
  // })


  // grab the contents of random.txt
  fs.readFile('random.txt', 'utf8', (err, data) => {
    // handle errors
    if (err) throw err;
    // parse the incoming JSON
    let options = JSON.parse(data);
    // pick a random option from the resulting array
    let option = options[Math.floor(Math.random() * options.length)]
    // format the method
    let method = option['method'].slice(0, option['method'].indexOf('-'));
    // run the appropriate function
    methods[method](option['input'])  
  })  
}



// App methods
const methods = {
  band: concertSearch,
  concert: concertSearch,
  song: spotifySearch,
  spotify: spotifySearch,
  movie: movieSearch,
  do: randomSearch
}






let curMethod = '';
if (process.argv[2]) {
  curMethod = process.argv[2].slice(0, process.argv[2].indexOf('-'))
  methods[curMethod](process.argv[3])
}

else {
  inquirer.prompt([
    {
      name: 'method',
      message: 'What do you want to search for?',
      type: 'list',
      choices: [
        {
          name: 'Search concert dates for a band.',
          value: 'band',
          short: 'Concert search.'
        },
        {
          name: 'Search Spotify for a song.',
          value: 'song',
          short: 'Spotify song search.'
        },
        {
          name: 'Search OMDB for movie info.',
          value: 'movie',
          short: 'Movie search.'
        },
        {
          name: 'Do a random search!',
          value: 'do',
          short: 'Random search.'
        }
      ]
    }
  ]).then(ans => {
    if (ans.method === 'do') return methods['do']()
    curMethod = ans.method
    inquirer.prompt([
      {
        name: 'term',
        message: `What ${curMethod} are you searching for?`
      }
    ]).then(term => {
      methods[curMethod](term.term)     
    })
  })
}

