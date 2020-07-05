<template>
  <v-dialog v-model="dialog" max-width="300" persistent>
    <v-card>
      <v-card-title>
        提醒
      </v-card-title>
      <v-card-text class="pt-2">
        <v-form>
          <v-row>
            <v-col cols="12">
              是否确认完成配送？
            </v-col>
          </v-row>
        </v-form>
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
  name: 'WorkDialog',
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
      this.$emit('confirm')
      this.dialog = false
    },
    close() {
      this.dialog = false
    }
  }
}
</script>

<style scoped></style>
