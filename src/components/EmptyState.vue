<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <q-icon :name="icon" :size="iconSize" :color="iconColor" />
    </div>
    <h3 v-if="title" class="empty-state__title">{{ title }}</h3>
    <p v-if="message" class="empty-state__message">{{ message }}</p>
    <div v-if="$slots.action" class="empty-state__action">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    icon: {
      type: String,
      default: 'las la-cloud-sun'
    },
    iconSize: {
      type: String,
      default: '64px'
    },
    iconColor: {
      type: String,
      default: 'text-muted'
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  text-align: center;
  min-height: 300px;

  &__icon {
    margin-bottom: var(--spacing-lg);
    opacity: 0.6;
  }

  &__title {
    font-size: var(--font-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--text);
    margin: 0 0 var(--spacing-sm);
  }

  &__message {
    font-size: var(--font-base);
    color: var(--text-muted);
    margin: 0 0 var(--spacing-lg);
    max-width: 400px;
    line-height: 1.5;
  }

  &__action {
    margin-top: var(--spacing-md);
  }

  @media (max-width: 599px) {
    padding: var(--spacing-xl);
    min-height: 250px;

    &__icon {
      font-size: 48px !important;
    }

    &__title {
      font-size: var(--font-lg);
    }

    &__message {
      font-size: var(--font-sm);
    }
  }
}
</style>
