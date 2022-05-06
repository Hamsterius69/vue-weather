# Current weather data (vue-technical-challenge-tinkerlist)

A Quasar Framework app

## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
yarn lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

# Technical Front End Developer Assingment
If you made it all the way here, congratulations! A new challenge has arrived though. 💪

Time for a technical assignment! Take as much time as you need to deliver your solution, while being reasonable. Please let us know if there are any unexpected delays or reasons why you can't take the test at this time. For any further questions, contact us via you HR contact at our company.

## Instructions
+ Clone this repo
+ Complete this exercise and submit either a zip of the solution or a link to a new repo
+ Please target the latest stable release of Vue.js
+ Use the [OpenWeatherMap API](https://openweathermap.org/api) for weather data

## Requirements
+ Solution should be responsive
+ There should be an input where the user can write the location (city, for example) they want to get info for
+ Show the weather info currently for the input location:
  + Location (ie. Brussels, Belgium)
  + Current weather description (ie. raining)
  + Current temperature
  + Today's high temperature
  + Today's low temperature
+ Add extra info about the current conditions on a hidden component the user can toggle the visibility:
    + Wind Speed
    + Humidity
    + Pressure
    + Sunrise/Sunset Time
+ Show basic weather info for the next 7 days on that location
+ Show basic weather info for the last 5 days on that location
+ If there's a need to make a big number of requests, make them concurrent

## Bonus Round:
__Was this too easy?__
  + Pre-fill the input field with the user current location
  + Deliver the solution hosted on your favourite cloud service with any appropriate changes you'd feel are relevant for a hosted solution
  + Show the location on a map
  + Auto complete the location input as the user types
  + Lazy-load weather info
  + Surprise us :)
