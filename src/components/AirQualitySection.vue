<template>
  <section class="air-quality-compact">
    <div v-if="loading" class="air-quality-compact__loading">
      <q-skeleton type="rect" height="48px" />
    </div>

    <div v-else-if="airData" class="air-quality-compact__content">
      <!-- Compact inline layout -->
      <div class="air-quality-compact__main">
        <div class="air-quality-compact__badge" :class="`air-quality-compact__badge--${airData.aqiColor}`">
          <q-icon name="las la-lungs" size="18px" />
          <span class="air-quality-compact__value">AQI {{ airData.aqi }}</span>
          <span class="air-quality-compact__divider">·</span>
          <span class="air-quality-compact__label">{{ airData.aqiLabel }}</span>
        </div>
        <p class="air-quality-compact__description">
          {{ getShortDescription(airData.aqi) }}
        </p>
      </div>
      <q-tooltip
        anchor="bottom middle"
        self="top middle"
        :offset="[0, 8]"
        :delay="250"
        class="custom-tooltip"
      >
        <div class="custom-tooltip__title">Air Quality Index</div>
        <div class="custom-tooltip__text">{{ getAqiDescription(airData.aqi) }}</div>
      </q-tooltip>
    </div>

    <div v-else class="air-quality-compact__empty">
      <q-icon name="las la-lungs" size="18px" />
      <span>Air quality unavailable</span>
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
    const getShortDescription = (aqi) => {
      const descriptions = {
        1: 'Great for outdoor activities',
        2: 'Acceptable for most people',
        3: 'Consider limiting outdoor exertion',
        4: 'Limit outdoor activities',
        5: 'Avoid outdoor activities'
      }
      return descriptions[aqi] || 'Data unavailable'
    }

    const getAqiDescription = (aqi) => {
      const descriptions = {
        1: 'Air quality is excellent. Ideal conditions for all outdoor activities.',
        2: 'Air quality is acceptable. Sensitive individuals may want to limit prolonged outdoor exertion.',
        3: 'Air quality is moderate. Consider reducing prolonged outdoor exertion.',
        4: 'Air quality is poor. Avoid prolonged outdoor activities.',
        5: 'Air quality is very poor. Stay indoors and keep windows closed.'
      }
      return descriptions[aqi] || 'Air quality data unavailable.'
    }

    return {
      getShortDescription,
      getAqiDescription
    }
  }
}
</script>

<style lang="scss" scoped>
.air-quality-compact {
  background-color: var(--surface);
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  transition: all var(--transition-base);
  cursor: default;

  .body--light & {
    box-shadow: var(--shadow-sm);
  }

  .body--dark & {
    border: 1px solid var(--border);
  }

  &__content {
    position: relative;
  }

  &__main {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    flex-wrap: wrap;

    @media (max-width: 599px) {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-sm);
    }
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: var(--font-weight-medium);
    white-space: nowrap;

    &--positive {
      background-color: rgba(76, 175, 80, 0.12);
      color: #4caf50;
    }

    &--light-green {
      background-color: rgba(139, 195, 74, 0.12);
      color: #8bc34a;
    }

    &--warning {
      background-color: rgba(255, 193, 7, 0.12);
      color: #d4a800;

      .body--dark & {
        color: #ffc107;
      }
    }

    &--orange {
      background-color: rgba(255, 152, 0, 0.12);
      color: #e68900;

      .body--dark & {
        color: #ff9800;
      }
    }

    &--negative {
      background-color: rgba(244, 67, 54, 0.12);
      color: #f44336;
    }

    &--grey {
      background-color: rgba(158, 158, 158, 0.12);
      color: #9e9e9e;
    }
  }

  &__value {
    font-weight: var(--font-weight-semibold);
  }

  &__divider {
    opacity: 0.5;
  }

  &__label {
    font-weight: var(--font-weight-medium);
  }

  &__description {
    color: var(--text-muted);
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.4;
  }

  &__loading {
    padding: var(--spacing-xs) 0;
  }

  &__empty {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text-muted);
    font-size: 0.875rem;
  }
}

/* Custom tooltip styles */
.custom-tooltip {
  &__title {
    font-size: 0.875rem;
    font-weight: var(--font-weight-semibold);
    margin-bottom: 4px;
  }

  &__text {
    font-size: 0.8125rem;
    line-height: 1.4;
    opacity: 0.9;
  }
}
</style>
