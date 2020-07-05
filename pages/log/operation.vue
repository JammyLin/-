<template>
  <v-row>
    <v-col class="mb-0 pb-0" cols="12">
      <v-alert
        border="left"
        colored-border
        dismissible
        dense
        type="info"
        elevation="2"
      >
        用户权限及仓库状态记录在调整操作中，其他对象的状态调整则记录在更新操作中
      </v-alert>
    </v-col>
    <v-col cols="12">
      <v-card>
        <top-bar title="操作日志" :add-btn="false" @show-search="getSearchVal">
          <op-log-search-bar @search="searchOption" />
        </top-bar>
        <v-data-table :headers="headers" :items="dispList" :search="search" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'
import TopBar from '~/components/common/TopBar/TopBar'
import DateUtil from '~/assets/js/DateUtil'
import OpLogSearchBar from '~/components/content/log/SearchBar/OpLogSearchBar'

export default {
  name: 'OperationLog',
  components: {
    OpLogSearchBar,
    TopBar
  },
  async asyncData({ $axios }) {
    moment.locale('zh-CN')
    const { logList } = await $axios.$get('/api/log/operation')
    for (const index in logList) {
      logList[index].index = parseInt(index) + 1
      logList[index].createdAt = moment(logList[index].created_at).format('lll')
    }
    const dispList = logList
    return { logList, dispList }
  },
  data() {
    return {
      search: '',
      headers: [
        {
          text: '#',
          value: 'index',
          align: 'start'
        },
        {
          text: '操作信息',
          value: 'info'
        },
        {
          text: '操作时间',
          value: 'createdAt'
        }
      ],
      logList: [],
      dispList: [],
      option: {}
    }
  },
  methods: {
    getSearchVal(search) {
      this.search = search
    },
    searchOption(option) {
      this.option = option
      this.filter()
    },
    filter() {
      let tmpList = this.logList
      if (this.option.object)
        tmpList = tmpList.filter(
          (v) => v.object_type === this.option.object - 1
        )
      if (this.option.action)
        tmpList = tmpList.filter((v) => v.action === this.option.action - 1)
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
