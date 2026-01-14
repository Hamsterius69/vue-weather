<template>
  <q-table
    title="Forecast weather information"
    :rows="rows"
    :columns="columns"
    row-key="name"
    :loading="loading"
  />
</template>

<script>
import { ref, onBeforeMount } from 'vue'

export default {
  name: 'WeatherForecastTable',
  props: {
    rows: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  setup () {
    const columns = ref([])

    onBeforeMount(() => {
      columns.value.push({
        name: 'date',
        align: 'left',
        label: 'Date',
        field: 'date',
        sortable: true
      })
      columns.value.push({
        name: 'temperatureDay',
        align: 'left',
        label: 'Temperature day',
        field: 'temperatureDay'
      })
      columns.value.push({
        name: 'temperatureMin',
        align: 'left',
        label: 'Temperature min',
        field: 'temperatureMin'
      })
      columns.value.push({
        name: 'temperatureMax',
        align: 'left',
        label: 'Temperature max',
        field: 'temperatureMax'
      })
      columns.value.push({
        name: 'description',
        align: 'left',
        label: 'Description',
        field: 'description'
      })
    })

    return {
      columns
    }
  }
}
</script>
