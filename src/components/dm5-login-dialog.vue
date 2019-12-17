<template>
  <el-dialog custom-class="dm5-login-dialog" :visible="visible_" width="20em" title="Login"
      @opened="opened" @close="close">
    <div class="field" v-if="showSelect">
      <div class="field-label">Authorization Method</div>
      <el-select v-model="authMethod">
        <el-option v-for="authMethod in authMethods" :value="authMethod" :key="authMethod"></el-option>
      </el-select>
    </div>
    <div class="field">
      <div class="field-label">Username</div>
      <el-input v-model="credentials.username" ref="username" @keyup.native.enter="advance"></el-input>
    </div>
    <div class="field">
      <div class="field-label">Password</div>
      <el-input v-model="credentials.password" ref="password" @keyup.native.enter="login" type="password"></el-input>
    </div>
    <div class="field">
      {{message}}
    </div>
    <div slot="footer">
      <el-button type="primary" @click="login">OK</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dm5 from 'dm5'

export default {

  created () {
    // console.log('dm5-login-dialog created', this.authMethods)
    dm5.restClient.getAuthorizationMethods().then(authMethods => {
      console.log('[DMX] Installed auth methods', authMethods)
      this.authMethods = this.authMethods.concat(authMethods)
    })
    //
    this.authMethod = this.authMethods[0]
  },

  mounted () {
    // console.log('dm5-login-dialog mounted')
  },

  props: {
    visible: Boolean,
  },

  data () {
    return {
      authMethods: ['Basic'],   // names of installed auth methods (array of string)
      authMethod: undefined,
      credentials: {
        username: '',
        password: ''
      },
      message: '',
      // mirror props
      visible_: this.visible
    }
  },

  computed: {
    showSelect () {
      return this.authMethods.length > 1
    }
  },

  watch: {
    // needed when instantiated via template
    visible () {
      this.visible_ = this.visible
    }
  },

  methods: {

    login () {
      dm5.restClient.login(this.credentials, this.authMethod).then(() => {
        this.message = 'Login OK'
        this.$emit('logged-in', this.credentials.username)
        this.close()
      }).catch(error => {
        this.message = 'Login failed'
      }).finally(() => {
        this.credentials.password = ''
      })
    },

    opened () {
      this.$refs.username.focus()
      this.message = ''
    },

    close () {
      // console.log('close login')
      // FIXME: called twice when closing programmatically (through login())
      this.$emit('close')
    },

    advance () {
      this.$refs.password.focus()
    }
  }
}
</script>

<style>
.dm5-login-dialog .field + .field {
  margin-top: var(--field-spacing);
}
</style>
