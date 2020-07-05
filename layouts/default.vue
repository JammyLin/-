<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <dynamic-list />
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer />
      <v-menu open-on-hover min-width="150" offset-y>
        <template v-slot:activator="{ on }">
          <v-avatar style="margin-right: 10px" v-on="on">
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
        </template>
        <v-list>
          <v-list-item class="name">
            <v-list-item-title class="text">{{
              getRealName
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item class="role">
            <v-list-item-title class="text">{{ roleText }}</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item @click="changePassword">
            <v-list-item-title>修改密码</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-icon @click="userLogout">mdi-logout</v-icon>
    </v-app-bar>
    <v-content class="grey lighten-4">
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer fixed app class="justify-center">
      <span>&copy; 2020</span>
    </v-footer>
    <notify />
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Notify from '~/components/common/Notify/Notify'
import DynamicList from '~/components/content/router/DynamicList'
export default {
  name: 'Default',
  middleware: 'auth',
  components: { DynamicList, Notify },
  data() {
    return {
      drawer: false
    }
  },
  computed: {
    ...mapGetters(['getRealName', 'getRoleType']),
    roleText() {
      switch (this.getRoleType) {
        case 1:
          return '快递员'
        case 2:
          return '快递管理员'
        case 3:
          return '上级管理员'
        case 4:
          return '超级管理员'
        default:
          return ''
      }
    }
  },
  methods: {
    ...mapActions(['userexit']),
    async userLogout() {
      await this.$axios.$get('/api/auth/logout').then((res) => {
        if (res.code === 200) {
          this.userexit()
          this.$notify({ text: res.msg, type: 'success' })
          setTimeout(() => {
            this.$router.push({ path: '/auth/login' })
          }, 500)
        } else this.$notify({ text: res.msg, type: 'error' })
      })
    },
    changePassword() {
      this.$router.push({ path: '/auth/change' })
    }
  }
}
</script>

<style lang="scss" scoped>
.name {
  min-height: 20px;
  font-weight: bold;
  .text {
    text-align: center;
    font-size: 18px;
  }
}
.role {
  min-height: 20px;
  .text {
    text-align: center;
    font-size: 1px;
  }
}
</style>
