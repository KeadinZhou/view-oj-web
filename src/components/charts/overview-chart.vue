<template>
    <div class="chart-box">
        <div class="chartTitle">
            <b>Training status chart of Grade {{this.grade}}</b>
        </div>
        <div class="chartSubTitle">
            {{this.daterange && this.daterange[0] ? ('The data from ' + this.daterange[0] + ' to ' + this.daterange[1]) : ('Last week\'s data')}}
        </div>
        <ve-histogram
                :data="chartData"
                :loading="loading"
                :extend="extend"
                :legend-visible="false"
                :mark-line="markLine"
                :events="chartEvents"
                width="100%"
                height="800px">
        </ve-histogram>
    </div>
</template>

<script>
export default {
  name: 'overview-chart',
  props: {
    grade: String,
    daterange: Array
  },
  data () {
    var that = this
    this.markLine = {
      data: [
        {
          name: 'AVG',
          type: 'average',
          label: {
            show: true,
            position: 'start',
            formatter: '{b}\n{c}'
          }
        }, {
          name: 'MAX',
          type: 'max',
          label: {
            show: true,
            position: 'start',
            formatter: '{b}\n{c}'
          }
        }, {
          name: 'MIN',
          type: 'min',
          label: {
            show: true,
            position: 'start',
            formatter: '{b}\n{c}'
          }
        }
      ]
    }
    this.extend = {
      series: {
        label: { show: true, position: 'top' },
        barMaxWidth: 70,
        barMinHeight: 5,
        itemStyle: {
          normal: {
            color: '#409eff'
          }
        }
      },
      xAxis: {
        axisLabel: {
          margin: 15,
          interval: 0,
          rotate: 45
        }
      },
      yAxis: {
        minInterval: 1
      },
      triggerEvent: true
    }
    this.chartEvents = {
      click: function (e) {
        var name = e.name
        var username = name.substring(0, name.indexOf(' '))
        if (!username) return
        that.$router.push('/user/' + username + '?part=problem')
      }
    }
    return {
      chartData: {
        columns: ['User', 'Accept'],
        rows: []
      },
      loading: false,
      chartTitle: {
        text: 'Training status chart of Grade ' + this.grade,
        subtext: this.daterange && this.daterange[0] ? ('The data from ' + this.daterange[0] + ' to ' + this.daterange[1]) : ('Last week\'s data'),
        left: 'center',
        right: 'center',
        textStyle: {
          fontSize: 25
        },
        padding: [0, 0, 20, 0]
      }
    }
  },
  methods: {
    getData () {
      this.loading = true
      this.chartData.rows = []
      for (var i in this.$store.state.OverviewData) {
        var item = this.$store.state.OverviewData[i]
        if (item.group === this.grade) {
          this.chartData.rows.push({'User': item.userid + ' - ' + item.username, 'Accept': item.number})
        }
      }
      this.loading = false
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>
    .chart-box{
        margin-top: 50px;
    }
    .chartTitle{
        text-align: center;
        font-size: 28px;
        margin-top: 30px;
    }
    .chartSubTitle{
        text-align: center;
        margin-top: 5px;
        color: #808080;
        font-size: 13px;
    }
</style>
