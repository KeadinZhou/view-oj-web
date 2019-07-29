import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const api = 'http://47.111.25.1:5000'
var state = {
  page: null,
  user: {
    userid: '',
    username: '',
    permission: ''
  },
  OverviewData: [],
  OverviewGrade: [],
  OJlist: null, // Map
  UserallChartData: [],
  Userlist: null, // Map
  OJSetTableData: null
}

var mutations = {
  savePage (state, page) {
    state.page = page
  },
  updateUser (state) {
    state.page.$http.post(api + '/v1/user/get_user_info')
      .then(data => {
        state.user.userid = data.data.data.username
        state.user.username = data.data.data.nickname
        state.user.permission = data.data.data.permission
      })
      .catch(function (error) {
        if (error.response) {}
      })
  },
  login (state, data) {
    state.page.$http.post(api + '/v1/user/login', {
      username: data.username,
      password: data.password
    })
      .then(data => {
        state.page.$store.commit('updateUser')
        state.page.$message.success(data.data.msg)
        state.page.$router.push('/')
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  logout (state) {
    state.page.$http.post(api + '/v1/user/logout')
      .then(data => {
        state.user = {
          userid: '',
          username: '',
          permission: ''
        }
        state.page.$message.success(data.data.msg)
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  updateOverview (state, date) {
    state.OverviewData = []
    state.OverviewGrade = new Set()
    var i
    state.page.$http.post(api + '/v1/data/get_all_accept_problem_count', date || null)
      .then(data => {
        for (i in data.data.data) {
          var item = data.data.data[i]
          state.OverviewData.push({
            userid: item.username,
            username: item.nickname,
            number: item.accept_problem_count
          })
        }
        for (i = 0; i < state.OverviewData.length; i++) {
          var tmp = state.OverviewData[i].userid.substr(1, 2)
          state.OverviewGrade.add(tmp)
        }
        state.OverviewGrade = Array.from(state.OverviewGrade)
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  updateUserlist (state) {
    state.page.$http.post(api + '/v1/user/get_user_list')
      .then(data => {
        state.Userlist = new Map()
        for (var i in data.data.data) {
          var item = data.data.data[i]
          state.Userlist.set(item.username, item)
        }
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  updateAllData (state) {
    state.page.$http.post(api + '/v1/task/refresh_all_data')
      .then(data => {
        state.page.$message.success(data.data.msg)
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  updateUserallChartData (state, username) {
    state.page.$http.post(api + '/v1/data/get_accept_problem_distributed', {username: username})
      .then(data => {
        state.UserallChartData = []
        for (var i in data.data.data) {
          var item = data.data.data[i]
          state.UserallChartData.push({
            'OJ': item.oj_id,
            'Accept': item.accept_problem_count
          })
        }
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  modifyUserInfo (state, data) {
    state.page.$http.post(api + '/v1/user/modify_user_info', data)
      .then(data => {
        state.page.$message.success(data.msg)
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  addUser (state, data) {
    state.page.$http.post(api + '/v1/user/create_user', data)
      .then(data => {
        state.page.$store.commit('updateUserlist')
        state.page.$message.success(data.msg)
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  updateOJSetTableData (state, username) {
    state.page.$http.post(api + '/v1/user/get_oj_username', {username: username})
      .then(data => {
        state.OJSetTableData = new Map()
        for (var i in data.data.data) {
          var item = data.data.data[i]
          state.OJSetTableData.set(item.oj_id, item.username)
        }
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  modifyOJID (state, data) {
    state.page.$http.post(api + '/v1/user/modify_oj_username', {
      user_id: data.userid,
      oj_id: data.ojid,
      username: data.id
    })
      .then(data => {
        state.page.$message.success(data.data.msg)
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  updateUserOJData (state, data) {
    state.page.$http.post(api + '/v1/task/refresh_data', {
      user_id: data.userid,
      oj_id: data.ojid
    })
      .then(data => {
        state.page.$message.success(data.data.msg)
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  }
}

export default new Vuex.Store({
  state,
  mutations
})
