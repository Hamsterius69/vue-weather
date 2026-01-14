<template>
  <div>
    <list-data :listData="basicWeatherData" key="basicData"/>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import ListData from './ListData'
import { genericFunctions } from '../composable/GenericFunctions'

const { useKelvinAndCelsius } = genericFunctions()

export default {
  name: 'WeatherBasicInfo',
  components: { ListData },
  props: {
    weatherData: {
      type: Object,
      required: true
    }
  },

  setup (props) {
    const basicWeatherData = ref([])

    const setBasicWeatherData = () => {
      basicWeatherData.value.length = 0

      if (!props.weatherData || !props.weatherData.name) {
        return
      }

      const location = {
        icon: 'las la-map-marker',
        title: 'location:',
        response: `${props.weatherData.name}. ${props.weatherData.sys.country}`
      }
      const description = {
        icon: 'las la-cloud-sun',
        title: 'Current weather description:',
        response: props.weatherData.weather[0].description
      }
      const temperature = {
        icon: 'las la-thermometer',
        title: 'Current temperature:',
        response: useKelvinAndCelsius(props.weatherData.main.temp)
      }
      const highTemperature = {
        icon: 'las la-temperature-high',
        title: 'High temperature:',
        response: useKelvinAndCelsius(props.weatherData.main.temp_max)
      }
      const lowTemperature = {
        icon: 'las la-temperature-low',
        title: 'Low temperature:',
        response: useKelvinAndCelsius(props.weatherData.main.temp_min)
      }

      basicWeatherData.value.push(location)
      basicWeatherData.value.push(description)
      basicWeatherData.value.push(temperature)
      basicWeatherData.value.push(highTemperature)
      basicWeatherData.value.push(lowTemperature)
    }

    watch(() => props.weatherData, () => {
      setBasicWeatherData()
    }, { immediate: true, deep: true })

    return {
      basicWeatherData
    }
  }
}
</script>
