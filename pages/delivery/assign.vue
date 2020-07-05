<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <top-bar title="快递分配" :add-btn="false" @show-search="getSearchVal">
          <assign-search-bar @search="searchOption" />
        </top-bar>
        <div class="d-inline-flex btn-list">
          <v-btn
            text
            tile
            small
            :disabled="isLegal"
            @click.stop="handleWorkAssign"
            ><v-icon small>mdi-clipboard-list-outline</v-icon>分配</v-btn
          >
          <v-btn text tile small :disabled="isEmpty" @click="cancel"
            ><v-icon small>mdi-cancel</v-icon>取消</v-btn
          >
        </div>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="dispList"
          :search="search"
          show-select
        >
          <template v-slot:item.state="{ item }">
            <v-chip :color="getStateColor(item.state)" text-color="white" label
              >{{ getStateLabel(item.state) }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              v-if="isUnfinished(item.vehicle_no)"
              small
              class="mr-2"
              @click.stop="handleSingleWorkAssign(item)"
            >
              mdi-truck-fast-outline
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
    <assign-dialog ref="assignDialog" @confirm-assign="assign" />
  </v-row>
</template>

<script>
import TopBar from '~/components/common/TopBar/TopBar'
import AssignDialog from '~/components/content/delivery/Dialog/AssignDialog'
import DateUtil from '~/assets/js/DateUtil'
import AssignSearchBar from '~/components/content/delivery/SearchBar/AssignSearchBar'

export default {
  name: 'Assign',
  components: {
    AssignSearchBar,
    TopBar,
    AssignDialog
  },
  async asyncData({ $axios }) {
    const { deliveryList } = await $axios.$get('/api/delivery')
    for (const index in deliveryList) {
      deliveryList[
        index
      ].tracking_no = `${deliveryList[index].logistics.tracking_no}`
      if (deliveryList[index].vehicle)
        deliveryList[
          index
        ].vehicle_no = `${deliveryList[index].vehicle.vehicle_no}`
      else deliveryList[index].vehicle_no = '无'
      if (deliveryList[index].user)
        deliveryList[
          index
        ].real_name = `${deliveryList[index].user.real_name}(${deliveryList[index].user.account})`
      else deliveryList[index].real_name = '无'
    }
    const dispList = deliveryList
    return { deliveryList, dispList }
  },
  data() {
    return {
      search: '',
      selected: [],
      headers: [
        {
          text: '物流单号',
          value: 'tracking_no',
          align: 'start'
        },
        {
          text: '快递状态',
          value: 'state',
          filterable: false
        },
        {
          text: '车辆编号',
          value: 'vehicle_no'
        },
        {
          text: '快递员信息',
          value: 'real_name'
        },
        {
          text: '操作',
          value: 'actions',
          sortable: false
        }
      ],
      deliveryList: [],
      dispList: [],
      option: {}
    }
  },
  computed: {
    isEmpty() {
      return this.selected.length === 0
    },
    isLegal() {
      return !this.selected.length || this.selected.some((v) => v.vehicle_id)
    }
  },
  methods: {
    /*
         handle函数为按钮点击事件
         不处理数据
         */
    handleSingleWorkAssign(item) {
      this.selected = []
      this.selected.push(item)
      this.$refs.assignDialog.show()
    },
    handleWorkAssign() {
      this.$refs.assignDialog.show()
    },
    /*
         以下为数据处理事件
         */
    async assign(vehicleInfo) {
      if (!vehicleInfo.user) {
        this.$notify({ text: '车辆暂未分配快递员，请重新选择', type: 'error' })
        return
      }
      await this.$axios
        .$post('/api/delivery/assign', {
          selected: this.selected,
          vehicle_id: vehicleInfo.id,
          user_id: vehicleInfo.user.id
        })
        .then((res) => {
          if (res.code === 200) {
            this.changeOriginalValue(vehicleInfo.vehicle_no, vehicleInfo.user)
            this.selected = []
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      this.filter()
    },
    cancel() {
      this.selected = []
    },
    changeOriginalValue(vehicleNo, user) {
      this.selected.sort((a, b) => b.id - a.id)
      let i = 0
      let j = 0
      while (j < this.selected.length) {
        if (this.deliveryList[i].id === this.selected[j].id) {
          this.deliveryList[i].vehicle_no = vehicleNo
          this.deliveryList[i].real_name = `${user.real_name}(${user.account})`
          this.deliveryList[i].state += 3
          j++
        } else i++
      }
    },
    /*
    数据获取事件
     */
    getStateLabel(state) {
      switch (state) {
        case 1:
          return '待揽收'
        case 2:
          return '待中转'
        case 3:
          return '待派送'
        case 4:
          return '揽收中'
        case 5:
          return '中转中'
        case 6:
          return '派送中'
        case 7:
          return '揽收完成'
        case 8:
          return '中转完成'
        case 9:
          return '派送完成'
      }
    },
    getStateColor(state) {
      switch (state) {
        case 1:
        case 2:
        case 3:
          return 'orange'
        case 4:
        case 5:
        case 6:
          return 'primary'
        default:
          return 'success'
      }
    },
    getSearchVal(search) {
      this.search = search
    },
    searchOption(option) {
      this.option = option
      this.filter()
    },
    filter() {
      let tmpList = this.deliveryList
      if (this.option.vehicle)
        tmpList = tmpList.filter((v) => v.vehicle_id === this.option.vehicle)
      if (this.option.state)
        tmpList = tmpList.filter((v) => v.state === this.option.state % 7)
      if (this.option.time)
        tmpList = DateUtil.dateFilter(
          this.option.time,
          this.option.date,
          tmpList
        )
      this.dispList = tmpList
    },
    isUnfinished(vehicleNo) {
      return vehicleNo === '无'
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-list {
  margin-left: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  & > .v-btn:not(:first-child) {
    border-left: 1px solid #dcdfe6;
  }
}
</style>
