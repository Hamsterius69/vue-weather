<template>
  <GoogleMap api-key="AIzaSyBtOIFuiiLkLmMtwiVIUaTCd9-x1xZAGQY" style="width: 100%; height: 500px" :center="position" :zoom="5">
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
  }
})
</script>
