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
                    @change="dateSure()">
            </el-date-picker>
        </div>
        <template v-if="isRefresh">
            <count-chart :userid="this.userid" :inputDate="this.sureDate"></count-chart>
            <el-divider></el-divider>
            <ac-table :userid="this.userid" :inputDate="this.sureDate"></ac-table>
        </template>
    </div>
</template>

<script>
import ACTable from '@/components/pageitem/ac-table'
import CountChart from '@/components/charts/count-chart'
export default {
  name: 'ac-detail-part',
  props: {
    userid: String
  },
  components: {
    'ac-table': ACTable,
    'count-chart': CountChart
  },
  data () {
    return {
      isRefresh: true,
      inputDate: [],
      sureDate: [],
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
  methods: {
    reFreshChart () {
      this.isRefresh = false
      this.$nextTick(function () {
        this.isRefresh = true
      })
    },
    dateSure () {
      if (this.inputDate && this.inputDate.length === 2) {
        this.sureDate = this.inputDate
      } else {
        this.sureDate = []
      }
      this.reFreshChart()
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
