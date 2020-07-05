<template>
  <v-dialog v-model="dialog" max-width="300" persistent>
    <v-card>
      <v-card-title>
        快递中转
      </v-card-title>
      <v-card-text class="pt-2">
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="warehouseId"
                :items="warehouseList"
                label="仓库编号"
                item-text="warehouse_name"
                item-value="id"
                :rules="warehouseIdRules"
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
import { mapGetters } from 'vuex'
export default {
  name: 'TransferDialog',
  data() {
    return {
      dialog: false,
      warehouseId: null,
      warehouseList: [],
      warehouseIdRules: [(v) => !!v || '请选择所要中转的仓库'],
      valid: false
    }
  },
  computed: {
    ...mapGetters(['getWarehouseId'])
  },
  methods: {
    async show() {
      const { warehouseList } = await this.$axios.$get(
        '/api/warehouse?format=true&all=true'
      )
      this.warehouseList = warehouseList.filter(
        (v) => v.id !== this.getWarehouseId
      )
      this.dialog = true
    },
    confirm() {
      this.$refs.form.validate()
      if (this.valid) {
        this.$emit('confirm-transfer', this.warehouseId)
        this.dialog = false
        this.$refs.form.reset()
      }
    },
    close() {
      this.dialog = false
      this.$refs.form.reset()
    }
  }
}
</script>

<style scoped></style>
