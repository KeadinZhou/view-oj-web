<template>
    <div>
        <userall-chart :userid="this.pageid"></userall-chart>
        <el-divider></el-divider>
        <oj-set-table :userid="this.pageid"></oj-set-table>
    </div>
</template>

<script>
import UserallChart from '@/components/charts/userall-chart'
import OJSetTable from '@/components/pageitem/oj-set-table'
export default {
  name: 'userinfo-page',
  components: {
    'userall-chart': UserallChart,
    'oj-set-table': OJSetTable
  },
  data () {
    return {
      pageid: ''
    }
  },
  created () {
    this.pageid = this.$route.params.userid
  }
}
</script>

<style scoped>

</style>
