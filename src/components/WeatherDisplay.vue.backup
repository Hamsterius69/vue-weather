<template>
  <div v-if="weatherData && weatherData.name" class="q-pa-xl">
    <q-responsive :ratio="4/3">
      <q-card flat>
        <div>
          <q-parallax
            src="https://cdn.quasar.dev/img/mountains.jpg"
            :height="$q.screen.width >= smBreakPoint ? 200 : 100"
          />
        </div>
        <q-card-section>
          <div class="row q-my-md">
            <div :class="$q.screen.width >= smBreakPoint ? 'col-6' : 'col-12'">
              <weather-basic-info :weatherData="weatherData" />
              <weather-detail-info :weatherData="weatherData" />
              <div v-if="$q.screen.width < smBreakPoint">
                <location-map :position="center"/>
              </div>
            </div>
            <div v-if="$q.screen.width >= smBreakPoint" class="col-6">
              <location-map :position="center"/>
            </div>
          </div>
          <div>
            <weather-forecast-table
              :rows="forecastWeatherRows"
              :loading="forecastTableLoading"
            />
          </div>
          <div>
            <weather-historical-table
              :rows="historicalWeatherRows"
              :loading="historicalTableLoading"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-responsive>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import WeatherBasicInfo from './WeatherBasicInfo'
import WeatherDetailInfo from './WeatherDetailInfo'
import WeatherForecastTable from './WeatherForecastTable'
import WeatherHistoricalTable from './WeatherHistoricalTable'
import LocationMap from './LocationMap'

export default {
  name: 'WeatherDisplay',
  components: {
    WeatherBasicInfo,
    WeatherDetailInfo,
    WeatherForecastTable,
    WeatherHistoricalTable,
    LocationMap
  },
  props: {
    weatherData: {
      type: Object,
      required: true
    },
    center: {
      type: Object,
      required: true
    },
    forecastWeatherRows: {
      type: Array,
      required: true
    },
    historicalWeatherRows: {
      type: Array,
      required: true
    },
    forecastTableLoading: {
      type: Boolean,
      default: false
    },
    historicalTableLoading: {
      type: Boolean,
      default: false
    }
  },

  setup () {
    const store = useStore()
    const smBreakPoint = computed(() => store.state.weather.smBreakPoint)

    return {
      smBreakPoint
    }
  }
}
</script>
