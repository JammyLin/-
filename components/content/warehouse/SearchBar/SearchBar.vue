<template>
  <div>
    <cata-list title="仓库状态" :list="list1" @li-click="stateClick" />
    <cata-list title="创建时间" :list="list2" @li-click="dateClick" />
    <date-picker v-show="isCustom" @confirm="confirmPick" />
  </div>
</template>

<script>
import CataList from '~/components/common/CataList/CataList'
import DatePicker from '~/components/common/DatePicker/DatePicker'
export default {
  name: 'SearchBar',
  components: { DatePicker, CataList },
  data() {
    return {
      list1: ['全部', '启用', '停用'],
      list2: ['全部', '今日', '一周', '一月', '一年', '自定义'],
      options: {
        state: 0,
        time: 0,
        date: []
      }
    }
  },
  computed: {
    isCustom() {
      return this.options.time === 5
    }
  },
  methods: {
    stateClick(index) {
      this.options.state = index
      this.$emit('search', this.options)
    },
    dateClick(index) {
      this.options.time = index
      if (index !== 5) this.$emit('search', this.options)
    },
    confirmPick(date) {
      this.options.time = 5
      this.options.date = date
      this.$emit('search', this.options)
    }
  }
}
</script>

<style lang="scss" scoped></style>
