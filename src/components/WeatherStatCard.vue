<template>
  <q-card flat class="stat-card" :class="{ 'stat-card--clickable': clickable }">
    <q-card-section class="stat-card__content">
      <!-- Icon -->
      <div class="stat-card__icon-wrapper">
        <q-icon :name="icon" class="stat-card__icon" />
      </div>

      <!-- Value -->
      <div class="stat-card__value">{{ value }}</div>

      <!-- Label -->
      <div class="stat-card__label">{{ label }}</div>

      <!-- Optional sublabel -->
      <div class="stat-card__sublabel" v-if="sublabel">{{ sublabel }}</div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'WeatherStatCard',
  props: {
    icon: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    sublabel: {
      type: String,
      default: ''
    },
    clickable: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.stat-card {
  background-color: var(--surface);
  border-radius: 0.75rem;
  transition: all var(--transition-base);
  height: 100%;

  // Light mode
  .body--light & {
    box-shadow: var(--shadow-sm);

    &:hover {
      box-shadow: var(--shadow-md);
    }
  }

  // Dark mode
  .body--dark & {
    border: 0.0625rem solid var(--border);

    &:hover {
      border-color: var(--accent);
    }
  }

  &--clickable {
    cursor: pointer;
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
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
    margin-bottom: 0.25rem;

    @media (max-width: 599px) {
      width: 2rem;
      height: 2rem;
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

  &__sublabel {
    font-size: 0.6875rem;
    color: var(--text-muted);
    opacity: 0.7;
  }
}
</style>
