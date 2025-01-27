<template>
  <el-dialog class="dmx-login-dialog" :model-value="visible" width="20em" title="Sign in" :modal="false"
      @opened="opened" @close="close">
    <div class="field" v-if="showSelect">
      <div class="field-label">Authorization Method</div>
      <el-select class="auth-method-selector" v-model="authMethod">
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
      <component v-for="(ext, i) in extensions" :is="ext" :key="i"></component>
    </div>
    <div class="field">
      {{message}}
    </div>
    <template #footer>
      <el-button type="primary" @click="login">Sign in</el-button>
    </template>
  </el-dialog>
</template>

<script>
import dmx from 'dmx-api'

export default {

  created () {
    // console.log('dmx-login-dialog created', this.authMethods)
    dmx.rpc.getAuthorizationMethods().then(authMethods => {
      // console.log('[DMX] Installed auth methods', authMethods)
      this.authMethods = this.authMethods.concat(authMethods)
      this.authMethod = this.authMethods[0]
    })
  },

  mounted () {
    // console.log('dmx-login-dialog mounted')
  },

  props: {
    visible: Boolean,
    extensions: Array           // Vue components
  },

  data () {
    return {
      authMethods: [],   // names of installed auth methods (array of string)
      authMethod: undefined,
      credentials: {
        username: '',
        password: ''
      },
      message: ''
    }
  },

  computed: {
    showSelect () {
      return this.authMethods.length > 1
    }
  },

  methods: {

    login () {
      dmx.rpc.login(this.credentials, this.authMethod).then(() => {
        this.message = 'Signing in OK'
        this.$emit('logged-in', this.credentials.username)
        this.close()
      }).catch(error => {
        this.message = 'Signing in failed'
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
.dmx-login-dialog .auth-method-selector {
  width: 100px;
}

.dmx-login-dialog .field + .field {
  margin-top: var(--field-spacing);
}
</style>
