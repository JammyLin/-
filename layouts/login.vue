<template>
  <v-app class="login">
    <v-content>
      <v-container fill-height>
        <nuxt />
      </v-container>
    </v-content>
    <notify />
  </v-app>
</template>

<script>
import Notify from '~/components/common/Notify/Notify'
export default {
  name: 'LoginLayout',
  components: { Notify }
}
</script>

<style scoped>
.login {
  background: url('~static/bg.jpg') no-repeat;
  background-size: cover;
}
</style>
