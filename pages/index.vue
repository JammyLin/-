<template>
  <v-row class="text-center">
    <v-col cols="12">
      <p style="color: #555555;">欢迎使用物流仓储管理系统</p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Index',
  mounted() {
    setTimeout(() => this.$router.push({ path: '/dashboard' }), 1500)
  }
}
</script>

<style scoped></style>
