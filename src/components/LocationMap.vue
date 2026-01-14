<template>
  <GoogleMap :api-key="googleMapsApiKey" style="width: 100%; height: 500px" :center="position" :zoom="5">
    <Marker :options="{ position: position }" />
  </GoogleMap>
</template>

<script>
import { defineComponent } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'

export default defineComponent({
  name: 'LocationMap',
  components: { GoogleMap, Marker },
  props: {
    position: {
      type: Object,
      required: true
    }
  },
  setup () {
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!googleMapsApiKey) {
      console.error('GOOGLE_MAPS_API_KEY is not defined in environment variables')
    }

    return {
      googleMapsApiKey
    }
  }
})
</script>
