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
      airPollutionData,
      forecastTableLoading,
      airPollutionLoading,
      fetchWeatherData,
      temperatureUnit,
      convertTemperature,
      convertFromKelvin,
      setTemperatureUnit
    } = useWeatherData()

    // Provide weather data and fetchWeatherData to all descendants
    provide('weatherData', weatherData)
    provide('center', center)
    provide('forecastWeatherRows', forecastWeatherRows)
    provide('airPollutionData', airPollutionData)
    provide('forecastTableLoading', forecastTableLoading)
    provide('airPollutionLoading', airPollutionLoading)
    provide('fetchWeatherData', fetchWeatherData)
    provide('temperatureUnit', temperatureUnit)
    provide('convertTemperature', convertTemperature)
    provide('convertFromKelvin', convertFromKelvin)

    const handleCityLoaded = () => {
      // City loaded event handled
    }

    const handleUnitChanged = (unit) => {
      setTemperatureUnit(unit)
    }

    return {
      handleCityLoaded,
      handleUnitChanged
    }
  }
})
</script>
