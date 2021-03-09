<template>
  <el-dialog title="Edit Monitor" :visible.sync="isVisible" append-to-body width="600px">
    <div>
      <el-input placeholder="The Title of The New Problem Set" v-model="set_title"
                prefix-icon="el-icon-edit-outline"></el-input>
    </div>
    <el-divider><i class="el-icon-document"/></el-divider>
    <div style="display: flex; justify-content: space-between; margin: 20px 0">
      <el-date-picker
          style="width: 45%"
          type="datetime" v-model="startTime"
          placeholder="开始时间（可不填）"
          value-format="yyyy-MM-dd HH:mm:ss"
      />
      <p style="line-height: 40px; font-size: 20px">-</p>
      <el-date-picker
          style="width: 45%"
          type="datetime" v-model="endTime"
          placeholder="结束时间（可不填）"
          value-format="yyyy-MM-dd HH:mm:ss"
      />
    </div>
    <div class="itemBox">
      <template v-for="(item,index) in problemSet">
        <div :key="index" class="itemItem">
          <b style="margin-right: 10px">{{ String.fromCharCode((65 + index)) }}</b>
          <el-input v-model="item.pid" placeholder="Pro. Num">
            <el-select v-model="item.oj" placeholder="OJ" style="width: 150px" slot="prepend">
              <el-option v-for="OJ in oj_list" :key="OJ.id" :label="OJ.name" :value="OJ.name"></el-option>
            </el-select>
            <el-select v-model="item.difficulty" style="width: 120px" slot="append">
              <el-option v-for="i in Array(6).keys()" :key="i" :value="i" :label="getDifficultyDescribe(i)"/>
            </el-select>
          </el-input>
          <el-button type="danger" icon="el-icon-delete" size="mini" circle style="margin-left: 10px;"
                     @click="delItem(item)"></el-button>
        </div>
      </template>
      <div class="itemItem">
        <el-button icon="el-icon-plus" round @click="addProblem">Problem</el-button>
      </div>
    </div>
    <el-divider><i class="el-icon-user-solid"/></el-divider>
    <el-tree
        :data="user_list"
        show-checkbox
        check-on-click-node
        :expand-on-click-node="false"
        ref="user_tree"/>
    <div slot="footer" class="dialog-footer">
      <el-button @click="initProblemSet">Cancel</el-button>
      <el-button type="primary" @click="submitCreate">Submit</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "monitor-edit-dialog",
  inject: ['refresh'],
  props: {
    user_list: Array,
    contest_oj_list: Array,
    oj_list: Array,
    visible: Boolean
  },
  data() {
    return {
      set_title: '',
      problemSet: [],
      isVisible: this.visible,
      startTime: undefined,
      endTime: undefined
    }
  },
  methods: {
    show() {
      this.isVisible = true
    },
    initProblemSet() {
      this.set_title = ''
      this.problemSet = []
      this.startTime = this.endTime = undefined
      this.isVisible = false
    },
    addProblem() {
      let num = this.problemSet.length
      if (num === 0) {
        this.problemSet.push({
          oj: null,
          pid: '',
          difficulty: 0
        })
      } else {
        let oldpid = this.problemSet[num - 1].pid
        let newpid
        if (oldpid === '') newpid = ''
        else if (isNaN(oldpid)) newpid = oldpid.substr(0, oldpid.length - 1) + String.fromCharCode(oldpid.charCodeAt(oldpid.length - 1) + 1)
        else newpid = (parseInt(oldpid) + 1).toString()
        this.problemSet.push({
          oj: this.problemSet[num - 1].oj,
          pid: newpid,
          difficulty: 0
        })
      }
    },
    delItem(item) {
      let index = this.problemSet.indexOf(item)
      if (index !== -1) {
        this.problemSet.splice(index, 1)
      }
    },
    submitCreate() {
      let checked_nodes = this.$refs.user_tree.getCheckedNodes()
      let checked_users = []
      for (let i of checked_nodes) {
        if (i.children === undefined) checked_users.push(i.username)
      }
      const that = this
      if (!that.set_title) {
        that.$message.error('Title cannot be empty!')
        return
      }
      if (checked_users.length === 0) {
        that.$message.error('Please select user(s)')
        return
      }
      for (let item of that.problemSet) {
        if (!(item.oj && item.pid)) {
          that.$message.error('Problem cannot be empty!')
          return
        }
      }
      if (that.problemSet.length === 0) {
        that.$message.error('ProblemSet cannot be empty!')
        return
      }
      let problems = []
      for (let prob of that.problemSet) {
        problems.push({
          problem: prob.oj + '-' + prob.pid,
          difficulty: prob.difficulty
        })
      }
      that.$http.post(this.$store.state.api + '/v2/problem_set', {
        name: that.set_title,
        problem_list: JSON.stringify(Array.from(problems)),
        start_time: this.startTime,
        end_time: this.endTime,
        user_list: JSON.stringify(checked_users)
      })
          .then(data => {
            that.$message.success(data.data.msg)
            that.initProblemSet()
            that.refresh()
          })
          .catch(function (error) {
            if (error.response) {
              that.$message.error(error.response.data.msg)
            }
          })
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
    },
  },
  watch: {
    isVisible(val) {
      this.$emit('update:visible', val)
    },
    visible(val) {
      this.isVisible = val
    }
  }
}
</script>

<style scoped>
.itemBox {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  flex-direction: column;
}

.itemItem {
  width: 90%;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around
}

/deep/ .el-tree-node__children .el-tree-node__children .el-tree-node__content {
  float: left;
  width: 20%;
  padding: 0 !important;
  margin-left: 20px;
}

/deep/ .el-input-group__append, /deep/ .el-input-group__prepend {
  background-color: transparent;
}
</style>
