<template>
  <div>
    <item-list
      title="派送车辆"
      :list="list1"
      item-text="vehicle_no"
      @item-click="vehicleClick"
    />
    <cata-list title="快递状态" :list="list2" @li-click="stateClick" />
    <cata-list title="创建时间" :list="list3" @li-click="dateClick" />
    <date-picker v-show="isCustom" @confirm="confirmPick" />
  </div>
</template>

<script>
import ItemList from '~/components/common/ItemList/ItemList'
import CataList from '~/components/common/CataList/CataList'
import DatePicker from '~/components/common/DatePicker/DatePicker'
export default {
  name: 'AssignSearchBar',
  components: { ItemList, DatePicker, CataList },
  data() {
    return {
      list1: [],
      list2: [
        '全部',
        '待揽收',
        '待中转',
        '待派送',
        '揽收中',
        '中转中',
        '派送中',
        '已完成'
      ],
      list3: ['全部', '今日', '一周', '一月', '一年', '自定义'],
      options: {
        vehicle: 0,
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
  async mounted() {
    const { vehicleList } = await this.$axios.$get('/api/vehicle')
    for (const vehicle of vehicleList) {
      vehicle.vehicle_no += `(${vehicle.user.real_name})`
      this.list1.push({
        vehicle_no: vehicle.vehicle_no,
        id: vehicle.id
      })
    }
    this.list1.push({
      vehicle_no: '所有',
      id: 0
    })
    this.list1.sort((a, b) => a.id - b.id)
  },
  methods: {
    vehicleClick(id) {
      this.options.vehicle = id
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
