<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-text class="pt-2">
        <div>
          <div class="title font-weight-bold pb-2">寄件人信息</div>
          <div class="info-content">
            <div class="name">姓名: {{ info.shipper }}</div>
            <div class="phone">电话号码: {{ info.shipper_phone }}</div>
            <div class="address">地址: {{ info.departure }}</div>
          </div>
        </div>
        <div>
          <div class="title font-weight-bold pb-2">收件人信息</div>
          <div class="info-content">
            <div class="name">姓名: {{ info.consignee }}</div>
            <div class="phone">电话号码: {{ info.consignee_phone }}</div>
            <div class="address">地址: {{ info.consignee_address }}</div>
          </div>
        </div>
        <div v-if="isEmpty">
          <div class="title font-weight-bold pb-2">商品清单</div>
          <div class="goods-info">
            <div class="goods-title">
              <div class="name">商品名称</div>
              <div class="number">数量</div>
            </div>
            <div v-for="goods in info.goods" :key="goods.id" class="content">
              <div class="name">{{ goods.goods_name }}</div>
              <div class="number">{{ goods.goods_number }}</div>
            </div>
          </div>
        </div>
        <div class="foot">
          <div>货物重量: {{ info.weight }}KG</div>
          <div>费用: ¥{{ info.cost }}</div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'InfoDialog',
  props: {
    // eslint-disable-next-line
    info: Object
  },
  data() {
    return {
      dialog: false
    }
  },
  computed: {
    title() {
      return `${this.info.tracking_no} 物流信息`
    },
    isEmpty() {
      return this.info.goods && this.info.goods.length !== 0
    }
  },
  methods: {
    show() {
      this.dialog = true
    },
    close() {
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.info-content {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding-left: 20px;
  .name {
    width: 50%;
    line-height: 30px;
    height: 30px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .phone {
    width: 50%;
    line-height: 30px;
    height: 30px;
  }
  .address {
    width: 100%;
    line-height: 30px;
  }
}
.goods-info {
  width: 100%;
  padding-left: 20px;
  .goods-title {
    display: flex;
    width: 100%;
  }
  .content {
    display: flex;
    width: 100%;
  }
  .name {
    width: 60%;
    line-height: 30px;
    height: 30px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .number {
    width: 40%;
    line-height: 30px;
    height: 30px;
  }
}
.foot {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>
