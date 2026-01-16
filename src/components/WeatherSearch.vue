<template>
  <div class="weather-search">
    <div class="row justify-center items-center">
      <div :class="$q.screen.width >= xsBreakPoint ? 'col-4' && 'q-mr-md' : 'col-12'" style="position: relative;">
        <q-input
          ref="inputRef"
          v-model="cityInput"
          :loading="cityLoading"
          filled
          dense
          placeholder="City, country code (e.g. Brussels, BE)"
          :error="!isInputValid"
          :error-message="inputError || undefined"
          lazy-rules
          hide-bottom-space
          class="weather-search__input"
          @keyup.enter="handleSearch"
          @keydown="handleKeydown"
          @focus="handleFocus"
          @blur="handleBlur"
        >
          <template v-slot:append>
            <q-icon
              v-if="cityInput"
              name="las la-times-circle"
              class="cursor-pointer"
              @click="clearInput"
            />
            <q-icon v-else name="las la-search" />
          </template>
        </q-input>

        <!-- Autocomplete dropdown -->
        <div
          v-if="showAutocompleteMenu && (autocompleteSuggestions.length > 0 || autocompleteLoading)"
          class="autocomplete-dropdown"
        >
          <q-list>
            <q-item
              v-for="(suggestion, index) in autocompleteSuggestions"
              :key="index"
              clickable
              :class="{ 'autocomplete-dropdown__item--selected': index === selectedSuggestionIndex }"
              @click="selectSuggestion(suggestion)"
            >
              <q-item-section avatar>
                <q-icon name="las la-map-marker-alt" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ suggestion.name }}</q-item-label>
                <q-item-label caption>{{ suggestion.country }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="autocompleteLoading">
              <q-item-section avatar>
                <q-spinner color="primary" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Loading suggestions...</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <q-btn
        :loading="searchInProgress"
        color="primary"
        label="Check weather"
        size="md"
        :disabled="!cityInput"
        @click="handleSearch"
      >
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
          Loading...
        </template>
      </q-btn>
    </div>
  </div>
</template>

<script>
import { ref, watch, onBeforeMount, onBeforeUnmount, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useInputValidation } from '../composable/useInputValidation'

export default {
  name: 'WeatherSearch',
  emits: ['search', 'city-loaded'],

  setup (props, { emit }) {
    const store = useStore()
    const $q = useQuasar()
    const { validateCityInput } = useInputValidation()

    const inputRef = ref(null)
    const cityInput = ref('')
    const inputError = ref('')
    const cityLoading = ref(false)
    const searchInProgress = ref(false)
    const showAutocompleteMenu = ref(false)
    const autocompleteSuggestions = ref([])
    const autocompleteLoading = ref(false)
    const isInputFocused = ref(false)
    const skipNextAutocomplete = ref(false)
    const selectedSuggestionIndex = ref(-1)
    const xsBreakPoint = computed(() => store.state.weather.xsBreakPoint)

    const isInputValid = computed(() => inputError.value === '')

    let autocompleteTimeout = null

    onBeforeMount(() => {
      loadCity()
    })

    onBeforeUnmount(() => {
      if (autocompleteTimeout) {
        clearTimeout(autocompleteTimeout)
      }
    })

    watch(cityInput, (newValue) => {
      // Clear previous timeout
      if (autocompleteTimeout) {
        clearTimeout(autocompleteTimeout)
        autocompleteTimeout = null
      }

      // Clear error when user types
      if (inputError.value) {
        inputError.value = ''
      }

      // Reset selection when typing
      selectedSuggestionIndex.value = -1

      // If input is empty or too short, close menu
      if (!newValue || newValue.length < 3) {
        showAutocompleteMenu.value = false
        autocompleteSuggestions.value = []
        return
      }

      // Skip autocomplete if we just selected a suggestion
      if (skipNextAutocomplete.value) {
        skipNextAutocomplete.value = false
        return
      }

      // Debounce autocomplete requests
      autocompleteTimeout = setTimeout(() => {
        if (isInputFocused.value) {
          fetchAutocomplete()
        }
      }, 400)
    })

    const loadCity = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            cityLoading.value = true
            store.dispatch('callGetCity', {
              lat: position.coords.latitude,
              lon: position.coords.longitude
            }).then((response) => {
              const address = response.data.address
              // LocationIQ puede devolver diferentes campos según la ubicación
              // Priorizamos city/state sobre town/village para obtener nombres más reconocibles
              const cityName = address.city ||
                               address.state ||
                               address.town ||
                               address.village ||
                               address.municipality ||
                               address.county ||
                               address.name ||
                               ''
              const countryCode = address.country_code || address.country || ''

              if (cityName && countryCode) {
                skipNextAutocomplete.value = true
                cityInput.value = `${cityName}, ${countryCode}`
                emit('city-loaded', cityInput.value)
                // Ejecutar búsqueda automática al cargar la ubicación
                cityLoading.value = false
                handleSearch()
              } else {
                cityLoading.value = false
              }
            }).catch((error) => {
              const errorMessage = `Error to get city from geolocation: ${error.response ? error.response.data.message : ''}`
              cityLoading.value = false
              showNotify('negative', errorMessage)
            })
          },
          () => {
            // Geolocation denied or error - silent fail
          }
        )
      }
    }

    const fetchAutocomplete = () => {
      if (!cityInput.value || cityInput.value.length < 3) {
        return
      }

      autocompleteLoading.value = true
      showAutocompleteMenu.value = true

      store.dispatch('callGetAutocomplete', cityInput.value)
        .then((response) => {
          autocompleteSuggestions.value = response.data
            .slice(0, 5)
            .map(item => ({
              name: item.address.name,
              country: item.address.country_code || item.address.country,
              fullText: `${item.address.name}, ${item.address.country_code || item.address.country}`
            }))
          autocompleteLoading.value = false
        })
        .catch((error) => {
          autocompleteLoading.value = false
          showAutocompleteMenu.value = false
          console.error('Autocomplete error:', error)
        })
    }

    const selectSuggestion = (suggestion) => {
      skipNextAutocomplete.value = true
      cityInput.value = suggestion.fullText
      showAutocompleteMenu.value = false
      autocompleteSuggestions.value = []
      selectedSuggestionIndex.value = -1
      handleSearch()
    }

    const clearInput = () => {
      cityInput.value = ''
      inputError.value = ''
      showAutocompleteMenu.value = false
      autocompleteSuggestions.value = []
      selectedSuggestionIndex.value = -1
      // Focus the input after clearing
      if (inputRef.value) {
        inputRef.value.focus()
      }
    }

    const handleFocus = () => {
      isInputFocused.value = true
      // Show suggestions if we have them
      if (cityInput.value && cityInput.value.length >= 3 && autocompleteSuggestions.value.length > 0) {
        showAutocompleteMenu.value = true
      }
    }

    const handleBlur = (event) => {
      // Check if the blur is caused by clicking inside the autocomplete dropdown
      const relatedTarget = event.relatedTarget
      if (relatedTarget && relatedTarget.closest('.autocomplete-dropdown')) {
        return
      }

      // Delay to allow click events on suggestions to fire
      setTimeout(() => {
        isInputFocused.value = false
        showAutocompleteMenu.value = false
        selectedSuggestionIndex.value = -1
      }, 150)
    }

    const handleKeydown = (event) => {
      // Escape - close autocomplete
      if (event.key === 'Escape') {
        showAutocompleteMenu.value = false
        selectedSuggestionIndex.value = -1
        return
      }

      // Only handle arrow keys and enter if autocomplete is open
      if (!showAutocompleteMenu.value || autocompleteSuggestions.value.length === 0) {
        return
      }

      const maxIndex = autocompleteSuggestions.value.length - 1

      // Arrow Down - move selection down
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (selectedSuggestionIndex.value < maxIndex) {
          selectedSuggestionIndex.value++
        } else {
          selectedSuggestionIndex.value = 0
        }
        return
      }

      // Arrow Up - move selection up
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (selectedSuggestionIndex.value > 0) {
          selectedSuggestionIndex.value--
        } else {
          selectedSuggestionIndex.value = maxIndex
        }
        return
      }

      // Enter - select current suggestion or search
      if (event.key === 'Enter') {
        if (selectedSuggestionIndex.value >= 0 && selectedSuggestionIndex.value <= maxIndex) {
          event.preventDefault()
          selectSuggestion(autocompleteSuggestions.value[selectedSuggestionIndex.value])
        }
        // If no selection, let the existing @keyup.enter handler work
      }
    }

    const showNotify = (type, message) => {
      $q.notify({
        type,
        message,
        position: 'bottom-right',
        timeout: 5000,
        closeBtn: 'Close me'
      })
    }

    const validateInput = () => {
      if (!cityInput.value) {
        inputError.value = ''
        return true
      }

      const result = validateCityInput(cityInput.value)
      if (result !== true) {
        inputError.value = result
        return false
      }

      inputError.value = ''
      return true
    }

    const handleSearch = () => {
      if (!validateInput()) {
        showNotify('negative', inputError.value)
        return
      }

      showAutocompleteMenu.value = false
      searchInProgress.value = true

      emit('search', cityInput.value, () => {
        searchInProgress.value = false
      })
    }

    return {
      inputRef,
      cityInput,
      inputError,
      isInputValid,
      cityLoading,
      searchInProgress,
      showAutocompleteMenu,
      autocompleteSuggestions,
      autocompleteLoading,
      selectedSuggestionIndex,
      xsBreakPoint,
      handleSearch,
      selectSuggestion,
      clearInput,
      handleFocus,
      handleBlur,
      handleKeydown
    }
  }
}
</script>

