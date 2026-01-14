<template>
  <div class="forecast-card">
    <div class="forecast-card__header">
      <div class="forecast-card__day">{{ dayOfWeek }}</div>
      <div class="forecast-card__date">{{ formattedDate }}</div>
    </div>

    <div class="forecast-card__icon">
      <q-icon :name="weatherIcon" size="48px" />
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
  background-color: var(--surface);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 140px;
  transition: all var(--transition-base);

  .body--light & {
    box-shadow: var(--shadow-md);

    &:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }
  }

  .body--dark & {
    border: 1px solid var(--border);

    &:hover {
      border-color: var(--accent);
    }
  }

  &__header {
    text-align: center;
    width: 100%;
  }

  &__day {
    font-size: var(--font-base);
    font-weight: var(--font-weight-semibold);
    color: var(--text);
  }

  &__date {
    font-size: var(--font-sm);
    color: var(--text-muted);
    margin-top: var(--spacing-xs);
  }

  &__icon {
    color: var(--accent);
    margin: var(--spacing-sm) 0;
  }

  &__temps {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
  }

  &__temp {
    font-weight: var(--font-weight-semibold);

    &--high {
      font-size: var(--font-2xl);
      color: var(--text);
    }

    &--low {
      font-size: var(--font-lg);
      color: var(--text-muted);
    }
  }

  &__description {
    font-size: var(--font-sm);
    color: var(--text-muted);
    text-align: center;
    text-transform: capitalize;
  }

  &__details {
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-xs);
    width: 100%;
    justify-content: center;
  }

  &__detail {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-xs);
    color: var(--text-muted);
  }

  @media (max-width: 599px) {
    padding: var(--spacing-md);
    min-width: 120px;

    &__icon {
      font-size: 40px !important;
    }

    &__temp--high {
      font-size: var(--font-xl);
    }

    &__temp--low {
      font-size: var(--font-base);
    }
  }
}
</style>
