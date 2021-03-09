<template>
  <div>
    <monitor-edit-dialog :visible.sync="addBoxShow" :oj_list="ojList" :user_list="userList"/>
    <el-card shadow="hover" class="tableBox">
      <div class="tableTitle">
        <b>The Monitor of The Problem Set</b>
      </div>
      <div class="centerBox">
        <el-input placeholder="Search Problem Set" v-model="searchStr" style="width: 500px"
                  @keydown.enter.native="listFilter">
          <el-button slot="append" icon="el-icon-search" @click="listFilter"/>
        </el-input>
      </div>
      <div class="centerBox">
        <div style="width: 500px">
          Or click tag:
          <template v-for="i in simplified">
            <el-tag :key="i.sim" style="font-size: 14px; cursor: pointer; margin: 5px"
                    @click="fillSearch(i.text)">
              {{ i.sim }}
            </el-tag>
          </template>
        </div>
      </div>
      <div class="centerBox" v-if="this.$store.state.user.permission === 1">
        <el-button-group>
          <el-tooltip effect="dark" content="Add New Problem Set" placement="top">
            <el-button icon="el-icon-plus" size="medium" @click="addBoxShow = true" round></el-button>
          </el-tooltip>
          <template v-if="isAdminMode">
            <el-tooltip effect="dark" content="Close Admin Mode" placement="top">
              <el-button icon="el-icon-unlock" size="medium" @click="isAdminMode = false" round
                         type="danger"></el-button>
            </el-tooltip>
          </template>
          <template v-else>
            <el-tooltip effect="dark" content="Open Admin Mode" placement="top">
              <el-button icon="el-icon-lock" size="medium" @click="isAdminMode = true" round></el-button>
            </el-tooltip>
          </template>
          <el-tooltip effect="dark" content="Refresh All Data" placement="top">
            <el-button icon="el-icon-refresh" size="medium" @click="$store.commit('updateAllData')"
                       round></el-button>
          </el-tooltip>
        </el-button-group>
      </div>
      <el-collapse accordion @change="openItem">
        <template v-for="item in filteredList">
          <el-collapse-item :name="item.id" :key="item.id">
            <template slot="title">
              <i class="el-icon-collection-tag" style="margin-left: 10px;color: #409EFF"></i>
              <el-divider direction="vertical"></el-divider>
              <template v-if="isAdminMode">
                <el-popover placement="top" title="Rename" trigger="hover" v-model="item.renameShow"
                            width="400">
                  <i class="el-icon-edit" slot="reference" style="color: #E6A23C"></i>
                  <el-input v-model="item.name" prefix-icon="el-icon-edit"></el-input>
                  <div style="text-align: right; margin-top: 10px">
                    <el-button size="mini" type="text" @click="item.renameShow = false"
                               style="color: black">Cancel
                    </el-button>
                    <el-button type="warning" size="mini"
                               @click="renameSet(item); item.renameShow = false">Submit
                    </el-button>
                  </div>
                </el-popover>
                <el-divider direction="vertical"></el-divider>
                <el-popover placement="top" trigger="hover" v-model="item.delShow">
                  <i class="el-icon-delete" slot="reference" style="color: #F56C6C"></i>
                  <p style="text-align: center">Are you sure you want to delete <br/><br/><b>{{ item.name }}</b>
                    ?<br/></p>
                  <div style="text-align: right; margin-top: 10px">
                    <el-button size="mini" type="text" @click="item.delShow = false"
                               style="color: black">Cancel
                    </el-button>
                    <el-button type="danger" size="mini"
                               @click="delSet(item.id); item.delShow = false">Delete
                    </el-button>
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
                  <monitor-table :proData="proData" :proList="proList"
                                 :pro-start="proStart" :pro-end="proEnd"/>
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
import MonitorEditDialog from "@/components/pageitem/edit-monitor-dialog";

