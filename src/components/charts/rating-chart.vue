<template>
    <div>
        <ve-line
                :data="chartData"
                :extend="extend"
                :settings="chartSettings"
                :title="chartTitle"
                :mark-point="markPoint"
                :legend-visible="false"
                height="600px"
                v-loading="loading">
        </ve-line>
    </div>
</template>

<script>
export default {
  name: 'rating-chart',
  props: {
    userid: String
  },
  data () {
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
        showSymbol: false,
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
              yAxis: 1600
            }
          ], [
            {
              yAxis: 1600,
              itemStyle: {
                color: '#77e177'
              }
            }, {
              yAxis: 1800
            }
          ], [
            {
              yAxis: 1800,
              itemStyle: {
                color: '#77ddbb'
              }
            }, {
              yAxis: 2000
            }
          ], [
            {
              yAxis: 2000,
              itemStyle: {
                color: '#aaaaff'
              }
            }, {
              yAxis: 2300
            }
          ], [
            {
              yAxis: 2300,
              itemStyle: {
                color: '#ff88ff'
              }
            }, {
              yAxis: 2500
            }
          ], [
            {
              yAxis: 2500,
              itemStyle: {
                color: '#ffbb55'
              }
            }, {
              yAxis: 2800
            }
          ], [
            {
              yAxis: 2800,
              itemStyle: {
                color: '#ff7777'
              }
            }, {
              yAxis: 3000
            }
          ], [
            {
              yAxis: 3000,
              itemStyle: {
                color: '#ff3333'
              }
            }, {
              yAxis: 3300
            }
          ], [
            {
              yAxis: 3300,
              itemStyle: {
                color: '#aa0000'
              }
            }, {
              yAxis: Infinity
            }
          ]]
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
      chartTitle: {
        text: 'Rating',
        subtext: this.userid,
        left: 'center',
        right: 'center',
        textStyle: {
          fontSize: 25
        }
      },
      chartData: {
        columns: ['Date', 'Rating'],
        rows: []
      }
    }
  },
  methods: {
    reFreshChart () {
      this.isRefresh = false
      this.$nextTick(function () {
        this.isRefresh = true
        this.loading = false
      })
    },
    getData () {
      this.loading = true
      var api = this.$store.state.api
      var that = this
      that.$http.post(api + '/v1/data/get_rating_trend', {username: this.userid})
        .then(data => {
          this.chartData.rows = []
          var rating = 1500
          for (var i in data.data.data) {
            var item = data.data.data[i]
            rating += item.add_rating
            this.chartData.rows.push({
              'Date': item.date,
              'Rating': rating
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
</style>
