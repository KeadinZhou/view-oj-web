<template>
    <div class="task-box">
        <el-dialog :visible.sync="isShow" :append-to-body="true" width="360px">
            <iframe name = "child" id = "child" :src="'http://kealine.top/almanac/?username='+$store.state.user.userid" width="320px" height="650px" frameborder="0" scrolling="no"></iframe>
        </el-dialog>
        <el-popover
                class="messageClass"
                placement="top-start"
                trigger="hover"
                :content="this.messageText">
            <el-button
                    slot="reference"
                    :type="this.count!==0?'warning':'primary'"
                    :icon="this.count!==0?'el-icon-loading':'el-icon-check'"
                    @click="bottonClick"
                    circle>
            </el-button>
        </el-popover>
    </div>
</template>

<script>
export default {
  name: 'task-box',
  data () {
    return {
      count: 0,
      api: this.$store.state.api,
      clickCount: 0,
      isShow: false
    }
  },
  computed: {
    messageText: function () {
      return (this.count === 0) ? ('There is no task in the queue.')
        : ((this.count === 1) ? ('There is 1 task in the queue.')
          : ('There are ' + this.count + ' tasks in the queue.'))
    }
  },
  methods: {
    getData () {
      var that = this
      that.$http.post(this.api + '/v1/task/get_task_count')
        .then(data => {
          this.count = data.data.data
        })
      setTimeout(() => {
        this.getData()
      }, 2000)
    },
    bottonClick () {
      this.clickCount++
      if (this.clickCount % 5 === 0 && this.$store.state.user.userid) {
        this.isShow = true
      }
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>
    .task-box{
        position: fixed;
        z-index: 9999;
        right: 50px;
        bottom: 50px;
    }
    .messageClass{
        text-align: center;
    }
</style>