export default {
  name: 'monitor-page',
  provide() {
    return {
      refresh: this.getList
    }
  },
  data() {
    return {
      api: this.$store.state.api,
      SetList: [],
      filteredList: [],
      activeNames: -1,
      isLoading: true,
      proStart: null,
      proEnd: null,
      proData: [],
      proList: [],
      ojList: [],
      userList: [],
      addBoxShow: false,
      isAdminMode: false,
      searchStr: '',
      simplified: [{
        sim: '全部',
        text: ''
      }, {
        sim: 'CF',
        text: 'Codeforces'
      }, {
        sim: 'div. 2',
        text: 'div. 2'
      }, {
        sim: '牛客',
        text: '牛客'
      }, {
        sim: '周赛',
        text: '周赛'
      }]
    }
  },
  components: {
    MonitorEditDialog,
    'monitor-table': MonitorTable
  },
  methods: {
    fillSearch(str) {
      this.searchStr = str
      this.listFilter()
    },
    listFilter() {
      this.filteredList = this.SetList.filter(value => {
        return value.name.toLowerCase().indexOf(this.searchStr.toLowerCase()) >= 0
      })
    },
    getList() {
      this.SetList = []
      var that = this
      that.$http.get(this.api + '/v2/problem_set/summary')
          .then(data => {
            this.SetList = data.data.data
            this.listFilter()
          })
          .catch(function (error) {
            if (error.response) {
              that.$message.error(error.response.data.msg)
            }
          })
    },
    getTableData(activeNames) {
      var that = this
      that.$http.get(this.api + '/v2/problem_set/' + activeNames)
          .then(data => {
            this.proData = data.data.data.detail
            this.proList = data.data.data.problem_list
            this.proStart = data.data.data.start_time
            this.proEnd = data.data.data.end_time
            this.isLoading = false
          })
          .catch(function (error) {
            if (error.response) {
              that.$message.error(error.response.data.msg)
            }
          })
    },
    openItem(activeNames) {
      this.activeNames = activeNames
      if (!activeNames) {
        this.proData = []
        return
      }
      this.isLoading = true
      this.getTableData(activeNames)
    },
    getOJList() {
      var that = this
      that.$http.get(this.api + '/v2/problem_set/valid_oj')
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
    delSet(setId) {
      const that = this
      that.$http.delete(this.api + '/v2/problem_set/' + setId)
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
    renameSet(SET) {
      const that = this
      that.$http.put(this.api + '/v2/problem_set/' + SET.id, {
        name: SET.name
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
    },
    getUserList() {
      if (!this.$store.state.Userlist) this.$store.commit('updateUserlist')
      this.initUserList()
    },
    initUserList() {
      if (this.$store.state.Userlist) {
        let usermap = new Map()
        for (let item of this.$store.state.Userlist) {
          let user = item[1]
          if (user.status === 0) continue
          let group = user.group
          if (user.is_freshman) group = '新生'
          if (!usermap.has(group)) usermap.set(group, [])
          user.label = user.nickname
          usermap.get(group).push(user)
        }
        let user_list = []
        for (let item of usermap) {
          user_list.push({
            label: item[0],
            children: item[1]
          })
        }
        user_list.sort(function (a, b) {
          if (a.label < b.label) return -1
          else if (a.label === b.label) return 0
          else return 1
        })
        this.userList = [{
          label: '全部',
          children: user_list
        }]
      } else {
        setTimeout(() => {
          this.initUserList()
        }, 500)
      }
    },
    getDifficultyDescribe(difficulty) {
      switch (difficulty) {
        case 0:
          return '未评级'
        case 1:
          return '普通'
        case 2:
          return '稀有'
        case 3:
          return '史诗'
        case 4:
          return '传说'
        case 5:
          return '神话'
        default:
          return 'ERROR'
      }
    }
  },
  created() {
    document.title = "Monitor - viewOJ"
    this.getList()
    this.getOJList()
    this.getUserList()
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
  left: 50%;
  transform: translate(-50%, 0);
}

.centerBox {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

.itemBox {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  flex-direction: column;
}

.itemItem {
  width: 90%;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around
}
</style>
