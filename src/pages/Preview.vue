<template>
  <q-page class="preview-page">
    <!-- TopBar -->
    <top-bar
      @search="handleSearch"
      @city-loaded="handleCityLoaded"
      @unit-changed="handleUnitChanged"
    />

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

      <!-- Forecast Section -->
      <div class="preview-section">
        <forecast-section :forecasts="sampleForecasts" :loading="false" />
      </div>

      <!-- Historical Section -->
      <div class="preview-section">
        <historical-section :historical-data="sampleHistorical" :loading="false" />
      </div>

      <!-- Map Section -->
      <div class="preview-section">
        <map-section :position="samplePosition" :default-expanded="false" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import TopBar from '../components/TopBar.vue'
import WeatherHero from '../components/WeatherHero.vue'
import WeatherStatCard from '../components/WeatherStatCard.vue'
import StatsGrid from '../components/StatsGrid.vue'
import ForecastSection from '../components/ForecastSection.vue'
import HistoricalSection from '../components/HistoricalSection.vue'
import MapSection from '../components/MapSection.vue'

export default {
  name: 'PreviewPage',
  components: {
    TopBar,
    WeatherHero,
    WeatherStatCard,
    StatsGrid,
    ForecastSection,
    HistoricalSection,
    MapSection
  },

  setup () {
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
      },
      {
        date: '2024-01-19',
        maxTemp: 23,
        minTemp: 15,
        description: 'Few clouds',
        weatherMain: 'Clouds',
        windSpeed: 9,
        humidity: 62
      },
      {
        date: '2024-01-20',
        maxTemp: 20,
        minTemp: 12,
        description: 'Thunderstorm',
        weatherMain: 'Thunderstorm',
        windSpeed: 15,
        humidity: 80
      }
    ])

    const sampleHistorical = ref([
      {
        date: '2024-01-13',
        maxTemp: 18,
        minTemp: 10,
        avgTemp: 14,
        description: 'Broken clouds',
        weatherMain: 'Clouds',
        windSpeed: 8,
        humidity: 65,
        pressure: 1013
      },
      {
        date: '2024-01-12',
        maxTemp: 17,
        minTemp: 9,
        avgTemp: 13,
        description: 'Light rain',
        weatherMain: 'Rain',
        windSpeed: 11,
        humidity: 72,
        pressure: 1010
      },
      {
        date: '2024-01-11',
        maxTemp: 19,
        minTemp: 11,
        avgTemp: 15,
        description: 'Clear sky',
        weatherMain: 'Clear',
        windSpeed: 7,
        humidity: 58,
        pressure: 1015
      },
      {
        date: '2024-01-10',
        maxTemp: 16,
        minTemp: 8,
        avgTemp: 12,
        description: 'Overcast clouds',
        weatherMain: 'Clouds',
        windSpeed: 9,
        humidity: 68,
        pressure: 1012
      },
      {
        date: '2024-01-09',
        maxTemp: 15,
        minTemp: 7,
        avgTemp: 11,
        description: 'Few clouds',
        weatherMain: 'Clouds',
        windSpeed: 6,
        humidity: 62,
        pressure: 1016
      }
    ])

    const samplePosition = ref({
      lat: 50.8503,
      lng: 4.3517
    })

    const handleSearch = (cityName, callback) => {
      console.log('Search:', cityName)
      if (callback) callback()
    }

    const handleCityLoaded = (cityName) => {
      console.log('City loaded:', cityName)
    }

    const handleUnitChanged = (unit) => {
      console.log('Unit changed:', unit)
    }

    return {
      handleSearch,
      handleCityLoaded,
      handleUnitChanged,
      sampleForecasts,
      sampleHistorical,
      samplePosition
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
