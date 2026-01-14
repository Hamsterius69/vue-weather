<template>
  <q-card flat class="stat-card" :class="{ 'stat-card--clickable': clickable }">
    <q-card-section class="stat-card__content">
      <!-- Icon -->
      <div class="stat-card__icon-wrapper">
        <q-icon :name="icon" size="32px" class="stat-card__icon" />
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
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  height: 100%;

  // Light mode
  .body--light & {
    box-shadow: var(--shadow-md);

    &:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }
  }

  // Dark mode
  .body--dark & {
    border: 1px solid var(--border);

    &:hover {
      border-color: var(--accent);
    }
  }

  &--clickable {
    cursor: pointer;
  }

  &__content {
    padding: var(--spacing-lg);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);

    @media (max-width: 599px) {
      padding: var(--spacing-md);
    }
  }

  &__icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
    margin-bottom: var(--spacing-xs);

    @media (max-width: 599px) {
      width: 48px;
      height: 48px;
    }
  }

  &__icon {
    color: #FFFFFF;
  }

  &__value {
    font-size: var(--font-3xl);
    font-weight: var(--font-weight-bold);
    color: var(--text);
    line-height: 1;

    @media (max-width: 599px) {
      font-size: var(--font-2xl);
    }
  }

  &__label {
    font-size: var(--font-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @media (max-width: 599px) {
      font-size: var(--font-xs);
    }
  }

  &__sublabel {
    font-size: var(--font-xs);
    color: var(--text-muted);
    opacity: 0.7;
  }
}
</style>
