<template>
  <div>
    <cata-list title="操作对象" :list="list1" @li-click="objectClick" />
    <cata-list title="操作类型" :list="list2" @li-click="actionClick" />
    <cata-list title="创建时间" :list="list3" @li-click="dateClick" />
    <date-picker v-show="isCustom" @confirm="confirmPick" />
  </div>
</template>

<script>
import CataList from '~/components/common/CataList/CataList'
import DatePicker from '~/components/common/DatePicker/DatePicker'
export default {
  name: 'OpLogSearchBar',
  components: { DatePicker, CataList },
  data() {
    return {
      list1: ['全部', '仓库', '库区', '物流订单', '出入订单', '用户', '车辆'],
      list2: ['全部', '添加', '更新', '删除', '激活', '调整'],
      list3: ['全部', '今日', '一周', '一月', '一年', '自定义'],
      options: {
        object: 0,
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
    objectClick(index) {
      this.options.object = index
      this.$emit('search', this.options)
    },
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

<style lang="scss" scoped></style>
