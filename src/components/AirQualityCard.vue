<template>
  <q-card flat class="aqi-card" :class="`aqi-card--${aqiColor}`">
    <q-card-section class="aqi-card__content">
      <!-- Icon -->
      <div class="aqi-card__icon-wrapper" :class="`aqi-card__icon-wrapper--${aqiColor}`">
        <q-icon name="las la-lungs" size="24px" class="aqi-card__icon" />
      </div>

      <!-- Value -->
      <div class="aqi-card__value">{{ aqiValue }}</div>

      <!-- Label -->
      <div class="aqi-card__label">Air Quality</div>

      <!-- Status -->
      <div class="aqi-card__status" :class="`aqi-card__status--${aqiColor}`">
        {{ aqiLabel }}
      </div>
    </q-card-section>

    <!-- Tooltip with details -->
    <q-tooltip
      anchor="top middle"
      self="bottom middle"
      :offset="[0, 8]"
      :delay="200"
      class="aqi-tooltip"
    >
      <div class="aqi-tooltip__title">{{ aqiLabel }}</div>
      <div class="aqi-tooltip__text">{{ aqiDescription }}</div>
    </q-tooltip>
  </q-card>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'AirQualityCard',
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

  setup (props) {
    const aqiValue = computed(() => {
      if (!props.airData) return '--'
      return `AQI ${props.airData.aqi}`
    })

    const aqiLabel = computed(() => {
      if (!props.airData) return 'N/A'
      return props.airData.aqiLabel || 'Unknown'
    })

    const aqiColor = computed(() => {
      if (!props.airData) return 'grey'
      return props.airData.aqiColor || 'grey'
    })

    const aqiDescription = computed(() => {
      if (!props.airData) return 'Air quality data unavailable.'
      const descriptions = {
        1: 'Air quality is excellent. Ideal conditions for all outdoor activities.',
        2: 'Air quality is acceptable. Sensitive individuals may want to limit prolonged outdoor exertion.',
        3: 'Air quality is moderate. Consider reducing prolonged outdoor exertion.',
        4: 'Air quality is poor. Avoid prolonged outdoor activities.',
        5: 'Air quality is very poor. Stay indoors and keep windows closed.'
      }
      return descriptions[props.airData.aqi] || 'Air quality data unavailable.'
    })

    return {
      aqiValue,
      aqiLabel,
      aqiColor,
      aqiDescription
    }
  }
}
</script>

<style lang="scss" scoped>
.aqi-card {
  background-color: var(--surface);
  border-radius: 0.75rem;
  transition: all var(--transition-base);
  height: 100%;
  cursor: default;

  // Match stat-card styling exactly
  .body--light & {
    box-shadow: var(--shadow-sm);

    &:hover {
      box-shadow: var(--shadow-md);
    }
  }

  .body--dark & {
    border: 0.0625rem solid var(--border);

    &:hover {
      border-color: var(--accent);
    }
  }

  &__content {
    padding: 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;

    @media (max-width: 599px) {
      padding: 0.75rem;
    }
  }

  &__icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.5rem;
    margin-bottom: 0.25rem;

    @media (max-width: 599px) {
      width: 2rem;
      height: 2rem;
    }

    // Subtle, muted color backgrounds
    &--positive {
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
    }

    &--light-green {
      background: linear-gradient(135deg, #7cb342 0%, #9ccc65 100%);
    }

    &--warning {
      background: linear-gradient(135deg, #ffb300 0%, #ffc107 100%);
    }

    &--orange {
      background: linear-gradient(135deg, #fb8c00 0%, #ffa726 100%);
    }

    &--negative {
      background: linear-gradient(135deg, #e53935 0%, #ef5350 100%);
    }

    &--grey {
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
    }
  }

  &__icon {
    color: #FFFFFF;
    font-size: 1.125rem !important;

    @media (max-width: 599px) {
      font-size: 1rem !important;
    }
  }

  &__value {
    font-size: 1.375rem;
    font-weight: var(--font-weight-bold);
    color: var(--text);
    line-height: 1;

    @media (max-width: 599px) {
      font-size: 1.125rem;
    }
  }

  &__label {
    font-size: 0.75rem;
    font-weight: var(--font-weight-medium);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.02rem;
  }

  &__status {
    font-size: 0.6875rem;
    font-weight: var(--font-weight-medium);
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    margin-top: 0.125rem;

    &--positive {
      background-color: rgba(76, 175, 80, 0.12);
      color: #43a047;
    }

    &--light-green {
      background-color: rgba(124, 179, 66, 0.12);
      color: #689f38;
    }

    &--warning {
      background-color: rgba(255, 179, 0, 0.12);
      color: #f9a825;
    }

    &--orange {
      background-color: rgba(251, 140, 0, 0.12);
      color: #ef6c00;
    }

    &--negative {
      background-color: rgba(229, 57, 53, 0.12);
      color: #e53935;
    }

    &--grey {
      background-color: rgba(158, 158, 158, 0.12);
      color: #757575;
    }
  }
}

/* Tooltip styles */
.aqi-tooltip {
  background-color: #1F2937 !important;
  color: #F3F4F6 !important;
  font-size: 0.875rem !important;
  padding: 0.75rem 1rem !important;
  border-radius: 0.75rem !important;
  max-width: 16rem !important;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.25) !important;

  &__title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.375rem;
  }

  &__text {
    font-size: 0.875rem;
    line-height: 1.4;
    opacity: 0.9;
  }
}
</style>
