import { ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'

export function useTheme () {
  const $q = useQuasar()
  const isDark = ref(false)
  const weatherCondition = ref('sunny') // sunny, cloudy, rainy, snowy

  // Initialize theme from localStorage or system preference
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // Check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    // Apply theme
    applyTheme()
  })

  // Watch for theme changes
  watch(isDark, () => {
    applyTheme()
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  })

  // Watch for weather condition changes
  watch(weatherCondition, () => {
    applyWeatherCondition()
  })

  const applyTheme = () => {
    // Set Quasar dark mode
    $q.dark.set(isDark.value)

    // Set data attribute for CSS
    if (isDark.value) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  const applyWeatherCondition = () => {
    document.documentElement.setAttribute('data-weather', weatherCondition.value)
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  /**
   * Determina la condición del clima basado en el código de OpenWeatherMap
   * @param {string} weatherMain - El campo "main" de la API (Clear, Clouds, Rain, Snow, etc.)
   * @param {string} weatherDescription - Descripción detallada
   * @returns {string} - sunny, cloudy, rainy, snowy
   */
  const setWeatherCondition = (weatherMain, weatherDescription = '') => {
    const main = (weatherMain || '').toLowerCase()
    const description = (weatherDescription || '').toLowerCase()

    if (main === 'clear') {
      weatherCondition.value = 'sunny'
    } else if (main === 'clouds') {
      weatherCondition.value = 'cloudy'
    } else if (main === 'rain' || main === 'drizzle' || main === 'thunderstorm') {
      weatherCondition.value = 'rainy'
    } else if (main === 'snow') {
      weatherCondition.value = 'snowy'
    } else if (description.includes('mist') || description.includes('fog')) {
      weatherCondition.value = 'cloudy'
    } else {
      // Default
      weatherCondition.value = 'sunny'
    }

    return weatherCondition.value
  }

  return {
    isDark,
    weatherCondition,
    toggleTheme,
    setWeatherCondition
  }
}
