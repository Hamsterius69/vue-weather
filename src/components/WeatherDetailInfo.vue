<template>
  <div>
    <div class="row q-my-md">
      <q-toggle v-model="showDetails" label="Show extra information"/>
    </div>
    <list-data v-if="showDetails" :listData="detailWeatherData" key="detailData"/>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import ListData from './ListData'
import { genericFunctions } from '../composable/GenericFunctions'

const { numberToHour } = genericFunctions()

export default {
  name: 'WeatherDetailInfo',
  components: { ListData },
  props: {
    weatherData: {
      type: Object,
      required: true
    }
  },

  setup (props) {
    const showDetails = ref(false)
    const detailWeatherData = ref([])

    const setDetailWeatherData = () => {
      detailWeatherData.value.length = 0

      if (!props.weatherData || !props.weatherData.name) {
        return
      }

      const wind = {
        icon: 'las la-wind',
        title: 'Wind Speed:',
        response: `${props.weatherData.wind.speed}km/h`
      }
      const humidity = {
        icon: 'las la-tint',
        title: 'Humidity:',
        response: `${props.weatherData.main.humidity}%`
      }
      const pressure = {
        icon: 'las la-tachometer-alt',
        title: 'Pressure:',
        response: `${props.weatherData.main.pressure}mb`
      }
      const sunrise = {
        icon: 'las la-sun',
        title: 'Sunrise/Sunset Time:',
        response: `${numberToHour(props.weatherData.sys.sunrise)} / ${numberToHour(props.weatherData.sys.sunset)}`
      }

      detailWeatherData.value.push(wind)
      detailWeatherData.value.push(humidity)
      detailWeatherData.value.push(pressure)
      detailWeatherData.value.push(sunrise)
    }

    watch(() => props.weatherData, () => {
      setDetailWeatherData()
    }, { immediate: true, deep: true })

    return {
      showDetails,
      detailWeatherData
    }
  }
}
</script>
