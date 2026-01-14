import { ref } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { genericFunctions } from './GenericFunctions'

const { useKelvinAndCelsius, getEpochNumber, epochToDateString } = genericFunctions()

export function useWeatherData () {
  const store = useStore()
  const $q = useQuasar()

  const weatherData = ref({})
  const center = ref({})
  const forecastWeatherRows = ref([])
  const historicalWeatherRows = ref([])
  const forecastTableLoading = ref(false)
  const historicalTableLoading = ref(false)

  const showNotify = (type, message) => {
    $q.notify({
      type: type,
      message: message,
      position: 'top-right',
      timeout: 5000,
      closeBtn: 'Close me'
    })
  }

  const loadForecastWeatherRows = (lat, lon) => {
    forecastTableLoading.value = true
    store.dispatch('callGetForecastWeather', { lat: lat, lon: lon }).then((response) => {
      forecastWeatherRows.value.length = 0
      response.data.daily.forEach(element => {
        const row = {
          date: epochToDateString(element.dt),
          temperatureDay: useKelvinAndCelsius(element.temp.day),
          temperatureMin: useKelvinAndCelsius(element.temp.min),
          temperatureMax: useKelvinAndCelsius(element.temp.max),
          description: element.weather[0].description
        }
        forecastWeatherRows.value.push(row)
      })
      forecastTableLoading.value = false
    }).catch((error) => {
      const errorMessage = `Error to get forecast weather: ${error.response ? error.response.data.message : ''}`
      forecastTableLoading.value = false
      showNotify('negative', errorMessage)
    })
  }

  const loadHistoricalWeatherRows = (lat, lon) => {
    const httpRequestList = []
    for (let i = 5; i > 0; i -= 1) {
      const args = {
        lat: lat,
        lon: lon,
        dt: getEpochNumber(-i)
      }
      const httpRequest = store.dispatch('callGetHistoricalWeather', args)
      httpRequestList.push(httpRequest)
    }
    historicalWeatherRows.value.length = 0
    historicalTableLoading.value = true
    Promise.allSettled(httpRequestList).then((values) => {
      values.forEach((response) => {
        const historicalData = response.value.data.current
        const row = {
          date: epochToDateString(historicalData.dt),
          temperature: useKelvinAndCelsius(historicalData.temp),
          main: historicalData.weather[0].main,
          description: historicalData.weather[0].description
        }
        historicalWeatherRows.value.push(row)
      })
      historicalTableLoading.value = false
    }).catch((error) => {
      const errorMessage = `Error to get historical weather: ${error.response ? error.response.data.message : ''}`
      historicalTableLoading.value = false
      showNotify('negative', errorMessage)
    })
  }

  const fetchWeatherData = (cityName) => {
    return new Promise((resolve, reject) => {
      store.dispatch('callGetWeather', cityName).then((response) => {
        weatherData.value = response.data
        center.value = { lat: response.data.coord.lat, lng: response.data.coord.lon }
        loadForecastWeatherRows(response.data.coord.lat, response.data.coord.lon)
        loadHistoricalWeatherRows(response.data.coord.lat, response.data.coord.lon)
        resolve(response.data)
      }).catch((error) => {
        const errorMessage = `Error to get weather: ${error.response ? error.response.data.message : ''}`
        showNotify('negative', errorMessage)
        reject(error)
      })
    })
  }

  return {
    weatherData,
    center,
    forecastWeatherRows,
    historicalWeatherRows,
    forecastTableLoading,
    historicalTableLoading,
    loadForecastWeatherRows,
    loadHistoricalWeatherRows,
    fetchWeatherData,
    showNotify
  }
}
