<template>
  <div class="weather-hero" :class="`weather-hero--${weatherCondition}`">
    <div class="weather-hero__gradient"></div>
    <div class="weather-hero__pattern"></div>

    <div class="weather-hero__content">
      <!-- Location -->
      <div class="weather-hero__location">
        <q-icon name="las la-map-marker-alt" class="weather-hero__location-icon" />
        <h1 class="weather-hero__city">{{ cityName }}</h1>
      </div>

      <!-- Main Weather Display -->
      <div class="weather-hero__main">
        <!-- Weather Icon -->
        <div class="weather-hero__icon-wrapper">
          <q-icon :name="weatherIcon" class="weather-hero__icon" />
        </div>

        <!-- Temperature -->
        <div class="weather-hero__temp-section">
          <div class="weather-hero__temp">{{ temperature }}°</div>
          <div class="weather-hero__feels-like">Feels like {{ feelsLike }}°</div>
        </div>
      </div>

      <!-- Condition -->
      <div class="weather-hero__condition">{{ condition }}</div>

      <!-- Last Updated -->
      <div class="weather-hero__updated" v-if="lastUpdated">
        Updated {{ lastUpdated }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'WeatherHero',
  props: {
    cityName: {
      type: String,
      default: 'Unknown Location'
    },
    temperature: {
      type: [Number, String],
      required: true
    },
    feelsLike: {
      type: [Number, String],
      required: true
    },
    condition: {
      type: String,
      default: 'Unknown'
    },
    weatherMain: {
      type: String,
      default: 'Clear'
    },
    lastUpdated: {
      type: String,
      default: ''
    }
  },

  setup (props) {
    // Determine weather condition for gradient
    const weatherCondition = computed(() => {
      const main = (props.weatherMain || '').toLowerCase()
      if (main === 'clear') return 'sunny'
      if (main === 'clouds') return 'cloudy'
      if (main === 'rain' || main === 'drizzle' || main === 'thunderstorm') return 'rainy'
      if (main === 'snow') return 'snowy'
      return 'sunny'
    })

    // Map weather conditions to icons
    const weatherIcon = computed(() => {
      switch (weatherCondition.value) {
        case 'sunny':
          return 'las la-sun'
        case 'cloudy':
          return 'las la-cloud'
        case 'rainy':
          return 'las la-cloud-rain'
        case 'snowy':
          return 'las la-snowflake'
        default:
          return 'las la-sun'
      }
    })

    return {
      weatherCondition,
      weatherIcon
    }
  }
}
</script>

<style lang="scss" scoped>
.weather-hero {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
  min-height: 16rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 599px) {
    min-height: 14rem;
    margin-bottom: 1rem;
    border-radius: 0.75rem;
  }

  &__gradient {
    position: absolute;
    inset: 0;
    opacity: 1;
    transition: opacity var(--transition-slow);
  }

  // Subtle pattern overlay for texture
  &__pattern {
    position: absolute;
    inset: 0;
    opacity: 0.08;
    background-image: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 1px, transparent 1px);
    background-size: 1.5rem 1.5rem;
    pointer-events: none;
  }

  // Sunny gradient - warm amber tones with depth
  &--sunny &__gradient {
    background: linear-gradient(135deg, #B45309 0%, #D97706 25%, #F59E0B 50%, #FBBF24 75%, #FDE68A 100%);
  }

  // Cloudy gradient - slate/blue cool tones
  &--cloudy &__gradient {
    background: linear-gradient(135deg, #334155 0%, #475569 30%, #64748B 60%, #94A3B8 100%);
  }

  // Rainy gradient - deep blue tones
  &--rainy &__gradient {
    background: linear-gradient(135deg, #075985 0%, #0369A1 30%, #0EA5E9 60%, #38BDF8 100%);
  }

  // Snowy gradient - icy blue/white tones
  &--snowy &__gradient {
    background: linear-gradient(135deg, #0369A1 0%, #0284C7 30%, #38BDF8 60%, #BAE6FD 100%);
  }

  // Dark mode - slightly subdued
  .body--dark &__gradient {
    opacity: 0.9;
  }

  // Bottom vignette for depth
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.15) 100%);
    pointer-events: none;
  }

  &__content {
    position: relative;
    z-index: 1;
    text-align: center;
    color: #FFFFFF;
    padding: 2rem 1.5rem;
    width: 100%;

    @media (max-width: 599px) {
      padding: 1.5rem 1rem;
    }
  }

  &__location {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  &__location-icon {
    opacity: 0.9;
    font-size: 1.25rem !important;
  }

  &__city {
    font-size: 1.5rem;
    font-weight: var(--font-weight-semibold);
    margin: 0;
    text-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.2);

    @media (max-width: 599px) {
      font-size: 1.25rem;
    }
  }

  &__main {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 0.75rem;

    @media (max-width: 599px) {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  &__icon-wrapper {
    filter: drop-shadow(0 0.25rem 0.75rem rgba(0, 0, 0, 0.25));
  }

  &__icon {
    color: #FFFFFF;
    font-size: 4.5rem !important;

    @media (max-width: 599px) {
      font-size: 3.5rem !important;
    }
  }

  &__temp-section {
    text-align: left;

    @media (max-width: 599px) {
      text-align: center;
    }
  }

  &__temp {
    font-size: 4rem;
    font-weight: var(--font-weight-bold);
    line-height: 1;
    margin-bottom: 0.25rem;
    text-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.25);

    @media (max-width: 599px) {
      font-size: 3rem;
    }
  }

  &__feels-like {
    font-size: 1rem;
    font-weight: var(--font-weight-normal);
    opacity: 0.9;

    @media (max-width: 599px) {
      font-size: 0.875rem;
    }
  }

  &__condition {
    font-size: 1.125rem;
    font-weight: var(--font-weight-medium);
    text-transform: capitalize;
    margin-bottom: 0.25rem;
    text-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.2);

    @media (max-width: 599px) {
      font-size: 1rem;
    }
  }

  &__updated {
    font-size: 0.8125rem;
    opacity: 0.75;
  }
}
</style>
