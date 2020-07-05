<template>
  <v-card class="mx-auto" tile>
    <v-list flat>
      <v-subheader>待办事项</v-subheader>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i">
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-row align="center" justify="center" no-gutters>
              <v-col cols="auto" class="mr-2"
                ><v-list-item-title v-text="item.text"></v-list-item-title
              ></v-col>
              <v-col
                ><v-chip
                  v-if="item.path"
                  color="primary"
                  class="mt-1"
                  :to="item.path"
                  small
                  >前往操作</v-chip
                ></v-col
              >
            </v-row>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: 'ToDoList',
  props: {
    // eslint-disable-next-line
    roleType: Number,
    // eslint-disable-next-line
    todo: Array
  },
  data: () => ({
    items: []
  }),
  mounted() {
    if (this.roleType === 1) {
      if (this.todo[0])
        this.items.push({
          text: `有 ${this.todo[0]} 个快递还未确认完成`,
          icon: 'mdi-information',
          path: '/delivery/work'
        })
    } else if (this.roleType === 2) {
      if (this.todo[0])
        this.items.push({
          text: `有 ${this.todo[0]} 条入库记录正等待中转或派送`,
          icon: 'mdi-information',
          path: '/storage'
        })
      if (this.todo[1])
        this.items.push({
          text: `有 ${this.todo[1]} 条快递正等待分配`,
          icon: 'mdi-information',
          path: '/delivery/assign'
        })
    } else if (this.roleType === 3) {
      if (this.todo[0])
        this.items.push({
          text: `有 ${this.todo[0]} 辆车还未分配快递员`,
          icon: 'mdi-information',
          path: '/vehicle'
        })
    }

    if (!this.items.length)
      this.items.push({
        text: `暂无待办事项`,
        icon: 'mdi-party-popper'
      })
  }
}
</script>

<style lang="scss" scoped></style>