<style lang="scss" scoped>
.weather-search {
  width: 100%;

  /* Input field styles */
  :deep(.q-field) {
    // Remove margin/padding when focused or filled
    padding-bottom: 0 !important;

    .q-field__bottom {
      display: none;
    }
  }

  :deep(.q-field__control) {
    height: 2.75rem;
    min-height: 2.75rem;
    min-width: 20rem;
    // Fix border in dark mode - use theme border color
    border: 0.0625rem solid var(--border) !important;
    background-color: var(--surface) !important;

    &::before,
    &::after {
      // Remove Quasar default borders
      border: none !important;
    }
  }

  :deep(.q-field__label) {
    font-size: 0.9375rem;
  }

  :deep(.q-field__native) {
    font-size: 0.9375rem;
    // Center text vertically
    padding: 0 !important;
    height: 100%;
    display: flex;
    align-items: center;
    color: var(--text);

    &::placeholder {
      color: var(--text-muted);
    }
  }

  :deep(.q-field__append) {
    // Center icons vertically
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: 0.5rem;

    .q-icon {
      color: var(--text-muted);

      &:hover {
        color: var(--accent);
      }
    }
  }

  :deep(.q-field--filled .q-field__control) {
    border-radius: 0.75rem;
  }

  // Focus state
  :deep(.q-field--focused .q-field__control) {
    border-color: var(--accent) !important;
  }

  // Remove Quasar's blue highlight line
  :deep(.q-field--highlighted .q-field__control::after) {
    display: none !important;
  }

  :deep(.q-field__control::after) {
    display: none !important;
  }

  /* Search button styles */
  :deep(.q-btn) {
    height: 2.75rem;
    min-height: 2.75rem;
    padding: 0 1.25rem;
    border-radius: 0.75rem;

    .q-btn__content {
      font-size: 0.9375rem !important;
      font-weight: var(--font-weight-bold) !important;
      letter-spacing: 0.075rem !important;
      text-transform: uppercase !important;
    }
  }
}

.row {
  align-items: center;
  gap: 0.5rem;
}

.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: var(--surface);
  border: 0.0625rem solid var(--border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  margin-top: 0.25rem;
  max-height: 17.5rem;
  overflow-y: auto;

  .q-item {
    padding: 0.5rem 1rem;
    transition: background-color var(--transition-fast);

    &:hover {
      background-color: var(--bg);
    }
  }

  &__item--selected {
    background-color: var(--bg) !important;

    .body--dark & {
      background-color: rgba(255, 255, 255, 0.08) !important;
    }
  }

  :deep(.q-item__label) {
    font-size: 0.9375rem;
    color: var(--text);
  }

  :deep(.q-item__label--caption) {
    font-size: 0.8125rem;
    color: var(--text-muted);
  }
}
</style>
