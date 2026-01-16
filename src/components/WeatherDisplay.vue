<template>
  <div v-if="weatherData && weatherData.name" class="weather-display">
    <div class="weather-display__container">
      <!-- Weather Hero -->
      <weather-hero
        v-if="heroData"
        :city-name="heroData.cityName"
        :temperature="heroData.temperature"
        :feels-like="heroData.feelsLike"
        :condition="heroData.condition"
        :weather-main="heroData.weatherMain"
        :last-updated="heroData.lastUpdated"
      />

      <!-- Stats Grid with Air Quality integrated -->
      <div class="weather-display__section">
        <stats-grid>
          <weather-stat-card
            v-for="(stat, index) in statsData"
            :key="index"
            :icon="stat.icon"
            :label="stat.label"
            :value="stat.value"
            :sublabel="stat.sublabel"
          />
          <!-- Air Quality Card integrated in grid -->
          <air-quality-card
            :air-data="airPollutionData"
            :loading="airPollutionLoading"
          />
        </stats-grid>
      </div>

      <!-- Forecast Section -->
      <div class="weather-display__section weather-display__section--tight">
        <forecast-section
          :forecasts="transformedForecastData"
          :loading="forecastTableLoading"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch, inject } from 'vue'
import WeatherHero from './WeatherHero.vue'
import WeatherStatCard from './WeatherStatCard.vue'
import StatsGrid from './StatsGrid.vue'
import AirQualityCard from './AirQualityCard.vue'
import ForecastSection from './ForecastSection.vue'
import { useWeatherDataTransform } from '../composable/useWeatherDataTransform'
import { useTheme } from '../composable/useTheme'

export default {
  name: 'WeatherDisplay',
  components: {
    WeatherHero,
    WeatherStatCard,
    StatsGrid,
    AirQualityCard,
    ForecastSection
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
    airPollutionData: {
      type: Object,
      default: null
    },
    forecastTableLoading: {
      type: Boolean,
      default: false
    },
    airPollutionLoading: {
      type: Boolean,
      default: false
    }
  },

  setup (props) {
    const {
      transformWeatherHero,
      transformWeatherStats,
      transformForecastData
    } = useWeatherDataTransform()

    const { setWeatherCondition } = useTheme()

    // Inject temperature unit to make computed properties reactive to unit changes
    const temperatureUnit = inject('temperatureUnit')

    // Include temperatureUnit.value in computed to trigger re-computation when unit changes
    const heroData = computed(() => {
      // eslint-disable-next-line no-unused-expressions
      temperatureUnit?.value
      return transformWeatherHero(props.weatherData)
    })

    const statsData = computed(() => {
      // eslint-disable-next-line no-unused-expressions
      temperatureUnit?.value
      return transformWeatherStats(props.weatherData)
    })

    const transformedForecastData = computed(() => {
      // eslint-disable-next-line no-unused-expressions
      temperatureUnit?.value
      return transformForecastData(props.forecastWeatherRows)
    })

    // Update weather condition when weather data changes
    watch(() => props.weatherData, (newWeatherData) => {
      if (newWeatherData && newWeatherData.weather && newWeatherData.weather[0]) {
        setWeatherCondition(
          newWeatherData.weather[0].main,
          newWeatherData.weather[0].description
        )
      }
    }, { immediate: true })

    return {
      heroData,
      statsData,
      transformedForecastData
    }
  }
}
</script>

<style lang="scss" scoped>
.weather-display {
  background-color: var(--bg);
  min-height: 100vh;
  padding-top: 1.25rem;

  &__container {
    max-width: 75rem;
    margin: 0 auto;
    padding: 0 1.5rem 2rem;

    @media (max-width: 599px) {
      padding: 0 1rem 1.5rem;
    }
  }

  &__section {
    margin-bottom: 1.5rem;

    @media (max-width: 599px) {
      margin-bottom: 1rem;
    }

    &--tight {
      margin-bottom: 1rem;

      @media (max-width: 599px) {
        margin-bottom: 0.75rem;
      }
    }
  }
}
</style>
