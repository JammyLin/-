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
                v-model="item.vehicle_no"
                :readonly="isEdit"
                outlined
                label="车牌号"
                :rules="vehicleNoRules"
                dense
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="item.user_id"
                :items="userList"
                label="车辆主人"
                :messages="!isEdit ? userIdHint : ''"
                item-text="real_name"
                item-value="id"
                outlined
                dense
              />
            </v-col>
            <v-col v-show="isEdit" cols="12">
              <v-select
                v-model="item.state"
                :items="stateList"
                label="车辆状态"
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
        <v-btn color="blue darken-1" text @click="save">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
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
      stateList: [
        { value: 0, text: '使用中' },
        { value: 1, text: '维修中' }
      ],
      userList: [],
      vehicleNoRules: [
        (v) => {
          if (!v) return '请输入车牌号'
          else if (
            !/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}$/.test(
              v
            )
          )
            return '请输入正确的车牌号'
          else return true
        }
      ],
      userIdHint: '可添加后再选快递员',

      valid: false
    }
  },
  computed: {
    ...mapGetters(['getWarehouseId']),
    title() {
      return this.index === -1 ? '添加车辆' : '修改车辆'
    },
    isEdit() {
      return this.index !== -1
    }
  },
  methods: {
    async show() {
      const { userList } = await this.$axios.$get('/api/user?format=true')
      this.userList = userList.filter((v) => v.state !== 0 && v.role_type === 1)
      this.item.warehouse_id = this.getWarehouseId
      this.dialog = true
    },
    save() {
      this.$refs.form.validate()
      if (this.valid) {
        this.item.state = parseInt(this.item.state)

        const formData = Object.assign({}, this.item)
        // 回传格式后的用户名
        if (formData.user_id)
          formData.real_name = this.userList.find(
            (v) => v.id === this.item.user_id
          ).real_name
        else {
          formData.real_name = '无'
          formData.user_id = null
        }

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
