<template>
    <div>
        <el-select
                style="margin-bottom: 15px; width: 100%"
                placeholder="Select a contest"
                v-model="selectedContest"
                popper-append-to-body>
            <el-option
                    v-for="contest of contests"
                    :key="contest.id"
                    :label="contest.name"
                    :value="contest.id"/>
        </el-select>
        <template v-if="selectedContest !== ''">
            <el-card class="tableBox" shadow="never">
                <el-table
                        :data="tableData"
                        :default-sort="{prop: 'rating', order: 'descending'}"
                        v-loading="isLoading">
                    <el-table-column label="Userid" align="center" width="90" prop="userid">
                        <template slot-scope="scope">
                            {{ scope.row.userid }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Name" align="center" width="90" prop="name">
                        <template slot-scope="scope">
                            {{ scope.row.username }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Cnt" align="center" width="90" prop="count"
                                     sortable :sort-method="function(a,b) {return Number(a.rating) - Number(b.rating)}">
                        <template slot-scope="scope">
                            {{ scope.row.count }}
                        </template>
                    </el-table-column>
                    <template v-for="(problem, index) in  proList">
                        <el-table-column align="center" :key="index" min-width="35">
                            <template slot="header">
                                <el-tooltip class="item" effect="dark"
                                            :content="problem"
                                            placement="top">
                                    <b>{{problem}}</b>
                                </el-tooltip>
                            </template>
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark"
                                            :content="problem"
                                            placement="top">
                                    <i :class="scope.row.state[index]?'el-icon-success doneColor':'el-icon-minus'"></i>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column label="Rating" align="center" width="90" prop="rating"
                                     sortable :sort-method="function(a,b) {return Number(a.rating) - Number(b.rating)}">
                        <template slot-scope="scope">
                            {{ scope.row.rating }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </template>
    </div>
</template>

<script>
    export default {
        name: "camp-monitor-table",
        props: {
            contests: Array,
        },
        data() {
            return {
                isLoading: true,
                tableData: [],
                proList: [],
                selectedContest: '',
            }
        },
        methods: {
            refreshContestData() {
                let api = this.$store.state.api
                let that = this
                this.tableData = []
                this.isLoading = true
                this.$http.get(api + "/v2/camp/contest/" + this.selectedContest + '/detail')
                    .then(response => {
                        let data = response.data.data
                        that.proList = []
                        for (let problem of data.all_problems) {
                            that.proList.push(problem.problem_pid)
                        }
                        for (let item of data.user_state) {
                            let proset = new Set()
                            for (let ac_problem of item.accepted_problems) {
                                proset.add(ac_problem.problem.problem_pid)
                            }
                            let state = []
                            for (let problem of that.proList) {
                                state.push(proset.has(problem))
                            }
                            that.tableData.push({
                                userid: item.user.username,
                                username: item.user.nickname,
                                state: state,
                                count: proset.size,
                                rating: item.rating
                            })
                        }
                        that.isLoading = false
                        console.log()
                    })
            }
        },
        created() {
            if (this.contests.length === 0) {
                return
            }
            this.selectedContest = this.contests[0].id
        },
        watch: {
            selectedContest() {
                this.refreshContestData()
            }
        }
    }
</script>

<style scoped>
    .doneColor {
        color: #67C23A;
    }
</style>