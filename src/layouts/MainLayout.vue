<template>
  <q-layout view="lHh Lpr lFf">
    <top-bar
      @search="handleSearch"
      @city-loaded="handleCityLoaded"
      @unit-changed="handleUnitChanged"
    />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import TopBar from '../components/TopBar.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    TopBar
  },

  setup () {
    const handleSearch = (cityName, callback) => {
      // This will be handled by WeatherForm through events
      console.log('Search from TopBar:', cityName)
      if (callback) callback()
    }

    const handleCityLoaded = (cityName) => {
      console.log('City loaded from TopBar:', cityName)
    }

    const handleUnitChanged = (unit) => {
      console.log('Unit changed from TopBar:', unit)
      // TODO: Implement temperature unit conversion
    }

    return {
      handleSearch,
      handleCityLoaded,
      handleUnitChanged
    }
  }
})
</script>
