<template>
  <v-dialog v-model="dialog" max-width="300" persistent>
    <v-card>
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-text class="pt-2">
        <v-form ref="form" v-model="valid">
          <v-row no-gutters>
            <v-col cols="12">
              <v-text-field
                v-model="item.reservoir_no"
                outlined
                label="库区编号"
                :rules="reservoirNoRules"
                dense
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="item.reservoir_name"
                outlined
                label="库区名称"
                :rules="nameRules"
                dense
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="item.warehouse_id"
                :items="warehouseList"
                label="所属仓库"
                item-text="warehouse_name"
                item-value="id"
                :readonly="isAdd"
                :rules="warehouseIdRules"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="item.remark"
                outlined
                label="备注(选填)"
                :rules="remarkRules"
                dense
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">取消</v-btn>
        <v-btn color="blue darken-1" text @click="save">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ItemDialog',
  props: {
    // eslint-disable-next-line
    item: Object,
    index: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      dialog: false,
      warehouseList: [],
      reservoirNoRules: [(v) => !!v || '请输入库区编号'],
      nameRules: [(v) => !!v || '请输入库区名称'],
      warehouseIdRules: [(v) => !!v || '请选择所属仓库'],
      remarkRules: [(v) => !v || v.length <= 30 || '备注过长'],
      valid: false
    }
  },
  computed: {
    title() {
      return this.index === -1 ? '添加库区' : '修改库区'
    },
    isAdd() {
      return this.index !== -1
    }
  },
  methods: {
    async show() {
      const { warehouseList } = await this.$axios.$get(
        '/api/warehouse?format=true'
      )
      this.warehouseList = warehouseList
      this.dialog = true
    },
    save() {
      this.$refs.form.validate()
      if (this.valid) {
        const formData = Object.assign({}, this.item)
        formData.warehouse_name = this.warehouseList.find(
          (v) => v.id === this.item.warehouse_id
        ).warehouse_name
        this.$emit('save', formData)
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
