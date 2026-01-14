<template>
  <div class="q-pt-lg">
    <div class="row justify-center">
      <q-input
        :class="$q.screen.width >= xsBreakPoint ? 'col-4' && 'q-mr-md' : ''"
        dense
        v-on:keyup.enter="handleSearch"
        style="max-height=10"
        :loading='cityLoading'
        filled
        v-model="cityInput"
        label="City, Country code"
        hint="Format: City, Country (e.g., Brussels, BE)"
        :error="!isInputValid"
        :error-message="inputError"
        @blur="validateInput"
        lazy-rules
      >
        <template v-slot:append>
          <q-icon name="las la-search" />
        </template>
      </q-input>
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
    const xsBreakPoint = computed(() => store.state.weather.xsBreakPoint)

    const isInputValid = computed(() => {
      return inputError.value === ''
    })

    onBeforeMount(() => {
      loadCity()
    })

    watch(cityInput, (currentValue) => {
      if (currentValue.length % 3 === 0 && currentValue.length && autocompleteAvailable.value) {
        showAutocomplete()
      }
      autocompleteAvailable.value = true
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

    const showAutocomplete = () => {
      store.dispatch('callGetAutocomplete', cityInput.value).then((response) => {
        const size = response.data.length / 3
        for (let i = 0; i < size; i += 1) {
          const message = `You mean... ${response.data[i].address.name}, ${response.data[i].address.country_code}?`
          $q.notify({
            color: 'purple',
            message: message,
            position: 'top-right',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
            timeout: 6000,
            actions: [{
              label: 'You right',
              color: 'white',
              handler: () => {
                $q.notify({
                  color: 'green',
                  icon: 'las la-smile-wink',
                  iconSize: '50px',
                  position: 'center',
                  timeout: 3000
                })
                autocompleteAvailable.value = false
                cityInput.value = `${response.data[i].address.name}, ${response.data[i].address.country_code}`
                handleSearch()
              }
            }]
          })
        }
      })
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
      xsBreakPoint,
      handleSearch,
      validateInput
    }
  }
}
</script>
