<template>
  <div>
    <cata-list title="操作类型" :list="list1" @li-click="actionClick" />
    <cata-list title="创建时间" :list="list2" @li-click="dateClick" />
    <date-picker v-show="isCustom" @confirm="confirmPick" />
  </div>
</template>

<script>
import DatePicker from '~/components/common/DatePicker/DatePicker'
import CataList from '~/components/common/CataList/CataList'

export default {
  name: 'UserLogSearchBar',
  components: { DatePicker, CataList },
  data() {
    return {
      list1: ['全部', '登录', '退出'],
      list2: ['全部', '今日', '一周', '一月', '一年', '自定义'],
      options: {
        action: 0,
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
    actionClick(index) {
      this.options.action = index
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

<style scoped></style>
