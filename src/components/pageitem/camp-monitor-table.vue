<template>
  <div>
    <el-dialog
        title="添加比赛"
        :visible.sync="isAppendDialogShow"
        width="600px"
        append-to-body>
      <el-form label-position="left" v-model="appendForm" label-width="120px">
        <el-form-item label="比赛名称">
          <el-input v-model="appendForm.name"/>
        </el-form-item>
        <el-form-item label="比赛cid">
          <el-input v-model="appendForm.contest_cid"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="initAppendForm">取 消</el-button>
        <el-button type="primary" @click="submitAppendForm">确 定</el-button>
      </div>
    </el-dialog>
    <div style="display: flex; margin-bottom: 15px">
      <el-select
          style="flex-grow: 1; margin-right: 5px"
          placeholder="Select a contest"
          v-model="selectedContest"
          popper-append-to-body>
        <el-option
            v-for="contest of contests"
            :key="contest.id"
            :label="contest.name"
            :value="contest.id"/>
      </el-select>
      <el-tooltip v-if="$store.state.user.permission===1" content="append contest" placement="top">
        <el-button class="el-icon-plus" @click="isAppendDialogShow = true"/>
      </el-tooltip>
    </div>
    <template v-if="selectedContest !== ''">
      <el-card shadow="never">
        <el-table
            :data="tableData"
            :default-sort="{prop: 'rating', order: 'descending'}"
            v-loading="isLoading">
          <el-table-column label="TeamName" align="center" width="160" prop="name" fixed="left">
            <template slot-scope="scope">
              <el-popover :content="getMembersStr(scope.row.members)" trigger="click" placement="top">
                <el-link :underline="false" slot="reference">
                  {{ scope.row.team_name }}
                </el-link>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="Cnt" align="center" width="70" prop="count" fixed="left"
                           sortable :sort-method="function(a,b) {return Number(a.count) - Number(b.count)}">
            <template slot-scope="scope">
              {{ scope.row.count }}
            </template>
          </el-table-column>
          <template v-for="(problem, index) in  proList">
            <el-table-column align="center" :key="index" min-width="35">
              <template slot="header">
                <el-tooltip class="item" effect="dark"
                            :content="problem"
                            placement="top">
                  <b>{{ problem }}</b>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark"
                            :content="problem"
                            placement="top">
                  <i :class="scope.row.state[index]?'el-icon-success doneColor':'el-icon-minus'"></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="Rating" align="center" width="90" prop="rating" fixed="right"
                           sortable :sort-method="function(a,b) {return Number(a.rating) - Number(b.rating)}">
            <template slot-scope="scope">
              {{ scope.row.rating }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>
  </div>
</template>

<script>
export default {
  name: "camp-monitor-table",
  props: {
    course_id: String,
    contests: Array,
  },
  data() {
    return {
      isLoading: true,
      tableData: [],
      proList: [],
      selectedContest: '',
      isAppendDialogShow: false,
      appendForm: {
        'name': '',
        'contest_cid': ''
      }
    }
  },
  methods: {
    getMembersStr(members) {
      let s = '团队成员:'
      for (let member of members) {
        s += ' ' + member.nickname
      }
      return s
    },
    refreshContestData() {
      if (this.selectedContest === '') return
      let api = this.$store.state.api
      let that = this
      this.tableData = []
      this.isLoading = true
      this.$http.get(api + "/v2/camp/contest/" + this.selectedContest + '/detail')
          .then(response => {
            let data = response.data.data
            that.proList = []
            for (let problem of data.all_problems) {
              that.proList.push(problem.problem_pid)
            }
            for (let item of data.user_state) {
              let proset = new Set()
              for (let ac_problem of item.accepted_problems) {
                proset.add(ac_problem.problem.problem_pid)
              }
              let state = []
              for (let problem of that.proList) {
                state.push(proset.has(problem))
              }
              that.tableData.push({
                team_name: item.team_name,
                members: item.members,
                state: state,
                count: proset.size,
                rating: item.rating
              })
            }
            that.isLoading = false
          })
    },
    initAppendForm() {
      Object.assign(this.appendForm, this.$options.data().appendForm)
      this.isAppendDialogShow = false
    },
    submitAppendForm() {
      if (this.appendForm.name === '') {
        this.$message.error('比赛名称不能为空')
        return
      }
      if (this.appendForm.contest_cid === '') {
        this.$message.error('比赛cid不能为空')
        return
      }
      let api = this.$store.state.api
      let that = this
      this.$http.post(api + '/v2/camp/course/' + this.course_id + '/append_contest', {
        name: that.appendForm.name,
        contest_cid: that.appendForm.contest_cid
      }).then(response => {
        that.$message.success(response.data.msg)
        that.initAppendForm()
      }).catch(error => {
        if (error.response) {
          that.$message.error(error.response.data.msg)
        } else {
          that.$message.error('无法连接至服务器')
        }
      })
    }
  },
  created() {
    this.selectedContest = ''
  },
  watch: {
    selectedContest() {
      this.refreshContestData()
    }
  }
}
</script>

<style scoped>
.doneColor {
  color: #67C23A;
}
</style>
