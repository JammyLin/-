<template>
  <div>
    <cata-list
      title="结算方式"
      :list="list1"
      @li-click="settlementModesClick"
    />
    <cata-list title="物流状态" :list="list2" @li-click="stateClick" />
    <cata-list title="创建时间" :list="list3" @li-click="dateClick" />
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
      list1: ['全部', '现付', '到付'],
      list2: ['全部', '待揽收', '运输中', '已签收'],
      list3: ['全部', '今日', '一周', '一月', '一年', '自定义'],
      options: {
        settlementModes: 0,
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
    settlementModesClick(index) {
      this.options.settlementModes = index
      this.$emit('search', this.options)
    },
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
