<template>
  <v-row no-gutters>
    <v-spacer />
    <v-col cols="12">
      <v-row>
        <v-spacer />
        <v-col cols="6">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            min-width="290px"
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dateText"
                label="选择时间"
                readonly
                outlined
                dense
                :rules="rules"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="date" range @input="dateRangeText" />
          </v-menu>
        </v-col>
        <v-col cols="4"><v-btn @click="confirm">确认</v-btn></v-col>
      </v-row>
    </v-col>
    <v-spacer />
  </v-row>
</template>

<script>
export default {
  name: 'DatePicker',
  data() {
    return {
      date: [],
      dateText: '',
      menu: false,
      rules: [(v) => (!!v && this.date[0] !== this.date[1]) || '所选时间不正确']
    }
  },
  methods: {
    dateRangeText() {
      this.date.sort()
      this.dateText = this.date.join(' ~ ')
    },
    confirm() {
      const items = []
      for (const item of this.date) {
        const time = new Date(item).toLocaleDateString()
        items.push(new Date(time))
      }
      this.$emit('confirm', items)
    }
  }
}
</script>

<style scoped></style>
