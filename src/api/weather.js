import axios from 'axios'

const baseEndpoint = 'https://api.openweathermap.org/data/2.5'
const appid = process.env.OPENWEATHER_API_KEY
const locationIQToken = process.env.LOCATIONIQ_TOKEN
const locationBaseEndPoint = 'https://us1.locationiq.com/v1'
const locationApiBaseEndPoint = 'https://api.locationiq.com/v1'

// Validación de API keys
if (!appid) {
  console.error('OPENWEATHER_API_KEY is not defined in environment variables')
}
if (!locationIQToken) {
  console.error('LOCATIONIQ_TOKEN is not defined in environment variables')
}

export default {
  // Clima actual
  getWeather (city) {
    const params = {
      appid: appid,
      q: city
    }
    return axios.get(`${baseEndpoint}/weather`, { params })
  },

  // Pronóstico de 5 días (cada 3 horas) - GRATIS
  getForecastWeather (args) {
    const params = {
      appid: appid,
      lat: args.lat,
      lon: args.lon
    }
    return axios.get(`${baseEndpoint}/forecast`, { params })
  },

  // Calidad del aire actual - GRATIS
  getAirPollution (args) {
    const params = {
      appid: appid,
      lat: args.lat,
      lon: args.lon
    }
    return axios.get(`${baseEndpoint}/air_pollution`, { params })
  },

  // Pronóstico de calidad del aire - GRATIS
  getAirPollutionForecast (args) {
    const params = {
      appid: appid,
      lat: args.lat,
      lon: args.lon
    }
    return axios.get(`${baseEndpoint}/air_pollution/forecast`, { params })
  },

  // LocationIQ - Reverse geocoding
  getCity (args) {
    const params = {
      key: locationIQToken,
      lat: args.lat,
      lon: args.lon,
      format: 'json'
    }
    return axios.get(`${locationBaseEndPoint}/reverse.php`, { params })
  },

  // LocationIQ - Autocomplete
  getAutocomplete (args) {
    const params = {
      key: locationIQToken,
      q: args
    }
    return axios.get(`${locationApiBaseEndPoint}/autocomplete.php`, { params })
  }
}
