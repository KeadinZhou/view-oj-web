<template>
  <div>
    <div class="chartTitle">
      <b>{{
          (this.inputDate && this.inputDate.length === 2) ? ('AC-Line from ' + inputDate[0] +
              ' to ' + inputDate[1]) : 'AC-Line in last week'
        }}</b>
    </div>
    <div class="tips-box">
      总出题数：<b>{{ tips.acSum }}</b>
      <el-divider direction="vertical"></el-divider>
      平均出题数：<b>{{ tips.averageNum }}</b>
      <el-divider direction="vertical"></el-divider>
      出题总天数：<b>{{ tips.acDayCnt }}</b>
      <el-divider direction="vertical"></el-divider>
      未出题总天数：<b>{{ tips.notAcDayCnt }}</b>
      <el-divider direction="vertical"></el-divider>
      最长连续出题天数：<b>{{ tips.longestAcDays }}</b>
      <el-divider direction="vertical"></el-divider>
      最长连续未出题天数：<b>{{ tips.longestNotAcDays }}</b>
      <el-divider direction="vertical"></el-divider>
      <!--            方差：<b>{{tips.variance}}</b><el-divider direction="vertical"></el-divider>-->
      标准差：<b>{{ tips.standardDeviation }}</b>
    </div>
    <ve-line
        :data="chartData"
        :extend="extend"
        :settings="chartSettings"
        :legend-visible="false"
        height="500px"
        v-loading="loading">
    </ve-line>
  </div>
</template>

<script>
export default {
  name: 'count-chart',
  props: {
    userid: String,
    inputDate: Array
  },
  data() {
    this.extend = {
      'xAxis.0.axisLabel.rotate': 45
    }
    this.chartSettings = {
      area: true
    }
    return {
      loading: false,
      isRefresh: true,
      chartData: {
        columns: ['Time', 'Accept'],
        rows: []
      },
      tips: {
        averageNum: 0,
        acDayCnt: 0,
        notAcDayCnt: 0,
        longestAcDays: 0,
        longestNotAcDays: 0,
        variance: 0,
        standardDeviation: 0,
        acSum: 0
      }
    }
  },
  methods: {
    reFreshChart() {
      this.isRefresh = false
      this.$nextTick(function () {
        this.isRefresh = true
        this.loading = false
      })
    },
    updateTips() {
      const that = this
      const data = that.chartData.rows
      var tips = {
        averageNum: 0,
        acDayCnt: 0,
        notAcDayCnt: 0,
        longestAcDays: 0,
        longestNotAcDays: 0,
        variance: 0,
        standardDeviation: 0,
        acSum: 0
      }
      var longestAcDaysTmp = 0
      var longestNotAcDaysTmp = 0
      var acSum = 0
      for (const item of data) {
        acSum += item.Accept
        if (item.Accept === 0) {
          tips.notAcDayCnt++
          longestNotAcDaysTmp++
          tips.longestAcDays = Math.max(tips.longestAcDays, longestAcDaysTmp)
          longestAcDaysTmp = 0
        } else {
          tips.acDayCnt++
          longestAcDaysTmp++
          tips.longestNotAcDays = Math.max(tips.longestNotAcDays, longestNotAcDaysTmp)
          longestNotAcDaysTmp = 0
        }
      }
      tips.longestAcDays = Math.max(tips.longestAcDays, longestAcDaysTmp)
      tips.longestNotAcDays = Math.max(tips.longestNotAcDays, longestNotAcDaysTmp)
      tips.averageNum = acSum / data.length

      for (const item of data) {
        tips.variance += (item.Accept - tips.averageNum) * (item.Accept - tips.averageNum)
      }
      tips.acSum = acSum
      tips.variance /= data.length
      tips.standardDeviation = Math.sqrt(tips.variance)
      tips.averageNum = tips.averageNum.toFixed(2)
      tips.variance = tips.variance.toFixed(2)
      tips.standardDeviation = tips.standardDeviation.toFixed(2)
      that.tips = tips
    },
    getData() {
      this.loading = true
      var postdata = this.inputDate && this.inputDate.length === 2 ? {
        username: this.userid,
        start_date: this.inputDate[0],
        end_date: this.inputDate[1]
      } : {
        username: this.userid
      }
      var api = this.$store.state.api
      var that = this
      that.$http.get(api + '/v2/accept_problem', {params: postdata})
          .then(data => {
            this.chartData.rows = []
            for (var i in data.data.data.summary) {
              var item = data.data.data.summary[i]
              this.chartData.rows.push({
                'Time': item.date,
                'Accept': item.count
              })
            }
            that.updateTips()
            that.reFreshChart()
          })
          .catch(function (error) {
            if (error.response) {
              that.$message.error(error.response.data.msg)
            }
          })
    }
  },
  created() {
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
.chartTitle {
  text-align: center;
  font-size: 25px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.tips-box {
  width: 100%;
  text-align: center;
  color: #555555;
  font-size: 14px;
}
</style>
