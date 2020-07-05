<template>
  <v-dialog v-model="dialog" max-width="300" persistent>
    <v-card>
      <v-card-title>
        账号激活
      </v-card-title>
      <v-card-text class="pt-2">
        <v-form v-if="isSuperAdmin" ref="form" v-model="valid">
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
        <p v-else>确认激活账号？</p>
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
  name: 'ActivateDialog',
  data() {
    return {
      dialog: false,
      warehouseId: null,
      warehouseList: [],
      warehouseIdRules: [(v) => !!v || '请选择用户所属仓库'],
      valid: false,
      isSuperAdmin: false
    }
  },
  computed: {
    ...mapGetters(['getWarehouseId', 'getRoleType'])
  },
  methods: {
    async show() {
      await setTimeout(() => {
        if (parseInt(this.getRoleType) !== 4)
          this.warehouseId = this.getWarehouseId
        else this.isSuperAdmin = true
      })
      const { warehouseList } = await this.$axios.$get(
        '/api/warehouse?format=true'
      )
      this.warehouseList = warehouseList
      this.dialog = true
    },
    confirm() {
      const item = {
        warehouseId: this.warehouseId
      }
      const warehouse = this.warehouseList.find(
        (v) => v.id === this.warehouseId
      )

      if (this.isSuperAdmin) {
        this.$refs.form.validate()
        if (this.valid) {
          item.warehouse_name = warehouse.warehouse_name
          this.$emit('confirm-activate', item)
          this.dialog = false
          this.$refs.form.reset()
        }
      } else {
        item.warehouse_name = warehouse.warehouse_name
        this.$emit('confirm-activate', item)
        this.dialog = false
      }
    },
    close() {
      if (this.isSuperAdmin) this.$refs.form.reset()
      this.dialog = false
    }
  }
}
</script>

<style scoped></style>
