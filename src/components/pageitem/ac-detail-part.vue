<template>
    <div>
        <div class="dataBox">
            <el-date-picker
                    v-model="inputDate"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="to"
                    start-placeholder="Begin Date"
                    end-placeholder="End Date">
            </el-date-picker>
            <el-button icon="el-icon-search" plain @click="dateSure()"></el-button>
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
      sureDate: []
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
        width: 411px;
        left: 50%;
        transform: translate(-50%,0);
        margin-top: 50px;
        margin-bottom: 50px;
    }
</style>
