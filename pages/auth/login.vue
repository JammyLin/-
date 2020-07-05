<template>
  <v-row>
    <v-col cols="12" class="ma-auto col-sm-8 col-md-6 col-lg-4">
      <v-card class="ma-auto" elevation="6">
        <v-card-title class="justify-center">
          <h1 class="display-1">登录</h1>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="account"
              type="text"
              label="用户名"
              prepend-icon="mdi-account-circle"
            />
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="密码"
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn color="primary" min-width="100" link to="/auth/register">
            注册
          </v-btn>
          <v-btn color="primary" min-width="100" @click="handleLogin">
            登录
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  layout: 'login',
  name: 'Login',
  data() {
    return {
      showPassword: false,
      account: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(['userlogin']),
    async handleLogin() {
      if (this.account === '' || this.password === '')
        this.$notify({ text: '用户名密码不匹配', type: 'error' })
      else
        await this.$axios
          .$post('/api/auth/login', {
            account: this.account,
            password: this.password
          })
          .then((res) => {
            if (res.code === 200) {
              this.$notify({ text: res.msg, type: 'success' })
              this.userlogin(res.user)
              this.$router.replace('/')
            } else this.$notify({ text: res.msg, type: 'error' })
          })
    }
  }
}
</script>

<style scoped></style>
