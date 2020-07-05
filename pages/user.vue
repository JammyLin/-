<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <top-bar
          title="用户信息"
          @add-item="handleItemAdd"
          @show-search="getSearchVal"
        >
          <search-bar @search="searchOption" />
        </top-bar>
        <v-data-table :headers="headers" :items="dispList" :search="search">
          <template v-slot:item.state="{ item }">
            <v-chip :color="getStateColor(item.state)" text-color="white" label
              >{{ getStateLabel(item.state) }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              v-show="item.state !== 1"
              small
              @click.stop="handleItemActivate(item)"
            >
              mdi-account-key
            </v-icon>
            <v-icon
              v-show="item.state === 1 && item.role_type < getRoleType"
              small
              @click.stop="handleItemAuth(item)"
            >
              mdi-account-cog
            </v-icon>
            <v-icon
              v-show="item.role_type < getRoleType"
              small
              @click.stop="handleItemDelete(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
      <delete-dialog ref="alertDialog" @confirm-delete="deleteItem" />

      <activate-dialog ref="activateDialog" @confirm-activate="activate" />
      <auth-dialog ref="authDialog" @change-auth="changeAuth" />
      <item-dialog ref="registerDialog" @register="userRegister" />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

import TopBar from '~/components/common/TopBar/TopBar'
import DeleteDialog from '~/components/common/DeleteDialog/DeleteDialog'

import ActivateDialog from '~/components/content/user/Dialog/ActivateDialog'
import AuthDialog from '~/components/content/user/Dialog/AuthDialog'
import SearchBar from '~/components/content/user/SearchBar/SearchBar'
import DateUtil from '~/assets/js/DateUtil'
import ItemDialog from '~/components/content/user/Dialog/ItemDialog'

export default {
  name: 'User',
  components: {
    TopBar,
    DeleteDialog,

    SearchBar,
    ItemDialog,
    ActivateDialog,
    AuthDialog
  },
  async asyncData({ $axios }) {
    const { userList } = await $axios.$get('/api/user')
    const roleList = ['无', '快递员', '快递管理员', '上级管理员', '超级管理员']
    for (const index in userList) {
      if (userList[index].warehouse)
        userList[
          index
        ].warehouse_name = `${userList[index].warehouse.warehouse_name}(${userList[index].warehouse.warehouse_no})`
      else userList[index].warehouse_name = '无'
      userList[index].role_name = roleList[userList[index].role_type]
    }
    const dispList = userList
    return { userList, roleList, dispList }
  },
  data() {
    return {
      search: '',
      headers: [
        {
          text: '用户名',
          value: 'account',
          align: 'start'
        },
        {
          text: '姓名',
          value: 'real_name'
        },
        {
          text: '电话号码',
          value: 'phone_number'
        },
        {
          text: '所属仓库',
          value: 'warehouse_name'
        },
        {
          text: '用户类型',
          value: 'role_name',
          filterable: false
        },
        {
          text: '用户状态',
          value: 'state',
          filterable: false
        },
        {
          text: '操作',
          value: 'actions',
          sortable: false
        }
      ],
      userList: [],
      roleList: [],
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
      this.$refs.registerDialog.show()
    },
    handleItemDelete(item) {
      this.editedIndex = this.userList.indexOf(item)
      this.$refs.alertDialog.show()
    },
    handleItemActivate(item) {
      this.editedIndex = this.userList.indexOf(item)
      this.$refs.activateDialog.show()
    },
    handleItemAuth(item) {
      this.editedIndex = this.userList.indexOf(item)
      this.$refs.authDialog.show()
    },
    /*
         以下为数据处理事件
         */
    userRegister(item) {
      this.userList.unshift(item)
      this.filter()
    },
    async deleteItem() {
      await this.$axios
        .$delete(`/api/user?id=${this.userList[this.editedIndex].id}`)
        .then((res) => {
          if (res.code === 200) {
            this.userList.splice(this.editedIndex, 1)
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      this.filter()
    },
    async activate(item) {
      await this.$axios
        .$put('/api/user/activate', {
          id: this.userList[this.editedIndex].id,
          warehouse_id: item.warehouseId
        })
        .then((res) => {
          if (res.code === 200) {
            this.userList[this.editedIndex].state = 1
            this.userList[this.editedIndex].warehouse_id = item.warehouseId
            this.userList[this.editedIndex].warehouse_name = item.warehouse_name
            this.userList[this.editedIndex].role_name = '快递员'
            this.userList[this.editedIndex].role_type = 1
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      this.filter()
    },
    async changeAuth(roleType) {
      await this.$axios
        .$put('/api/user/auth', {
          id: this.userList[this.editedIndex].id,
          role_type: roleType
        })
        .then((res) => {
          if (res.code === 200) {
            this.userList[this.editedIndex].role_name = this.roleList[roleType]
            this.userList[this.editedIndex].role_type = roleType
            this.$notify({ text: res.msg, type: 'success' })
          } else this.$notify({ text: res.msg, type: 'error' })
        })
      this.filter()
    },
    getStateLabel(state) {
      if (state === 0) return '待激活'
      else return '已激活'
    },
    getStateColor(state) {
      if (state === 0) return ''
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
      let tmpList = this.userList
      if (this.option.warehouse)
        tmpList = tmpList.filter(
          (v) => v.warehouse_id === this.option.warehouse
        )
      if (this.option.userType)
        tmpList = tmpList.filter((v) => v.role_type === this.option.userType)
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
