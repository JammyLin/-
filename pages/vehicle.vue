<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <top-bar
          title="车辆信息"
          @show-search="getSearchVal"
          @add-item="handleItemAdd"
        >
          <search-bar @search="searchOption" />
        </top-bar>
        <v-data-table :headers="headers" :items="dispList" :search="search">
          <template v-slot:item.state="{ item }">
            <v-chip :color="getStateColor(item.state)" text-color="white" label
              >{{ getStateText(item.state) }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small @click.stop="handleItemEdit(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click.stop="handleItemDelete(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card>

      <delete-dialog ref="alertDialog" @confirm-delete="deleteItem" />
      <item-dialog
        ref="itemDialog"
        :item="formData"
        :index="editedIndex"
        @save="saveItem"
      />
    </v-col>
  </v-row>
</template>

<script>
import TopBar from '~/components/common/TopBar/TopBar'
import DeleteDialog from '~/components/common/DeleteDialog/DeleteDialog'

import ItemDialog from '~/components/content/vehicle/Dialog/ItemDialog'
import DateUtil from '~/assets/js/DateUtil'
import SearchBar from '~/components/content/vehicle/SearchBar/SearchBar'

export default {
  name: 'Vehicle',
  components: {
    SearchBar,
    TopBar,
    DeleteDialog,

    ItemDialog
  },
  async asyncData({ $axios }) {
    const { vehicleList } = await $axios.$get('/api/vehicle')
    for (const index in vehicleList)
      if (vehicleList[index].user)
        vehicleList[
          index
        ].real_name = `${vehicleList[index].user.real_name}(${vehicleList[index].user.account})`
      else vehicleList[index].real_name = '无'
    const dispList = vehicleList
    return { vehicleList, dispList }
  },
  data() {
    return {
      search: '',
      headers: [
        {
          text: '车牌号',
          value: 'vehicle_no',
          align: 'start'
        },
        {
          text: '车辆主人',
          value: 'real_name'
        },
        {
          text: '车辆状态',
          value: 'state',
          filterable: false
        },
        {
          text: '操作',
          value: 'actions',
          sortable: false
        }
      ],
      formData: {},
      vehicleList: [],
      dispList: [],
      editedIndex: -1,
      option: {}
    }
  },
  methods: {
    /*
         handle函数为按钮点击事件
         不处理数据
         */
    handleItemAdd() {
      this.editedIndex = -1
      this.formData = {}
      this.$refs.itemDialog.show()
    },
    handleItemEdit(item) {
      this.editedIndex = this.vehicleList.indexOf(item)
      this.formData = Object.assign({}, item)
      this.$refs.itemDialog.show()
    },
    handleItemDelete(item) {
      this.editedIndex = this.vehicleList.indexOf(item)
      this.$refs.alertDialog.show()
    },
    /*
         以下为数据处理事件
         */
    // editedIndex -1为创建，其他值为更新
    async saveItem(item) {
      if (this.editedIndex === -1) {
        item.state = 0
        await this.$axios.$post('/api/vehicle', item).then((res) => {
          if (res.code === 200) {
            res.instance.real_name = item.real_name
            this.vehicleList.unshift(res.instance)
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      } else {
        await this.$axios.$put('/api/vehicle', item).then((res) => {
          if (res.code === 200) {
            Object.assign(this.vehicleList[this.editedIndex], item)
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      }
      this.filter()
    },
    async deleteItem() {
      await this.$axios
        .$delete(`/api/vehicle?id=${this.vehicleList[this.editedIndex].id}`)
        .then((res) => {
          if (res.code === 200) {
            this.vehicleList.splice(this.editedIndex, 1)
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      this.filter()
    },
    getStateText(state) {
      if (state === 0) return '使用中'
      else return '维修中'
    },
    getStateColor(state) {
      if (state === 0) return 'primary'
      else return 'orange'
    },
    getSearchVal(search) {
      this.search = search
    },
    searchOption(option) {
      this.option = option
      this.filter()
    },
    filter() {
      let tmpList = this.vehicleList
      if (this.option.state)
        tmpList = tmpList.filter((v) => v.state === this.option.state - 1)
      if (this.option.time)
        tmpList = DateUtil.dateFilter(
          this.option.time,
          this.option.date,
          tmpList
        )
      this.dispList = tmpList
    }
  }
}
</script>

<style scoped></style>
