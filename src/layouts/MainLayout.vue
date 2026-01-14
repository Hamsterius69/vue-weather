<template>
  <q-layout view="lHh Lpr lFf">
    <top-bar
      @city-loaded="handleCityLoaded"
      @unit-changed="handleUnitChanged"
    />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, provide } from 'vue'
import TopBar from '../components/TopBar.vue'
import { useWeatherData } from '../composable/useWeatherData'

export default defineComponent({
  name: 'MainLayout',

  components: {
    TopBar
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

    // Provide weather data and fetchWeatherData to all descendants
    provide('weatherData', weatherData)
    provide('center', center)
    provide('forecastWeatherRows', forecastWeatherRows)
    provide('historicalWeatherRows', historicalWeatherRows)
    provide('forecastTableLoading', forecastTableLoading)
    provide('historicalTableLoading', historicalTableLoading)
    provide('fetchWeatherData', fetchWeatherData)

    const handleCityLoaded = (cityName) => {
      console.log('City loaded from TopBar:', cityName)
    }

    const handleUnitChanged = (unit) => {
      console.log('Unit changed from TopBar:', unit)
      // TODO: Implement temperature unit conversion
    }

    return {
      handleCityLoaded,
      handleUnitChanged
    }
  }
})
</script>
