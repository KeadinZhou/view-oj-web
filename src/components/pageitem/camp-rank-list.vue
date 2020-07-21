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
                    <el-table-column label="UserID" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.username }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Username" align="center">
                        <template slot-scope="scope">
                            <b :style="'font-weight: 600;color:'+getColorForRating(scope.row.rating)">
                                {{ scope.row.nickname }}
                            </b>
                        </template>
                    </el-table-column>
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
            getColorForRating(rating) {
                if (rating <= 1600) return '#808080'
                if (rating <= 1800) return '#008000'
                if (rating <= 2000) return '#03a89e'
                if (rating <= 2300) return '#0000ff'
                if (rating <= 2500) return '#aa00aa'
                if (rating <= 2800) return '#FF8C00'
                if (rating <= 3000) return '#ff7777'
                if (rating <= 3300) return '#ff0000'
                return '#aa0000'
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
