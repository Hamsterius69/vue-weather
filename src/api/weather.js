import axios from 'axios'

const baseEndpoint = 'https://api.openweathermap.org/data/2.5'
const weather = 'weather'
const onecall = 'onecall'
const historicalWeather = 'timemachine'
const appid = 'cc9f6c5a6b39c16407d129e3e7a4c339'
const locationIQToken = 'pk.c6c6a4b31091555181893a51d208bb8b'
const locationBaseEndPoint = 'https://us1.locationiq.com/v1'
const locationApiBaseEndPoint = 'https://api.locationiq.com/v1'
const reverse = 'reverse.php'
const autocomplete = 'autocomplete.php'
const locationMap = 'https://maps.locationiq.com/v3/staticmap'
const excludeData = 'current,minutely,hourly,alerts'

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
