<template>
  <div class="weather-hero" :class="`weather-hero--${weatherCondition}`">
    <div class="weather-hero__gradient"></div>

    <div class="weather-hero__content">
      <!-- Location -->
      <div class="weather-hero__location">
        <q-icon name="las la-map-marker-alt" size="20px" class="weather-hero__location-icon" />
        <h1 class="weather-hero__city">{{ cityName }}</h1>
      </div>

      <!-- Main Weather Display -->
      <div class="weather-hero__main">
        <!-- Weather Icon -->
        <div class="weather-hero__icon-wrapper">
          <q-icon :name="weatherIcon" size="120px" class="weather-hero__icon" />
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
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--spacing-xl);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 599px) {
    min-height: 320px;
    margin-bottom: var(--spacing-lg);
  }

  &__gradient {
    position: absolute;
    inset: 0;
    opacity: 1;
    transition: opacity var(--transition-slow);
  }

  // Sunny gradient
  &--sunny &__gradient {
    background: linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%);
  }

  // Cloudy gradient
  &--cloudy &__gradient {
    background: linear-gradient(135deg, #64748B 0%, #CBD5E1 100%);
  }

  // Rainy gradient
  &--rainy &__gradient {
    background: linear-gradient(135deg, #0EA5E9 0%, #7DD3FC 100%);
  }

  // Snowy gradient
  &--snowy &__gradient {
    background: linear-gradient(135deg, #38BDF8 0%, #E0F2FE 100%);
  }

  // Dark mode overlay
  .body--dark &__gradient {
    opacity: 0.8;
  }

  &__content {
    position: relative;
    z-index: 1;
    text-align: center;
    color: #FFFFFF;
    padding: var(--spacing-2xl) var(--spacing-xl);
    width: 100%;

    @media (max-width: 599px) {
      padding: var(--spacing-xl) var(--spacing-lg);
    }
  }

  &__location {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
  }

  &__location-icon {
    opacity: 0.9;
  }

  &__city {
    font-size: var(--font-3xl);
    font-weight: var(--font-weight-semibold);
    margin: 0;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    @media (max-width: 599px) {
      font-size: var(--font-2xl);
    }
  }

  &__main {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-lg);

    @media (max-width: 599px) {
      flex-direction: column;
      gap: var(--spacing-md);
    }
  }

  &__icon-wrapper {
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
  }

  &__icon {
    color: #FFFFFF;
  }

  &__temp-section {
    text-align: left;

    @media (max-width: 599px) {
      text-align: center;
    }
  }

  &__temp {
    font-size: var(--font-5xl);
    font-weight: var(--font-weight-bold);
    line-height: 1;
    margin-bottom: var(--spacing-sm);
    text-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

    @media (max-width: 599px) {
      font-size: var(--font-4xl);
    }
  }

  &__feels-like {
    font-size: var(--font-lg);
    font-weight: var(--font-weight-normal);
    opacity: 0.9;

    @media (max-width: 599px) {
      font-size: var(--font-base);
    }
  }

  &__condition {
    font-size: var(--font-2xl);
    font-weight: var(--font-weight-medium);
    text-transform: capitalize;
    margin-bottom: var(--spacing-md);
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    @media (max-width: 599px) {
      font-size: var(--font-xl);
    }
  }

  &__updated {
    font-size: var(--font-sm);
    opacity: 0.8;
  }
}
</style>
