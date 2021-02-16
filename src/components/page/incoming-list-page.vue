<template>
  <div>
    <el-card shadow="hover" style="padding: 10px; border-radius: 30px">
      <div class="tableTitle">
        <b>Incoming Competitions</b>
      </div>
      <div v-if="$store.state.user.permission === 1" class="centerBox">
        <el-button class="el-icon-plus" type="primary" round plain @click="$message.error('施工中')">
          添加新比赛
        </el-button>
      </div>
      <el-table :data="tableData" stripe border>
        <el-table-column prop="name" label="比赛名称" fixed="left">
          <template slot-scope="scope">
            <el-link :href="scope.row.link" target="_blank" :underline="false">{{ scope.row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="start_time" label="开始时间"/>
        <el-table-column prop="end_time" label="结束时间"/>
        <el-table-column prop="remark" label="备注"/>
        <template v-if="$store.state.user.permission === 1">
          <el-table-column label="操作" fixed="right" width="150px">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" plain @click="$message.error('施工中')">编辑</el-button>
              <el-button size="mini" type="danger" plain
                         @click="$message.error('施工中')">删除{{ scope && null }}
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
      tableData: [],
      page: 1,
      total: 1,
      page_size: 20
    }
  },
  methods: {
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
