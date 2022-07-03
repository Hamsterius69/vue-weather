<template>
  <div class="q-pt-lg">
    <div class="row justify-center">
      <q-input :class="$q.screen.width >= xsBreakPoint ? 'col-4' && 'q-mr-md' : ''"
               dense v-on:keyup.enter="searchWather" style="max-height=10"
               :loading='cityLoading' filled v-model="cityData" label="City, Country code">
        <template v-slot:append>
          <q-icon name="las la-search" />
        </template>
      </q-input>
      <q-btn :loading="searchInProgress" color="primary" label="Check weather" size="md"
             @click="searchWather" :disabled="!cityData">
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
          Loading...
        </template>
      </q-btn>
    </div>
    <div v-if="weatherData && weatherData.name" class="q-pa-xl">
      <q-responsive :ratio="4/3">
        <q-card flat>
          <div>
            <q-parallax src="https://cdn.quasar.dev/img/mountains.jpg" :height="$q.screen.width >= smBreakPoint ? 200 : 100"/>
          </div>
          <q-card-section>
            <div class="row q-my-md">
              <div :class="$q.screen.width >= smBreakPoint ? 'col-6' : 'col-12'">
                <list-data :listData="basicWeatherData" key="basicData"/>
                <div class="row q-my-md">
                  <q-toggle v-model="showDetails" label="Show extra information"/>
                </div>
                <list-data v-if="showDetails" :listData="detailWeatherData" key="detailData"/>
                <div v-if="$q.screen.width < smBreakPoint">
                  <location-map :position="center"/>
                </div>
              </div>
              <div v-if="$q.screen.width >= smBreakPoint" class="col-6">
                <location-map :position="center"/>
              </div>
            </div>
            <div>
              <q-table
                title="Forecast weather information"
                :rows="forecastWeatherRows"
                :columns="forecastWeatherColumns"
                row-key="name"
                :loading="forecastTableLoading"
              />
            </div>
            <div>
              <q-table
                title="Historical weather information"
                :rows="historicalWeatherRows"
                :columns="historicalWeatherColumns"
                row-key="name"
                :loading="historicalTableLoading"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-responsive>
    </div>
  </div>
</template>

