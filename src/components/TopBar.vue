<template>
  <q-header
    elevated
    class="top-bar"
    :class="{ 'top-bar--dark': $q.dark.isActive }"
  >
    <q-toolbar class="top-bar__toolbar">
      <!-- Cluster 1: App Identity -->
      <div class="top-bar__identity">
        <q-icon name="las la-cloud-sun" class="top-bar__logo-icon" />
        <span class="top-bar__logo-text">WeatherApp</span>
      </div>

      <!-- Cluster 2: Search (desktop only) -->
      <div class="top-bar__search-cluster" v-if="$q.screen.gt.xs">
        <weather-search @search="handleSearch" @city-loaded="handleCityLoaded" />
      </div>

      <!-- Spacer -->
      <q-space />

      <!-- Cluster 3: Settings -->
      <div class="top-bar__settings">
        <!-- Theme Toggle -->
        <q-btn
          flat
          round
          :icon="isDark ? 'las la-sun' : 'las la-moon'"
          class="top-bar__action-btn"
          @click="toggleTheme"
          aria-label="Toggle theme"
        >
          <q-tooltip :delay="250" class="custom-tooltip">
            {{ isDark ? 'Switch to light mode' : 'Switch to dark mode' }}
          </q-tooltip>
        </q-btn>

        <!-- Temperature Unit Toggle -->
        <q-btn
          flat
          no-caps
          class="top-bar__unit-btn"
          @click="toggleUnit"
          aria-label="Toggle temperature unit"
        >
          <span class="top-bar__unit-text">{{ temperatureUnit === 'celsius' ? '°C' : '°F' }}</span>
          <q-tooltip :delay="250" class="custom-tooltip">
            Switch to {{ temperatureUnit === 'celsius' ? 'Fahrenheit' : 'Celsius' }}
          </q-tooltip>
        </q-btn>
      </div>
    </q-toolbar>

    <!-- Mobile Search (shown below toolbar on small screens) -->
    <div class="top-bar__mobile-search" v-if="$q.screen.xs">
      <weather-search @search="handleSearch" @city-loaded="handleCityLoaded" />
    </div>
  </q-header>
</template>

<script>
import { inject, ref } from 'vue'
import { useTheme } from '../composable/useTheme'
import WeatherSearch from './WeatherSearch.vue'

export default {
  name: 'TopBar',
  components: {
    WeatherSearch
  },
  emits: ['city-loaded', 'unit-changed'],

  setup (props, { emit }) {
    const { isDark, toggleTheme } = useTheme()

    // Inject shared temperature unit from MainLayout, fallback to local ref
    const temperatureUnit = inject('temperatureUnit', ref('celsius'))

    // Inject fetchWeatherData from MainLayout
    const fetchWeatherData = inject('fetchWeatherData', null)

    const handleSearch = (cityName, callback) => {
      if (fetchWeatherData) {
        fetchWeatherData(cityName)
          .then(() => {
            if (callback) callback()
          })
          .catch(() => {
            if (callback) callback()
          })
      } else {
        console.error('fetchWeatherData not available')
        if (callback) callback()
      }
    }

    const handleCityLoaded = (cityName) => {
      emit('city-loaded', cityName)
    }

    const toggleUnit = () => {
      const newUnit = temperatureUnit.value === 'celsius' ? 'fahrenheit' : 'celsius'
      emit('unit-changed', newUnit)
    }

    return {
      isDark,
      toggleTheme,
      temperatureUnit,
      toggleUnit,
      handleSearch,
      handleCityLoaded
    }
  }
}
</script>

<style lang="scss" scoped>
.top-bar {
  background-color: var(--surface);
  border-bottom: 0.0625rem solid var(--border);
  box-shadow: none;

  &__toolbar {
    padding: 1rem 2rem;
    min-height: 4.25rem;
    gap: 1.5rem;

    @media (max-width: 599px) {
      padding: 0.75rem 1rem;
      min-height: 3.75rem;
      gap: 1rem;
    }
  }

  // Cluster 1: App Identity
  &__identity {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    flex-shrink: 0;
  }

  &__logo-icon {
    color: var(--accent);
    font-size: 1.75rem !important;
  }

  &__logo-text {
    font-size: 1.125rem;
    font-weight: var(--font-weight-bold);
    color: var(--text);
    white-space: nowrap;

    @media (max-width: 599px) {
      font-size: 1rem;
    }
  }

  // Cluster 2: Search
  &__search-cluster {
    flex: 1;
    max-width: 36rem;
    margin-left: 2rem;
    display: flex;
    align-items: center;
  }

  // Cluster 3: Settings
  &__settings {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  &__mobile-search {
    padding: 0.5rem 1rem 1rem;
    background-color: var(--surface);
    border-top: 0.0625rem solid var(--border);
  }

  &__action-btn {
    color: var(--text-muted);
    width: 2.5rem;
    height: 2.5rem;
    transition: all var(--transition-fast);

    :deep(.q-icon) {
      font-size: 1.25rem;
    }

    &:hover {
      color: var(--accent);
      background-color: rgba(245, 158, 11, 0.1);
    }
  }

  &__unit-btn {
    color: var(--text-muted);
    min-width: 2.75rem;
    height: 2.5rem;
    padding: 0 0.75rem;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    border: 0.0625rem solid var(--border);

    &:hover {
      color: var(--accent);
      border-color: var(--accent);
      background-color: rgba(245, 158, 11, 0.1);
    }
  }

  &__unit-text {
    font-size: 0.9375rem;
    font-weight: var(--font-weight-semibold);
  }
}
</style>
