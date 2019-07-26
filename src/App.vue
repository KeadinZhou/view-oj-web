<template>
    <div id="app" ref="pageBox">
        <el-scrollbar class="scrollbar">
            <div id="appBox">
                <page-nav></page-nav>
                <div class="page-main-box" ref="pageMainBox">
                    <router-view/>
                </div>
                <page-foot></page-foot>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import PageNav from '@/components/pageitem/page-nav'
import PageFoot from '@/components/pageitem/page-foot'
export default {
  name: 'App',
  components: {
    'page-nav': PageNav,
    'page-foot': PageFoot
  },
  methods: {
    fixBox () {
      this.$refs.pageMainBox.style.minHeight = this.clientHeight - 61 - 44 - 120 + 'px'
      this.$refs.pageBox.style.height = this.clientHeight + 'px'
    }
  },
  mounted () {
    this.fixBox()
  },
  computed: {
    clientHeight: function () {
      return document.documentElement.clientHeight
    }
  },
  watch: {
    clientHeight: function () {
      this.fixBox()
    }
  }
}
</script>
<style>
    *{
        padding: 0;
        margin: 0;
        border: 0;
        text-decoration: none;
        list-style-type: none;
    }
    #app{
        font-family: "Helvetica Neue",Helvetica,"Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        overflow: hidden;
        width: 100%;
    }
    #appBox{
        width: 1100px;
        position: relative;
        left: 50%;
        transform: translate(-50%,0);
    }
    .page-main-box{
        margin-top: 20px;
        margin-bottom: 20px;
        position: relative;
    }
    .scrollbar{
        height: 100%;
    }
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>
