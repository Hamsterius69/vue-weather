<template>
  <section class="forecast-section">
    <div class="forecast-section__header">
      <h2 class="forecast-section__title">
        <q-icon name="las la-calendar-alt" size="28px" />
        5-Day Forecast
      </h2>
    </div>

    <div v-if="loading" class="forecast-section__loading">
      <q-skeleton v-for="i in 5" :key="i" type="rect" class="forecast-section__skeleton" />
    </div>

    <div v-else-if="forecasts && forecasts.length > 0" class="forecast-section__cards">
      <forecast-card
        v-for="(forecast, index) in forecasts"
        :key="index"
        :date="forecast.date"
        :high-temp="forecast.maxTemp"
        :low-temp="forecast.minTemp"
        :description="forecast.description"
        :weather-main="forecast.weatherMain"
        :wind-speed="forecast.windSpeed"
        :humidity="forecast.humidity"
      />
    </div>

    <div v-else class="forecast-section__empty">
      <q-icon name="las la-cloud-sun" size="48px" color="text-muted" />
      <p>No forecast data available</p>
    </div>
  </section>
</template>

<script>
import ForecastCard from './ForecastCard.vue'

export default {
  name: 'ForecastSection',
  components: {
    ForecastCard
  },
  props: {
    forecasts: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.forecast-section {
  background-color: var(--surface);
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: all var(--transition-base);

  .body--light & {
    box-shadow: var(--shadow-md);
  }

  .body--dark & {
    border: 0.0625rem solid var(--border);
  }

  &__header {
    margin-bottom: 1rem;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.125rem;
    font-weight: var(--font-weight-semibold);
    color: var(--text);
    margin: 0;

    .q-icon {
      color: var(--accent);
      font-size: 1.375rem !important;
    }
  }

  &__cards {
    display: flex;
    justify-content: flex-start;
    gap: 0.75rem;
    overflow-x: auto;
    padding-bottom: 0.25rem;

    /* Custom scrollbar */
    &::-webkit-scrollbar {
      height: 0.375rem;
    }

    &::-webkit-scrollbar-track {
      background: var(--bg);
      border-radius: 9999px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 9999px;

      &:hover {
        background: var(--text-muted);
      }
    }
  }

  &__loading {
    display: flex;
    justify-content: flex-start;
    gap: 0.75rem;
    overflow-x: auto;
  }

  &__skeleton {
    min-width: 8.5rem;
    height: 12.5rem;
    border-radius: 0.75rem;

    @media (max-width: 599px) {
      min-width: 6.5rem;
      height: 11rem;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 0;
    color: var(--text-muted);

    p {
      margin-top: 1rem;
      font-size: 0.875rem;
    }
  }

  @media (max-width: 599px) {
    padding: 1rem;

    &__title {
      font-size: 1rem;
    }

    &__cards {
      gap: 0.5rem;
    }
  }
}
</style>
