<template>
  <v-content>
    <v-container>
      <v-row class="text-center">
        <v-col cols="12">
          <div class="display-3" :class="[$style.errorHint]">
            糟糕, 404
          </div>
          <p :class="[$style.errorText]">
            该页面不存在
          </p>
          <v-btn rounded dark color="primary" :to="to">
            返回主页
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: 'Error',
  layout: 'empty',
  props: {
    to: {
      type: String,
      default: '/'
    }
  }
}
</script>

<style lang="scss" module>
.errorHint {
  color: #42a5f5;
  margin-bottom: 10px;
}
.errorText {
  color: #222;
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 10px;
}
</style>
