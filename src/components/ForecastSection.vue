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
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  transition: all var(--transition-base);

  .body--light & {
    box-shadow: var(--shadow-md);
  }

  .body--dark & {
    border: 1px solid var(--border);
  }

  &__header {
    margin-bottom: var(--spacing-lg);
  }

  &__title {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: var(--font-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--text);
    margin: 0;

    .q-icon {
      color: var(--accent);
    }
  }

  &__cards {
    display: flex;
    justify-content: center;
    gap: var(--spacing-lg);
    overflow-x: auto;
    padding-bottom: var(--spacing-sm);

    /* Custom scrollbar */
    &::-webkit-scrollbar {
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: var(--bg);
      border-radius: var(--radius-full);
    }

    &::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: var(--radius-full);

      &:hover {
        background: var(--text-muted);
      }
    }
  }

  &__loading {
    display: flex;
    justify-content: center;
    gap: var(--spacing-lg);
    overflow-x: auto;
  }

  &__skeleton {
    min-width: 140px;
    height: 260px;
    border-radius: var(--radius-md);

    @media (max-width: 599px) {
      min-width: 120px;
      height: 240px;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2xl) 0;
    color: var(--text-muted);

    p {
      margin-top: var(--spacing-md);
      font-size: var(--font-base);
    }
  }

  @media (max-width: 599px) {
    padding: var(--spacing-lg);

    &__title {
      font-size: var(--font-lg);
    }

    &__cards {
      gap: var(--spacing-md);
    }
  }
}
</style>
