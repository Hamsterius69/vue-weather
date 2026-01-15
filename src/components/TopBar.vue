<template>
  <q-header
    elevated
    class="top-bar"
    :class="{ 'top-bar--dark': $q.dark.isActive }"
  >
    <q-toolbar class="top-bar__toolbar">
      <!-- App Name -->
      <q-toolbar-title class="top-bar__title">
        <div class="top-bar__logo">
          <q-icon name="las la-cloud-sun" size="28px" class="top-bar__logo-icon" />
          <span class="top-bar__logo-text">WeatherApp</span>
        </div>
      </q-toolbar-title>

      <!-- City Search (center/right) -->
      <div class="top-bar__search" v-if="$q.screen.gt.xs">
        <weather-search @search="handleSearch" @city-loaded="handleCityLoaded" />
      </div>

      <!-- Theme Toggle -->
      <q-btn
        flat
        round
        dense
        :icon="isDark ? 'las la-sun' : 'las la-moon'"
        class="top-bar__theme-toggle"
        @click="toggleTheme"
        aria-label="Toggle theme"
      >
        <q-tooltip>{{ isDark ? 'Light mode' : 'Dark mode' }}</q-tooltip>
      </q-btn>

      <!-- Optional: Temperature Unit Toggle -->
      <q-btn
        flat
        dense
        no-caps
        class="top-bar__unit-toggle"
        @click="toggleUnit"
        aria-label="Toggle temperature unit"
      >
        <span class="top-bar__unit-text">{{ temperatureUnit === 'celsius' ? '°C' : '°F' }}</span>
        <q-tooltip>Switch to {{ temperatureUnit === 'celsius' ? 'Fahrenheit' : 'Celsius' }}</q-tooltip>
      </q-btn>
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
  border-bottom: 1px solid var(--border);
  box-shadow: none;

  &__toolbar {
    padding: var(--spacing-sm) var(--spacing-lg);
    min-height: 64px;

    @media (max-width: 599px) {
      padding: var(--spacing-sm) var(--spacing-md);
    }
  }

  &__title {
    flex-shrink: 0;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  &__logo-icon {
    color: var(--accent);
  }

  &__logo-text {
    font-size: var(--font-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--text);

    @media (max-width: 599px) {
      font-size: var(--font-base);
    }
  }

  &__search {
    flex: 1;
    max-width: 600px;
    margin: 0 var(--spacing-xl);
    display: flex;
    align-items: center;
  }

  &__mobile-search {
    padding: 0 var(--spacing-md) var(--spacing-md);
    background-color: var(--surface);
    border-top: 1px solid var(--border);
  }

  &__theme-toggle {
    color: var(--text-muted);
    transition: all var(--transition-fast);

    &:hover {
      color: var(--accent);
      background-color: rgba(var(--accent-rgb), 0.1);
    }
  }

  &__unit-toggle {
    color: var(--text-muted);
    margin-left: var(--spacing-sm);
    min-width: 40px;
    transition: all var(--transition-fast);

    &:hover {
      color: var(--accent);
      background-color: rgba(var(--accent-rgb), 0.1);
    }
  }

  &__unit-text {
    font-size: var(--font-sm);
    font-weight: var(--font-weight-medium);
  }
}
</style>
