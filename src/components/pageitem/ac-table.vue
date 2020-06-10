<template>
    <div class="tableBox">
        <div class="tableTitle">
            <b>AC Problems List</b>
        </div>
        <el-card class="box-card" shadow="hover">
            <div v-loading="loading" v-if="isRefresh">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column label="Problem" align="center">
                        <template slot-scope="scope">
                            <el-link :href="scope.row.problem.url" target="_blank" :underline="false">{{ scope.row.problem.oj.name }}-{{ scope.row.problem.problem_pid }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="Rating" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.rating }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Contribution" align="center">
                        <template slot-scope="scope">
                            +{{ scope.row.add_rating }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Time" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.create_time }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Refresh" width="80px">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" :content="'Refresh the Rating of '+scope.row.oj_name+'-'+scope.row.problem_pid" placement="right">
                                <span style="cursor: pointer;margin-left: 20px" @click="refreshProblem(scope.row)"><i class="el-icon-refresh"></i></span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
                    :page-size="10"
                    layout="prev,pager,next"
                    :total="this.dataCount"
                    :current-page="this.currentPage"
                    align="center"
                    style="margin-top: 20px"
                    @current-change="current_change">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
  name: 'ac-table',
  props: {
    userid: String,
    inputDate: Array
  },
  data () {
    return {
      loading: false,
      isRefresh: true,
      currentPage: 1,
      dataCount: 0,
      tableData: [{
        add_rating: 0,
        create_time: '2020-02-14 12:46:29',
        id: 85827,
        problem: {
          id: 9416,
          oj: {
            id: 6,
            name: 'zoj',
            status: 0
          },
          oj_id: 6,
          problem_pid: '4117',
          rating: 0,
          url: 'http://acm.zju.edu.cn/onlinejudge/showProblem.do?problemCode=4117'
        },
        problem_id: 9416,
        username: '31801130'
      }]
    }
  },
  methods: {
    refreshProblem (row) {
      this.$store.commit('refreshProblemRating', row.problem_id)
    },
    current_change (currentPage) {
      this.getData(currentPage)
    },
    reFreshChart () {
      this.isRefresh = false
      this.$nextTick(function () {
        this.isRefresh = true
        this.loading = false
      })
    },
    showData () {
    },
    getData (pageid) {
      this.loading = true
      var postdata = this.inputDate && this.inputDate.length === 2 ? {
        username: this.userid,
        page: pageid,
        page_size: 10,
        start_date: this.inputDate[0],
        end_date: this.inputDate[1]
      } : {
        username: this.userid,
        page: pageid,
        page_size: 10
      }
      var api = this.$store.state.api
      var that = this
      that.$http.get(api + '/v2/accept_problem', {params: postdata})
        .then(data => {
          that.dataCount = data.data.data.detail.meta.count
          that.tableData = data.data.data.detail.data
          that.currentPage = pageid
          that.reFreshChart()
        })
        .catch(function (error) {
          if (error.response) {
            that.$message.error(error.response.data.msg)
          }
        })
    }
  },
  created () {
    this.getData(1)
  },
  watch: {
    userid: function () {
      this.getData(1)
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
        width: 750px;
        left: 50%;
        transform: translate(-50%, 0);
        margin-top: 50px;
        margin-bottom: 50px;
    }
</style>
