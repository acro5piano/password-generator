Vue.createApp({
  created() {
    const onChange = async () => {
      if (this.salt && this.identifier) {
        this.password = await digestMessage(`${this.salt}__${this.identifier}`)
      }
    }
    this.$watch('salt', onChange)
    this.$watch('identifier', onChange)
  },
  data() {
    return {
      salt: '',
      identifier: '',
      length: 32,
      password: '',
      message: '',
      showPassword: false,
    }
  },
  methods: {
    async copyToClipboard() {
      await navigator.clipboard.writeText(this.passwordWithFixedLength)
      this.message = 'Copied!'
      setTimeout(() => (this.message = ''), 4000)
    },
  },
  computed: {
    passwordWithFixedLength() {
      return this.password.slice(0, this.length)
    },
  },
}).mount('#app')

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return btoa(hashHex)
}
