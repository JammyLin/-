<template>
  <v-row>
    <v-col cols="12" class="ma-auto col-sm-8 col-md-6 col-lg-4">
      <v-card class="ma-auto" elevation="6">
        <v-card-title class="justify-center">
          <h1 class="display-1">修改密码</h1>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="oldPassword"
              type="password"
              label="旧密码"
              prepend-icon="mdi-lock"
            />
            <v-text-field
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'"
              label="新密码"
              :messages="passwordHint"
              :success="$helper.handlePasswordValidate(newPassword)"
              :error="
                Boolean(
                  newPassword.length !== 0 &&
                    !$helper.handlePasswordValidate(newPassword)
                )
              "
              :error-messages="
                Boolean(
                  newPassword.length !== 0 &&
                    !$helper.handlePasswordValidate(newPassword)
                )
                  ? '密码不符合规则'
                  : ''
              "
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
            />
            <v-text-field
              v-model="confirmNewPassword"
              :type="showPassword ? 'text' : 'password'"
              label="确认密码"
              :success="
                confirmNewPassword.length !== 0 &&
                  confirmNewPassword === newPassword
              "
              :error="confirmNewPassword !== newPassword"
              :error-messages="
                confirmNewPassword !== newPassword ? '确认密码与密码不相同' : ''
              "
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn color="primary" min-width="100" link to="/">
            返回主页
          </v-btn>
          <v-btn color="primary" min-width="100" @click="changePassword">
            确认
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Change',
  data() {
    return {
      showPassword: false,

      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      passwordHint:
        '支持由数字、大小写英文以及符号 .,_@{}[]/|\\~`!#$%^()-=?:; 组成的6~16位密码，且密码不能是纯英文字母或纯数字',

      valid: true
    }
  },
  methods: {
    async changePassword() {
      if (this.valid) {
        await this.$axios
          .$put('/api/user/change', {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword
          })
          .then((res) => {
            if (res.code === 200) {
              this.$notify({ text: res.msg, type: 'success' })
            } else this.$notify({ text: res.msg, type: 'error' })
          })
      } else this.$notify({ text: '请正确填写信息', type: 'error' })
    }
  }
}
</script>

<style scoped></style>