<script>
import { ref, watch, onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import ListData from './ListData'
import LocationMap from './LocationMap'
import { genericFunctions } from '../composable/GenericFunctions'

const { useKelvinAndCelsius, getEpochNumber, epochToDateString, numberToHour } = genericFunctions()

export default ({
  name: 'WeatherForm',
  components: { ListData, LocationMap },

  setup () {
    const store = useStore()
    const $q = useQuasar()
    const weatherData = ref({})
    const center = ref({})
    const cityData = ref('')
    const autocompleteAvailable = ref(false)
    const cityMap = ref(null)
    const cityLoading = ref(false)
    const showDetails = ref(false)
    const searchInProgress = ref(false)
    const historicalTableLoading = ref(false)
    const forecastTableLoading = ref(false)
    const basicWeatherData = ref([])
    const detailWeatherData = ref([])
    const historicalWeatherColumns = ref([])
    const forecastWeatherColumns = ref([])
    const historicalWeatherRows = ref([])
    const forecastWeatherRows = ref([])
    const xsBreakPoint = computed(() => store.state.weather.xsBreakPoint)
    const smBreakPoint = computed(() => store.state.weather.smBreakPoint)

    onBeforeMount(() => {
      loadCity()
      loadHeaderTables()
    })

    watch(cityData, (curremtValue) => {
      if (curremtValue.length % 3 === 0 && curremtValue.length && autocompleteAvailable.value) {
        showAutocomplete()
      }
      autocompleteAvailable.value = true
    })

    const loadHeaderTables = () => {
      historicalWeatherColumns.value.push({ name: 'date', align: 'left', label: 'Date', field: 'date', sortable: true })
      historicalWeatherColumns.value.push({ name: 'temperature', align: 'left', label: 'Temperature', field: 'temperature' })
      historicalWeatherColumns.value.push({ name: 'main', align: 'left', label: 'Main', field: 'main' })
      historicalWeatherColumns.value.push({ name: 'description', align: 'left', label: 'Description', field: 'description' })
      forecastWeatherColumns.value.push({ name: 'date', align: 'left', label: 'Date', field: 'date', sortable: true })
      forecastWeatherColumns.value.push({ name: 'temperatureDay', align: 'left', label: 'Temperature day', field: 'temperatureDay' })
      forecastWeatherColumns.value.push({ name: 'temperatureMin', align: 'left', label: 'Temperature min', field: 'temperatureMin' })
      forecastWeatherColumns.value.push({ name: 'temperatureMax', align: 'left', label: 'Temperature max', field: 'temperatureMax' })
      forecastWeatherColumns.value.push({ name: 'description', align: 'left', label: 'Description', field: 'description' })
    }

    const loadCity = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          cityLoading.value = true
          store.dispatch('callGetCity', { lat: position.coords.latitude, lon: position.coords.longitude }).then((response) => {
            cityData.value = `${response.data.address.city}, ${response.data.address.country_code}`
            cityLoading.value = false
          }).catch((error) => {
            const errorMessage = `Error to get city from geolocation: ${error.response ? error.response.data.message : ''}`
            cityLoading.value = false
            showNotify('negative', errorMessage)
          })
        })
      } else {
        showNotify('info', 'please to have a better user experience allow the browser to use your location')
      }
    }

    const showAutocomplete = () => {
      store.dispatch('callGetAutocomplete', cityData.value).then((response) => {
        const size = response.data.length / 3
        for (let i = 0; i < size; i += 1) {
          const message = `You mean... ${response.data[i].address.name}, ${response.data[i].address.country_code}?`
          $q.notify({
            color: 'purple',
            message: message,
            position: 'top-right',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
            timeout: 6000,
            actions: [{
              label: 'You right',
              color: 'white',
              handler: () => {
                $q.notify({
                  color: 'green',
                  icon: 'las la-smile-wink',
                  iconSize: '50px',
                  position: 'center',
                  timeout: 3000
                })
                autocompleteAvailable.value = false
                cityData.value = `${response.data[i].address.name}, ${response.data[i].address.country_code}`
                searchWather()
              }
            }]
          })
        }
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

    const setBasicWeatherData = () => {
      basicWeatherData.value.length = 0
      const location = {
        icon: 'las la-map-marker', title: 'location:', response: `${weatherData.value.name}. ${weatherData.value.sys.country}`
      }
      const description = {
        icon: 'las la-cloud-sun', title: 'Current weather description:', response: weatherData.value.weather[0].description
      }
      const temperature = {
        icon: 'las la-thermometer', title: 'Current temperature:', response: useKelvinAndCelsius(weatherData.value.main.temp)
      }
      const highTemperature = {
        icon: 'las la-temperature-high', title: 'High temperature:', response: useKelvinAndCelsius(weatherData.value.main.temp_max)
      }
      const lowTemperature = {
        icon: 'las la-temperature-low', title: 'Low temperature:', response: useKelvinAndCelsius(weatherData.value.main.temp_min)
      }
      basicWeatherData.value.push(location)
      basicWeatherData.value.push(description)
      basicWeatherData.value.push(temperature)
      basicWeatherData.value.push(highTemperature)
      basicWeatherData.value.push(lowTemperature)
    }

    const setDetailWeatherData = () => {
      detailWeatherData.value.length = 0
      const wind = {
        icon: 'las la-wind', title: 'Wind Speed:', response: `${weatherData.value.wind.speed}km/h`
      }
      const humidity = {
        icon: 'las la-tint', title: 'Humidity:', response: `${weatherData.value.main.humidity}%`
      }
      const pressure = {
        icon: 'las la-tachometer-alt', title: 'Pressure:', response: `${weatherData.value.main.pressure}mb`
      }
      const sunrise = {
        icon: 'las la-sun', title: 'Sunrise/Sunset Time:', response: `${numberToHour(weatherData.value.sys.sunrise)} / ${numberToHour(weatherData.value.sys.sunset)}`
      }

      detailWeatherData.value.push(wind)
      detailWeatherData.value.push(humidity)
      detailWeatherData.value.push(pressure)
      detailWeatherData.value.push(sunrise)
    }

    const showNotify = (type, message) => {
      $q.notify({
        type: type,
        message: message,
        position: 'top-right',
        timeout: 5000,
        closeBtn: 'Close me'
      })
    }

    const searchWather = () => {
      searchInProgress.value = true
      store.dispatch('callGetWeather', cityData.value).then((response) => {
        weatherData.value = response.data
        searchInProgress.value = false
        loadForecastWeatherRows(response.data.coord.lat, response.data.coord.lon)
        loadHistoricalWeatherRows(response.data.coord.lat, response.data.coord.lon)
        setBasicWeatherData()
        setDetailWeatherData()
        center.value = { lat: response.data.coord.lat, lng: response.data.coord.lon }
      }).catch((error) => {
        const errorMessage = `Error to get weather: ${error.response ? error.response.data.message : ''}`
        searchInProgress.value = false
        showNotify('negative', errorMessage)
      })
    }

    return {
      cityData,
      showDetails,
      searchInProgress,
      weatherData,
      historicalWeatherColumns,
      historicalWeatherRows,
      forecastWeatherColumns,
      forecastWeatherRows,
      forecastTableLoading,
      historicalTableLoading,
      cityLoading,
      cityMap,
      center,
      basicWeatherData,
      detailWeatherData,
      searchWather,
      showAutocomplete,
      smBreakPoint,
      xsBreakPoint
    }
  }
})
</script>
