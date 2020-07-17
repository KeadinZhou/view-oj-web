<template>
    <span>
        <el-popover placement="top" v-model="visible" width="252">
            <div class="itemBox">
                <el-checkbox v-model="changeName" disabled>I want to change my name.</el-checkbox>
                <div v-if="changeName">
                    <el-input v-model="name" placeholder="New Name" class="mini-input"></el-input>
                </div>
            </div>
            <div class="itemBox">
                <el-checkbox v-model="changePwd">I want to change my password.</el-checkbox>
                <div v-if="changePwd">
                    <el-input v-model="oldPwd" placeholder="Old Password" show-password class="mini-input"></el-input>
                    <el-input v-model="newPwd" placeholder="New Password" show-password class="mini-input"></el-input>
                    <el-input v-model="newPwd2" placeholder="Confirm New Password" show-password
                              class="mini-input"></el-input>
                </div>
            </div>
            <div style="text-align: right; margin-right: 10px">
                <el-button size="mini" type="text" @click="toCancel()">Cancel</el-button>
                <el-button type="primary" size="mini" @click="toSubmit()">Submit</el-button>
            </div>
            <el-button slot="reference" type="text">{{this.$store.state.user.username}}</el-button>
        </el-popover>
    </span>
</template>

<script>
    export default {
        name: 'user-change-box',
        data() {
            return {
                visible: false,
                changeName: false,
                name: this.$store.state.user.username,
                changePwd: false,
                oldPwd: '',
                newPwd: '',
                newPwd2: ''
            }
        },
        methods: {
            toCancel() {
                this.visible = false
                this.changeName = false
                this.name = this.$store.state.user.username
                this.changePwd = false
                this.oldPwd = ''
                this.newPwd = ''
                this.newPwd2 = ''
            },
            toSubmit() {
                this.visible = false
                if (this.changeName) {
                    this.$store.commit('modifyUserNameBySelf', this.name)
                }
                if (this.changePwd) {
                    if (this.newPwd === this.newPwd2) {
                        this.$store.commit('modifyUserInfo', {
                            username: this.$store.state.user.userid,
                            old_password: this.oldPwd,
                            password: this.newPwd
                        })
                        setTimeout(() => {
                            this.toCancel()
                        }, 500)
                    } else {
                        this.$message.error('Entered passwords differ from the another!')
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .itemBox {
        margin: 10px;
    }

    .mini-input {
        margin-top: 5px;
        margin-bottom: 5px;
        width: 230px;
    }
</style>
