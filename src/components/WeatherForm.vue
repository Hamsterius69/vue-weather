<template>
  <div>
    <weather-display
      v-if="weatherData && weatherData.name"
      :weatherData="weatherData"
      :center="center"
      :forecastWeatherRows="forecastWeatherRows"
      :historicalWeatherRows="historicalWeatherRows"
      :forecastTableLoading="forecastTableLoading"
      :historicalTableLoading="historicalTableLoading"
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
    const historicalWeatherRows = inject('historicalWeatherRows')
    const forecastTableLoading = inject('forecastTableLoading')
    const historicalTableLoading = inject('historicalTableLoading')

    return {
      weatherData,
      center,
      forecastWeatherRows,
      historicalWeatherRows,
      forecastTableLoading,
      historicalTableLoading
    }
  }
}
</script>
