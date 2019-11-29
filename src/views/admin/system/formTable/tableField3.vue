<template>
    <div style="width:800px">
        <el-form :inline="true">
            <draggable v-model="filters" dragable="true" :move="getdata" @update="datadragEnd">
                <transition-group>
                    <div  v-for="(item,index) in tableData" border :key="item.id">
                        <el-form-item>
                            {{index+1}}
                        </el-form-item>

                        <el-form-item :prop="'tableData.' + index + '.id'">
                           <el-input v-model="item.id" placeholder="编号"
                           show-word-limit size="mini"></el-input>
                       </el-form-item>

                        <el-form-item :prop="'tableData.' + index + '.name'">
                            <el-input v-model="item.name" placeholder="名字"
                                      show-word-limit size="mini"></el-input>
                        </el-form-item>
                        <el-form-item :prop="'tableData.' + index + '.date'">
                            <el-input v-model="item.date" placeholder="日期"
                                      show-word-limit size="mini"></el-input>
                        </el-form-item>
                        <el-form-item :prop="'tableData.' + index + '.address'">
                            <el-input v-model="item.address" placeholder="地址"
                                      show-word-limit size="mini"></el-input>
                        </el-form-item>
                    </div>
                </transition-group>
            </draggable>

        </el-form>



    </div>
</template>

<script>
    import draggable from 'vuedraggable'

    export default {
        components: {
            draggable,
        },
        name: "tableField3",
        data() {
            return {
                col: [
                    {
                        label: '日期',
                        prop: 'date'
                    },
                    {
                        label: '姓名',
                        prop: 'name'
                    },
                    {
                        label: '地址',
                        prop: 'address'
                    }
                ],
                dropCol: [
                    {
                        label: '日期',
                        prop: 'date'
                    },
                    {
                        label: '姓名',
                        prop: 'name'
                    },
                    {
                        label: '地址',
                        prop: 'address'
                    }
                ],
                tableData: [
                    {
                        id: '1',
                        date: '2016-05-02',
                        name: '王小虎1',
                        address: '上海市普陀区金沙江路 100 弄'
                    },
                    {
                        id: '2',
                        date: '2016-05-04',
                        name: '王小虎2',
                        address: '上海市普陀区金沙江路 200 弄'
                    },
                    {
                        id: '3',
                        date: '2016-05-01',
                        name: '王小虎3',
                        address: '上海市普陀区金沙江路 300 弄'
                    },
                    {
                        id: '4',
                        date: '2016-05-03',
                        name: '王小虎4',
                        address: '上海市普陀区金沙江路 400 弄'
                    }
                ]
            }
        },
        mounted() {

        },
        methods: {

            getdata(evt) {
                console.log(evt.draggedContext.filterKey)

            },
            datadragEnd(evt) {
                console.log('拖动前的索引 :' + evt.oldIndex)
                console.log('拖动后的索引 :' + evt.newIndex);
                let tableData = this.tableData;
                for (let a = 0; a < tableData.length; a++) {
                    tableData[a].index = a;
                }
                this.tableData = tableData;
            }
        }
    }
</script>
