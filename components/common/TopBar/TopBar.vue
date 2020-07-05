<template>
  <v-card-title>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="auto">
            <v-subheader class="display-1">
              {{ title }}
            </v-subheader>
          </v-col>
          <v-spacer />
          <v-col cols="6">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="搜索"
              single-line
              hide-details
              @input="sendSearch"
            />
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-btn v-if="addBtn" color="primary" @click="addItem">
              <v-icon>mdi-plus</v-icon>新增
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-expansion-panels tile>
          <v-expansion-panel>
            <v-expansion-panel-header>搜索选项</v-expansion-panel-header>
            <v-expansion-panel-content>
              <slot />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-card-title>
</template>

<script>
export default {
  name: 'TopBar',
  props: {
    title: {
      type: String,
      default() {
        return ''
      }
    },
    addBtn: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      search: '',
      dialog: false
    }
  },
  methods: {
    sendSearch() {
      this.$emit('show-search', this.search)
    },
    addItem() {
      this.$emit('add-item')
    }
  }
}
</script>

<style scoped></style>
