<template>
    <div>
        <userall-chart :userid="this.pageid"></userall-chart>
        <a id="rating"></a>
        <el-divider></el-divider>
        <rating-chart :userid="this.pageid"></rating-chart>
        <el-divider></el-divider>
        <oj-set-table :userid="this.pageid"></oj-set-table>
        <a id="problem"></a>
        <el-divider></el-divider>
        <ac-detail-part :userid="this.pageid"></ac-detail-part>
    </div>
</template>

<script>
import UserallChart from '@/components/charts/userall-chart'
import OJSetTable from '@/components/pageitem/oj-set-table'
import ACDetailPart from '@/components/pageitem/ac-detail-part'
import RatingChart from '@/components/charts/rating-chart'
export default {
  name: 'userinfo-page',
  components: {
    'userall-chart': UserallChart,
    'oj-set-table': OJSetTable,
    'ac-detail-part': ACDetailPart,
    'rating-chart': RatingChart
  },
  data () {
    return {
      pageid: ''
    }
  },
  methods: {
    gotoPart (part) {
      setTimeout(() => {
        document.querySelector('#' + part).scrollIntoView({behavior: 'smooth'})
      }, 500)
    },
    pageInit () {
      this.pageid = this.$route.params.userid
    }
  },
  created () {
    this.pageInit()
  },
  mounted () {
    if (this.$route.query.part) {
      this.gotoPart(this.$route.query.part)
    }
  },
  watch: {
    '$route' () {
      this.pageInit()
    }
  }
}
</script>

<style scoped>

</style>
