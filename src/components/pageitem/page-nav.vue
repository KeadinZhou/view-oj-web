<template>
    <div>
        <el-menu :default-active="this.$route.path" class="page-nav" style="height:60px;width:100%;z-index:1000" mode="horizontal" @select="handleSelect" router>
            <el-menu-item index="/" class="nav-item" route="/">Home</el-menu-item>
            <el-menu-item index="/ranklist" class="nav-item" route="/ranklist">Ranklist</el-menu-item>
            <el-menu-item index="/monitor" class="nav-item" route="/monitor">Monitor</el-menu-item>
            <template v-if="this.$store.state.user.userid">
                <el-menu-item :index="'/user/'+$store.state.user.userid" class="nav-item" :route="'/user/'+$store.state.user.userid">Userinfo</el-menu-item>
                <template v-if="this.$store.state.user.permission === 1">
                    <el-menu-item index="/admin" class="nav-item" route="/admin">Admin</el-menu-item>
                </template>
            </template>
            <div class="userBox">
                <template v-if="this.$store.state.user.userid">
                    <span>Welcome,<use-change-box></use-change-box>&nbsp;&nbsp;</span>
                    <el-button icon="el-icon-user" @click="logout">Logout</el-button>
                </template>
                <template v-else>
                    <el-button type="primary" icon="el-icon-user" @click="$router.push('/login')">Login</el-button>
                </template>
            </div>
        </el-menu>
    </div>
</template>

<script>
import store from '@/vuex/store.js'
import UserChangeBox from '@/components/pageitem/user-change-box'
export default {
  name: 'page-nav',
  components: {
    'use-change-box': UserChangeBox
  },
  data () {
    return {
    }
  },
  store,
  methods: {
    handleSelect (key, keyPath) {
    },
    logout () {
      this.$store.commit('logout')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
    .nav-item{
        font-size: 16px;
    }
    .userBox{
        position: relative;
        float: right;
        top: 50%;
        transform: translate(0,-50%);
        outline:none;
        font-size: 15px;
    }
</style>
