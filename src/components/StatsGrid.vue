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
  grid-template-columns: repeat(auto-fit, minmax(8.75rem, 1fr));
  gap: 1rem;
  width: 100%;

  @media (max-width: 599px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  @media (min-width: 600px) and (max-width: 1023px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1024px) {
    // 7 cards: 6 stats + 1 air quality
    grid-template-columns: repeat(7, 1fr);
    gap: 1rem;
  }
}
</style>
