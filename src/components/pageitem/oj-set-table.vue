<template>
    <div class="tableBox">
        <div class="tableTitle">
            <b>OJ-ID Setting</b>
        </div>
        <el-card class="box-card" shadow="hover">
            <div v-loading="loading" v-if="isRefresh">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column label="Userid">
                        <template slot-scope="scope">
                            {{ scope.row.userid }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Name">
                        <template slot-scope="scope">
                            {{ scope.row.username }}
                        </template>
                    </el-table-column>
                    <el-table-column label="OJ">
                        <template slot-scope="scope">
                            {{ scope.row.oj }}
                        </template>
                    </el-table-column>
                    <el-table-column label="ID" width="130px">
                        <template slot-scope="scope">
                            {{ scope.row.id }}&nbsp;<span style="cursor: pointer" @click="editOJID(scope.row)"><i class="el-icon-edit"></i></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Refresh" width="80px">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" :content="'Refresh '+scope.row.oj+' for '+scope.row.username" placement="right">
                                <span style="cursor: pointer;margin-left: 20px" @click="refreshOJ(scope.row)"><i class="el-icon-refresh"></i></span>
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
  data () {
    return {
      loading: false,
      isRefresh: true,
      username: '罗老嫖',
      tableData: []
    }
  },
  methods: {
    editOJID (row) {
      this.$prompt('Input the ID of ' + row.oj, 'Modify', {
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        inputValue: row.id
      }).then(({ value }) => {
        row.id = value
        this.$store.commit('modifyOJID', {
          userid: row.userid,
          ojid: row.ojid,
          id: row.id
        })
      })
    },
    refreshOJ (row) {
      this.$store.commit('updateUserOJData', {
        userid: row.userid,
        ojid: row.ojid
      })
    },
    reFreshChart () {
      this.isRefresh = false
      this.$nextTick(function () {
        this.isRefresh = true
        this.loading = false
      })
    },
    showData () {
      if (this.$store.state.OJSetTableData && this.$store.state.OJlist) {
        this.tableData = []
        for (var item of this.$store.state.OJlist) {
          if (item[1].status === 1) {
            this.tableData.push({
              userid: this.userid,
              username: this.username,
              ojid: item[0],
              oj: item[1].name,
              id: ''
            })
          }
        }
        for (var i in this.tableData) {
          item = this.tableData[i]
          if (this.$store.state.OJSetTableData.has(item.ojid)) {
            item.id = this.$store.state.OJSetTableData.get(item.ojid)
          }
        }
      } else {
        setTimeout(() => {
          this.showData()
        }, 500)
      }
    },
    initData () {
      if (this.$store.state.Userlist) {
        this.$store.commit('updateOJSetTableData', this.userid)
        this.username = this.$store.state.Userlist.get(this.userid).nickname
        setTimeout(() => {
          this.showData()
          this.reFreshChart()
        }, 500)
      } else {
        setTimeout(() => {
          this.initData()
        }, 500)
      }
    },
    getData () {
      this.loading = true
      if (!this.$store.state.Userlist) {
        setTimeout(() => {
          this.initData()
        }, 500)
      } else {
        this.initData()
      }
    }
  },
  created () {
    this.getData()
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
        width: 700px;
        left: 50%;
        transform: translate(-50%,0);
        margin-top: 50px;
        margin-bottom: 50px;
    }
</style>
