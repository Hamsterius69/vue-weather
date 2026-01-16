<template>
  <q-page>
    <weather-form />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import WeatherForm from 'components/WeatherForm'

export default defineComponent({
  name: 'PageIndex',
  components: {
    WeatherForm
  }
})
</script>
