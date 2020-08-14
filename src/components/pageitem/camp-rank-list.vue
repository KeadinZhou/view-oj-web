<template>
    <div>
        <el-card shadow="hover" class="tableBox">
            <div v-loading="loading" v-if="isRefresh">
                <el-table :data="tableData" :default-sort="{prop: 'rating', order: 'descending'}" style="width: 100%">
                    <el-table-column label="Rank" align="center" width="100px">
                        <template slot-scope="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <template v-if="course_id!=='total'">
                        <el-table-column label="Teamname" align="center">
                            <template slot-scope="scope">
                                <el-popover
                                    trigger="hover"
                                    placement="top"
                                    :content="getMembersStr(scope.row.members)">
                                    <b slot="reference" style="font-weight: 600;">
                                        <span :style="'border-top-left-radius:5px; border-bottom-left-radius: 5px;' +
                                         'padding:3px; padding-right:0px; color:'+getNameColor(scope.row)[0]+
                                        ';background-color:'+getNameColorBack(scope.row)[0]">{{
                                                scope.row.team_name[0]
                                            }}</span>
                                        <span :style="'border-top-right-radius:5px; border-bottom-right-radius: 5px;' +
                                         'padding:3px; padding-left:0px; color:'+getNameColor(scope.row)[1]+
                                        ';background-color:'+getNameColorBack(scope.row)[1]">{{
                                                scope.row.team_name.slice(1)
                                            }}</span>
                                    </b>
                                </el-popover>
                            </template>
                        </el-table-column>
                    </template>
                    <template v-else>
                        <el-table-column label="UserID" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.user.username }}
                            </template>
                        </el-table-column>
                        <el-table-column label="Username" align="center">
                            <template slot-scope="scope">
                                <b slot="reference" style="font-weight: 600;">
                                    <span :style="'border-top-left-radius:5px; border-bottom-left-radius: 5px;' +
                                         'padding:3px; padding-right:0px; color:'+getNameColor(scope.row)[0]+
                                        ';background-color:'+getNameColorBack(scope.row)[0]">{{
                                            scope.row.user.nickname[0]
                                        }}</span>
                                    <span :style="'border-top-right-radius:5px; border-bottom-right-radius: 5px;' +
                                         'padding:3px; padding-left:0px; color:'+getNameColor(scope.row)[1]+
                                        ';background-color:'+getNameColorBack(scope.row)[1]">{{
                                            scope.row.user.nickname.slice(1)
                                        }}</span>
                                </b>
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column label="Rating" align="center" width="100px" prop="rating" sortable
                                     :sort-method="function(a,b) {return Number(a.rating) - Number(b.rating)}">
                        <template slot-scope="scope">
                            {{ scope.row.rating }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'camp-rank-list',
    props: {
        camp_id: String,
        course_id: String
    },
    data() {
        return {
            loading: false,
            isRefresh: true,
            tableData: [],
        }
    },
    methods: {
        getMembersStr(members) {
            let s = '团队成员:'
            for (let member of members) {
                s += ' ' + member.nickname
            }
            return s
        },
        getNameColor(row) {
            if (row.user && row.user.name_color) return row.user.name_color
            let rating = row.rating
            if (rating <= 100) return ['#808080', '#808080']
            if (rating <= 233) return ['#008000', '#008000']
            if (rating <= 400) return ['#03a89e', '#03a89e']
            if (rating <= 600) return ['#0000ff', '#0000ff']
            if (rating <= 800) return ['#aa00aa', '#aa00aa']
            if (rating <= 1000) return ['#FF8C00', '#FF8C00']
            if (rating <= 1200) return ['#ff0000', '#ff0000']
            return ['#000000', '#ff0000']
        },
        getNameColorBack(row) {
            if (row.user && row.user.name_back_color) return row.user.name_back_color
            return ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)']
        },
        reFreshChart() {
            this.isRefresh = false
            this.$nextTick(function () {
                this.isRefresh = true
                this.loading = false
            })
        },
        getData() {
            this.loading = true
            let api = this.$store.state.api
            let that = this
            let loc = ''
            if (this.course_id === 'total')
                loc = api + '/v2/camp/' + this.camp_id + '/rating'
            else
                loc = api + '/v2/camp/course/' + this.course_id + '/rating'
            that.$http.get(loc)
                .then(data => {
                    that.tableData = data.data.data
                    that.reFreshChart()
                })
                .catch(function (error) {
                    if (error.response) {
                        that.$message.error(error.response.data.msg)
                    }
                })
        }
    },
    created() {
        this.getData()
    },
    watch: {
        camp_id() {
            this.getData()
        },
        course_id() {
            this.getData()
        }
    }
}
</script>

<style scoped>
.tableBox {
    position: relative;
    left: 50%;
    width: 700px;
    transform: translate(-50%, 0);
}
</style>
