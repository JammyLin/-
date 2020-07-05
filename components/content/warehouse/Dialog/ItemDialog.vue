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
                v-model="item.warehouse_no"
                outlined
                label="仓库编号"
                :rules="warehouseNoRules"
                :readonly="index !== -1"
                dense
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="item.warehouse_name"
                outlined
                label="仓库名称"
                :rules="nameRules"
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
      warehouseNoRules: [(v) => !!v || '请输入仓库编号'],
      nameRules: [(v) => !!v || '请输入仓库名称'],
      remarkRules: [(v) => !v || v.length <= 30 || '备注过长'],
      valid: false
    }
  },
  computed: {
    title() {
      return this.index === -1 ? '添加仓库' : '修改仓库'
    }
  },
  methods: {
    show() {
      this.dialog = true
    },
    save() {
      this.$refs.form.validate()
      if (this.valid) {
        const formData = Object.assign({}, this.item)
        this.$emit('save', formData)
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
