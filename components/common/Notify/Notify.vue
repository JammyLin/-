<template>
  <div class="notify-component">
    <notifications class="notify-default" :width="width">
      <template v-slot:body="{ item, close }">
        <div class="notify-default" :class="item.type">
          <div class="blur-bg"></div>
          <div class="action-close" @click="close">
            <v-icon>mdi-close</v-icon>
          </div>
          <v-icon class="notify-icon">{{ setIcon(item.type) }}</v-icon>
          <div style="width: 140px">
            <div class="notification-content">{{ item.text }}</div>
          </div>
        </div>
      </template>
    </notifications>
  </div>
</template>

<script>
export default {
  name: 'Notify',
  props: {
    group: {
      type: String,
      default: ''
    },
    width: {
      type: [Number, String],
      default: 250
    },
    position: {
      type: [String, Array],
      default: () => {
        return ['top', 'right']
      }
    }
  },
  methods: {
    setIcon(type) {
      switch (type) {
        case 'error':
          return 'mdi-alert-outline'
        case 'warn':
          return 'mdi-alert-decagram-outline'
        case 'success':
          return 'mdi-check-circle-outline'
        default:
          return 'mdi-information-outline'
      }
    }
  }
}
</script>

<style>
.vue-notification-group {
  display: block;
  position: fixed;
  z-index: 5000;
}
.vue-notification-wrapper {
  display: block;
  overflow: hidden;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>

<style lang="scss">
.notify-default {
  padding: 4px 21px 10px 11px;
  margin: 11px 7px 0 0;
  font-size: 12px;
  color: #ffffff;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  background-color: transparent !important;
  border-radius: 8px;
  .blur-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    z-index: -1;
    background-color: #616161 !important;
    filter: blur(1px);
    border-radius: 8px;
  }
  .action-close {
    position: absolute;
    z-index: 5001;
    top: 18px;
    right: 12px;
  }
  .notify-icon {
    margin-right: 12px;
  }
  .notification-content {
    line-height: 1.5;
  }
  &.warn {
    background-color: transparent !important;
    .notify-icon {
      color: #ffb648;
    }
  }
  &.error {
    background-color: transparent !important;
    .notify-icon {
      color: #e54d42;
    }
  }
  &.success {
    background-color: transparent !important;
    .notify-icon {
      color: #68cd86;
    }
  }
}
</style>
