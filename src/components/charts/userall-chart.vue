<template>
    <div v-loading="loading" v-if="isRefresh">
        <div class="chartTitle">
            <b>The problem quantity distribution of {{this.username}}({{this.userid}})</b>
        </div>
        <ve-pie
                :data="chartData"
                :settings="chartSettings"
                :data-empty="dataEmpty"
                width="100%"
                height="450px">
        </ve-pie>
    </div>
</template>

<script>
import 'v-charts/lib/style.css'
export default {
  name: 'userall-chart',
  props: {
    userid: String
  },
  data () {
    this.chartSettings = {
      radius: 170,
      offsetY: 250,
      limitShowNum: 4
    }
    return {
      loading: false,
      isRefresh: true,
      dataEmpty: false,
      chartData: {
        columns: ['OJ', 'Accept'],
        rows: []
      },
      username: null
    }
  },
  methods: {
    reFreshChart () {
      this.isRefresh = false
      if (this.chartData.rows.length === 0) {
        this.dataEmpty = true
      }
      this.$nextTick(function () {
        this.isRefresh = true
      })
    },
    initData () {
      this.$store.commit('updateUserallChartData', {
        username: this.userid,
        chart: this
      })
    },
    getData () {
      this.loading = true
      var api = this.$store.state.api
      var that = this
      that.$http.get(api + '/v2/session')
        .then(data => {
          this.username = data.data.data.nickname
          this.initData()
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
    userid: function () {
      this.getData()
    }
  }
}
</script>

<style scoped>
    .chartTitle{
        text-align: center;
        font-size: 25px;
        margin-top: 30px;
        margin-bottom: 30px;
    }
</style>
