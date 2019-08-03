<template>
    <div>
        <el-card class="tableBox" shadow="never">
            <el-table :data="tableData" :default-sort = "{prop: 'count', order: 'descending'}">
                <el-table-column label="Userid" align="center" width="90" prop="userid" sortable>
                    <template slot-scope="scope">
                        {{ scope.row.userid }}
                    </template>
                </el-table-column>
                <el-table-column label="Name" align="center" width="90" prop="name">
                    <template slot-scope="scope">
                        {{ scope.row.username }}
                    </template>
                </el-table-column>
                <el-table-column label="Cnt" align="center" width="70" prop="count" sortable>
                    <template slot-scope="scope">
                        {{ scope.row.count }}
                    </template>
                </el-table-column>
                <template v-for="(problem, index) in  proList">
                    <el-table-column align="center" :key="index" min-width="35">
                        <template slot="header" slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="problem.oj_name+'-'+problem.problem_pid" placement="top">
                                <b>{{String.fromCharCode((65+index))}}</b>
                            </el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="problem.oj_name+'-'+problem.problem_pid" placement="top">
                                <i :class="scope.row.state[index]?'el-icon-success doneColor':'el-icon-minus'"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
  name: 'monitor-table',
  props: {
    proData: Array,
    proList: Array
  },
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    initData () {
      this.tableData = []
      for (var man of this.proData) {
        var manProList = new Map()
        for (var manPro of man.data) {
          manProList.set(manPro.problem_id, manPro.create_time)
        }
        var state = []
        for (var problem of this.proList) {
          state.push(manProList.has(problem.problem_id))
        }
        this.tableData.push({
          userid: man.username,
          username: man.nickname,
          state: state,
          count: manProList.size
        })
      }
    }
  },
  created () {
    this.initData()
  }
}
</script>

<style scoped>
    .doneColor{
        color: #67C23A;
    }
    .tableBox{
        position: relative;
        left: 50%;
        transform: translate(-50%,0);
    }
</style>
