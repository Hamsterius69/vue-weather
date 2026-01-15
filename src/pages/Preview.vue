<template>
  <q-page class="preview-page">
    <div class="preview-container">
      <!-- Weather Hero -->
      <weather-hero
        city-name="Brussels, Belgium"
        :temperature="18"
        :feels-like="16"
        condition="Broken clouds"
        weather-main="Clouds"
        last-updated="5 min ago"
      />

      <!-- Stats Grid -->
      <div class="preview-stats">
        <stats-grid>
          <weather-stat-card
            icon="las la-thermometer-half"
            :value="18 + '°'"
            label="Current"
          />
          <weather-stat-card
            icon="las la-temperature-high"
            :value="22 + '°'"
            label="High"
          />
          <weather-stat-card
            icon="las la-temperature-low"
            :value="14 + '°'"
            label="Low"
          />
          <weather-stat-card
            icon="las la-tint"
            value="65%"
            label="Humidity"
          />
          <weather-stat-card
            icon="las la-wind"
            value="12 m/s"
            label="Wind"
          />
          <weather-stat-card
            icon="las la-compress-arrows-alt"
            value="1013 hPa"
            label="Pressure"
          />
        </stats-grid>
      </div>

      <!-- Air Quality Section -->
      <div class="preview-section">
        <air-quality-section :air-data="sampleAirQuality" :loading="false" />
      </div>

      <!-- Forecast Section -->
      <div class="preview-section">
        <forecast-section :forecasts="sampleForecasts" :loading="false" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import WeatherHero from '../components/WeatherHero.vue'
import WeatherStatCard from '../components/WeatherStatCard.vue'
import StatsGrid from '../components/StatsGrid.vue'
import AirQualitySection from '../components/AirQualitySection.vue'
import ForecastSection from '../components/ForecastSection.vue'

export default {
  name: 'PreviewPage',
  components: {
    WeatherHero,
    WeatherStatCard,
    StatsGrid,
    AirQualitySection,
    ForecastSection
  },

  setup () {
    const sampleAirQuality = ref({
      aqi: 1,
      aqiLabel: 'Good',
      aqiColor: 'positive'
    })

    const sampleForecasts = ref([
      {
        date: '2024-01-14',
        maxTemp: 20,
        minTemp: 12,
        description: 'Partly cloudy',
        weatherMain: 'Clouds',
        windSpeed: 8,
        humidity: 60
      },
      {
        date: '2024-01-15',
        maxTemp: 22,
        minTemp: 14,
        description: 'Clear sky',
        weatherMain: 'Clear',
        windSpeed: 6,
        humidity: 55
      },
      {
        date: '2024-01-16',
        maxTemp: 19,
        minTemp: 11,
        description: 'Light rain',
        weatherMain: 'Rain',
        windSpeed: 12,
        humidity: 75
      },
      {
        date: '2024-01-17',
        maxTemp: 18,
        minTemp: 10,
        description: 'Overcast clouds',
        weatherMain: 'Clouds',
        windSpeed: 10,
        humidity: 70
      },
      {
        date: '2024-01-18',
        maxTemp: 21,
        minTemp: 13,
        description: 'Clear sky',
        weatherMain: 'Clear',
        windSpeed: 7,
        humidity: 58
      }
    ])

    return {
      sampleAirQuality,
      sampleForecasts
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-page {
  background-color: var(--bg);
  min-height: 100vh;
}

.preview-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-lg);

  @media (max-width: 599px) {
    padding: var(--spacing-lg) var(--spacing-md);
  }
}

.preview-stats {
  margin-bottom: var(--spacing-xl);
}

.preview-section {
  margin-bottom: var(--spacing-xl);
}
</style>
