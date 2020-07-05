<template>
  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card class="ma-auto" elevation="6">
      <v-card-title class="justify-center">
        <h1 class="display-1">注册</h1>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="account"
            label="用户名"
            :messages="usernameHint"
            prepend-icon="mdi-account-circle"
            :success="$helper.handleAccountValidate(account)"
            :error="
              Boolean(
                account.length !== 0 && !$helper.handleAccountValidate(account)
              )
            "
            :error-messages="
              Boolean(
                account.length !== 0 && !$helper.handleAccountValidate(account)
              )
                ? '用户名不符合规则'
                : ''
            "
          />
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="密码"
            :messages="passwordHint"
            :success="$helper.handlePasswordValidate(password)"
            :error="
              Boolean(
                password.length !== 0 &&
                  !$helper.handlePasswordValidate(password)
              )
            "
            :error-messages="
              Boolean(
                password.length !== 0 &&
                  !$helper.handlePasswordValidate(password)
              )
                ? '密码不符合规则'
                : ''
            "
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />
          <v-text-field
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            label="确认密码"
            :success="
              confirmPassword.length !== 0 && confirmPassword === password
            "
            :error="confirmPassword !== password"
            :error-messages="
              confirmPassword !== password ? '确认密码与密码不相同' : ''
            "
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />
          <v-text-field
            v-model="real_name"
            label="真实姓名"
            prepend-icon="mdi-card-account-details"
            :messages="nameHint"
            :success="$helper.handleRealNameValidate(real_name)"
            :error="
              real_name.length !== 0 &&
                !$helper.handleRealNameValidate(real_name)
            "
            :error-messages="
              real_name.length !== 0 &&
              !$helper.handleRealNameValidate(real_name)
                ? '真实姓名不符合规则'
                : ''
            "
          />
          <v-text-field
            v-model="phone_number"
            label="电话号码"
            prepend-icon="mdi-card-account-phone"
            :messages="phoneHint"
            :success="$helper.handlePhoneValidate(phone_number)"
            :error="
              phone_number.length !== 0 &&
                !$helper.handlePhoneValidate(phone_number)
            "
            :error-messages="
              phone_number.length !== 0 &&
              !$helper.handlePhoneValidate(phone_number)
                ? '电话号码不符合规则'
                : ''
            "
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn color="blue darken-1" text @click="close">取消</v-btn>
        <v-btn color="blue darken-1" text @click="register">注册</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ItemDialog',
  data() {
    return {
      dialog: false,
      showPassword: false,

      account: '',
      password: '',
      confirmPassword: '',
      real_name: '',
      phone_number: '',

      usernameHint:
        '支持由数字、大小写英文组成的4~15位用户名，且用户名不能为纯数字',
      passwordHint:
        '支持由数字、大小写英文以及符号 .,_@{}[]/|\\~`!#$%^()-=?:; 组成的6~16位密码，且密码不能是纯英文字母或纯数字',
      nameHint: '支持由中文组成的2~15位真实姓名长度',
      phoneHint: '支持11位电话号码，且电话号码只能为13-19开头',

      valid: true
    }
  },
  methods: {
    show() {
      this.dialog = true
    },
    async register() {
      if (this.valid) {
        await this.$axios
          .$post('/api/user', {
            account: this.account,
            password: this.password,
            real_name: this.real_name,
            phone_number: this.phone_number,
            isLogin: true
          })
          .then((res) => {
            if (res.code === 200) {
              res.user.warehouse_name = '无'
              res.user.role_name = '无'
              this.$emit('register', res.user)
              this.$notify({ text: res.msg, type: 'success' })
              this.dialog = false
              this.initValue()
            } else this.$notify({ text: res.msg, type: 'error' })
          })
      } else this.$notify({ text: '请正确填写注册信息', type: 'error' })
    },
    close() {
      this.dialog = false
      this.initValue()
    },
    initValue() {
      this.$refs.form.resetValidation()
      this.account = ''
      this.password = ''
      this.confirmPassword = ''
      this.real_name = ''
      this.phone_number = ''
    }
  }
}
</script>

<style scoped></style>
