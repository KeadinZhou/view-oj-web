<template>
    <div>
        <el-dialog
                title="Edit camps"
                :visible.sync="isEditDialogShow"
                append-to-body
                width="600px">
            This function is unfinished now. I will do it later.
        </el-dialog>
        <div class="tableTitle">
            <b>The monitor of Camps</b>
        </div>
        <el-container
                v-loading="isReloading">
            <template v-if="camp_list.length === 0">
                <p class="centerBox">暂无数据</p>
            </template>
            <template v-else>
                <el-aside>
                    <template v-if="$store.state.user.permission === 1">
                        <el-tooltip content="Edit camps" placement="top">
                            <el-button
                                    style="margin-bottom: 10px"
                                    icon="el-icon-edit"
                                    size="medium"
                                    round
                                    @click="isEditDialogShow = true">
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="Refresh All" placement="top">
                            <el-button
                                    style="margin-bottom: 10px"
                                    icon="el-icon-refresh"
                                    size="medium"
                                    round
                                    @click="submitRefreshAll">
                            </el-button>
                        </el-tooltip>
                    </template>
                    <el-menu
                            :default-active="courseIndex"
                            @select="menuSelected">
                        <div v-for="camp of camp_list" :key="camp.id">
                            <el-submenu :index="camp.id.toString()">
                                <template slot="title">
                                    <span>{{camp.name}}</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item :index="camp.id + '-total'">
                                        总览
                                    </el-menu-item>
                                    <el-menu-item
                                            v-for="course of camp.courses"
                                            :key="course.id"
                                            :index="camp.id + '-' + course.id">
                                        {{course.name}}
                                    </el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                        </div>
                    </el-menu>
                </el-aside>
                <el-main v-if="!isRefresh">
                    <el-tabs type="card">
                        <el-tab-pane label="榜单">
                            <camp-rank-list
                                    :camp_id="camp_id"
                                    :course_id="course_id"/>
                        </el-tab-pane>
                        <el-tab-pane label="填写账号" v-if="!isTotal && $store.state.user.userid">
                            <camp-oj-set-table :course_id="course_id"></camp-oj-set-table>
                        </el-tab-pane>
                        <el-tab-pane label="比赛情况" v-if="!isTotal">
                            <camp-monitor-table :contests="contests"></camp-monitor-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-main>
            </template>
        </el-container>
    </div>
</template>

<script>
    import CampMonitorTable from "@/components/pageitem/camp-monitor-table";
    import CampOjSetTable from "@/components/pageitem/camp-oj-set-table";
    import CampRankList from "@/components/pageitem/camp-rank-list";

    export default {
        name: "camp-page",
        components: {CampRankList, CampOjSetTable, CampMonitorTable},
        data() {
            return {
                camp_list: [],
                camp_id: '',
                course_id: '',
                contests: [],
                isReloading: false,
                isRefresh: false,
                isEditDialogShow: false
            }
        },
        computed: {
            isTotal() {
                return this.course_id === 'total'
            },
            courseIndex() {
                if (this.camp_id === '' || this.course_id === '') return null
                return this.camp_id + '-' + this.course_id
            }
        },
        methods: {
            menuSelected(index) {
                if (this.courseIndex === index) return
                let sep = index.split('-')
                this.camp_id = sep[0]
                this.course_id = sep[1]
                this.isRefresh = true
                let that = this
                this.$nextTick(() => {
                    that.isRefresh = false
                })
                this.refreshCourseData()
            },
            refreshCourseData() {
                let that = this
                if (this.course_id === 'total') return
                let api = this.$store.state.api
                this.$http.get(api + '/v2/camp/course/' + this.course_id)
                    .then(response => {
                        that.contests = response.data.data.contests
                    })
                    .catch(error => {
                        if (error.response) {
                            that.$message.error(error.response.data.msg)
                        }
                    })
            },
            refreshData() {
                let that = this
                let api = this.$store.state.api
                Object.assign(this.$data, this.$options.data())
                that.isReloading = true
                this.$http.get(api + '/v2/camp/summary')
                    .then(response => {
                        that.camp_list = response.data.data
                        if (that.camp_list.length === 0) {
                            that.isReloading = false
                            return
                        }
                        that.camp_id = that.camp_list[0].id.toString()
                        that.course_id = 'total'
                        that.isReloading = false
                        this.refreshCourseData()
                    })
                    .catch(error => {
                        if (error.response) {
                            that.$message.error(error.response.msg)
                        }
                    })
            },
            submitRefreshAll() {
                let api = this.$store.state.api
                let that = this
                this.$http.post(api + "/v2/camp/refresh_all")
                    .then(response => {
                        that.$message.success(response.data.msg)
                    }).catch(error => {
                    if (error.response) {
                        that.$message.error(error.data.msg)
                    }
                })
            }
        }
        ,
        created() {
            document.title = "Camp - viewOJ"
            this.refreshData()
        }
    }
</script>

<style scoped>
    .tableTitle {
        text-align: center;
        font-size: 25px;
        margin-top: 50px;
        margin-bottom: 30px;
    }

    .centerBox {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 30px;
        margin-bottom: 30px;
    }

    .el-menu-item:focus:not(:hover) {
        background-color: white;
    }
</style>