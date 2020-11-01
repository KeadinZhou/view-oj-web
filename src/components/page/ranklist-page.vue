<template>
  <div style="display: flex">
    <el-card shadow="hover" class="tableBox">
      <div v-loading="loading" v-if="isRefresh">
        <el-table :data="tableData" :default-sort="{prop: 'rating', order: 'descending'}" style="width: 100%">
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
                <b class="ColoredName" :style="getNameColorInfo(scope.row, 2)">
                                    <span :style="'border-top-left-radius:5px; border-bottom-left-radius: 5px;' +
                                         'padding:3px; padding-right:0px;'+getNameColorInfo(scope.row, 0)">{{
                                        scope.row.nickname[0]
                                      }}</span>
                  <span :style="'border-top-right-radius:5px; border-bottom-right-radius: 5px;' +
                                         'padding:3px; padding-left:0px;'+getNameColorInfo(scope.row, 1)">{{
                      scope.row.nickname.slice(1)
                    }}</span>
                </b>
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="Rating" align="center" width="100px" prop="rating" sortable
                           :sort-method="function(a,b) {return Number(a.rating) - Number(b.rating)}">
            <template slot-scope="scope">
              <el-link :href="'#/user/'+scope.row.username+'?part=rating'" :underline="false">{{
                  scope.row.rating
                }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="CF" align="center" width="80px" prop="codeforces" sortable
                           :sort-method="function(a,b) {return Number(a.codeforces_rating) - Number(b.codeforces_rating)}">
            <template slot-scope="scope">
              <span>{{ Number(scope.row.codeforces_rating) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Cnt" align="center" width="80px" prop="contest" sortable
                           :sort-method="function(a,b) {return Number(a.contest_num) - Number(b.contest_num)}">
            <template slot-scope="scope">
              <span>{{ Number(scope.row.contest_num) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <div style="margin: 12px;">
      <el-checkbox v-model="showAll" style="margin-bottom: 5px">Show All User</el-checkbox>
      <br/>
      <el-checkbox v-model="showFreshman">Show Freshman</el-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ranklist-page',
  data() {
    return {
      loading: false,
      isRefresh: true,
      tableData: [],
      showAll: false,
      showFreshman: false
    }
  },
  methods: {
    getNameColorInfo(row, index) {
      let s = ''
      if (row.custom_color) {
        return row.custom_color[index]
      }
      let color = this.getNameColor(row)
      let back_color = this.getNameColorBack(row)
      s += 'color: ' + color[index] + ';'
      s += 'background-color: ' + back_color[index] + ';'
      return s
    },
    getNameColor(row) {
      let rating = row.rating
      if (rating <= 1500) return ['#808080', '#808080']
      if (rating <= 1600) return ['#008000', '#008000']
      if (rating <= 1800) return ['#03a89e', '#03a89e']
      if (rating <= 2000) return ['#0000ff', '#0000ff']
      if (rating <= 2200) return ['#aa00aa', '#aa00aa']
      if (rating <= 2500) return ['#ff8c00', '#ff8c00']
      if (rating <= 2800) return ['#ff7777', '#ff7777']
      if (rating <= 3000) return ['#ff0000', '#ff0000']
      return ['#000000', '#ff0000']
    },
    getNameColorBack(row) {
      (row)
      return ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)']
    },
    gotoDetail(row) {
      this.$router.push('/user/' + row.username + '?part=rating')
    },
    current_change(currentPage) {
      this.getData(currentPage)
    },
    reFreshChart() {
      this.isRefresh = false
      this.$nextTick(function () {
        this.isRefresh = true
        this.loading = false
      })
    },
    getData() {
      this.loading = true
      var api = this.$store.state.api
      var that = this
      that.$http.get(api + '/v2/user/rating')
          .then(data => {
            // that.tableData = data.data.data
            that.tableData = []
            for (var item of data.data.data) {
              if (item.is_freshman && !that.showFreshman) continue
              if (item.status === 1 && !that.showAll) continue
              that.tableData.push(item)
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
  created() {
    document.title = "Ranklist - viewOJ"
    this.getData()
  },
  watch: {
    showAll: function () {
      this.getData()
    },
    showFreshman: function () {
      this.getData()
    }
  }
}
</script>

<style scoped>
.tableBox {
  width: 1000px;
  margin-right: 20px;
}

.ColoredName {
  font-weight: 600;
  padding: 3px 0 3px 0;
  border-radius: 5px;
}
</style>
