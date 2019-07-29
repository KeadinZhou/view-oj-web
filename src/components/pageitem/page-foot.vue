<template>
    <div class="page-foot">
        <p>
            <el-divider></el-divider>
            Copyright &copy; 2017-{{ new Date().getFullYear() }} ZUCC-ACM-LAB. All Rights Reserved.<br>
            Powered by <el-link type="primary" href="https://github.com/taoting1234/oj_spider">Taoting</el-link> & <el-link type="primary" href="https://github.com/KeadinZhou">Keadin</el-link>
        </p>
    </div>
</template>

<script>
export default {
  name: 'page-foot'
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
</style>
