<template>
    <div>
        <el-dialog title="Add Problem Set" :visible.sync="addBoxShow" :append-to-body="true" width="600px">
            <div>
                <el-input placeholder="The Title of The New Problem Set" v-model="newSetTitle" prefix-icon="el-icon-edit-outline"></el-input>
            </div>
            <div class="itemBox">
                <div class="itemItem"><el-button icon="el-icon-plus" round @click="addProblem">New</el-button></div>
                <template v-for="(item,index) in problemSet">
                    <div :key="index" class="itemItem">
                        <b style="margin-right: 10px">{{String.fromCharCode((65+index))}}</b>
                        <el-select v-model="item.oj" placeholder="OJ" style="width: 200px">
                            <el-option v-for="OJ in ojList" :key="OJ.id" :label="OJ.name" :value="OJ.id"></el-option>
                        </el-select>
                        <el-input v-model="item.pid" placeholder="Pro. Num" style="width: 200px"></el-input>
                        <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="delItem(item)"></el-button>
                    </div>
                </template>
            </div>
            <template v-if="showProgress">
                <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage"></el-progress>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="initProblemSet">Cancel</el-button>
                <el-button type="primary" @click="submitAdd">Submit</el-button>
            </div>
        </el-dialog>
        <el-card shadow="hover" class="tableBox">
            <div class="tableTitle">
                <b>The Monitor of The Problem Set</b>
            </div>
            <div class="centerBox" v-if="this.$store.state.user.permission === 1">
                <el-button-group>
                    <el-tooltip effect="dark" content="Add New Problem Set" placement="top">
                        <el-button icon="el-icon-plus" size="medium" @click="addBoxShow = true" round></el-button>
                    </el-tooltip>
                    <template v-if="isAdminMode">
                        <el-tooltip effect="dark" content="Close Admin Mode" placement="top">
                            <el-button icon="el-icon-unlock" size="medium" @click="isAdminMode = false" round type="danger"></el-button>
                        </el-tooltip>
                    </template>
                    <template v-else>
                        <el-tooltip effect="dark" content="Open Admin Mode" placement="top">
                            <el-button icon="el-icon-lock" size="medium" @click="isAdminMode = true" round></el-button>
                        </el-tooltip>
                    </template>
                    <el-tooltip effect="dark" content="Refresh All Data" placement="top">
                        <el-button icon="el-icon-refresh" size="medium" @click="$store.commit('updateAllData')" round></el-button>
                    </el-tooltip>
                </el-button-group>
            </div>
            <el-collapse accordion @change="openItem">
                <template v-for="item in SetList">
                    <el-collapse-item :name="item.id" :key="item.id">
                        <template slot="title">
                            <i class="el-icon-collection-tag" style="margin-left: 10px;color: #409EFF"></i>
                            <el-divider direction="vertical"></el-divider>
                            <template v-if="isAdminMode">
                                <el-popover placement="top" title="Rename" trigger="hover" v-model="item.renameShow" width="400">
                                    <i class="el-icon-edit" slot="reference" style="color: #E6A23C"></i>
                                    <el-input v-model="item.name" prefix-icon="el-icon-edit"></el-input>
                                    <div style="text-align: right; margin-top: 10px">
                                        <el-button size="mini" type="text" @click="item.renameShow = false" style="color: black">Cancel</el-button>
                                        <el-button type="warning" size="mini" @click="renameSet(item); item.renameShow = false">Submit</el-button>
                                    </div>
                                </el-popover>
                                <el-divider direction="vertical"></el-divider>
                                <el-popover placement="top" trigger="hover" v-model="item.delShow">
                                    <i class="el-icon-delete" slot="reference" style="color: #F56C6C"></i>
                                    <p style="text-align: center">Are you sure you want to delete <br/><br/><b>{{item.name}}</b> ?<br/></p>
                                    <div style="text-align: right; margin-top: 10px">
                                        <el-button size="mini" type="text" @click="item.delShow = false" style="color: black">Cancel</el-button>
                                        <el-button type="danger" size="mini" @click="delSet(item.id); item.delShow = false">Delete</el-button>
                                    </div>
                                </el-popover>
                                <el-divider direction="vertical"></el-divider>
                            </template>
                            {{ item.name }}
                        </template>
                        <div>
                            <template v-if="activeNames === item.id">
                                <template v-if="isLoading">
                                    <i class="el-icon-loading"></i> Loading...
                                </template>
                                <template v-else>
                                    <monitor-table :proData="proData" :proList="proList"></monitor-table>
                                </template>
                            </template>
                        </div>
                    </el-collapse-item>
                </template>
            </el-collapse>
        </el-card>
    </div>
</template>

