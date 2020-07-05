<template>
  <div>
    <item-list
      v-if="getRoleType === 4"
      title="所属仓库"
      :list="list1"
      item-text="warehouse_name"
      @item-click="warehouseClick"
    />
    <cata-list title="用户类型" :list="list2" @li-click="userTypeClick" />
    <cata-list title="创建时间" :list="list3" @li-click="dateClick" />
    <date-picker v-show="isCustom" @confirm="confirmPick" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CataList from '~/components/common/CataList/CataList'
import DatePicker from '~/components/common/DatePicker/DatePicker'
import ItemList from '~/components/common/ItemList/ItemList'
export default {
  name: 'SearchBar',
  components: { ItemList, DatePicker, CataList },
  data() {
    return {
      list1: [],
      list2: ['全部', '快递员', '快递管理员', '上级管理员', '超级管理员'],
      list3: ['全部', '今日', '一周', '一月', '一年', '自定义'],
      options: {
        warehouse: 0,
        userType: 0,
        time: 0,
        date: []
      }
    }
  },
  computed: {
    ...mapGetters(['getRoleType']),
    isCustom() {
      return this.options.time === 5
    }
  },
  async mounted() {
    const { warehouseList } = await this.$axios.$get(
      '/api/warehouse?format=true'
    )
    for (const warehouse of warehouseList)
      this.list1.push({
        warehouse_name: warehouse.warehouse_name,
        id: warehouse.id
      })
    this.list1.push({
      warehouse_name: '所有',
      id: 0
    })
    this.list1.sort((a, b) => a.id - b.id)
  },
  methods: {
    warehouseClick(id) {
      this.options.warehouse = id
      this.$emit('search', this.options)
    },
    userTypeClick(index) {
      this.options.userType = index
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
