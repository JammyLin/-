<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <top-bar title="出入订单" :add-btn="false" @show-search="getSearchVal">
          <search-bar @search="searchOption" />
        </top-bar>
        <div class="d-inline-flex btn-list">
          <v-btn
            text
            tile
            small
            :disabled="isLegal"
            @click.stop="handleSelectedTransfer"
            ><v-icon small>mdi-transfer</v-icon>中转</v-btn
          >
          <v-btn
            text
            tile
            small
            :disabled="isLegal"
            @click.stop="handleSelectedDistribute"
            ><v-icon small>mdi-cube-send</v-icon>派送</v-btn
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
              v-if="!isOut(item.state)"
              small
              @click.stop="handleSingleTransfer(item)"
            >
              mdi-transfer
            </v-icon>
            <v-icon
              v-if="!isOut(item.state)"
              small
              @click.stop="handleSingleDistribute(item)"
            >
              mdi-cube-send
            </v-icon>
            <v-icon
              v-if="isOut(item.state)"
              small
              @click.stop="handleItemDelete(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
      <delete-dialog ref="alertDialog" @confirm-delete="deleteItem" />
      <transfer-dialog ref="transferDialog" @confirm-transfer="transfer" />
      <distribute-dialog
        ref="distributeDialog"
        @confirm-distribute="distribute"
      />
    </v-col>
  </v-row>
</template>

<script>
import TopBar from '~/components/common/TopBar/TopBar'
import DeleteDialog from '~/components/common/DeleteDialog/DeleteDialog'

import TransferDialog from '~/components/content/storage/Dialog/TransferDialog'
import DistributeDialog from '~/components/content/storage/Dialog/DistributeDialog'
import DateUtil from '~/assets/js/DateUtil'
import SearchBar from '~/components/content/storage/SearchBar/SearchBar'

export default {
  name: 'Storage',
  components: {
    SearchBar,
    TopBar,
    DeleteDialog,

    TransferDialog,
    DistributeDialog
  },
  async asyncData({ $axios }) {
    const { storageList } = await $axios.$get('/api/storage')
    for (const index in storageList)
      storageList[
        index
      ].tracking_no = `${storageList[index].logistics.tracking_no}`
    const dispList = storageList
    return { storageList, dispList }
  },
  data() {
    return {
      search: '',
      stateData: {},
      selected: [],
      headers: [
        {
          text: '出入单号',
          value: 'storage_no',
          align: 'start'
        },
        {
          text: '物流单号',
          value: 'tracking_no'
        },
        {
          text: '出入状态',
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
      storageList: [],
      dispList: [],
      editedIndex: -1,
      option: {}
    }
  },
  computed: {
    isEmpty() {
      return this.selected.length === 0
    },
    isLegal() {
      return !this.selected.length || this.selected.some((v) => v.state === 1)
    }
  },
  methods: {
    /*
       handle函数为按钮点击事件
       不发送请求
       */
    handleItemDelete(item) {
      this.editedIndex = this.storageList.indexOf(item)
      this.$refs.alertDialog.show()
    },
    handleSingleTransfer(item) {
      this.selected = []
      this.selected.push(item)
      this.$refs.transferDialog.show()
    },
    handleSingleDistribute(item) {
      this.selected = []
      this.selected.push(item)
      this.$refs.distributeDialog.show()
    },
    handleSelectedTransfer() {
      this.$refs.transferDialog.show()
    },
    handleSelectedDistribute() {
      this.$refs.distributeDialog.show()
    },
    /*
       以下为数据处理事件
       */
    async deleteItem() {
      await this.$axios
        .$delete(`/api/storage?id=${this.storageList[this.editedIndex].id}`)
        .then((res) => {
          if (res.code === 200) {
            this.storageList.splice(this.editedIndex, 1)
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      this.filter()
    },
    async transfer(id) {
      await this.$axios
        .$post('/api/storage/transfer', {
          selected: this.selected,
          warehouseId: id
        })
        .then((res) => {
          if (res.code === 200) {
            this.changeOriginalValue()
            this.selected = []
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      this.filter()
    },
    async distribute() {
      await this.$axios
        .$post('/api/storage/distribute', {
          selected: this.selected
        })
        .then((res) => {
          if (res.code === 200) {
            this.changeOriginalValue()
            this.selected = []
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      this.filter()
    },
    cancel() {
      this.selected = []
    },
    changeOriginalValue() {
      this.selected.sort((a, b) => b.id - a.id)
      let i = 0
      let j = 0
      while (j < this.selected.length) {
        if (this.storageList[i].id === this.selected[j].id) {
          this.storageList[i].state = 1
          j++
        } else i++
      }
    },
    getStateLabel(state) {
      if (state === 0) return '已入库'
      else return '已出库'
    },
    getStateColor(state) {
      if (state === 0) return 'success'
      else return ''
    },
    getSearchVal(search) {
      this.search = search
    },
    searchOption(option) {
      this.option = option
      this.filter()
    },
    filter() {
      let tmpList = this.storageList
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
    isOut(state) {
      return state === 1
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
