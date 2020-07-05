<template>
  <v-dialog v-model="dialog" max-width="300">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="1">
            <v-icon :color="iconColor">
              mdi-alert-outline
            </v-icon>
          </v-col>
          <v-col class="ml-2">
            {{ title }}
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        {{ info }}
        <br />
        {{ hint }}
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
  name: 'StateDialog',
  props: {
    // eslint-disable-next-line
    item: Object
  },
  data: () => ({
    dialog: false
  }),
  computed: {
    iconColor() {
      return this.item.state === 0 ? 'orange' : 'red'
    },
    title() {
      return this.item.state === 0 ? '启用仓库' : '停用仓库'
    },
    info() {
      return this.item.state === 0 ? '确认启用仓库？' : '确认停用仓库？'
    },
    hint() {
      return this.item.state === 0 ? '' : '(停用将可能造成影响)'
    }
  },
  methods: {
    show() {
      this.dialog = true
    },
    confirm() {
      const stateData = Object.assign({}, this.item)
      stateData.state ^= 1
      this.$emit('state-change', stateData)
      this.dialog = false
    },
    close() {
      this.dialog = false
    }
  }
}
</script>

<style scoped></style>
