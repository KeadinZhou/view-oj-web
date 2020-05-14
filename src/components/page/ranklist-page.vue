<template>
    <div>
        <div style="margin: 10px">
            <div style="float: right;margin: 12px;">
                <el-checkbox v-model="showAll">Show All User</el-checkbox>
            </div>
        </div>
        <el-card shadow="hover" class="tableBox">
            <div v-loading="loading" v-if="isRefresh">
                <el-table :data="tableData" :default-sort = "{prop: 'Rating', order: 'descending'}" style="width: 100%" >
                    <el-table-column label="Rank" align="center" width="100px">
                        <template slot-scope="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Userid" align="center">
                        <template slot-scope="scope">
                            <el-link :href="'#/user/'+scope.row.username+'?part=page-top'" :underline="false">
                                {{ scope.row.username }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="Username" align="center">
                        <template slot-scope="scope">
                            <el-link :href="'#/user/'+scope.row.username+'?part=page-top'" :underline="false">
                                <b :style="'font-weight: 900;color:'+getColorForRating(scope.row.rating)">{{ scope.row.nickname }}</b>
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="Rating" align="center" width="150px" prop="Rating" sortable>
                        <template slot-scope="scope">
                            <el-link :href="'#/user/'+scope.row.username+'?part=rating'" :underline="false">{{ scope.row.rating }}</el-link>
                            <!--                            <el-tooltip effect="dark" :content="'Refresh rating for '+scope.row.nickname" placement="right">-->
                            <!--                                <span style="cursor: pointer;margin-left: 5px" @click="$store.commit('refreshUserRating',scope.row.username)"><i class="el-icon-refresh"></i></span>-->
                            <!--                            </el-tooltip>-->
                        </template>
                    </el-table-column>
                    <el-table-column label="Codeforces" align="center" width="130px" prop="Codeforces" sortable>
                        <template slot-scope="scope">
                            {{ scope.row.codeforces_rating }}
                        </template>
                    </el-table-column>
<!--                    <el-table-column label="Detail" width="70px">-->
<!--                        <template slot-scope="scope">-->
<!--                            <el-button-->
<!--                                    icon="el-icon-s-data"-->
<!--                                    size="mini"-->
<!--                                    @click="gotoDetail(scope.row)">-->
<!--                            </el-button>-->
<!--                        </template>-->
<!--                    </el-table-column>-->
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
      tableData: [],
      showAll: false
    }
  },
  methods: {
    getColorForRating (rating) {
      if (rating <= 1600) return '#808080'
      if (rating <= 1800) return '#008000'
      if (rating <= 2000) return '#03a89e'
      if (rating <= 2300) return '#0000ff'
      if (rating <= 2500) return '#aa00aa'
      if (rating <= 2800) return '#FF8C00'
      if (rating <= 3000) return '#ff7777'
      if (rating <= 3300) return '#ff0000'
      return '#aa0000'
    },
    gotoDetail (row) {
      this.$router.push('/user/' + row.username + '?part=rating')
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
      that.$http.get(api + '/v2/user/rating')
        .then(data => {
          // that.tableData = data.data.data
          that.tableData = []
          for (var item of data.data.data) {
            if (item.status === 1 || that.showAll) {
              that.tableData.push(item)
            }
          }
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
  },
  watch: {
    showAll: function () {
      this.getData()
    }
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
