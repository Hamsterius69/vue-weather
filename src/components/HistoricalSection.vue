<template>
  <section class="historical-section">
    <div class="historical-section__header">
      <h2 class="historical-section__title">
        <q-icon name="las la-history" size="24px" />
        Historical Weather (Last 5 Days)
      </h2>
    </div>

    <div v-if="loading" class="historical-section__loading">
      <q-skeleton type="rect" height="60px" v-for="i in 5" :key="i" class="historical-section__skeleton" />
    </div>

    <div v-else-if="historicalData && historicalData.length > 0" class="historical-section__list">
      <q-expansion-item
        v-for="(item, index) in historicalData"
        :key="index"
        class="historical-section__item"
        expand-separator
        :default-opened="index === 0"
      >
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon :name="getWeatherIcon(item.weatherMain)" size="32px" :color="'accent'" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="historical-section__date">{{ formatDate(item.date) }}</q-item-label>
            <q-item-label caption class="historical-section__description">{{ item.description }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="historical-section__temp-range">
              <span class="historical-section__temp-high">{{ item.maxTemp }}°</span>
              <span class="historical-section__temp-divider">/</span>
              <span class="historical-section__temp-low">{{ item.minTemp }}°</span>
            </div>
          </q-item-section>
        </template>

        <q-card class="historical-section__details">
          <q-card-section>
            <div class="historical-section__details-grid">
              <div class="historical-section__detail">
                <q-icon name="las la-thermometer-half" size="20px" />
                <div class="historical-section__detail-content">
                  <div class="historical-section__detail-label">Avg Temp</div>
                  <div class="historical-section__detail-value">{{ item.avgTemp }}°</div>
                </div>
              </div>

              <div class="historical-section__detail">
                <q-icon name="las la-wind" size="20px" />
                <div class="historical-section__detail-content">
                  <div class="historical-section__detail-label">Wind</div>
                  <div class="historical-section__detail-value">{{ item.windSpeed }} m/s</div>
                </div>
              </div>

              <div class="historical-section__detail">
                <q-icon name="las la-tint" size="20px" />
                <div class="historical-section__detail-content">
                  <div class="historical-section__detail-label">Humidity</div>
                  <div class="historical-section__detail-value">{{ item.humidity }}%</div>
                </div>
              </div>

              <div class="historical-section__detail">
                <q-icon name="las la-compress-arrows-alt" size="20px" />
                <div class="historical-section__detail-content">
                  <div class="historical-section__detail-label">Pressure</div>
                  <div class="historical-section__detail-value">{{ item.pressure }} hPa</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>

    <div v-else class="historical-section__empty">
      <q-icon name="las la-history" size="48px" color="text-muted" />
      <p>No historical data available</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HistoricalSection',
  props: {
    historicalData: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  setup () {
    const getWeatherIcon = (weatherMain) => {
      const main = (weatherMain || 'clear').toLowerCase()
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
    }

    const formatDate = (dateString) => {
      const dateObj = new Date(dateString)
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      const dayName = days[dateObj.getDay()]
      const monthName = months[dateObj.getMonth()]
      const day = dateObj.getDate()

      return `${dayName}, ${monthName} ${day}`
    }

    return {
      getWeatherIcon,
      formatDate
    }
  }
}
</script>

<style lang="scss" scoped>
.historical-section {
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

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  &__item {
    background-color: var(--bg);
    border-radius: var(--radius-md);
    transition: all var(--transition-base);

    .body--dark & {
      border: 1px solid var(--border);
    }

    &:hover {
      .body--light & {
        box-shadow: var(--shadow-sm);
      }
    }
  }

  &__date {
    font-size: var(--font-base);
    font-weight: var(--font-weight-medium);
    color: var(--text);
  }

  &__description {
    text-transform: capitalize;
    color: var(--text-muted);
  }

  &__temp-range {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-lg);
  }

  &__temp-high {
    color: var(--text);
    font-weight: var(--font-weight-semibold);
  }

  &__temp-divider {
    color: var(--text-muted);
  }

  &__temp-low {
    color: var(--text-muted);
    font-weight: var(--font-weight-medium);
  }

  &__details {
    background-color: var(--surface);
    box-shadow: none;
    border: none;
  }

  &__details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--spacing-lg);

    @media (max-width: 599px) {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-md);
    }
  }

  &__detail {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text);

    .q-icon {
      color: var(--accent);
    }
  }

  &__detail-content {
    display: flex;
    flex-direction: column;
  }

  &__detail-label {
    font-size: var(--font-xs);
    color: var(--text-muted);
  }

  &__detail-value {
    font-size: var(--font-base);
    font-weight: var(--font-weight-medium);
    color: var(--text);
  }

  &__loading {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  &__skeleton {
    border-radius: var(--radius-md);
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