<script>
import MonitorTable from '@/components/pageitem/monitor-table'
export default {
  name: 'monitor-page',
  data () {
    return {
      api: this.$store.state.api,
      SetList: [],
      activeNames: -1,
      isLoading: true,
      proData: [],
      proList: [],
      ojList: [],
      addBoxShow: false,
      newSetTitle: '',
      problemSet: [],
      isAdminMode: false,
      showProgress: false,
      percentage: 10
    }
  },
  components: {
    'monitor-table': MonitorTable
  },
  methods: {
    getList () {
      this.SetList = []
      var that = this
      that.$http.post(this.api + '/v1/problem_set/get_problem_set_list')
        .then(data => {
          this.SetList = data.data.data
        })
        .catch(function (error) {
          if (error.response) {
            that.$message.error(error.response.data.msg)
          }
        })
    },
    getTableData (activeNames) {
      var that = this
      that.$http.post(this.api + '/v1/problem_set/get_problem_set_detail', {problem_set_id: activeNames})
        .then(data => {
          this.proData = data.data.data.data
          this.proList = data.data.data.problem_list
          this.isLoading = false
        })
        .catch(function (error) {
          if (error.response) {
            that.$message.error(error.response.data.msg)
          }
        })
    },
    openItem (activeNames) {
      this.activeNames = activeNames
      if (!activeNames) {
        this.proData = []
        return
      }
      this.isLoading = true
      this.getTableData(activeNames)
    },
    getOJList () {
      var that = this
      that.$http.post(this.api + '/v1/data/get_oj_list')
        .then(data => {
          this.ojList = []
          for (var item of data.data.data) {
            if (item.name === 'vjudge') continue
            this.ojList.push({
              id: item.id,
              name: item.name
            })
          }
        })
        .catch(function (error) {
          if (error.response) {
            that.$message.error(error.response.data.msg)
          }
        })
    },
    initProblemSet () {
      this.newSetTitle = ''
      this.problemSet = []
      this.addBoxShow = false
      this.showProgress = false
      this.percentage = 0
    },
    addProblem () {
      var num = this.problemSet.length
      if (num === 0) {
        this.problemSet.push({
          oj: null,
          pid: '',
          id: null,
          delShow: false,
          renameShow: false
        })
      } else {
        this.problemSet.push({
          oj: this.problemSet[num - 1].oj,
          pid: (Number(this.problemSet[num - 1].pid) + 1) + '',
          id: null,
          delShow: false,
          renameShow: false
        })
      }
    },
    delItem (item) {
      var index = this.problemSet.indexOf(item)
      if (index !== -1) {
        this.problemSet.splice(index, 1)
      }
    },
    submitCreat () {
      const that = this
      var idList = []
      for (var item of that.problemSet) {
        idList.push(item.id)
      }
      that.$http.post(this.api + '/v1/problem_set/create_problem_set', {
        problem_set_name: that.newSetTitle,
        problem_id_list: idList
      })
        .then(data => {
          that.$message.success(data.data.msg)
          that.initProblemSet()
          that.getList()
        })
        .catch(function (error) {
          if (error.response) {
            that.$message.error(error.response.data.msg)
          }
        })
    },
    getProbID (index) {
      const that = this
      that.showProgress = true
      if (index >= that.problemSet.length) {
        that.submitCreat()
        return
      }
      that.$http.post(this.api + '/v1/data/get_problem_id', {
        oj_id: that.problemSet[index].oj,
        problem_pid: that.problemSet[index].pid
      })
        .then(data => {
          that.problemSet[index].id = data.data.data
          that.percentage = (index + 1) / that.problemSet.length * 100
          that.getProbID(index + 1)
        })
        .catch(function (error) {
          if (error.response) {
            that.$message.error(error.response.data.msg)
          }
        })
    },
    submitAdd () {
      const that = this
      if (!that.newSetTitle) {
        that.$message.error('Title cannot be empty!')
        return
      }
      for (var item of that.problemSet) {
        if (!(item.oj && item.pid)) {
          that.$message.error('Problem cannot be empty!')
          return
        }
      }
      if (that.problemSet.length === 0) {
        that.$message.error('ProblemSet cannot be empty!')
      }
      that.getProbID(0)
    },
    delSet (setId) {
      const that = this
      that.$http.post(this.api + '/v1/problem_set/delete_problem_set', {problem_set_id: setId})
        .then(data => {
          that.$message.success(data.data.msg)
          that.getList()
        })
        .catch(function (error) {
          if (error.response) {
            that.$message.error(error.response.data.msg)
          }
        })
    },
    renameSet (SET) {
      const that = this
      that.$http.post(this.api + '/v1/problem_set/modify_problem_set', {
        problem_set_id: SET.id,
        problem_set_name: SET.name
      })
        .then(data => {
          that.$message.success(data.data.msg)
          that.getList()
        })
        .catch(function (error) {
          if (error.response) {
            that.$message.error(error.response.data.msg)
          }
        })
    }
  },
  created () {
    this.getList()
    this.getOJList()
  }
}
</script>

<style scoped>
    .tableTitle{
        text-align: center;
        font-size: 25px;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .tableBox{
        position: relative;
        left: 50%;
        transform: translate(-50%,0);
    }
    .centerBox{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .itemBox{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        flex-direction:column;
    }
    .itemItem{
        width: 90%;
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content:space-around
    }
</style>
