<template>
  <div class="stats-grid">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'StatsGrid'
}
</script>

<style lang="scss" scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--spacing-lg);
  width: 100%;

  @media (max-width: 599px) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }

  @media (min-width: 600px) and (max-width: 1023px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--spacing-xl);
  }
}
</style>
