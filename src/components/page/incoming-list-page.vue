<template>
  <div>
    <el-dialog title="Edit Competition" :visible.sync="isDialogShow" append-to-body width="600px">
      <el-form label-position="left" :model="dialogData" label-width="100px">
        <el-form-item label="比赛名称">
          <el-input v-model="dialogData.name"/>
        </el-form-item>
        <el-form-item label="比赛链接">
          <el-input v-model="dialogData.link"/>
        </el-form-item>
        <el-form-item label="比赛时间">
          <el-date-picker
              style="width: 100%"
              type="datetimerange" v-model="dialogData.time_range"
              start-placeholder="开始时间" end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dialogData.remark" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="initDialog">Cancel</el-button>
        <el-button type="primary" @click="submitEdit">Submit</el-button>
      </div>
    </el-dialog>
    <el-card shadow="hover" style="padding: 10px; border-radius: 30px">
      <div class="tableTitle">
        <b>Incoming Competitions</b>
      </div>
      <div v-if="$store.state.user.permission === 1" class="centerBox">
        <el-button class="el-icon-plus" type="primary" round plain @click="openDialog(-1)">
          添加新比赛
        </el-button>
      </div>
      <el-table :data="tableData" stripe border>
        <el-table-column prop="name" label="比赛名称" fixed="left">
          <template slot-scope="scope">
            <template v-if="scope.row.link">
              <el-link :href="scope.row.link" target="_blank" :underline="false">{{ scope.row.name }}</el-link>
            </template>
            <template v-else>
              <el-tooltip content="暂无链接" placement="top">
                <p> {{ scope.row.name }} </p>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="start_time" label="开始时间"/>
        <el-table-column prop="end_time" label="结束时间"/>
        <el-table-column prop="remark" label="备注"/>
        <template v-if="$store.state.user.permission === 1">
          <el-table-column label="操作" fixed="right" width="150px">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" plain @click="openDialog(scope.row.id)">
                编辑
              </el-button>
              <el-button size="mini" type="danger" plain
                         @click="deleteCompetition(scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="pagination">
        <el-pagination
            layout="prev, pager, next, total"
            :current-page="page" :total="total" :page-size="page_size"
            @current-change="getData"/>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "incoming-list-page",
  data() {
    return {
      isDialogShow: false,
      dialogData: {},
      initDialogData: {
        id: -1,
        name: '',
        link: '',
        time_range: [],
        remark: ''
      },
      tableData: [],
      page: 1,
      total: 1,
      page_size: 20
    }
  },
  methods: {
    checkData(data) {
      if (data.name === '') return "Please input competition name"
      if (data.start_time === '' || data.start_time === undefined) return 'Please input competition time'
      return true
    },
    submitEdit() {
      if (!this.dialogData.timerange) {
        this.$message.error('Please input competition time')
        return
      }
      let data = {
        name: this.dialogData.name,
        link: this.dialogData.link,
        start_time: this.dialogData.time_range[0],
        end_time: this.dialogData.time_range[1],
        remark: this.dialogData.remark
      }
      let res = this.checkData(data)
      if (typeof res === "string") {
        this.$message.error(res)
        return
      }
      if (this.dialogData.id === -1) {
        this.$http.post(this.$store.state.api + '/v2/competition/', data)
            .then(resp => {
              this.$message.success(resp.data.msg)
              this.initDialog()
              this.getData(this.page)
            })
            .catch(error => {
              this.$message.error(error.response.data.msg)
            })
      } else {
        this.$http.put(this.$store.state.api + '/v2/competition/' + this.dialogData.id, data)
            .then(resp => {
              this.$message.success(resp.data.msg)
              this.initDialog()
              this.getData(this.page)
            })
            .catch(error => {
              this.$message.error(error.response.data.msg)
            })
      }
    },
    initDialog() {
      this.isDialogShow = false
      this.dialogData = this.initDialogData
    },
    openDialog(id) {
      this.initDialog()
      if (id !== -1) {
        for (let row of this.tableData) {
          if (row.id === id) {
            this.dialogData = row
            this.$set(this.dialogData, 'time_range', [row.start_time, row.end_time])
            break
          }
        }
      }
      this.isDialogShow = true
    },
    getData(pageid) {
      let that = this
      this.$http.get(this.$store.state.api + '/v2/competition/', {
        params: {
          page: pageid,
          page_size: that.page_size
        }
      }).then(resp => {
        that.tableData = resp.data.data.data
        that.page = resp.data.data.meta.page
        that.total = resp.data.data.meta.count
      })
    },
    deleteCompetition(id) {
      this.$confirm('确定要删除吗', '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(this.$store.state.api + '/v2/competition/' + id)
            .then(resp => {
              this.$message.success(resp.data.msg)
              this.getData(this.page)
            })
            .catch(error => {
              this.$message.error(error.response.data.msg)
            })
      })
    }
  },
  created() {
    this.getData(1)
  }
}
</script>

<style scoped>
.tableTitle {
  text-align: center;
  font-size: 25px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.centerBox {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

.pagination {
  position: relative;
  width: 50%;
  left: 50%;
  margin-top: 20px;
  transform: translate(-50%, 0);
  text-align: center;
}
</style>
