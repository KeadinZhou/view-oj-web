<template>
    <div>
        <div class="chartTitle">
            <b>{{(this.inputDate && this.inputDate.length===2)?('AC-Line from '+inputDate[0]+' to '+inputDate[1]):'AC-Line in last week'}}</b>
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
  data () {
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
      var postdata = this.inputDate && this.inputDate.length === 2 ? {
        username: this.userid,
        start_date: this.inputDate[0],
        end_date: this.inputDate[1]
      } : {
        username: this.userid
      }
      var api = this.$store.state.api
      var that = this
      that.$http.post(api + '/v1/data/get_accept_problem_count_distributed', postdata)
        .then(data => {
          this.chartData.rows = []
          for (var i in data.data.data) {
            var item = data.data.data[i]
            this.chartData.rows.push({
              'Time': item.date,
              'Accept': item.count
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
