import axios from 'axios'

const baseEndpoint = 'https://api.openweathermap.org/data/2.5'
const weather = 'weather'
const onecall = 'onecall'
const historicalWeather = 'timemachine'
const appid = process.env.OPENWEATHER_API_KEY
const locationIQToken = process.env.LOCATIONIQ_TOKEN
const locationBaseEndPoint = 'https://us1.locationiq.com/v1'
const locationApiBaseEndPoint = 'https://api.locationiq.com/v1'
const reverse = 'reverse.php'
const autocomplete = 'autocomplete.php'
const locationMap = 'https://maps.locationiq.com/v3/staticmap'
const excludeData = 'current,minutely,hourly,alerts'

// Validación de API keys
if (!appid) {
  console.error('OPENWEATHER_API_KEY is not defined in environment variables')
}
if (!locationIQToken) {
  console.error('LOCATIONIQ_TOKEN is not defined in environment variables')
}

export default {
  getWeather (city) {
    const params = {
      appid: appid,
      q: city
    }
    return axios.get(`${baseEndpoint}/${weather}`, { params })
  },
  getCity (args) {
    const params = {
      key: locationIQToken,
      lat: args.lat,
      lon: args.lon,
      format: 'json'
    }
    return axios.get(`${locationBaseEndPoint}/${reverse}`, { params })
  },
  getAutocomplete (args) {
    const params = {
      key: locationIQToken,
      q: args
    }
    return axios.get(`${locationApiBaseEndPoint}/${autocomplete}`, { params })
  },
  getMap (args) {
    const params = {
      key: locationIQToken,
      zoom: 5,
      center: `${args.lat},${args.lon}`,
      marker: `icon:large-red-cutout|${args.lat},${args.lon}`
    }
    return axios.get(`${locationMap}`, { params })
  },
  getHistoricalWeather (args) {
    const params = {
      appid: appid,
      lat: args.lat,
      lon: args.lon,
      dt: args.dt
    }
    return axios.get(`${baseEndpoint}/${onecall}/${historicalWeather}`, { params })
  },
  getForecastWeather (args) {
    const params = {
      appid: appid,
      lat: args.lat,
      lon: args.lon,
      exclude: excludeData
    }
    return axios.get(`${baseEndpoint}/${onecall}`, { params })
  }
}
