<template>
  <div id="page-top">
    <el-menu :default-active="this.$route.path" class="page-nav" style="height:60px;width:100%;z-index:1000"
             mode="horizontal" router>
      <template v-if="$store.state.showFreshmanStatus">
        <el-submenu index="status">
          <template slot="title">Status</template>
          <el-menu-item index="/" route="/">Member</el-menu-item>
          <el-menu-item index="/freshman" route="/freshman">Freshman</el-menu-item>
        </el-submenu>
      </template>
      <template v-else>
        <el-menu-item index="/" route="/">Status</el-menu-item>
      </template>
      <el-menu-item index="/upcoming-list" route="/upcoming-list">Upcoming</el-menu-item>
      <el-menu-item index="/ranklist" route="/ranklist">Ranklist</el-menu-item>
      <el-menu-item index="/camp" route="/camp">Camp</el-menu-item>
      <el-menu-item index="/monitor" route="/monitor">Monitor</el-menu-item>
      <template v-if="this.$store.state.user.userid">
        <el-menu-item :index="'/user/'+$store.state.user.userid"
                      :route="'/user/'+$store.state.user.userid">Userinfo
        </el-menu-item>
        <template v-if="this.$store.state.user.permission === 1">
          <el-menu-item index="/admin" route="/admin">Admin</el-menu-item>
        </template>
      </template>
      <div class="userBox">
        <template v-if="this.$store.state.user.userid">
          <span style="margin-right: 15px">Welcome,<use-change-box></use-change-box></span>
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
import store from '@/store'
import UserChangeBox from '@/components/pageitem/user-change-box'

export default {
  name: 'page-nav',
  components: {
    'use-change-box': UserChangeBox
  },
  data() {
    return {}
  },
  store,
  methods: {
    logout() {
      this.$store.commit('logout')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.page-nav .el-menu-item, /deep/ .page-nav .el-submenu__title {
  font-size: 16px;
}

.userBox {
  position: relative;
  float: right;
  top: 50%;
  transform: translate(0, -50%);
  outline: none;
  font-size: 15px;
}
</style>
