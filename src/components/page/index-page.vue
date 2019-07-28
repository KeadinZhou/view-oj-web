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
            <el-button icon="el-icon-search" plain @click="changeOverviewDate"></el-button>
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
      inputDate: []
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
        width: 411px;
        left: 50%;
        transform: translate(-50%,0);
        margin-top: 50px;
        margin-bottom: 50px;
    }
</style>
