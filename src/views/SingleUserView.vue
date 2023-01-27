<template>
  <div class="card">
    <v-card class="mx-auto" max-width="344" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-h5 mb-1">
            {{user.first_name}} {{user.last_name}}
          </v-list-item-title>
          <v-list-item-subtitle
            >{{user.email}}</v-list-item-subtitle
          >
        </v-list-item-content>

        <v-list-item-avatar tile size="80" color="grey">
            <img :src="user.avatar">
        </v-list-item-avatar>
      </v-list-item>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      user: null,
    }
  },
  methods:{
    async getDetail(){
        let url = this.$api + "users/"+this.id
        try{
            var res = await this.$http.get(url, {})
            this.user = res.data.data

            console.log(this.user)
        }catch(error){
            alert("user not found")
            this.$router.go(-1)
        }
    }
  },
  mounted(){
    this.getDetail()
  }
};
</script>