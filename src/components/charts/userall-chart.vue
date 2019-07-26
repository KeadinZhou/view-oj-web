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
      if (this.$store.state.Userlist) {
        this.$store.commit('updateUserallChartData', this.userid)
        this.username = this.$store.state.Userlist.get(this.userid).nickname
        setTimeout(() => {
          this.chartData.rows = this.$store.state.UserallChartData
          this.loading = false
          this.reFreshChart()
        }, 500)
      } else {
        setTimeout(() => {
          this.initData()
        }, 500)
      }
    },
    getData () {
      this.loading = true
      if (!this.$store.state.Userlist) {
        setTimeout(() => {
          this.initData()
        }, 500)
      } else {
        this.initData()
      }
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
