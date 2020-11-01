<template>
  <div>
    <div style="margin: 10px">
      <el-button-group>
        <el-tooltip effect="dark" content="Add User" placement="bottom">
          <el-button type="primary" icon="el-icon-plus" plain @click="addUser()"></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="Refresh All Data" placement="bottom">
          <el-button type="primary" icon="el-icon-refresh" plain @click="refreshAllData()"></el-button>
        </el-tooltip>
      </el-button-group>
      <div style="float: right;margin: 12px;">
        <el-checkbox v-model="showAll">Show All User</el-checkbox>
      </div>
    </div>
    <div v-loading="loading" v-if="isRefresh">
      <el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'group', order: 'descending'}">
        <el-table-column label="Userid" width="150" prop="userid" sortable>
          <template slot-scope="scope">
            {{ scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column label="Name" align="center">
          <template slot-scope="scope">
            {{ scope.row.nickname }}&nbsp;<span style="cursor: pointer" @click="editName(scope.row)"><i
              class="el-icon-edit"></i></span>
          </template>
        </el-table-column>
        <el-table-column label="Group" align="center" prop="group" sortable>
          <template slot-scope="scope">
            {{ scope.row.group }}&nbsp;<span style="cursor: pointer" @click="editGroup(scope.row)"><i
              class="el-icon-edit"></i></span>
          </template>
        </el-table-column>
        <el-table-column label="Recording" align="center">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change="switchChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="Admin" align="center">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.permission"
                :active-value="1"
                :inactive-value="0"
                @change="switchChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="Detail" width="70">
          <template slot-scope="scope">
            <el-button
                icon="el-icon-s-data"
                size="mini"
                @click="gotoDetail(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'admin-page',
  data() {
    return {
      loading: false,
      isRefresh: true,
      showAll: false,
      tableData: []
    }
  },
  methods: {
    switchChange(row) {
      this.$store.commit('modifyUserInfo', {
        username: row.username,
        nickname: row.nickname,
        permission: row.permission,
        status: row.status,
        group: row.group
      })
    },
    editName(row) {
      this.$prompt('Input the name of ' + row.username, 'Edit', {
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        inputValue: row.nickname
      }).then(({value}) => {
        row.nickname = value
        this.switchChange(row)
      })
    },
    editGroup(row) {
      this.$prompt('Input the group of ' + row.username, 'Edit', {
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        inputValue: row.group
      }).then(({value}) => {
        row.group = value
        this.switchChange(row)
      })
    },
    addUser() {
      this.$prompt('Input the Userid (StudentID)', 'Add User', {
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        inputPattern: /^[0-9]{8}$/,
        inputErrorMessage: 'Userid must be 8 digits! (StudentID)'
      }).then(({value}) => {
        this.$store.commit('addUser', {
          username: value
        })
      })
    },
    refreshAllData() {
      this.$store.commit('updateAllData')
    },
    gotoDetail(row) {
      this.$router.push('/user/' + row.username + '?part=page-top')
    },
    reFreshChart() {
      this.isRefresh = false
      this.$nextTick(function () {
        this.isRefresh = true
        this.loading = false
      })
    },
    initData() {
      if (this.$store.state.Userlist) {
        this.tableData = []
        for (var item of this.$store.state.Userlist) {
          if (this.showAll || item[1].status === 1 || item[1].permission === 1) {
            this.tableData.push(item[1])
          }
        }
        this.reFreshChart()
      } else {
        setTimeout(() => {
          this.initData()
        }, 500)
      }
    },
    getData() {
      this.loading = true
      if (!this.$store.state.Userlist) {
        this.$store.commit('updateUserlist')
        setTimeout(() => {
          this.initData()
        }, 500)
      } else {
        this.initData()
      }
    },
    permissionCheck() {
      if (this.$store.state.user.isUpdated) {
        if (this.$store.state.user.permission !== 1) {
          this.$router.replace('/error401')
        } else {
          this.getData()
        }
      } else {
        setTimeout(() => {
          this.permissionCheck()
        }, 100)
      }
    }
  },
  created() {
    document.title = "Admin - viewOJ"
    this.permissionCheck()
  },
  computed: {
    userlistSize() {
      if (this.$store.state.Userlist) {
        return this.$store.state.Userlist.size
      } else {
        return 0
      }
    }
  },
  watch: {
    showAll: function () {
      this.getData()
    },
    userlistSize: function () {
      this.getData()
    }
  }
}
</script>

<style scoped>
</style>
