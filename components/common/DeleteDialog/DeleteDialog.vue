<template>
  <v-dialog v-model="dialog" max-width="300">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="1">
            <v-icon color="red">
              mdi-alert-outline
            </v-icon>
          </v-col>
          <v-col class="ml-2">
            删除
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        确认删除？
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
  name: 'DeleteDialog',
  data: () => ({
    dialog: false
  }),
  methods: {
    show() {
      this.dialog = true
    },
    confirm() {
      this.$emit('confirm-delete')
      this.dialog = false
    },
    close() {
      this.dialog = false
    }
  }
}
</script>

<style scoped></style>
