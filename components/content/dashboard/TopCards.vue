<template>
  <v-row class="fill-height" align="center" justify="center">
    <template v-for="(item, i) in items">
      <v-col :key="i" cols="12" md="4">
        <v-hover v-slot:default="{ hover }">
          <v-card :elevation="hover ? 12 : 2">
            <v-card-title class="title">
              {{ item.title }}
            </v-card-title>
            <v-card-text>
              <span class="mr-1 headline font-weight-bold font-italic">
                {{ item.text }}
              </span>
              <span>
                件
              </span>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </template>
  </v-row>
</template>

<script>
export default {
  name: 'TopCards',
  props: {
    // eslint-disable-next-line
    roleType: Number,
    // eslint-disable-next-line
    data: Array
  },
  data: () => ({
    items: []
  }),
  mounted() {
    const title = this.getTitle(this.roleType)
    for (const index in title) {
      this.items.push({
        title: title[index],
        text: this.data[index]
      })
    }
  },
  methods: {
    getTitle(roleType) {
      if (roleType === 4)
        return ['本月所有仓库快递', '本月所有仓库入库', '本月所有仓库出库']
      else if (roleType === 1) return ['本月配送快递', '总计配送快递']
      else return ['本月快递', '本月入库', '本月出库']
    }
  }
}
</script>

<style lang="scss" scoped>
.v-card {
  transition: opacity 0.4s ease-in-out;
  text-align: right;
}
</style>
