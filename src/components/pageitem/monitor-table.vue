<template>
    <div>
        <el-card class="tableBox" shadow="never">
            <el-table :data="tableData" :default-sort="{prop: 'count', order: 'descending'}">
                <el-table-column label="Userid" align="center" width="90" prop="userid" sortable>
                    <template slot-scope="scope">
                        {{ scope.row.userid }}
                    </template>
                </el-table-column>
                <el-table-column label="Name" align="center" width="90" prop="name">
                    <template slot-scope="scope">
                        {{ scope.row.username }}
                    </template>
                </el-table-column>
                <el-table-column label="Cnt" align="center" width="70" prop="count" sortable>
                    <template slot-scope="scope">
                        {{ scope.row.count }}
                    </template>
                </el-table-column>
                <template v-for="(problem, index) in  proList">
                    <el-table-column align="center" :key="index" min-width="35">
                        <template slot="header">
                            <el-tooltip class="item" effect="dark" :content="problem.oj.name+'-'+problem.problem_pid"
                                        placement="top">
                                <el-link :href="problem.url" target="_blank" :underline="false" style="color: gray"><b>{{String.fromCharCode((65+index))}}</b>
                                </el-link>
                            </el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="problem.oj.name+'-'+problem.problem_pid"
                                        placement="top">
                                <i :class="scope.row.state[index]?'el-icon-success doneColor':'el-icon-minus'"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: 'monitor-table',
        props: {
            proData: Array,
            proList: Array
        },
        data() {
            return {
                tableData: []
            }
        },
        methods: {
            initData() {
                this.tableData = []
                for (let data of this.proData) {
                    let proset = new Set()
                    for (let ac_problem of data.data) {
                        proset.add(ac_problem.problem.problem_pid)
                    }
                    let state = []
                    for (let problem of this.proList) {
                        state.push(proset.has(problem.problem_pid))
                    }
                    this.tableData.push({
                        userid: data.user.username,
                        username: data.user.nickname,
                        state: state,
                        count: proset.size
                    })
                }
            }
        },
        created() {
            this.initData()
        }
    }
</script>

<style scoped>
    .doneColor {
        color: #67C23A;
    }

    .tableBox {
        position: relative;
        left: 50%;
        transform: translate(-50%, 0);
    }
</style>
