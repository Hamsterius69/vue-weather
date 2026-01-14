<template>
  <div class="q-pt-lg">
    <div class="row justify-center">
      <div :class="$q.screen.width >= xsBreakPoint ? 'col-4' && 'q-mr-md' : 'col-12'" style="position: relative;">
        <q-input
          dense
          v-on:keyup.enter="handleSearch"
          style="max-height=10"
          :loading='cityLoading'
          filled
          v-model="cityInput"
          label="City, Country code"
          hint="Format: City, Country (e.g., Brussels, BE)"
          :error="!isInputValid"
          :error-message="inputError || undefined"
          @blur="handleBlur"
          @focus="handleFocus"
          lazy-rules
        >
          <template v-slot:append>
            <q-icon name="las la-search" />
          </template>
        </q-input>

        <!-- Autocomplete dropdown tradicional -->
        <q-menu
          v-model="showAutocompleteMenu"
          fit
          no-parent-event
          :offset="[0, 8]"
        >
          <q-list style="min-width: 300px">
            <q-item
              v-for="(suggestion, index) in autocompleteSuggestions"
              :key="index"
              clickable
              v-close-popup
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
              <q-item-section>
                <q-spinner color="primary" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Loading suggestions...</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="!autocompleteLoading && autocompleteSuggestions.length === 0">
              <q-item-section>
                <q-item-label caption>No suggestions found</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>

      <q-btn
        :loading="searchInProgress"
        color="primary"
        label="Check weather"
        size="md"
        @click="handleSearch"
        :disabled="!cityInput"
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
import { ref, watch, onBeforeMount, computed } from 'vue'
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

    const cityInput = ref('')
    const inputError = ref('')
    const cityLoading = ref(false)
    const searchInProgress = ref(false)
    const autocompleteAvailable = ref(false)
    const showAutocompleteMenu = ref(false)
    const autocompleteSuggestions = ref([])
    const autocompleteLoading = ref(false)
    const isInputFocused = ref(false)
    const xsBreakPoint = computed(() => store.state.weather.xsBreakPoint)

    const isInputValid = computed(() => {
      return inputError.value === ''
    })

    onBeforeMount(() => {
      loadCity()
    })

    let autocompleteTimeout = null

    watch(cityInput, (currentValue) => {
      // Limpiar timeout anterior
      if (autocompleteTimeout) {
        clearTimeout(autocompleteTimeout)
      }

      // Si el input está vacío, cerrar el menú
      if (!currentValue || currentValue.length < 3) {
        showAutocompleteMenu.value = false
        autocompleteSuggestions.value = []
        return
      }

      // Debounce de 500ms para no hacer demasiadas peticiones
      autocompleteTimeout = setTimeout(() => {
        if (autocompleteAvailable.value && isInputFocused.value) {
          fetchAutocomplete()
        }
        autocompleteAvailable.value = true
      }, 500)
    })

    const loadCity = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          cityLoading.value = true
          store.dispatch('callGetCity', {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }).then((response) => {
            cityInput.value = `${response.data.address.city}, ${response.data.address.country_code}`
            cityLoading.value = false
            emit('city-loaded', cityInput.value)
          }).catch((error) => {
            const errorMessage = `Error to get city from geolocation: ${error.response ? error.response.data.message : ''}`
            cityLoading.value = false
            showNotify('negative', errorMessage)
          })
        })
      } else {
        showNotify('info', 'please to have a better user experience allow the browser to use your location')
      }
    }

    const fetchAutocomplete = () => {
      if (!cityInput.value || cityInput.value.length < 3) {
        return
      }

      autocompleteLoading.value = true
      showAutocompleteMenu.value = true

      store.dispatch('callGetAutocomplete', cityInput.value).then((response) => {
        autocompleteSuggestions.value = []

        // Limitar a 5 sugerencias
        const maxSuggestions = Math.min(5, response.data.length)

        for (let i = 0; i < maxSuggestions; i += 1) {
          const suggestion = {
            name: response.data[i].address.name,
            country: response.data[i].address.country_code || response.data[i].address.country,
            fullText: `${response.data[i].address.name}, ${response.data[i].address.country_code || response.data[i].address.country}`
          }
          autocompleteSuggestions.value.push(suggestion)
        }

        autocompleteLoading.value = false
      }).catch((error) => {
        autocompleteLoading.value = false
        showAutocompleteMenu.value = false
        console.error('Autocomplete error:', error)
      })
    }

    const selectSuggestion = (suggestion) => {
      autocompleteAvailable.value = false
      cityInput.value = suggestion.fullText
      showAutocompleteMenu.value = false
      // Buscar automáticamente al seleccionar
      handleSearch()
    }

    const handleFocus = () => {
      isInputFocused.value = true
      // Si ya hay sugerencias y hay texto, mostrar el menú
      if (cityInput.value && cityInput.value.length >= 3 && autocompleteSuggestions.value.length > 0) {
        showAutocompleteMenu.value = true
      }
    }

    const handleBlur = () => {
      // Delay para permitir que el click en una sugerencia se registre
      setTimeout(() => {
        isInputFocused.value = false
        validateInput()
      }, 200)
    }

    const showNotify = (type, message) => {
      $q.notify({
        type: type,
        message: message,
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
      // Validar antes de buscar
      if (!validateInput()) {
        showNotify('negative', inputError.value)
        return
      }

      // Cerrar menú de autocomplete
      showAutocompleteMenu.value = false

      searchInProgress.value = true
      emit('search', cityInput.value, () => {
        searchInProgress.value = false
      })
    }

    return {
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
      validateInput,
      selectSuggestion,
      handleFocus,
      handleBlur
    }
  }
}
</script>
