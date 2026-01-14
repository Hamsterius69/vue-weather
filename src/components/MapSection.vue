<template>
  <section class="map-section">
    <div class="map-section__header" @click="toggleExpanded">
      <h2 class="map-section__title">
        <q-icon name="las la-map-marked-alt" size="24px" />
        Location Map
      </h2>
      <q-btn
        flat
        round
        dense
        :icon="isExpanded ? 'las la-angle-up' : 'las la-angle-down'"
        class="map-section__toggle"
        aria-label="Toggle map"
      >
        <q-tooltip>{{ isExpanded ? 'Hide map' : 'Show map' }}</q-tooltip>
      </q-btn>
    </div>

    <q-slide-transition>
      <div v-show="isExpanded" class="map-section__content">
        <div v-if="position && position.lat && position.lng" class="map-section__map">
          <location-map :position="position" />
        </div>
        <div v-else class="map-section__empty">
          <q-icon name="las la-map" size="48px" color="text-muted" />
          <p>Map location not available</p>
        </div>
      </div>
    </q-slide-transition>
  </section>
</template>

<script>
import { ref } from 'vue'
import LocationMap from './LocationMap.vue'

export default {
  name: 'MapSection',
  components: {
    LocationMap
  },
  props: {
    position: {
      type: Object,
      default: () => ({ lat: 0, lng: 0 })
    },
    defaultExpanded: {
      type: Boolean,
      default: false
    }
  },

  setup (props) {
    const isExpanded = ref(props.defaultExpanded)

    const toggleExpanded = () => {
      isExpanded.value = !isExpanded.value
    }

    return {
      isExpanded,
      toggleExpanded
    }
  }
}
</script>

<style lang="scss" scoped>
.map-section {
  background-color: var(--surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);

  .body--light & {
    box-shadow: var(--shadow-md);
  }

  .body--dark & {
    border: 1px solid var(--border);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-xl);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
      background-color: var(--bg);
    }

    @media (max-width: 599px) {
      padding: var(--spacing-lg);
    }
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

    @media (max-width: 599px) {
      font-size: var(--font-lg);
    }
  }

  &__toggle {
    color: var(--text-muted);
    transition: all var(--transition-fast);

    &:hover {
      color: var(--accent);
    }
  }

  &__content {
    padding: 0 var(--spacing-xl) var(--spacing-xl);

    @media (max-width: 599px) {
      padding: 0 var(--spacing-lg) var(--spacing-lg);
    }
  }

  &__map {
    border-radius: var(--radius-md);
    overflow: hidden;
    height: 400px;

    @media (max-width: 599px) {
      height: 300px;
    }
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
}
</style>
