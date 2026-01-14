<template>
  <q-table
    title="Historical weather information"
    :rows="rows"
    :columns="columns"
    row-key="name"
    :loading="loading"
  />
</template>

<script>
import { ref, onBeforeMount } from 'vue'

export default {
  name: 'WeatherHistoricalTable',
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
        name: 'temperature',
        align: 'left',
        label: 'Temperature',
        field: 'temperature'
      })
      columns.value.push({
        name: 'main',
        align: 'left',
        label: 'Main',
        field: 'main'
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
