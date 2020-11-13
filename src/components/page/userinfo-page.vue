<template>
  <div v-if="this.pageid">
    <userall-chart :userid="this.pageid"></userall-chart>
    <el-divider></el-divider>
    <a id="cf-rating"/>
    <cf-rating-chart :userid="this.pageid"></cf-rating-chart>
    <a id="rating"/>
    <rating-chart :userid="this.pageid"></rating-chart>
    <el-divider></el-divider>
    <oj-set-table :userid="this.pageid"></oj-set-table>
    <el-divider></el-divider>
    <a id="problem"/>
    <ac-detail-part :userid="this.pageid"></ac-detail-part>
  </div>
</template>

<script>
import UserallChart from '@/components/charts/userall-chart'
import OJSetTable from '@/components/pageitem/oj-set-table'
import ACDetailPart from '@/components/pageitem/ac-detail-part'
import RatingChart from '@/components/charts/rating-chart'
import CfRatingChart from "@/components/charts/cf-rating-chart";

export default {
  name: 'userinfo-page',
  components: {
    CfRatingChart,
    'userall-chart': UserallChart,
    'oj-set-table': OJSetTable,
    'ac-detail-part': ACDetailPart,
    'rating-chart': RatingChart
  },
  data() {
    return {
      pageid: ''
    }
  },
  methods: {
    gotoPart(part) {
      setTimeout(() => {
        document.querySelector('#' + part).scrollIntoView({behavior: 'smooth', block: 'start'})
      }, 500)
    },
    pageInit() {
      this.pageid = this.$route.params.userid
    },
    permissionCheck() {
      if (this.$store.state.user.isUpdated) {
        if (!this.$store.state.user.username) {
          this.$router.replace('/error401')
        } else {
          this.pageInit()
        }
      } else {
        setTimeout(() => {
          this.permissionCheck()
        }, 100)
      }
    }
  },
  created() {
    document.title = "Userinfo - viewOJ"
    this.permissionCheck()
  },
  mounted() {
    if (this.$route.query.part) {
      this.gotoPart(this.$route.query.part)
    }
  },
  watch: {
    '$route'() {
      this.permissionCheck()
    }
  }
}
</script>

<style scoped>

</style>
