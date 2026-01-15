<template>
  <div>
    <weather-display
      v-if="weatherData && weatherData.name"
      :weatherData="weatherData"
      :center="center"
      :forecastWeatherRows="forecastWeatherRows"
      :airPollutionData="airPollutionData"
      :forecastTableLoading="forecastTableLoading"
      :airPollutionLoading="airPollutionLoading"
    />
  </div>
</template>

<script>
import { inject } from 'vue'
import WeatherDisplay from './WeatherDisplay'

export default {
  name: 'WeatherForm',
  components: {
    WeatherDisplay
  },

  setup () {
    // Inject weather data from MainLayout
    const weatherData = inject('weatherData')
    const center = inject('center')
    const forecastWeatherRows = inject('forecastWeatherRows')
    const airPollutionData = inject('airPollutionData')
    const forecastTableLoading = inject('forecastTableLoading')
    const airPollutionLoading = inject('airPollutionLoading')

    return {
      weatherData,
      center,
      forecastWeatherRows,
      airPollutionData,
      forecastTableLoading,
      airPollutionLoading
    }
  }
}
</script>
