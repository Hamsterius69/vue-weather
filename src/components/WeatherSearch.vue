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
          label="City, Country code"
          :error="!isInputValid"
          :error-message="inputError || undefined"
          lazy-rules
          hide-bottom-space
          class="weather-search__input"
          @keyup.enter="handleSearch"
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
              skipNextAutocomplete.value = true
              cityInput.value = `${response.data.address.city}, ${response.data.address.country_code}`
              cityLoading.value = false
              emit('city-loaded', cityInput.value)
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
      handleSearch()
    }

    const clearInput = () => {
      cityInput.value = ''
      inputError.value = ''
      showAutocompleteMenu.value = false
      autocompleteSuggestions.value = []
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
      }, 150)
    }

    const showNotify = (type, message) => {
      $q.notify({
        type,
        message,
        position: 'top-right',
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
      xsBreakPoint,
      handleSearch,
      selectSuggestion,
      clearInput,
      handleFocus,
      handleBlur
    }
  }
}
</script>

<style lang="scss" scoped>
.weather-search {
  width: 100%;

  :deep(.q-field__control) {
    height: 60px;
    min-height: 60px;
  }

  :deep(.q-btn) {
    height: 60px;
  }
}

.row {
  align-items: center;
}

.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;

  .q-item {
    transition: background-color var(--transition-fast);

    &:hover {
      background-color: var(--bg);
    }
  }
}
</style>
