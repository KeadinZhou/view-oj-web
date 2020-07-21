<template>
    <div class="tableBox">
        <div class="tableTitle">
            <b>Camp-OJ-ID Setting</b>
        </div>
        <el-card class="box-card" shadow="hover">
            <div v-loading="isLoading">
                <el-table :data="oj_username_list" style="width: 100%">
                    <el-table-column label="UserID" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.username }}
                        </template>
                    </el-table-column>
                    <el-table-column label="OJ" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.oj.name }}
                        </template>
                    </el-table-column>
                    <el-table-column label="ID" width="200px" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.oj_username }}
                            <template>
                                <span style="cursor: pointer" @click="editOJID(scope.row)">
                                    <i class="el-icon-edit"></i>
                                </span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="State" align="center" width="55px">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark"
                                        :content="'Last successful update at '+scope.row.last_success_time"
                                        placement="right">
                                <div :class="'dot ' + ((!scope.row.oj_username)?'none':timeSub(scope.row.last_success_time))"></div>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "camp-oj-set-table",
        props: {
            course_id: String
        },
        data() {
            return {
                isLoading: true,
                oj_username_list: []
            }
        },
        methods: {
            refreshOJUsername() {
                let api = this.$store.state.api
                let that = this
                this.isLoading = true
                this.oj_username_list = []
                this.$http.get(api + '/v2/camp/course/' + this.course_id + '/oj_username')
                    .then(response => {
                        that.oj_username_list = response.data.data
                        that.isLoading = false
                    })
                    .catch(error => {
                        if (error.response) {
                            that.$message.error(error.response.data.msg)
                        }
                    })
            },
            editOJID(row) {
                let api = this.$store.state.api
                let that = this
                this.$prompt('Input the ID of ' + row.oj.name, 'Modify', {
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Cancel',
                    inputValue: row.oj_username
                }).then(({value}) => {
                    that.$http.post(api + '/v2/camp/course/' + that.course_id + '/oj_username', {
                        username: row.username,
                        oj_username: value,
                    }).then(response => {
                        that.$message.success(response.data.msg)
                        row.oj_username = value
                    }).catch(error => {
                        if (error.response)
                            that.$message.error(error.response.data.msg)
                        else
                            that.$message.error("无法连接至服务器")
                    })
                })
            },
            timeSub(time) {
                let nowTime = (new Date().getTime()) / 1000
                let thatTime = (new Date(time).getTime()) / 1000
                let sub = nowTime - thatTime
                sub /= 60 * 60
                return (sub > 2) ? ('danger') : ('success')
            }
        },
        created() {
            this.refreshOJUsername()
        }
    }
</script>

<style scoped>
    .tableTitle {
        text-align: center;
        font-size: 25px;
        margin-top: 30px;
        margin-bottom: 30px;
    }

    .tableBox {
        position: relative;
        width: 700px;
        left: 50%;
        transform: translate(-50%, 0);
        margin-top: 50px;
        margin-bottom: 50px;
    }

    .dot {
        width: 10px;
        height: 10px;
        background: #409EFF;
        border-radius: 50%;
        margin-left: 15px;
    }

    .success {
        background: #67C23A;
    }

    .danger {
        background: #F56C6C;
    }

    .none {
        background: #909399;
    }
</style>