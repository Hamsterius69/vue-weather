<template>
  <div class="skeleton-block" :class="`skeleton-block--${variant}`">
    <q-skeleton :type="type" :height="height" :width="width" :animation="animation" />
  </div>
</template>

<script>
export default {
  name: 'SkeletonBlock',
  props: {
    type: {
      type: String,
      default: 'rect',
      validator: (value) => ['text', 'rect', 'circle', 'QBtn', 'QBadge', 'QChip', 'QToolbar', 'QCheckbox', 'QRadio', 'QToggle', 'QSlider', 'QRange', 'QInput', 'QAvatar'].includes(value)
    },
    height: {
      type: String,
      default: undefined
    },
    width: {
      type: String,
      default: undefined
    },
    animation: {
      type: String,
      default: 'wave',
      validator: (value) => ['wave', 'pulse', 'none'].includes(value)
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'card', 'hero'].includes(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.skeleton-block {
  &--card {
    background-color: var(--surface);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);

    .body--light & {
      box-shadow: var(--shadow-md);
    }

    .body--dark & {
      border: 1px solid var(--border);
    }
  }

  &--hero {
    background-color: var(--surface);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);

    .body--light & {
      box-shadow: var(--shadow-md);
    }

    .body--dark & {
      border: 1px solid var(--border);
    }
  }
}
</style>
