<template>
  <v-list dense>
    <div v-for="(item, i) in items" :key="i">
      <v-list-group
        v-if="item.children !== undefined"
        :prepend-icon="item.icon"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="(children, j) in item.children"
          :key="j"
          :to="children.to"
          exact
          nuxt
        >
          <v-list-item-title v-text="children.title"></v-list-item-title>
        </v-list-item>
      </v-list-group>
      <v-list-item v-else :to="item.to" exact nuxt>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </div>
  </v-list>
</template>

<script>
import { mapGetters } from 'vuex'
import routerList from '~/assets/js/dynaRouter'
export default {
  name: 'DynamicList',
  data() {
    return {
      items: []
    }
  },
  computed: {
    ...mapGetters(['getRoleType'])
  },
  async mounted() {
    await this.initRouter()
  },
  methods: {
    initRouter() {
      // 获取权限等级
      const roleType = this.getRoleType

      for (const router of routerList) {
        // 根路由没有子路由直接添加
        if (router.children !== undefined) {
          const item = {}
          item.icon = router.icon
          item.title = router.title
          item.children = []
          // 添加子路由
          // 权限判断
          for (const children of router.children)
            if (children.role.includes(roleType)) item.children.push(children)
          // 子路由列表不为空则添加该根路由
          if (item.children.length !== 0) this.items.push(item)
        } else if (router.role.includes(roleType)) {
          this.items.push(router)
        }
      }
    }
  }
}
</script>

<style scoped></style>
