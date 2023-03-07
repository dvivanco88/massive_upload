<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-2">
        <div class="row" style="margin-top: -3rem;">
          <div class="col-12 d-flex justify-content-center">
            <img src="@/assets/logo.jpg" class="img-fluid" style="width: 50%;">
          </div>          
        </div>          
        <div class="row m-1">
          <div class="list-group">
            <router-link to="/" active-class="active" class="list-group-item list-group-item-action">Users</router-link>
            <router-link to="/userRoles" active-class="active" class="list-group-item list-group-item-action">User Roles</router-link>
            <router-link to="/materials" active-class="active" class="list-group-item list-group-item-action">Materials</router-link>
            <router-link to="/materialsToOrgs" active-class="active" class="list-group-item list-group-item-action">Materials to Orgs</router-link>
            <router-link to="/materialsToRoutes" active-class="active" class="list-group-item list-group-item-action">Materials to Routes</router-link>
            <router-link to="/WIP" active-class="active" class="list-group-item list-group-item-action">WIP</router-link>
          </div>
        </div>
      </div>
      <div class="col-10" style="margin-top: -3rem;">
        <div class="row border m-1 mt-0">
          <h2 class="col-12 mt-2">Massive Uploads</h2>
          <div class="col-2 mt-2 mb-4 text-start">
            <label for="orgByPlant" :class="`form-label`">Org By Plant</label>
            <input class="form-control form-control-sm" type="text" id="orgByPlant" v-model="orgByPlant">
          </div>
          <div class="col-2 mt-2 mb-4 text-start">
            <label for="userId" :class="`form-label ${redEmailColor ? 'text-danger' : ''}`"  >Email address</label>
            <input :class="`form-control form-control-sm ${redEmailColor ? 'text-danger' : ''} `" id="userId" type="text" v-model="email" @click="email = ''">
          </div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'App',
  components: {
   
  },
  data() {
    return {
      email: 'your_email_here',
      orgByPlant: 1,
    }
  },
  computed: {
    redEmailColor(){
      let result = true
      if(this.$root.email && this.$root.email != 'your_email_here')
        result = false
      else 
        result = true 
        
      return result 
    }     
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.active{
  background-color: #004793 !important;
  color: #f3f3f3 !important;
  font-weight: bolder;
}
</style>
