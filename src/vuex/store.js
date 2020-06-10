import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const api = 'http://view-oj-api.newitd.com'
var state = {
  page: null,
  api: api,
  user: {
    userid: '',
    username: '',
    permission: '',
    status: '',
    isUpdated: false
  },
  OverviewData: [],
  OverviewGrade: [],
  OJlist: null, // Map
  UserallChartData: [],
  Userlist: null, // Map
  OJSetTableData: null,
  ACTableData: [],
  ACTableSize: 0
}

var mutations = {
  savePage (state, page) {
    state.page = page
  },
  updateUser (state) {
    state.page.$http.get(api + '/v2/session')
      .then(data => {
        state.user.userid = data.data.data.username
        state.user.username = data.data.data.nickname
        state.user.permission = data.data.data.permission
        state.user.status = data.data.data.status
        state.user.isUpdated = true
      })
      .catch(function (error) {
        if (error.response) {
          state.user.isUpdated = true
        }
      })
  },
  login (state, data) {
    state.page.$http.post(api + '/v2/session', {
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
    state.page.$http.delete(api + '/v2/session')
      .then(data => {
        state.user = {
          userid: '',
          username: '',
          permission: '',
          status: '',
          isUpdated: false
        }
        state.page.$store.commit('updateUser')
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
    state.page.$http.get(api + '/v2/accept_problem/summary', {params: date || null})
      .then(data => {
        for (i in data.data.data) {
          var item = data.data.data[i]
          state.OverviewData.push({
            userid: item.user.username,
            username: item.user.nickname,
            number: item.num,
            group: item.user.group
          })
        }
        for (i = 0; i < state.OverviewData.length; i++) {
          var tmp = state.OverviewData[i].group
          state.OverviewGrade.add(tmp)
        }
        state.OverviewGrade = Array.from(state.OverviewGrade)
        state.OverviewGrade.sort(function (a, b) {
          if (a < b) return 1
          else return -1
        })
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  updateUserlist (state) {
    state.page.$http.get(api + '/v2/user/rating')
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
    state.page.$http.post(api + '/v2/task', {
      type: 'crawl_user_info'
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
  updateUserallChartData (state, data) {
    let chart = data.chart
    state.page.$http.get(api + '/v2/user/' + data.username)
      .then(data => {
        state.UserallChartData = []
        for (let item of data.data.data.problem_distributed) {
          if (item.num === 0) continue
          state.UserallChartData.push({
            'OJ': item.oj.name,
            'Accept': item.num
          })
        }
        chart.chartData.rows = state.UserallChartData
        chart.loading = false
        chart.reFreshChart()
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  modifyUserInfo (state, data) {
    state.page.$http.patch(api + '/v2/user/' + data.username, data)
      .then(data => {
        state.page.$message.success(data.data.msg)
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  addUser (state, data) {
    state.page.$http.post(api + '/v2/user', data)
      .then(data => {
        state.page.$store.commit('updateUserlist')
        state.page.$message.success(data.data.msg)
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  updateOJSetTableData (state, username) {
    state.page.$http.get(api + '/v2/user/' + username)
      .then(data => {
        state.OJSetTableData = []
        for (var i in data.data.data.oj_username) {
          var item = data.data.data.oj_username[i]
          state.OJSetTableData.push(item)
        }
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  modifyOJID (state, data) {
    state.page.$http.post(api + '/v2/oj_username', {
      username: data.userid,
      oj_id: data.ojid,
      oj_username: data.id,
      oj_password: data.pwd
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
    state.page.$http.post(api + '/v2/task', {
      type: 'crawl_user_info',
      kwargs: JSON.stringify({
        username: data.userid,
        oj_id: data.ojid
      })
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
  refreshProblemRating (state, id) {
    state.page.$http.post(api + '/v2/task', {
      type: 'crawl_problem_info',
      kwargs: JSON.stringify({
        problem_id: id
      })
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
  modifyPassword (state, data) {
    state.page.$http.patch(api + '/v2/user/' + data.username, data)
      .then(data => {
        state.page.$message.success(data.data.msg)
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  modifyUserNameBySelf (state, username) {
    state.page.$http.post(api + '/v1/user/modify_user_info', {
      username: state.user.userid,
      nickname: username,
      permission: state.user.permission,
      status: state.user.status
    })
      .then(data => {
        state.user.username = username
        state.page.$message.success(data.data.msg)
      })
      .catch(function (error) {
        if (error.response) {
          state.page.$message.error(error.response.data.msg)
        }
      })
  },
  refreshUserRating (state, username) {
    state.page.$http.post(api + '/v2/task', {
      type: 'calculate_user_rating',
      kwargs: JSON.stringify({
        username: username
      })
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
