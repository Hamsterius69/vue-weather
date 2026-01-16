<template>
  <div class="forecast-card">
    <div class="forecast-card__header">
      <div class="forecast-card__day">{{ dayOfWeek }}</div>
      <div class="forecast-card__date">{{ formattedDate }}</div>
    </div>

    <div class="forecast-card__icon">
      <q-icon :name="weatherIcon" class="forecast-card__weather-icon" />
    </div>

    <div class="forecast-card__temps">
      <div class="forecast-card__temp forecast-card__temp--high">
        {{ highTemp }}°
      </div>
      <div class="forecast-card__temp forecast-card__temp--low">
        {{ lowTemp }}°
      </div>
    </div>

    <div class="forecast-card__description">
      {{ description }}
    </div>

    <div class="forecast-card__details">
      <div class="forecast-card__detail">
        <q-icon name="las la-wind" size="16px" />
        <span>{{ windSpeed }} m/s</span>
      </div>
      <div class="forecast-card__detail">
        <q-icon name="las la-tint" size="16px" />
        <span>{{ humidity }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ForecastCard',
  props: {
    date: {
      type: String,
      required: true
    },
    highTemp: {
      type: [Number, String],
      required: true
    },
    lowTemp: {
      type: [Number, String],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    weatherMain: {
      type: String,
      default: 'Clear'
    },
    windSpeed: {
      type: [Number, String],
      required: true
    },
    humidity: {
      type: [Number, String],
      required: true
    }
  },

  setup (props) {
    const weatherIcon = computed(() => {
      const main = props.weatherMain.toLowerCase()
      const iconMap = {
        clear: 'las la-sun',
        clouds: 'las la-cloud',
        rain: 'las la-cloud-rain',
        drizzle: 'las la-cloud-rain',
        thunderstorm: 'las la-bolt',
        snow: 'las la-snowflake',
        mist: 'las la-smog',
        fog: 'las la-smog'
      }
      return iconMap[main] || 'las la-cloud'
    })

    const formattedDate = computed(() => {
      const dateObj = new Date(props.date)
      const month = String(dateObj.getMonth() + 1).padStart(2, '0')
      const day = String(dateObj.getDate()).padStart(2, '0')
      return `${month}/${day}`
    })

    const dayOfWeek = computed(() => {
      const dateObj = new Date(props.date)
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      return days[dateObj.getDay()]
    })

    return {
      weatherIcon,
      formattedDate,
      dayOfWeek
    }
  }
}
</script>

<style lang="scss" scoped>
.forecast-card {
  background-color: var(--bg);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  min-width: 8.5rem;
  flex-shrink: 0;
  transition: all var(--transition-base);

  .body--light & {
    background-color: #F8FAFC;

    &:hover {
      background-color: #FFFFFF;
      box-shadow: var(--shadow-sm);
    }
  }

  .body--dark & {
    background-color: rgba(255, 255, 255, 0.03);

    &:hover {
      background-color: rgba(255, 255, 255, 0.06);
    }
  }

  &__header {
    text-align: center;
    width: 100%;
  }

  &__day {
    font-size: 0.9375rem;
    font-weight: var(--font-weight-semibold);
    color: var(--text);
  }

  &__date {
    font-size: 0.8125rem;
    color: var(--text-muted);
    margin-top: 0.125rem;
  }

  &__icon {
    color: var(--accent);
    margin: 0.375rem 0;
  }

  &__weather-icon {
    font-size: 2.5rem !important;
  }

  &__temps {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
  }

  &__temp {
    font-weight: var(--font-weight-bold);

    &--high {
      font-size: 1.125rem;
      color: var(--text);
    }

    &--low {
      font-size: 0.9375rem;
      color: var(--text-muted);
    }
  }

  &__description {
    font-size: 0.8125rem;
    color: var(--text-muted);
    text-align: center;
    text-transform: capitalize;
    line-height: 1.3;
  }

  &__details {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.25rem;
    width: 100%;
    justify-content: center;
  }

  &__detail {
    display: flex;
    align-items: center;
    gap: 0.125rem;
    font-size: 0.75rem;
    color: var(--text-muted);

    .q-icon {
      font-size: 0.875rem !important;
    }
  }

  @media (max-width: 599px) {
    padding: 0.75rem;
    min-width: 6.5rem;

    &__day {
      font-size: 0.875rem;
    }

    &__date {
      font-size: 0.75rem;
    }

    &__weather-icon {
      font-size: 2rem !important;
    }

    &__temp--high {
      font-size: 1rem;
    }

    &__temp--low {
      font-size: 0.875rem;
    }

    &__description {
      font-size: 0.75rem;
    }
  }
}
</style>
