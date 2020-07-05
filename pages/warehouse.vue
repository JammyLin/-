<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <top-bar
          title="仓库信息"
          :add-btn="parseInt(getRoleType) === 4"
          @show-search="getSearchVal"
          @add-item="handleItemAdd"
        >
          <search-bar @search="searchOption" />
        </top-bar>
        <v-data-table :headers="headers" :items="dispList" :search="search">
          <template v-slot:item.state="{ item }">
            <v-chip
              :color="getStateColor(item.state)"
              text-color="white"
              label
              @click.stop="handleItemState(item)"
              >{{ getStateLabel(item) }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click.stop="handleItemEdit(item)">
              mdi-pencil
            </v-icon>
            <v-icon
              v-if="parseInt(getRoleType) === 4"
              small
              @click.stop="handleItemDelete(item)"
            >
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
      <state-dialog
        ref="stateDialog"
        :item="stateData"
        @state-change="changeState"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import TopBar from '~/components/common/TopBar/TopBar'
import DeleteDialog from '~/components/common/DeleteDialog/DeleteDialog'

import ItemDialog from '~/components/content/warehouse/Dialog/ItemDialog'
import StateDialog from '~/components/content/warehouse/Dialog/StateDialog'
import SearchBar from '~/components/content/warehouse/SearchBar/SearchBar'

import DateUtil from '~/assets/js/DateUtil'

export default {
  name: 'Warehouse',
  components: {
    SearchBar,
    TopBar,
    DeleteDialog,

    ItemDialog,
    StateDialog
  },
  async asyncData({ $axios }) {
    const { warehouseList } = await $axios.$get('/api/warehouse')
    const dispList = warehouseList
    return { warehouseList, dispList }
  },
  data() {
    return {
      search: '',
      formData: {},
      stateData: {},
      headers: [
        {
          text: '仓库编号',
          value: 'warehouse_no',
          align: 'start'
        },
        {
          text: '仓库名称',
          value: 'warehouse_name'
        },
        {
          text: '仓库状态',
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
          filterable: false,
          sortable: false
        }
      ],
      warehouseList: [],
      dispList: [],
      editedIndex: -1,
      option: {}
    }
  },
  computed: {
    ...mapGetters(['getRoleType'])
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
      this.editedIndex = this.warehouseList.indexOf(item)
      this.formData = Object.assign({}, item)
      this.$refs.itemDialog.show()
    },
    handleItemDelete(item) {
      this.editedIndex = this.warehouseList.indexOf(item)
      this.$refs.alertDialog.show()
    },
    handleItemState(item) {
      this.editedIndex = this.warehouseList.indexOf(item)
      this.stateData = {
        id: item.id,
        state: item.state
      }
      this.$refs.stateDialog.show()
    },
    /*
     以下为数据处理事件
     */

    // editedIndex -1为创建，其他值为更新
    async saveItem(item) {
      if (this.editedIndex === -1) {
        await this.$axios.$post('/api/warehouse', item).then((res) => {
          if (res.code === 200) {
            this.warehouseList.unshift(res.instance)
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      } else {
        await this.$axios.$put('/api/warehouse', item).then((res) => {
          if (res.code === 200) {
            Object.assign(this.warehouseList[this.editedIndex], res.instance)
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      }
      this.filter()
    },
    async deleteItem() {
      await this.$axios
        .$delete(`/api/warehouse?id=${this.warehouseList[this.editedIndex].id}`)
        .then((res) => {
          if (res.code === 200) {
            this.warehouseList.splice(this.editedIndex, 1)
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      this.filter()
    },
    async changeState(item) {
      await this.$axios.$put('/api/warehouse/state', item).then((res) => {
        if (res.code === 200) {
          this.warehouseList[this.editedIndex].state = item.state
          this.$notify({ text: res.msg, type: 'success' })
        } else this.$notify({ text: res.msg, type: 'error' })
      })
      this.filter()
    },
    getStateLabel(item) {
      return item.state === 1 ? '启用' : '停用'
    },
    getStateColor(state) {
      return state === 1 ? 'green' : ''
    },
    getSearchVal(search) {
      this.search = search
    },
    searchOption(option) {
      this.option = option
      this.filter()
    },
    filter() {
      let tmpList = this.warehouseList
      if (this.option.state)
        tmpList = tmpList.filter((v) => v.state === this.option.state % 2)
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
