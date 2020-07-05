<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <top-bar title="快递清单" :add-btn="false" @show-search="getSearchVal">
          <work-search-bar @search="searchOption" />
        </top-bar>
        <div class="d-inline-flex btn-list">
          <v-btn
            text
            tile
            small
            :disabled="isLegal"
            @click.stop="handleWorkConfirm"
            ><v-icon small>mdi-check</v-icon>确认</v-btn
          >
          <v-btn text tile small :disabled="isEmpty" @click="cancel"
            ><v-icon small>mdi-cancel</v-icon>取消</v-btn
          >
        </div>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="dispList"
          :no-data-text="
            getVehicle ? '暂无快递需要配送' : '还未分配车辆,请通知分配'
          "
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
              v-if="isUnfinished(item.state)"
              small
              @click.stop="handleSingleWorkConfirm(item)"
            >
              mdi-check
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
    <work-dialog ref="workDialog" @confirm="confirm" />
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import TopBar from '~/components/common/TopBar/TopBar'
import WorkDialog from '~/components/content/delivery/Dialog/WorkDialog'
import DateUtil from '~/assets/js/DateUtil'
import WorkSearchBar from '~/components/content/delivery/SearchBar/WorkSearchBar'

export default {
  name: 'Work',
  components: {
    WorkSearchBar,
    TopBar,
    WorkDialog
  },
  async asyncData({ $axios }) {
    const { deliveryList } = await $axios.$get(`/api/delivery`)
    for (const index in deliveryList)
      deliveryList[
        index
      ].tracking_no = `${deliveryList[index].logistics.tracking_no}`
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
          value: 'state'
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
    ...mapGetters(['getVehicle']),
    isEmpty() {
      return this.selected.length === 0
    },
    isLegal() {
      return (
        !this.selected.length ||
        this.selected.some(
          (v) => v.state === 7 || v.state === 8 || v.state === 9
        )
      )
    }
  },
  methods: {
    /*
         handle函数为按钮点击事件
         不处理数据
         */
    handleSingleWorkConfirm(item) {
      this.selected = []
      this.selected.push(item)
      this.$refs.workDialog.show()
    },
    handleWorkConfirm() {
      this.$refs.workDialog.show()
    },
    /*
         以下为数据处理事件
         */
    async confirm() {
      await this.$axios
        .$post('/api/delivery/finish', {
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
        if (this.deliveryList[i].id === this.selected[j].id) {
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
      if (this.option.state)
        tmpList = tmpList.filter((v) => v.state === (this.option.state + 3) % 7)
      if (this.option.time)
        tmpList = DateUtil.dateFilter(
          this.option.time,
          this.option.date,
          tmpList
        )
      this.dispList = tmpList
    },
    isUnfinished(state) {
      return state !== 7 && state !== 8 && state !== 9
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
