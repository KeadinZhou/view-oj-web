<template>
    <div>
        <el-card shadow="hover" class="tableBox">
            <el-collapse accordion @change="openItem">
                <template v-for="(item,index) in SetList">
                    <el-collapse-item :name="item.id" :key="item.id">
                        <template slot="title">
                            <b style="min-width: 25px;text-align: right">{{index+1}}</b>
                            <el-divider direction="vertical"></el-divider>
                            <i class="el-icon-collection-tag" style="margin-right: 10px;color: #409EFF"></i>
                            {{ item.name }}
                        </template>
                        <div>
                            <template v-if="activeNames === item.id">
                                <template v-if="isLoading">
                                    <i class="el-icon-loading" style="font-size: 30px"></i>
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
      proList: []
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
      if (!activeNames) return
      this.activeNames = activeNames
      this.isLoading = true
      this.getTableData(activeNames)
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style scoped>
    .tableBox{
        position: relative;
        left: 50%;
        transform: translate(-50%,0);
    }
</style>
