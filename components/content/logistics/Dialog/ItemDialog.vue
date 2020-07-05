<template>
  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card>
      <v-card-title>
        添加物流订单
      </v-card-title>
      <v-card-text class="pt-2">
        <v-tabs v-model="tab" centered grow>
          <v-tab>上门取件</v-tab>
          <v-tab>服务点寄件</v-tab>
        </v-tabs>
        <v-form ref="form" v-model="valid">
          <v-row no-gutters>
            <v-col cols="12">
              <div class="title font-weight-bold pb-2">寄件人信息</div>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="logisticsInfo.shipper"
                outlined
                label="姓名"
                :rules="shipperRules"
                dense
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="logisticsInfo.shipper_phone"
                outlined
                label="电话号码"
                :rules="shipperPhoneRules"
                dense
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="logisticsInfo.departure"
                rows="1"
                auto-grow
                outlined
                label="地址"
                :rules="departureRules"
                dense
              />
            </v-col>
            <v-col cols="12">
              <div class="title font-weight-bold pb-2">收件人信息</div>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="logisticsInfo.consignee"
                outlined
                label="姓名"
                :rules="consigneeRules"
                dense
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="logisticsInfo.consignee_phone"
                outlined
                label="电话号码"
                :rules="consigneePhoneRules"
                dense
              />
            </v-col>
            <v-col cols="12" class="pb-4">
              <v-textarea
                v-model="logisticsInfo.consignee_address"
                rows="1"
                auto-grow
                outlined
                label="地址"
                :rules="consigneeAddressRules"
                dense
              />
            </v-col>
            <v-col cols="4">
              <v-spacer />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="logisticsInfo.weight"
                outlined
                type="number"
                suffix="g"
                label="货物重量"
                :rules="weightRules"
                dense
              />
            </v-col>
            <v-col cols="4" class="pb-4">
              <v-text-field
                v-model="logisticsInfo.cost"
                outlined
                type="number"
                prefix="¥"
                label="费用"
                :rules="costRules"
                dense
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="logisticsInfo.remark"
                rows="1"
                auto-grow
                outlined
                label="备注(选填)"
                :rules="remarkRules"
                dense
              />
            </v-col>
            <v-col cols="12">
              <div class="title font-weight-bold">
                商品清单(选填)
                <v-icon v-show="!isShow" color="primary" @click="addGoods"
                  >mdi-plus-box</v-icon
                >
              </div>
            </v-col>
            <v-col v-show="isShow" cols="12">
              <v-row no-gutters>
                <v-col cols="7" class="pr-2">商品名称</v-col>
                <v-col cols="3">数量</v-col>
              </v-row>
              <v-row
                v-for="(goods, index) in goodsList"
                :key="index"
                no-gutters
              >
                <v-col cols="7">
                  <v-text-field
                    v-model="goods.goods_name"
                    class="pr-2"
                    :rules="goodsNameRules"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="3"
                  ><v-text-field
                    v-model="goods.goods_number"
                    type="number"
                    suffix="件"
                    :rules="goodsNumberRules"
                    outlined
                    dense
                /></v-col>
                <v-col v-show="goodsList.length === index + 1" cols="1"
                  ><v-icon class="icon-center" color="primary" @click="addGoods"
                    >mdi-plus-box</v-icon
                  ></v-col
                >
                <v-col cols="1"
                  ><v-icon
                    class="icon-center"
                    color="error"
                    @click="delGoods(index)"
                    >mdi-minus-box</v-icon
                  ></v-col
                >
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row no-gutters>
                <v-col cols="5"><p class="subtitle">结算方式:</p></v-col>
                <v-col cols="7"
                  ><v-radio-group v-model="settlementModes" row>
                    <v-radio label="现付" value="1" active></v-radio>
                    <v-radio label="到付" value="2"></v-radio> </v-radio-group
                ></v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" text @click="close">取消</v-btn>
        <v-btn color="blue darken-1" text @click="save">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ItemDialog',
  data() {
    return {
      dialog: false,
      logisticsInfo: {},
      goodsList: [],
      settlementModes: '1',
      tab: 0,

      shipperRules: [
        (v) => {
          if (!v) return '请输入寄件人姓名'
          else if (v.length > 15) return '姓名长度过长'
          else return true
        }
      ],
      shipperPhoneRules: [
        (v) => {
          if (!v) return '请输入寄件人电话号码'
          else if (!/^\d{11}$/.test(v)) return '请输入正确的电话号码'
          else return true
        }
      ],
      departureRules: [
        (v) => {
          if (!v) return '请输入寄件人地址'
          else if (v.length > 25) return '寄件人地址过长'
          else return true
        }
      ],
      consigneeRules: [
        (v) => {
          if (!v) return '请输入收件人姓名'
          else if (v.length > 15) return '姓名长度过长'
          else return true
        }
      ],
      consigneePhoneRules: [
        (v) => {
          if (!v) return '请输入收件人电话号码'
          else if (!/^\d{11}$/.test(v)) return '请输入正确的电话号码'
          else return true
        }
      ],
      consigneeAddressRules: [
        (v) => {
          if (!v) return '请输入收件人地址'
          else if (v.length > 25) return '收件人地址过长'
          else return true
        }
      ],
      weightRules: [
        (v) => {
          if (!v) return '请输入快递重量'
          else if (
            !/(^[1-9]([0-9]{1,15})?(\.[0-9]{1,2})?$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
              v
            )
          )
            return '请输入正确的重量'
          else return true
        }
      ],
      costRules: [
        (v) => {
          if (!v) return '请输入快递费用'
          else if (
            !/(^[1-9]([0-9]{1,15})?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
              v
            )
          )
            return '请输入正确的费用'
          else return true
        }
      ],
      goodsNameRules: [
        (v) => {
          if (!v) return '请输入商品名称'
          else if (v.length > 30) return '商品名称过长'
          else return true
        }
      ],
      goodsNumberRules: [
        (v) => {
          if (!v) return '请输入商品数量'
          else if (parseInt(v) <= 0 || v.length > 18) return '请输入正确的数量'
          else return true
        }
      ],
      remarkRules: [(v) => !v || v.length <= 30 || '备注过长'],
      valid: false
    }
  },
  computed: {
    isShow() {
      return this.goodsList.length !== 0
    }
  },
  methods: {
    show() {
      this.dialog = true
    },
    save() {
      this.$refs.form.validate()
      if (this.valid) {
        const item = Object.assign({}, this.logisticsInfo)
        item.goodsList = this.goodsList
        item.settlement_modes = parseInt(this.settlementModes)
        item.type = this.tab
        this.$emit('save', item)
        this.dialog = false
        setTimeout(() => {
          this.$refs.form.reset()
          this.initValue()
        }, 50)
      }
    },
    close() {
      this.dialog = false
      this.$refs.form.reset()
      this.initValue()
    },
    addGoods() {
      this.goodsList.push({ goods_name: '', goods_number: null })
    },
    delGoods(index) {
      this.goodsList.splice(index, 1)
    },
    initValue() {
      this.goodsList = []
      this.settlementModes = '1'
      this.tab = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-center {
  height: 40px;
  line-height: 40px;
}
.icon-display {
  display: none;
}
.subtitle {
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 18px;
}
</style>
