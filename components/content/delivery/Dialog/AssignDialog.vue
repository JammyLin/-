<template>
  <v-dialog v-model="dialog" max-width="300" persistent>
    <v-card>
      <v-card-title>
        分配快递员
      </v-card-title>
      <v-card-text class="pt-2">
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="vehicleId"
                :items="vehicleList"
                label="车辆选择"
                item-text="vehicle_no"
                item-value="id"
                :rules="rules"
                outlined
                dense
              />
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
  name: 'AssignDialog',
  data() {
    return {
      dialog: false,
      vehicleList: [],
      vehicleId: null,
      rules: [(v) => !!v || '请选择配送的车辆'],
      valid: false
    }
  },
  methods: {
    async show() {
      const { vehicleList } = await this.$axios.$get('/api/vehicle')
      this.vehicleList = vehicleList.filter((v) => v.state === 0)
      for (const index in this.vehicleList) {
        if (this.vehicleList[index].user)
          this.vehicleList[
            index
          ].vehicle_no += `(${this.vehicleList[index].user.real_name})`
        else this.vehicleList[index].vehicle_no += `(未分配快递员)`
      }

      this.dialog = true
    },
    confirm() {
      this.$refs.form.validate()
      if (this.valid) {
        const vehicleInfo = {
          id: this.vehicleId
        }
        const vehicle = this.vehicleList.find((v) => v.id === this.vehicleId)
        vehicleInfo.vehicle_no = vehicle.vehicle_no.replace(/\(.+\)/, '')
        vehicleInfo.user = vehicle.user
        this.$emit('confirm-assign', vehicleInfo)
        this.dialog = false
        this.$refs.form.reset()
      }
    },
    close() {
      this.$refs.form.reset()
      this.dialog = false
    }
  }
}
</script>

<style scoped></style>
