<template>
  <v-row class="category_nav" no-gutters>
    <v-col cols="12">
      <v-row class="category_row" no-gutters>
        <v-col cols="auto" class="cate_row_l">
          {{ title }}
        </v-col>
        <v-col class="cate_row_r">
          <v-overflow-btn
            v-model="id"
            :items="list"
            :item-text="itemText"
            item-value="id"
            class="item"
            :hide-details="true"
            auto-select-first
            dense
            solo
            flat
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ItemList',
  props: {
    // eslint-disable-next-line
    title: String,
    // eslint-disable-next-line
    list: Array,
    // eslint-disable-next-line
    itemText: String
  },
  data() {
    return {
      id: 0
    }
  },
  watch: {
    id() {
      this.$emit('item-click', this.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.category_nav {
  color: #888;
  .cate_row_l {
    padding: 0 10px 0 30px;
    width: 100px;
    text-align: center;
    font-size: 12px;
    height: 42px;
    line-height: 42px;
    display: block;
  }
  .cate_row_r {
    margin-right: 30px;
    padding-bottom: 5px;
    border-bottom: 1px dashed #dedede;
    .item {
      width: 300px;
    }
  }
}
</style>
