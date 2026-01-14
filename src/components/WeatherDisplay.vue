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

      <!-- Stats Grid -->
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
        </stats-grid>
      </div>

      <!-- Forecast Section -->
      <div class="weather-display__section">
        <forecast-section
          :forecasts="transformedForecastData"
          :loading="forecastTableLoading"
        />
      </div>

      <!-- Historical Section -->
      <div class="weather-display__section">
        <historical-section
          :historical-data="transformedHistoricalData"
          :loading="historicalTableLoading"
        />
      </div>

      <!-- Map Section -->
      <div class="weather-display__section">
        <map-section :position="center" :default-expanded="false" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import WeatherHero from './WeatherHero.vue'
import WeatherStatCard from './WeatherStatCard.vue'
import StatsGrid from './StatsGrid.vue'
import ForecastSection from './ForecastSection.vue'
import HistoricalSection from './HistoricalSection.vue'
import MapSection from './MapSection.vue'
import { useWeatherDataTransform } from '../composable/useWeatherDataTransform'
import { useTheme } from '../composable/useTheme'

export default {
  name: 'WeatherDisplay',
  components: {
    WeatherHero,
    WeatherStatCard,
    StatsGrid,
    ForecastSection,
    HistoricalSection,
    MapSection
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

  setup (props) {
    const {
      transformWeatherHero,
      transformWeatherStats,
      transformForecastData,
      transformHistoricalData
    } = useWeatherDataTransform()

    const { setWeatherCondition } = useTheme()

    const heroData = computed(() => transformWeatherHero(props.weatherData))
    const statsData = computed(() => transformWeatherStats(props.weatherData))
    const transformedForecastData = computed(() => transformForecastData(props.forecastWeatherRows))
    const transformedHistoricalData = computed(() => transformHistoricalData(props.historicalWeatherRows))

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
      transformedForecastData,
      transformedHistoricalData
    }
  }
}
</script>

<style lang="scss" scoped>
.weather-display {
  background-color: var(--bg);
  min-height: 100vh;
  padding-top: var(--spacing-lg);

  &__container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 var(--spacing-lg) var(--spacing-xl);

    @media (max-width: 599px) {
      padding: 0 var(--spacing-md) var(--spacing-lg);
    }
  }

  &__section {
    margin-bottom: var(--spacing-xl);

    @media (max-width: 599px) {
      margin-bottom: var(--spacing-lg);
    }
  }
}
</style>
