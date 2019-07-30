<template>
    <div class="page-foot">
        <p>
            <el-divider></el-divider>
            Copyright &copy; 2017-{{ new Date().getFullYear() }} ZUCC-ACM-LAB. All Rights Reserved.<br>
            Powered by <el-link type="primary" href="https://github.com/taoting1234/oj_spider">Taoting</el-link> & <el-link type="primary" href="https://github.com/KeadinZhou">Keadin</el-link><br><br>
            Task Queue: <i :class="this.count!==0?'el-icon-loading':'el-icon-circle-check'"></i>{{ this.count!==0?this.count:'' }}
        </p>
    </div>
</template>

<script>
export default {
  name: 'page-foot',
  data () {
    return {
      count: 0
    }
  },
  methods: {
    getData () {
      var api = this.$store.state.api
      var that = this
      that.$http.post(api + '/v1/task/get_task_count')
        .then(data => {
          this.count = data.data.data
        })
        .catch(function (error) {
          if (error.response) {
          }
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
    .page-foot{
        height: 120px;
        width: 100%;
        text-align: center;
    }
    p{
        color: #909399;
        font-size: 14px;
        position: relative;
        line-height: 100%;
        top: 50%;
        transform: translate(0,-50%);
    }
</style>
