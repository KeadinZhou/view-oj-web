<template>
    <div class="tableBox">
        <div class="tableTitle">
            <b>OJ-ID Setting</b>
        </div>
        <el-card class="box-card" shadow="hover">
            <div v-loading="loading" v-if="isRefresh">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column label="Userid" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.userid }}
                        </template>
                    </el-table-column>
                    <el-table-column label="OJ" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.oj }}
                        </template>
                    </el-table-column>
                    <el-table-column label="ID" width="200px" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.id }}&nbsp;
                            <template v-if="userid === loguser">
                                <span style="cursor: pointer" @click="editOJID(scope.row)"><i class="el-icon-edit"></i></span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="Refresh" width="80px">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" :content="'Refresh '+scope.row.oj+' for '+scope.row.userid" placement="right">
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
  computed: {
    loguser: function () {
      return (this.$store.state.user.permission === 1) ? this.userid : this.$store.state.user.userid
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
      if (this.$store.state.OJSetTableData) {
        this.tableData = []
        for (var i in this.$store.state.OJSetTableData) {
          var item = this.$store.state.OJSetTableData[i]
          this.tableData.push({
            userid: this.userid,
            ojid: item.oj_id,
            oj: item.oj_name,
            id: item.oj_username
          })
        }
      } else {
        setTimeout(() => {
          this.showData()
        }, 500)
      }
    },
    getData () {
      this.$store.commit('updateOJSetTableData', this.userid)
      setTimeout(() => {
        this.showData()
        this.reFreshChart()
      }, 500)
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
