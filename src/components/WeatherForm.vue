<template>
  <div>
    <weather-search
      @search="handleSearch"
      @city-loaded="handleCityLoaded"
    />
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
import WeatherSearch from './WeatherSearch'
import WeatherDisplay from './WeatherDisplay'
import { useWeatherData } from '../composable/useWeatherData'

export default {
  name: 'WeatherForm',
  components: {
    WeatherSearch,
    WeatherDisplay
  },

  setup () {
    const {
      weatherData,
      center,
      forecastWeatherRows,
      historicalWeatherRows,
      forecastTableLoading,
      historicalTableLoading,
      fetchWeatherData
    } = useWeatherData()

    const handleSearch = (cityName, callback) => {
      fetchWeatherData(cityName)
        .then(() => {
          if (callback) callback()
        })
        .catch(() => {
          if (callback) callback()
        })
    }

    const handleCityLoaded = (cityName) => {
      // Optional: auto-search when city is loaded from geolocation
      // fetchWeatherData(cityName)
    }

    return {
      weatherData,
      center,
      forecastWeatherRows,
      historicalWeatherRows,
      forecastTableLoading,
      historicalTableLoading,
      handleSearch,
      handleCityLoaded
    }
  }
}
</script>
