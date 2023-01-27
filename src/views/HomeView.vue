<template>
  <v-container
    class="fill-height hero-section"
    fluid
  >
    <v-row
      class="fill-height"
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="10"
      >
        <v-expand-transition>
          <v-card
            v-show="expand"
            class="elevation-6"
          >
            <v-row
              class="fill-height px-3"
              align="center"
              justify="center"
            >
              <v-col
                cols="12"
                md="6"
              >
                <v-card-text>
                  <h1
                    class="text-center"
                  >
                    Log in
                  </h1>

                  <v-row
                    align="center"
                    justify="center"
                  >
                    <v-col
                      class="mt-16"
                      cols="12"
                      sm="8"
                    >
                      <v-form
                        ref="form"
                        lazy-validation
                      >
                        <v-text-field
                          label="Email"
                          placeholder="Email"
                          v-model="form.email"
                          :rules="emailRules"
                          solo
                          required
                          type="email"
                        ></v-text-field>
                        <v-text-field
                          label="Password"
                          placeholder="Password"
                          v-model="form.password"
                          :rules="passwordRules"
                          solo
                          required
                          type="password"
                        ></v-text-field>

                        <v-btn block color="#C58940" class="white--text" @click="login">Login</v-btn>
                      </v-form>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-col>

              <v-col
                cols="12"
                md="6"
                style="background-color: #C58940;"
              >
                <div style="  text-align: center; padding: 150px 0;">
                  <v-card-text class="white--text">
                    <v-avatar
                      class="mb-6"
                      color="grey lighten-3"
                      size="250"
                    >
                      <img
                        src="../assets/logo.png"
                        alt=""
                      >
                    </v-avatar>

                    <h1 class="text-center ">
                      Belum Punya Akun?
                    </h1>

                    <h4
                      class="text-center mt-3 font-weight-light"
                    >
                      Klik Register untuk mendaftarkan<br> akun Anda di sistem kami
                    </h4>
                  </v-card-text>

                  <div class="text-center">
                    <v-btn
                      color="white"
                      outlined
                      dark
                      @click="expand = !expand, refreshForm()"
                    >
                      Register
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-expand-transition>

        <v-expand-transition>
          <v-card
            v-show="expand === false"
            class="elevation-6"
          >
            <v-row
              class="fill-height px-3"
              align="center"
              justify="center"
            >
              <v-col
                cols="12"
                md="6"
                style="background-color: #C58940;"
              >
                <div style="  text-align: center; padding: 150px 0;">
                  <v-card-text class="white--text">
                    <v-avatar
                      class="mb-6"
                      color="grey lighten-3"
                      size="250"
                    >
                      <img
                        src="../assets/logo.png"
                        alt=""
                      >
                    </v-avatar>

                    <h1 class="text-center ">
                      Sudah Punya Akun?
                    </h1>

                    <h4
                      class="text-center mt-3 font-weight-light"
                    >
                      Klik Log In untuk untuk masuk<br> dengan akun terdaftar Anda
                    </h4>
                  </v-card-text>

                  <div class="text-center">
                    <v-btn
                      color="white"
                      outlined
                      dark
                      @click="expand = !expand, refreshForm ()"
                    >
                      Register
                    </v-btn>
                  </div>
                </div>
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-card-text>
                  <h1
                    class="text-center"
                  >
                    Register
                  </h1>

                  <v-row
                    align="center"
                    justify="center"
                  >
                    <v-col
                      class="mt-16"
                      cols="12"
                      sm="8"
                    >
                      <v-form
                        ref="form"
                        lazy-validation
                      >
                        <v-text-field
                          label="Email"
                          placeholder="Email"
                          v-model="form.email"
                          :rules="emailRules"
                          solo
                          required
                          type="email"
                        ></v-text-field>
                        <v-text-field
                          label="Password"
                          placeholder="Password"
                          v-model="form.password"
                          :rules="passwordRules"
                          solo
                          required
                          type="password"
                        ></v-text-field>

                        <v-btn block color="#C58940" class="white--text" @click="register">Register</v-btn>
                      </v-form>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-expand-transition>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar"
      :color="color"
    >{{message}}</v-snackbar>
  </v-container>
</template>

<script>

  export default {
    name: 'LoginView',

    data: () => ({
      expand: true,
      form: {
        email: null,
        password: null
      },
      emailRules: [
        v => !!v || 'Email Harus Diisi',
        (v) => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Format E-mail Tidak Valid',
      ],
      passwordRules: [
        v => !!v || 'Password Harus Diisi',
        v => (v && v.length >= 6) || 'Password Minimal 6 Karakter',
      ],
      show: false,
      color: null,
      title: null,
      load: false,
      message: null,
      snackbar: false,
      multiLine: true,
      loadingButton: false,
      checkbox: false,
      closebutton: false,
      users: [],
    }),

    methods: {
      alert (status, message) {
        this.color = status === 200 ? 'success' : 'error'
        this.title = status
        this.message = message
        this.snackbar = true
      },

      async setForm (actions) {
        let result

        if (actions === 'Register') {
          if (this.$refs.form.validate()) {
            this.loadingButton = true

            const customer = new FormData()
            customer.append('name', this.form.name)
            customer.append('email', this.form.email)
            customer.append('phone', this.form.phone)
            customer.append('password', this.form.password)

            result = await this.apiService.storeData(this.$http, 'customerStore', customer)

            this.alert(result.data.status, result.data.message)
            this.refreshForm()
          }
        } else {
          if (this.$refs.formLogin.validate()) {
            this.loadingButton = true

            const customer = new FormData()
            customer.append('reference', 'customer')
            customer.append('email', this.formLogin.email)
            customer.append('password', this.formLogin.password)

            result = await this.apiService.storeData(this.$http, 'login', customer)

            if (result.data.status === 'success') {
              if (this.checkbox === true) {
                localStorage.setItem('user', result.data.data)
                localStorage.setItem('token', result.data.access_token)
              } else {
                sessionStorage.setItem('user', result.data.data)
                sessionStorage.setItem('token', result.data.access_token)
              }

              this.$router.push('/')
            }

            this.alert(result.data.status, result.data.message)
            this.refreshFormLogin()
          }
        }
      },

      async login(){
        try{
          const res = await this.$refs.form.validate()
          const url = this.$api + 'login'
          this.load = true

          if(!res){
            return;
          }else{
            const response = await this.$http.post(url, {
              email: this.form.email,
              password: this.form.password
            }, {})

            this.alert (response.status, "login success")
            sessionStorage.setItem('token', response.data.token)
            
            this.refreshForm()
            this.$router.push({
              name: 'user'
            })
          }
        }catch(e){
          this.alert (e.response.status, e.response.data.error)
        }
      },

      async register(){
        try{
          const res = await this.$refs.form.validate()
          const url = this.$api + 'register'
          this.load = true

          if(!res){
            return;
          }else{
            const response = await this.$http.post(url, {
              email: this.form.email,
              password: this.form.password
            }, {})
            sessionStorage.setItem('token', response.data.token)
            this.alert (response.status, "register success")
            
            this.refreshForm()
          }
        }catch(e){
          this.alert (e.response.status, e.response.data.error)
        }
      },

      refreshForm () {
        Object.keys(this.form).forEach(key => {
          this.form[key] = null
        })
        this.$refs.form.reset()
        this.$refs.form.resetValidation()
        this.loadingButton = false
      },
      closing () {
        this.closebutton = false
      },
    },
  }
</script>

