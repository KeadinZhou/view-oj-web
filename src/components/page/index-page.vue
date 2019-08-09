<template>
    <div>
        <div class="dataBox">
            <el-date-picker
                    v-model="inputDate"
                    type="daterange"
                    align="center"
                    unlink-panels
                    value-format="yyyy-MM-dd"
                    range-separator="to"
                    start-placeholder="Begin Date"
                    end-placeholder="End Date"
                    :picker-options="pickerOptions"
                    @change="changeOverviewDate">
            </el-date-picker>
        </div>
        <template v-if="isRefresh">
            <overview-chart v-for="item in this.$store.state.OverviewGrade" :grade="item" :daterange="inputDate" :key="item"></overview-chart>
        </template>
    </div>
</template>

<script>
import OverviewChart from '@/components/charts/overview-chart'
export default {
  name: 'index-page',
  components: {
    'overview-chart': OverviewChart
  },
  data () {
    return {
      isRefresh: true,
      inputDate: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近两周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 14)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一年',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近两年',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 2)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created () {
    this.changeOverviewDate()
  },
  methods: {
    changeOverviewDate () {
      this.$store.commit('updateOverview', this.inputDate !== null && this.inputDate.length === 2 ? {
        start_date: this.inputDate[0],
        end_date: this.inputDate[1]
      } : null)
      this.isRefresh = false
      this.$nextTick(function () {
        this.isRefresh = true
      })
    }
  }
}
</script>

<style scoped>
    .dataBox{
        position: relative;
        width: 350px;
        left: 50%;
        transform: translate(-50%,0);
        margin-top: 50px;
        margin-bottom: 50px;
    }
</style>
