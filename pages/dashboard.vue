<template>
  <div>
    <top-cards :role-type="getRoleType" :data="data" />
    <to-do-list :role-type="getRoleType" :todo="todo" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TopCards from '~/components/content/dashboard/TopCards'
import ToDoList from '~/components/content/dashboard/ToDoList'
export default {
  name: 'DashBoard',
  components: { ToDoList, TopCards },
  async asyncData({ $axios }) {
    const { data, todo } = await $axios.$get('/api/dashboard')
    return { data, todo }
  },
  data() {
    return {
      data: [],
      todo: []
    }
  },
  computed: {
    ...mapGetters(['getRoleType'])
  }
}
</script>

<style scoped></style>
