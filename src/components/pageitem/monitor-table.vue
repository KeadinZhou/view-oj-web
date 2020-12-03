<template>
  <div>
    <el-card class="tableBox" shadow="never">
      <el-table :data="tableData" :default-sort="{prop: 'count', order: 'descending'}">
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
          <el-table-column align="center" :key="index" min-width="50">
            <template slot="header">
              <el-link :href="problem.url" target="_blank" :underline="false" style="color: gray">
                <el-tooltip effect="dark" :content="problem.oj.name+'-'+problem.problem_pid"
                            placement="top">
                  <span style="font-weight: bold">{{ String.fromCharCode((65 + index)) }}</span>
                </el-tooltip>
                <el-tooltip :content="getDifficultyDescribe(problem.difficulty)" placement="top">
                  <div class="dot" :class="'difficulty'+problem.difficulty"/>
                </el-tooltip>
              </el-link>
            </template>
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="problem.oj.name+'-'+problem.problem_pid"
                          placement="top">
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
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    initData() {
      this.tableData = []
      for (let data of this.proData.filter((a) => {
        return !a.user.is_freshman
      })) {
        let proset = new Set()
        for (let ac_problem of data.data) {
          proset.add(ac_problem.problem.problem_pid)
        }
        let state = []
        for (let problem of this.proList) {
          state.push(proset.has(problem.problem_pid))
        }
        this.tableData.push({
          userid: data.user.username,
          username: data.user.nickname,
          state: state,
          count: proset.size
        })
      }
    },
    getDifficultyDescribe(difficulty) {
      switch (difficulty) {
        case 0:
          return '未评级'
        case 1:
          return '普通'
        case 2:
          return '稀有'
        case 3:
          return '史诗'
        case 4:
          return '传说'
        case 5:
          return '神话'
        default:
          return 'ERROR'
      }
    }
  },
  created() {
    this.initData()
  }
}
</script>

<style scoped>
.doneColor {
  color: #67C23A;
}

.tableBox {
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: black;
  margin-left: 5px;
}

.difficulty0 {
  background: black;
}

.difficulty1 {
  background: #aaaaaa;
}

.difficulty2{
  background: skyblue;
}

.difficulty3 {
  background: purple;
}

.difficulty4 {
  background: orange;
}

.difficulty5 {
  background: red;
}
</style>
