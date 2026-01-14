import { ref, computed } from 'vue'

export function useInputValidation () {
  const inputValue = ref('')
  const inputError = ref('')

  // Reglas de validación
  const rules = {
    required: (val) => {
      return (val && val.length > 0) || 'Field is required'
    },

    minLength: (min) => (val) => {
      return (val && val.length >= min) || `Minimum ${min} characters required`
    },

    cityCountryFormat: (val) => {
      if (!val || val.length === 0) {
        return 'Field is required'
      }

      // Formato esperado: "City, Country" o "City, CC"
      // Ejemplos válidos:
      // - "Brussels, Belgium"
      // - "Brussels, BE"
      // - "San Francisco, US"
      // - "Mexico City, MX"

      const parts = val.split(',')

      if (parts.length < 2) {
        return 'Format should be: City, Country (e.g., "Brussels, BE")'
      }

      const city = parts[0].trim()
      const country = parts[1].trim()

      if (city.length === 0) {
        return 'City name cannot be empty'
      }

      if (country.length === 0) {
        return 'Country code cannot be empty'
      }

      // Validar que no contenga números en la ciudad
      if (/\d/.test(city)) {
        return 'City name should not contain numbers'
      }

      // Validar formato de país (2 letras o nombre completo)
      const isCountryCode = /^[A-Za-z]{2}$/.test(country)
      const isCountryName = /^[A-Za-z\s]+$/.test(country) && country.length >= 3

      if (!isCountryCode && !isCountryName) {
        return 'Country should be a 2-letter code (e.g., "BE") or full name (e.g., "Belgium")'
      }

      return true
    },

    noSpecialChars: (val) => {
      // Permitir solo letras, espacios, guiones y comas
      const regex = /^[a-zA-Z\s,-]+$/
      return regex.test(val) || 'Only letters, spaces, commas and hyphens are allowed'
    }
  }

  const validate = (value, validationRules) => {
    inputError.value = ''

    for (const rule of validationRules) {
      const result = rule(value)
      if (result !== true) {
        inputError.value = result
        return false
      }
    }

    return true
  }

  const validateCityInput = (value) => {
    return validate(value, [
      rules.required,
      rules.minLength(3),
      rules.cityCountryFormat,
      rules.noSpecialChars
    ])
  }

  const isValid = computed(() => {
    return inputError.value === ''
  })

  return {
    inputValue,
    inputError,
    isValid,
    rules,
    validate,
    validateCityInput
  }
}
