<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <top-bar
          title="系统登录日志"
          :add-btn="false"
          @show-search="getSearchVal"
        >
          <user-log-search-bar @search="searchOption" />
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
import UserLogSearchBar from '~/components/content/log/SearchBar/UserLogSearchBar'

export default {
  name: 'UserLog',
  components: {
    UserLogSearchBar,
    TopBar
  },
  async asyncData({ $axios }) {
    moment.locale('zh-CN')
    const type = ['退出', '登录']
    const { logList } = await $axios.$get('/api/log/user')
    for (const index in logList) {
      logList[index].index = parseInt(index) + 1
      logList[
        index
      ].name = `${logList[index].user.real_name}(${logList[index].user.account})`
      logList[index].actionText = type[logList[index].action]
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
          text: '姓名(账号)',
          value: 'name'
        },
        {
          text: 'ip',
          value: 'ip'
        },
        {
          text: '操作类型',
          value: 'actionText'
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
      if (this.option.action)
        tmpList = tmpList.filter((v) => v.action === this.option.action % 2)
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
