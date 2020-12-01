<template>
  <div>
    <p class="chartTitle">Codeforces Rating</p>
    <div class="tips-box">
      上周场数：<b>{{ statistics.count }}</b>
      <el-divider direction="vertical"></el-divider>
      分数变动：<b>{{ statistics.rating_change }}</b>
      <el-divider direction="vertical"></el-divider>
      最终分数：<b>{{ statistics.last_rating }}</b>
    </div>
    <ve-line
        :data="chartData"
        :extend="extend"
        :settings="chartSettings"
        :mark-point="markPoint"
        :legend-visible="false"
        height="600px"
        v-loading="loading"/>
  </div>
</template>

<script>
export default {
  name: 'cf-rating-chart',
  props: {
    userid: String
  },
  data() {
    var that = this
    this.markPoint = {
      symbolSize: 35,
      symbol: 'pin',
      data: [
        {
          name: 'MAX',
          type: 'max',
          label: {
            show: true,
            fontSize: 8
          }
        }
      ]
    }
    this.extend = {
      series: {
        symbol: 'circle',
        smooth: false,
        showSymbol: true,
        symbolSize: 10,
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(0, 0, 0, 1)',
          shadowBlur: 10,
          color: '#ddc44e'
        },
        markArea: {
          silent: true,
          data: [[
            {
              yAxis: -Infinity,
              itemStyle: {
                color: '#cccccc'
              }
            }, {
              yAxis: 1200
            }
          ], [
            {
              yAxis: 1200,
              itemStyle: {
                color: '#77e177'
              }
            }, {
              yAxis: 1400
            }
          ], [
            {
              yAxis: 1400,
              itemStyle: {
                color: '#77ddbb'
              }
            }, {
              yAxis: 1600
            }
          ], [
            {
              yAxis: 1600,
              itemStyle: {
                color: '#5d5dfa'
              }
            }, {
              yAxis: 1900
            }
          ], [
            {
              yAxis: 1900,
              itemStyle: {
                color: '#ff88ff'
              }
            }, {
              yAxis: 2100
            }
          ], [
            {
              yAxis: 2100,
              itemStyle: {
                color: '#ffbb55'
              }
            }, {
              yAxis: 2400
            }
          ], [
            {
              yAxis: 2400,
              itemStyle: {
                color: '#ff7777'
              }
            }, {
              yAxis: 2600
            }
          ], [
            {
              yAxis: 2600,
              itemStyle: {
                color: '#ff3333'
              }
            }, {
              yAxis: 3000
            }
          ], [
            {
              yAxis: 3000,
              itemStyle: {
                color: '#aa0000'
              }
            }, {
              yAxis: Infinity
            }
          ]]
        }
      },
      tooltip: {
        formatter: function (params) {
          let row = that.chartData.rows[params[0].dataIndex]
          let delta = row.Delta
          let deltastr = ''
          if (delta < 0) deltastr = '-' + (-delta)
          else deltastr = '+' + delta
          return row.Round +
              '<br />' +
              'Rank: ' + row.Rank +
              '<br />' +
              'Rating: ' + params[0].data[1] + ' (' + deltastr + ')' +
              '<br />' +
              'Time: ' + row.Date
        }
      }
    }
    this.colors = ['#ddc44e', '#ddc44e', '#ddc44e', '#ddc44e']
    this.chartSettings = {
      area: false,
      xAxisType: 'time',
      scale: [true, true]
    }
    return {
      loading: false,
      isRefresh: true,
      chartData: {
        columns: ['Date', 'Rating'],
        rows: []
      },
      statistics: {}
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
    getData() {
      this.loading = true
      var api = this.$store.state.api
      var that = this
      that.$http.get(api + '/v2/user/' + this.userid)
          .then(data => {
            this.statistics = data.data.data.cf_statistics
            if (this.statistics.rating_change > 0) {
              this.statistics.rating_change = '+' + this.statistics.rating_change
            }
            this.chartData.rows = []
            var rating = 0
            data.data.data.cf_rating_trend.sort(function (a, b) {
              if (a.date === b.date) {
                return 0
              } else {
                return a.date < b.date ? -1 : 0
              }
            })
            for (var i in data.data.data.cf_rating_trend) {
              var item = data.data.data.cf_rating_trend[i]
              rating += item.rating_change
              this.chartData.rows.push({
                Date: item.create_time,
                Rating: rating,
                Delta: item.rating_change,
                Round: item.round_name,
                Rank: item.rank
              })
            }
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
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 30px;
}

.tips-box {
  width: 100%;
  text-align: center;
  color: #555555;
  font-size: 14px;
  margin-bottom: -30px;
}
</style>
