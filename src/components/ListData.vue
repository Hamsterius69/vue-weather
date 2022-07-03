<template>
  <div v-for="(item, index) in listData" :key="index" class="row q-my-md">
    <q-icon :name="item.icon" :size="$q.screen.width >= xsBreakPoint ? '32px' : '24px'"/>
    <div :class="$q.screen.width >= xsBreakPoint ? 'text-h6' : 'text-weight-bold'"> {{ item.title }} </div>
    <div :class="$q.screen.width >= xsBreakPoint ? 'text-body1 q-pl-sm q-pt-xs': 'text-weight-light q-pl-sm'"> {{ item.response }} </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ListData',
  props: {
    listData: {
      type: Array,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const xsBreakPoint = computed(() => store.state.weather.xsBreakPoint)
    return { xsBreakPoint }
  }
})
</script>
