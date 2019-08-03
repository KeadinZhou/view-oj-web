<template>
    <div>
        <el-card shadow="hover" class="tableBox">
            <div v-loading="loading" v-if="isRefresh">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column label="Rank" align="center" width="60px">
                        <template slot-scope="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Userid" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.username }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Username" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.nickname }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Rating" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.rating }}
                            <el-tooltip effect="dark" :content="'Refresh rating for '+scope.row.nickname" placement="right">
                                <span style="cursor: pointer;margin-left: 5px" @click="$store.commit('refreshUserRating',scope.row.username)"><i class="el-icon-refresh"></i></span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="Detail" width="70px">
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
        </el-card>
    </div>
</template>

<script>
export default {
  name: 'ranklist-page',
  data () {
    return {
      loading: false,
      isRefresh: true,
      tableData: []
    }
  },
  methods: {
    gotoDetail (row) {
      this.$router.push('/user/' + row.username)
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
    getData () {
      this.loading = true
      var api = this.$store.state.api
      var that = this
      that.$http.post(api + '/v1/data/get_rating_rank_list')
        .then(data => {
          that.tableData = data.data.data
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
    this.getData()
  }
}
</script>

<style scoped>
    .tableBox{
        position: relative;
        left: 50%;
        width: 800px;
        transform: translate(-50%,0);
    }
</style>
