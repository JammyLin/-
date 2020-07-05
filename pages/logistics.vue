<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <top-bar
          title="物流订单"
          @show-search="getSearchVal"
          @add-item="handleItemAdd"
        >
          <search-bar @search="searchOption" />
        </top-bar>
        <v-data-table :headers="headers" :items="dispList" :search="search">
          <template v-slot:item.info="{ item }">
            <v-btn text color="primary" @click.stop="handleInfoShow(item)"
              >查看</v-btn
            >
          </template>
          <template v-slot:item.state="{ item }">
            <v-chip :color="getStateColor(item.state)" text-color="white" label
              >{{ getStateLabel(item.state) }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              v-if="isFinished(item.state)"
              small
              @click.stop="handleItemDelete(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
      <info-dialog ref="infoDialog" :info="logisticsInfo" />
      <item-dialog ref="itemDialog" @save="saveItem" />

      <delete-dialog ref="alertDialog" @confirm-delete="deleteItem" />
    </v-col>
  </v-row>
</template>

<script>
import TopBar from '~/components/common/TopBar/TopBar'
import DeleteDialog from '~/components/common/DeleteDialog/DeleteDialog'

import ItemDialog from '~/components/content/logistics/Dialog/ItemDialog'
import InfoDialog from '~/components/content/logistics/Dialog/InfoDialog'
import DateUtil from '~/assets/js/DateUtil'
import SearchBar from '~/components/content/logistics/SearchBar/SearchBar'

export default {
  name: 'Logistics',
  components: {
    SearchBar,
    TopBar,
    DeleteDialog,

    InfoDialog,
    ItemDialog
  },
  async asyncData({ $axios }) {
    const { logisticsList } = await $axios.$get('/api/logistics')
    const settlementLabel = ['现付', '到付']
    for (const index in logisticsList)
      logisticsList[index].settlement_text =
        settlementLabel[logisticsList[index].settlement_modes - 1]
    const dispList = logisticsList
    return { logisticsList, dispList }
  },
  data() {
    return {
      search: '',
      stateData: {},
      headers: [
        {
          text: '物流单号',
          value: 'tracking_no',
          align: 'start'
        },
        {
          text: '物流信息',
          value: 'info',
          filterable: false
        },
        {
          text: '结算方式',
          value: 'settlement_text',
          filterable: false
        },
        {
          text: '物流状态',
          value: 'state',
          filterable: false
        },
        {
          text: '备注',
          value: 'remark',
          filterable: false,
          sortable: false
        },
        {
          text: '操作',
          value: 'actions',
          sortable: false
        }
      ],
      logisticsList: [],
      dispList: [],
      logisticsInfo: {},
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
      this.$refs.itemDialog.show()
    },
    handleItemDelete(item) {
      this.editedIndex = this.logisticsList.indexOf(item)
      this.$refs.alertDialog.show()
    },
    handleInfoShow(item) {
      this.logisticsInfo = item
      this.$refs.infoDialog.show()
    },
    /*
       以下为数据处理事件
       */
    async saveItem(item) {
      await this.$axios.$post('/api/logistics', item).then((res) => {
        if (res.code === 200) {
          const instance = res.instance
          instance.goods = res.goods
          instance.settlement_text =
            item.settlement_modes === 1 ? '现付' : '到付'
          this.logisticsList.unshift(instance)
          this.$notify({ text: res.msg, type: 'success' })
        } else this.$notify({ text: res.msg, type: 'error' })
      })
      this.filter()
    },
    async deleteItem() {
      await this.$axios
        .$delete(`/api/logistics?id=${this.logisticsList[this.editedIndex].id}`)
        .then((res) => {
          if (res.code === 200) {
            this.logisticsList.splice(this.editedIndex, 1)
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      this.filter()
    },
    getStateLabel(state) {
      if (state === 0) return '待揽收'
      else if (state === 1) return '运输中'
      else return '已签收'
    },
    getStateColor(state) {
      if (state === 0) return 'orange'
      else if (state === 1) return 'primary'
      else return 'success'
    },
    getSearchVal(search) {
      this.search = search
    },
    searchOption(option) {
      this.option = option
      this.filter()
    },
    filter() {
      let tmpList = this.logisticsList
      if (this.option.settlementModes)
        tmpList = tmpList.filter(
          (v) => v.settlement_modes === this.option.settlementModes
        )
      if (this.option.state)
        tmpList = tmpList.filter((v) => v.state === this.option.state - 1)
      if (this.option.time)
        tmpList = DateUtil.dateFilter(
          this.option.time,
          this.option.date,
          tmpList
        )
      this.dispList = tmpList
    },
    isFinished(state) {
      return state === 2
    }
  }
}
</script>

<style scoped></style>
