<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <top-bar
          title="库区信息"
          @show-search="getSearchVal"
          @add-item="handleItemAdd"
        >
          <search-bar @search="searchOption" />
        </top-bar>
        <v-data-table :headers="headers" :items="dispList" :search="search">
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click.stop="handleItemEdit(item)">
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

import ItemDialog from '~/components/content/reservoir/Dialog/ItemDialog'
import SearchBar from '~/components/content/reservoir/SearchBar/SearchBar'
import DateUtil from '~/assets/js/DateUtil'

export default {
  name: 'Reservoir',
  components: {
    SearchBar,
    TopBar,
    DeleteDialog,

    ItemDialog
  },
  async asyncData({ $axios }) {
    const { reservoirList } = await $axios.$get('/api/reservoir')
    for (const index in reservoirList) {
      reservoirList[
        index
      ].warehouse_name = `${reservoirList[index].warehouse.warehouse_name}(${reservoirList[index].warehouse.warehouse_no})`
    }
    const dispList = reservoirList
    return { reservoirList, dispList }
  },
  data() {
    return {
      search: '',
      formData: {},
      headers: [
        {
          text: '库区编号',
          value: 'reservoir_no',
          align: 'start'
        },
        {
          text: '库区名称',
          value: 'reservoir_name'
        },
        {
          text: '所属仓库',
          value: 'warehouse_name',
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
      reservoirList: [],
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
      this.editedIndex = this.reservoirList.indexOf(item)
      this.formData = Object.assign({}, item)
      this.$refs.itemDialog.show()
    },
    handleItemDelete(item) {
      this.editedIndex = this.reservoirList.indexOf(item)
      this.$refs.alertDialog.show()
    },
    /*
       以下为数据处理事件
       */

    async saveItem(item) {
      // editedIndex -1为创建，其他值为更新
      if (this.editedIndex === -1) {
        await this.$axios.$post('/api/reservoir', item).then((res) => {
          if (res.code === 200) {
            res.instance.warehouse_name = item.warehouse_name
            this.reservoirList.unshift(res.instance)
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      } else {
        await this.$axios.$put('/api/reservoir', item).then((res) => {
          if (res.code === 200) {
            Object.assign(this.reservoirList[this.editedIndex], item)
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      }
      this.filter()
    },
    async deleteItem() {
      await this.$axios
        .$delete(`/api/reservoir?id=${this.reservoirList[this.editedIndex].id}`)
        .then((res) => {
          if (res.code === 200) {
            this.reservoirList.splice(this.editedIndex, 1)
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      this.filter()
    },
    getSearchVal(search) {
      this.search = search
    },
    searchOption(option) {
      this.option = option
      this.filter()
    },
    filter() {
      let tmpList = this.reservoirList
      if (this.option.warehouse)
        tmpList = tmpList.filter(
          (v) => v.warehouse_id === this.option.warehouse
        )
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
