<template>
    <div class="task-box">
        <el-popover
                class="messageClass"
                placement="top-start"
                trigger="hover"
                :content="this.messageText">
            <el-button slot="reference" type="primary" :icon="this.count!==0?'el-icon-loading':'el-icon-check'" circle></el-button>
        </el-popover>
    </div>
</template>

<script>
export default {
  name: 'task-box',
  data () {
    return {
      count: 0,
      api: this.$store.state.api
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
