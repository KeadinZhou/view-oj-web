<template>
    <div class="page-foot">
        <p>
            <el-divider></el-divider>
            Copyright &copy; 2017-{{ new Date().getFullYear() }} ZUCC-ACM-LAB. All Rights Reserved.<br>
            Powered by <el-link type="primary" href="https://github.com/taoting1234/view-oj-backend">Taoting</el-link> & <el-link type="primary" href="https://github.com/KeadinZhou/view-oj-web">Keadin</el-link>
            <span class="build-version">Build at {{buildVersion}}</span>
        </p>
    </div>
</template>

<script>
export default {
  name: 'page-foot',
  data () {
    return {
      buildVersion: ''
    }
  },
  created () {
    let version = document.getElementById("app-build-version").innerHTML.replace(" GMT+0800", "")
    this.buildVersion = version
  }
}
</script>

<style scoped>
    .page-foot{
        height: 120px;
        width: 100%;
        text-align: center;
    }
    p{
        color: #909399;
        font-size: 14px;
        position: relative;
        line-height: 100%;
        top: 50%;
        transform: translate(0,-50%);
    }
    .build-version {
        font-size: 12px;
        color: rgba(144, 147, 153, 0.98);
        display: block;
        margin-top: 15px;
    }
</style>
