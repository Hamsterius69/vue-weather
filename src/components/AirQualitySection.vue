<template>
  <section class="air-quality-section">
    <div class="air-quality-section__header">
      <h2 class="air-quality-section__title">
        <q-icon name="las la-lungs" size="24px" />
        Air Quality
      </h2>
    </div>

    <div v-if="loading" class="air-quality-section__loading">
      <q-skeleton type="rect" height="120px" />
    </div>

    <div v-else-if="airData" class="air-quality-section__content">
      <!-- AQI Principal -->
      <div class="air-quality-section__aqi">
        <div class="air-quality-section__aqi-badge" :class="`air-quality-section__aqi-badge--${airData.aqiColor}`">
          <span class="air-quality-section__aqi-value">{{ airData.aqi }}</span>
          <span class="air-quality-section__aqi-label">{{ airData.aqiLabel }}</span>
        </div>
        <p class="air-quality-section__aqi-description">
          {{ getAqiDescription(airData.aqi) }}
        </p>
      </div>
    </div>

    <div v-else class="air-quality-section__empty">
      <q-icon name="las la-lungs" size="48px" color="text-muted" />
      <p>No air quality data available</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AirQualitySection',
  props: {
    airData: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  setup () {
    const getAqiDescription = (aqi) => {
      const descriptions = {
        1: 'Air quality is excellent. Ideal for outdoor activities.',
        2: 'Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion.',
        3: 'Air quality is moderate. Consider reducing prolonged outdoor exertion.',
        4: 'Air quality is poor. Avoid prolonged outdoor activities.',
        5: 'Air quality is very poor. Stay indoors and keep windows closed.'
      }
      return descriptions[aqi] || 'Air quality data unavailable.'
    }

    return {
      getAqiDescription
    }
  }
}
</script>

<style lang="scss" scoped>
.air-quality-section {
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

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  &__aqi {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);

    @media (max-width: 599px) {
      flex-direction: column;
      text-align: center;
    }
  }

  &__aqi-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 100px;
    min-height: 100px;
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);

    &--positive {
      background-color: rgba(76, 175, 80, 0.15);
      color: #4caf50;
    }

    &--light-green {
      background-color: rgba(139, 195, 74, 0.15);
      color: #8bc34a;
    }

    &--warning {
      background-color: rgba(255, 193, 7, 0.15);
      color: #ffc107;
    }

    &--orange {
      background-color: rgba(255, 152, 0, 0.15);
      color: #ff9800;
    }

    &--negative {
      background-color: rgba(244, 67, 54, 0.15);
      color: #f44336;
    }

    &--grey {
      background-color: rgba(158, 158, 158, 0.15);
      color: #9e9e9e;
    }
  }

  &__aqi-value {
    font-size: var(--font-3xl);
    font-weight: var(--font-weight-bold);
    line-height: 1;
  }

  &__aqi-label {
    font-size: var(--font-sm);
    font-weight: var(--font-weight-medium);
    margin-top: var(--spacing-xs);
  }

  &__aqi-description {
    color: var(--text-muted);
    font-size: var(--font-base);
    margin: 0;
    flex: 1;
  }

  &__loading {
    padding: var(--spacing-md) 0;
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
  }
}
</style>
