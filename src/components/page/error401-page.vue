<template>
    <div>
        <div class="itemBox">
            <div class="imgBox">
                <img src="@/assets/401.gif">
            </div>
            <div class="textBox">
                <p style="color: #1482f0;font-size: 32px;line-height: 40px;margin-bottom: 20px"><b>OOPS!</b></p>
                <p style="color: #222222;font-size: 20px;line-height: 24px;margin-bottom: 10px"><b>You are not allowed to access this page...</b></p>
                <p style="color: #808080;font-size: 13px;line-height: 21px;margin-bottom: 30px">Please check that the URL you entered is correct, or click the button below to return to the homepage.</p>
                <el-button type="primary" size="medium" round @click="$router.push('/')" style="background: #1482f0;border-color:#1482f0">Back to home</el-button>
                <template v-if="!$store.state.user.username">
                    <el-button type="primary" size="medium" round @click="$router.push('/login')" style="background: #1482f0;border-color:#1482f0">Login first</el-button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'error401-page'
}
</script>

<style scoped>
    .itemBox{
        width: 620px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .imgBox{
        width: 320px;
        float: left;
    }
    .textBox{
        float: right;
        width: 300px;
        padding: 100px 0;
    }
</style>
