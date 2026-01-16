import { ref } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { genericFunctions } from './GenericFunctions'

const { kelvinToCelsius, epochToDateString } = genericFunctions()

// Shared temperature unit state (module-level to persist across components)
const temperatureUnit = ref('celsius')

export function useWeatherData () {
  const store = useStore()
  const $q = useQuasar()

  const weatherData = ref({})
  const center = ref({})
  const forecastWeatherRows = ref([])
  const airPollutionData = ref(null)
  const forecastTableLoading = ref(false)
  const airPollutionLoading = ref(false)

  // Temperature conversion function from Kelvin to selected unit
  const convertFromKelvin = (tempKelvin) => {
    const celsius = tempKelvin - 273.15
    if (temperatureUnit.value === 'fahrenheit') {
      return Math.round((celsius * 9 / 5) + 32)
    }
    return Math.round(celsius)
  }

  // Temperature conversion function (Celsius to selected unit)
  const convertTemperature = (tempCelsius) => {
    if (temperatureUnit.value === 'fahrenheit') {
      return Math.round((tempCelsius * 9 / 5) + 32)
    }
    return Math.round(tempCelsius)
  }

  // Set temperature unit
  const setTemperatureUnit = (unit) => {
    temperatureUnit.value = unit
  }

  const showNotify = (type, message) => {
    $q.notify({
      type: type,
      message: message,
      position: 'bottom-right',
      timeout: 5000,
      closeBtn: 'Close me'
    })
  }

  // Procesa el forecast de 5 días agrupando por día
  const loadForecastWeatherRows = (lat, lon) => {
    forecastTableLoading.value = true
    store.dispatch('callGetForecastWeather', { lat: lat, lon: lon }).then((response) => {
      // La API devuelve datos cada 3 horas (40 registros para 5 días)
      // Agrupamos por día y calculamos min/max
      const dailyData = {}

      response.data.list.forEach(item => {
        const date = epochToDateString(item.dt)

        if (!dailyData[date]) {
          dailyData[date] = {
            date: date,
            temps: [],
            descriptions: [],
            weatherMains: [],
            humidity: [],
            windSpeed: [],
            pop: [] // probability of precipitation
          }
        }

        dailyData[date].temps.push(item.main.temp)
        dailyData[date].descriptions.push(item.weather[0].description)
        dailyData[date].weatherMains.push(item.weather[0].main)
        dailyData[date].humidity.push(item.main.humidity)
        dailyData[date].windSpeed.push(item.wind.speed)
        if (item.pop !== undefined) {
          dailyData[date].pop.push(item.pop)
        }
      })

      // Convertir a array y calcular valores agregados
      forecastWeatherRows.value = Object.values(dailyData).map(day => ({
        date: day.date,
        minTemp: kelvinToCelsius(Math.min(...day.temps)),
        maxTemp: kelvinToCelsius(Math.max(...day.temps)),
        // Usar la descripción más frecuente del día
        description: getMostFrequent(day.descriptions),
        weatherMain: getMostFrequent(day.weatherMains),
        humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
        windSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length),
        pop: day.pop.length > 0 ? Math.round(Math.max(...day.pop) * 100) : 0
      }))

      forecastTableLoading.value = false
    }).catch((error) => {
      const errorMessage = `Error to get forecast weather: ${error.response ? error.response.data.message : ''}`
      forecastTableLoading.value = false
      showNotify('negative', errorMessage)
    })
  }

  // Obtiene el elemento más frecuente de un array
  const getMostFrequent = (arr) => {
    const counts = {}
    let maxCount = 0
    let mostFrequent = arr[0]

    arr.forEach(item => {
      counts[item] = (counts[item] || 0) + 1
      if (counts[item] > maxCount) {
        maxCount = counts[item]
        mostFrequent = item
      }
    })

    return mostFrequent
  }

  // Carga datos de calidad del aire
  const loadAirPollution = (lat, lon) => {
    airPollutionLoading.value = true
    store.dispatch('callGetAirPollution', { lat: lat, lon: lon }).then((response) => {
      const data = response.data.list[0]
      airPollutionData.value = {
        aqi: data.main.aqi,
        aqiLabel: getAqiLabel(data.main.aqi),
        aqiColor: getAqiColor(data.main.aqi),
        components: {
          co: data.components.co,
          no: data.components.no,
          no2: data.components.no2,
          o3: data.components.o3,
          so2: data.components.so2,
          pm2_5: data.components.pm2_5,
          pm10: data.components.pm10,
          nh3: data.components.nh3
        }
      }
      airPollutionLoading.value = false
    }).catch((error) => {
      const errorMessage = `Error to get air pollution: ${error.response ? error.response.data.message : ''}`
      airPollutionLoading.value = false
      showNotify('negative', errorMessage)
    })
  }

  // Convierte el índice AQI a etiqueta legible
  const getAqiLabel = (aqi) => {
    const labels = {
      1: 'Good',
      2: 'Fair',
      3: 'Moderate',
      4: 'Poor',
      5: 'Very Poor'
    }
    return labels[aqi] || 'Unknown'
  }

  // Convierte el índice AQI a color
  const getAqiColor = (aqi) => {
    const colors = {
      1: 'positive',
      2: 'light-green',
      3: 'warning',
      4: 'orange',
      5: 'negative'
    }
    return colors[aqi] || 'grey'
  }

  const fetchWeatherData = (cityName) => {
    return new Promise((resolve, reject) => {
      store.dispatch('callGetWeather', cityName).then((response) => {
        weatherData.value = response.data
        center.value = { lat: response.data.coord.lat, lng: response.data.coord.lon }
        loadForecastWeatherRows(response.data.coord.lat, response.data.coord.lon)
        loadAirPollution(response.data.coord.lat, response.data.coord.lon)
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
    airPollutionData,
    forecastTableLoading,
    airPollutionLoading,
    fetchWeatherData,
    showNotify,
    temperatureUnit,
    convertTemperature,
    convertFromKelvin,
    setTemperatureUnit
  }
}
