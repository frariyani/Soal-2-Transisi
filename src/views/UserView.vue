<template>
  <div class="pa-8">
    <v-card class="mt-4 mx-auto">
      <v-sheet
        class="v-sheet--offset mx-auto"
        color="#F7EFE5"
        elevation="8"
        max-width="calc(100% - 32px)"
      >
        <v-card-title>
          <h3 class="font-weight-bold">Daftar User</h3>
          <v-spacer></v-spacer>

          <v-btn
            depressed
            color="#C58940"
            class="white--text"
            @click="formDialog = true"
            >Tambah</v-btn
          >
        </v-card-title>
      </v-sheet>

      <v-card-text>
        <v-data-table :headers="headers" :items="users">
          <template v-slot:[`item.avatar`]="{ item }">
            <v-avatar>
              <img :src="item.avatar" style="width: 40px; height: 40px" />
            </v-avatar>
          </template>

          <template v-slot:[`item.fullname`]="{ item }">
            {{ item.first_name }} {{ item.last_name }}
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              style="margin-right: 15px"
              x-small
              depressed
              color="orange"
              class="white--text"
              @click="singleUser(item.id)"
            >
              <v-icon x-small>mdi-account</v-icon>
            </v-btn>
            <v-btn
              style="margin-right: 15px"
              x-small
              depressed
              color="success"
              class="white--text"
              @click="editHandler(item)"
            >
              <v-icon x-small>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              style="margin-right: 15px"
              x-small
              depressed
              color="error"
              class="white--text"
              @click="deleteHandler(item.id)"
            >
              <v-icon x-small>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="formDialog" persistent max-width="600px">
      <v-card tile>
        <v-toolbar color="#C58940" dark height="50" flat class="mb-2">
          <v-toolbar-title>
            {{ formTitle }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dismiss">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" lazy-validation>
              <v-text-field
                v-model="form.name"
                label="Name"
                :rules="nameRules"
                solo
                required
              ></v-text-field>

              <v-text-field
                v-model="form.job"
                label="Job"
                :rules="jobRules"
                solo
                required
              ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dismiss"> Batal </v-btn>
          <v-btn color="blue darken-1" text @click="setForm"> Simpan </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="confirmDialog"
      persistent
      max-width="600px"
    >
      <v-card tile>
        <v-toolbar color="#C58940" dark height="50" flat>
          <v-toolbar-title>
            Konfirmasi
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dismiss">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-title>
          Delete this user?
        </v-card-title>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="dismiss">
          Batal
        </v-btn>
        <v-btn color="blue darken-1" text @click="deleteUser">
          Ya
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color">{{ message }}</v-snackbar>
  </div>
</template>
<script>
export default {
  name: "UserView",
  data() {
    return {
      formDialog: false,
      confirmDialog: false,
      message: null,
      snackbar: false,
      color: null,
      user: new FormData(),
      formTitle: "Tambah",
      headers: [
        {
          text: "",
          align: "start",
          value: "avatar",
        },
        {
          text: "Email",
          value: "email",
        },
        {
          text: "Fullname",
          value: "fullname",
        },
        {
          text: "",
          value: "actions",
        },
      ],
      users: [],
      form: {
        name: "",
        job: "",
        id: ""
      },
      nameRules: [(v) => !!v || "Nama cannot be empty"],
      jobRules: [(v) => !!v || "Job cannot be empty"],
    };
  },
  methods: {
    alert(status, message) {
      this.color = status === 201 ? "success" : "error";
      this.title = status;
      this.message = message;
      this.snackbar = true;
    },
    alertUpdate(status, message) {
      this.color = status === 200 ? "success" : "error";
      this.title = status;
      this.message = message;
      this.snackbar = true;
    },
    alertDelete(status, message) {
      this.color = status === 204 ? "success" : "error";
      this.title = status;
      this.message = message;
      this.snackbar = true;
    },
    async getUsers() {
      let url = this.$api + "users";

      this.$http.get(url, {}).then((response) => {
        this.users = response.data.data;
        console.log(this.users);
      });
    },
    deleteHandler(id){
        this.confirmDialog = true
        this.form.id = id
    },
    async deleteUser(){
        let url = this.$api + 'users/id'+this.form.id

        const res = await this.$http.delete(url,{})

        try{
            this.confirmDialog = false
            this.alertDelete(res.status, "delete user success")
        }catch(e){
            console.log(e)
        }
    },
    setForm() {
      if (this.formTitle == "Tambah") {
        this.save();
      } else {
        this.update()
      }
    },
    async update(){
        let newData = this.form

        try{
            let url = this.$api + "users/"+this.form.id
            const res = await this.$http.put(url, newData, {})
            
            this.alertUpdate(res.status, "update user success");
        }catch(e){
            console.log(e)
        }
    },
    async save() {
      this.user.append("name", this.form.name);
      this.user.append("job", this.form.job);

      if (this.$refs.form.validate()) {
        let url = this.$api + "user";
        try {
          const res = await this.$http.post(url, this.user, {});

          var response = res;
          this.alert(response.status, "add user success");
        } catch (e) {
          console.log(e);
        }
      } else {
        return;
      }
    },
    editHandler(item) {
      this.formTitle = "Edit";
      this.formDialog = true;
      this.form.name = item.name
      this.form.job = item.job;
      this.form.id = item.id
    },
    dismiss() {
      this.formDialog = false;
      this.formTitle = "Tambah";
      this.confirmDialog = false
      Object.keys(this.form).forEach((key) => {
        this.form[key] = null;
      });
    },
    singleUser(id){
        this.$router.push('/user/'+id)
    }
  },
  mounted() {
    this.getUsers();
  },
};
</script>
<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>