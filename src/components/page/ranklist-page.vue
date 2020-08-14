<template>
    <div>
        <div style="margin: 10px">
            <div style="float: right;margin: 12px;">
                <el-checkbox v-model="showAll">Show All User</el-checkbox>
            </div>
        </div>
        <el-card shadow="hover" class="tableBox">
            <div v-loading="loading" v-if="isRefresh">
                <el-table :data="tableData" :default-sort="{prop: 'rating', order: 'descending'}" style="width: 100%">
                    <el-table-column label="Rank" align="center" width="100px">
                        <template slot-scope="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Userid" align="center">
                        <template slot-scope="scope">
                            <el-link :href="'#/user/'+scope.row.username+'?part=page-top'" :underline="false">
                                {{ scope.row.username }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="Username" align="center">
                        <template slot-scope="scope">
                            <el-link :href="'#/user/'+scope.row.username+'?part=page-top'" :underline="false">
                                <b style="'font-weight: 900'">
                                    <span :style="'border-top-left-radius:5px; border-bottom-left-radius: 5px;' +
                                         'padding:3px; padding-right:0px; color:'+getNameColor(scope.row)[0]+
                                        ';background-color:'+getNameColorBack(scope.row)[0]">{{
                                            scope.row.nickname[0]
                                        }}</span>
                                    <span :style="'border-top-right-radius:5px; border-bottom-right-radius: 5px;' +
                                         'padding:3px; padding-left:0px; color:'+getNameColor(scope.row)[1]+
                                        ';background-color:'+getNameColorBack(scope.row)[1]">{{
                                            scope.row.nickname.slice(1)
                                        }}</span>
                                </b>
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="Rating" align="center" width="100px" prop="rating" sortable
                                     :sort-method="function(a,b) {return Number(a.rating) - Number(b.rating)}">
                        <template slot-scope="scope">
                            <el-link :href="'#/user/'+scope.row.username+'?part=rating'" :underline="false">{{
                                    scope.row.rating
                                }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="CF" align="center" width="80px" prop="codeforces" sortable
                                     :sort-method="function(a,b) {return Number(a.codeforces_rating) - Number(b.codeforces_rating)}">
                        <template slot-scope="scope">
                            <span>{{ Number(scope.row.codeforces_rating) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Cnt" align="center" width="80px" prop="contest" sortable
                                     :sort-method="function(a,b) {return Number(a.contest_num) - Number(b.contest_num)}">
                        <template slot-scope="scope">
                            <span>{{ Number(scope.row.contest_num) }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'ranklist-page',
    data() {
        return {
            loading: false,
            isRefresh: true,
            tableData: [],
            showAll: false
        }
    },
    methods: {
        getNameColor(row) {
            if (row.name_color) return row.name_color
            let rating = row.rating
            if (rating <= 1500) return ['#808080', '#808080']
            if (rating <= 1600) return ['#008000', '#008000']
            if (rating <= 1800) return ['#03a89e', '#fcfcfc']
            if (rating <= 2000) return ['#0000ff', '#0000ff']
            if (rating <= 2200) return ['#aa00aa', '#aa00aa']
            if (rating <= 2500) return ['#ff8c00', '#ff8c00']
            if (rating <= 2800) return ['#ff7777', '#ff7777']
            if (rating <= 3000) return ['#ff0000', '#ff0000']
            return ['#000000', '#ff0000']
        },
        getNameColorBack(row) {
            if (row.name_back_color) return row.name_back_color
            return ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)']
        },
        gotoDetail(row) {
            this.$router.push('/user/' + row.username + '?part=rating')
        },
        current_change(currentPage) {
            this.getData(currentPage)
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
            var api = this.$store.state.api
            var that = this
            that.$http.get(api + '/v2/user/rating')
                .then(data => {
                    // that.tableData = data.data.data
                    that.tableData = []
                    for (var item of data.data.data) {
                        if (item.status === 1 || that.showAll) {
                            that.tableData.push(item)
                        }
                    }
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
        document.title = "Ranklist - viewOJ"
        this.getData()
    },
    watch: {
        showAll: function () {
            this.getData()
        }
    }
}
</script>

<style scoped>
.tableBox {
    position: relative;
    left: 50%;
    width: 800px;
    transform: translate(-50%, 0);
}
</style>
