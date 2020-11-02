<template>
  <div class="tableBox">
    <el-dialog
        title="Modify"
        width="30%"
        :visible.sync="showDialog"
        :append-to-body="true">
      <el-form label-position="left" label-width="100px" :model="OJSetForm">
        <el-form-item label="username">
          <el-input v-model="OJSetForm.username" autocomplete="off"/>
        </el-form-item>
        <el-form-item v-if="OJSetForm.need_password" label="password">
          <el-input v-model="OJSetForm.password" show-password autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitOJSet">提 交</el-button>
        <el-button @click="showDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <div class="tableTitle">
      <b>OJ-ID Setting</b>
    </div>
    <el-card class="box-card" shadow="hover">
      <div v-if="isRefresh">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="Userid" align="center">
            {{ userid }}
          </el-table-column>
          <el-table-column label="OJ" align="center">
            <template slot-scope="scope">
              {{ scope.row.oj.name }}
            </template>
          </el-table-column>
          <el-table-column label="ID" width="200px" align="center">
            <template slot-scope="scope">
              {{ scope.row.oj_username }}
              <template
                  v-if="(userid === $store.state.user.userid && !scope.row.oj_username) || $store.state.user.permission === 1">
                <i style="cursor: pointer" class="el-icon-edit" @click="editOJID(scope.row)"></i>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="State" align="center" width="55px">
            <template slot-scope="scope">
              <el-tooltip effect="dark"
                          :content="(scope.row.oj_username)?('Last successful update at '+scope.row.last_success_time):'No Data'"
                          placement="right">
                <div
                    :class="'dot ' + ((!scope.row.oj_username?'none':(!scope.row.last_success_time?'danger':timeSub(scope.row.last_success_time))))"></div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="Refresh" width="80px">
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="'Refresh '+scope.row.oj.name+' for '+userid"
                          placement="right">
                                <span style="cursor: pointer;margin-left: 20px" @click="refreshOJ(scope.row)"><i
                                    class="el-icon-refresh"></i></span>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'oj-set-table',
  props: {
    userid: String
  },
  data() {
    return {
      isRefresh: true,
      tableData: [],
      showDialog: false,
      OJSetForm: {
        username: '',
        password: '',
        need_password: false,
        oj: {},
      }
    }
  },
  methods: {
    editOJID(row) {
      this.OJSetForm.username = row.oj_username
      this.OJSetForm.need_password = row.oj.need_password
      this.OJSetForm.oj = row.oj
      this.showDialog = true
    },
    submitOJSet() {
      if (this.OJSetForm.username !== '' && this.OJSetForm.need_password && this.OJSetForm.password === '') {
        this.$alert('please input password', 'need password')
        return
      }
      this.$store.commit('modifyOJID', {
        userid: this.userid,
        oj_id: this.OJSetForm.oj.id,
        username: this.OJSetForm.username,
        password: this.OJSetForm.password
      })
      this.showDialog = false
    },
    refreshOJ(row) {
      this.$store.commit('updateUserOJData', {
        userid: this.userid,
        ojid: row.oj.id
      })
    },
    reFreshChart() {
      this.isRefresh = false
      this.$nextTick(function () {
        this.isRefresh = true
      })
    },
    getData() {
      let that = this
      let api = this.$store.state.api
      this.$http.get(api + '/v2/user/' + this.userid)
          .then(data => {
            this.tableData = []
            for (let oj_username of data.data.data.oj_username) {
              this.tableData.push(oj_username)
            }
            this.reFreshChart()
          })
          .catch(error => {
            if (error.response) {
              that.$message.error(error.response.data.msg)
            }
          })
    },
    timeSub(time) {
      let nowTime = (new Date().getTime()) / 1000
      let thatTime = (new Date(time).getTime()) / 1000
      let sub = nowTime - thatTime
      sub /= 60 * 60
      return (sub > 2) ? ('danger') : ('success')
    }
  },
  created() {
    this.getData()
  },
  watch: {
    userid: function () {
      this.getData()
    }
  }
}
</script>

<style scoped>
.tableTitle {
  text-align: center;
  font-size: 25px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.tableBox {
  position: relative;
  width: 700px;
  left: 50%;
  transform: translate(-50%, 0);
  margin-top: 50px;
  margin-bottom: 50px;
}

.dot {
  width: 10px;
  height: 10px;
  background: #409EFF;
  border-radius: 50%;
  margin-left: 15px;
}

.success {
  background: #67C23A;
}

.danger {
  background: #F56C6C;
}

.none {
  background: #909399;
}
</style>
