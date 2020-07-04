<template>
    <div>
        <div class="itemBox">
            <div class="imgBox">
                <img src="@/assets/404.png" width="600px">
            </div>
            <div class="textBox">
                <p style="color: #1482f0;font-size: 32px;line-height: 40px;margin-bottom: 20px"><b>OOPS!</b></p>
                <p style="color: #222222;font-size: 20px;line-height: 24px;margin-bottom: 10px"><b>The page you're looking for is missing...</b></p>
                <p style="color: #808080;font-size: 13px;line-height: 21px;margin-bottom: 30px">Please check that the URL you entered is correct, or click the button below to return to the homepage.</p>
                <el-button type="primary" size="medium" round @click="$router.push('/')">Back to home</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'error404-page',
  created () {
    document.title = "Error - viewOJ"
  }
}
</script>

<style scoped>
    .itemBox{
        width: 900px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .imgBox{
        float: left;
    }
    .textBox{
        float: right;
        width: 300px;
        padding: 52px 0;
    }
</style>
