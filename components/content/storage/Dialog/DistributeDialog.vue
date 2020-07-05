<template>
  <v-dialog v-model="dialog" max-width="300" persistent>
    <v-card>
      <v-card-title>
        快递派送
      </v-card-title>
      <v-card-text class="pt-2">
        <v-card-text>
          确认派送包裹？
        </v-card-text>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">取消</v-btn>
        <v-btn color="blue darken-1" text @click="confirm">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DistributeDialog',
  data() {
    return {
      dialog: false
    }
  },
  methods: {
    show() {
      this.dialog = true
    },
    confirm() {
      this.$emit('confirm-distribute')
      this.dialog = false
    },
    close() {
      this.dialog = false
    }
  }
}
</script>

<style scoped></style>
