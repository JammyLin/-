<template>
  <v-row class="category_nav" no-gutters>
    <v-col cols="12">
      <v-row class="category_row" no-gutters>
        <v-col cols="auto" class="cate_row_l">
          {{ title }}
        </v-col>
        <v-col class="cate_row_r">
          <ul>
            <li
              v-for="(item, i) in list"
              :key="i"
              :class="{ active: index === i }"
              @click.stop="handleLiClick(i)"
            >
              <a>{{ item }}</a>
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'CataList',
  props: {
    // eslint-disable-next-line
    title: String,
    // eslint-disable-next-line
    list: Array
  },
  data() {
    return {
      index: 0
    }
  },
  methods: {
    handleLiClick(index) {
      this.index = index
      this.$emit('li-click', this.index)
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
    display: inline-block;
  }
  .cate_row_r {
    margin-right: 30px;
    font-size: 12px;
    display: inline-block;
    border-bottom: 1px dashed #dedede;
    a {
      padding: 0 10px;
      color: #888;
    }
    ul,
    li {
      padding-left: 0;
      display: inline-block;
    }
    li {
      cursor: pointer;
      &:hover {
        color: #03a9f4;
        a {
          color: #03a9f4;
        }
      }
    }
    li.active {
      color: #03a9f4;
      a {
        color: #03a9f4;
      }
    }
  }
}
</style>
