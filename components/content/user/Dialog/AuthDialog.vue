<template>
  <v-dialog v-model="dialog" max-width="300" persistent>
    <v-card>
      <v-card-title>
        权限调整
      </v-card-title>
      <v-card-text class="pt-2">
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="roleType"
                :items="roleList"
                label="权限等级"
                :rules="roleTypeRules"
                outlined
                dense
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" text @click="close">取消</v-btn>
        <v-btn color="blue darken-1" text @click="confirm">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AuthDialog',
  data() {
    return {
      dialog: false,
      roleType: null,
      roleList: [],
      roleTypeRules: [(v) => !!v || '请选择所要调整的权限等级'],
      valid: false
    }
  },
  computed: {
    ...mapGetters(['getRoleType'])
  },
  methods: {
    async show() {
      await setTimeout(() => {
        const roles = [
          { value: 1, text: '快递员' },
          { value: 2, text: '快递管理员' },
          { value: 3, text: '上级管理员' },
          { value: 4, text: '超级管理员' }
        ]
        let index = 0
        while (index < parseInt(this.getRoleType) - 1) {
          this.roleList.push(roles[index])
          index++
        }
      })
      this.dialog = true
    },
    confirm() {
      this.$refs.form.validate()
      if (this.valid) {
        this.$emit('change-auth', this.roleType)
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
