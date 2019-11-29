<template>
    <transition name="fade" mode="out-in">
        <div v-if="showTagViews" class="page-container">
            <el-tabs class="tabs" v-model="currName" type="border-card" @tab-click="tabSelected" @tab-remove="removeTab">
                <el-tab-pane
                    v-for="(item, index) in tagViews"
                    :key="item.path"
                    :label="item.text"
                    :name="item.path"
                    :closable="index===0?tagViews.length>1:true"
                >
                </el-tab-pane>
            </el-tabs>
        </div>
    </transition>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "TagViews",
        data(){
            return {
            }
        },
        mounted() {
            if(this.tagViews.length < 1){
                const defaultTags = {text: '首页', path: '/Home'};
                this.$store.dispatch('tagViews/addTagView', defaultTags);
                this.$store.dispatch('tagViews/setActivatedPath', defaultTags.path);
            }
        },
        watch: {
            $route(to) {
                const tagView = {
                    text: to.meta.text,
                    path: to.path
                };
                this.handleTag(tagView);
            }
        },
        methods: {
            handleTag(tagView){
                const {path}  = tagView;
                const isExisted = this.tagViews.some(item => item.path === path);
                if(isExisted){
                    this.$store.dispatch('tagViews/setActivatedPath', path);
                    this.$router.replace(path);
                }else {
                    this.$store.dispatch('tagViews/addTagView', tagView);
                    this.$store.dispatch('tagViews/setActivatedPath', path);
                    this.$router.push(path);
                }
            },
            tabSelected(tab){
                const {name}  = tab;
                this.$store.dispatch('tagViews/setActivatedPath', name);
                this.$router.replace(name);
            },
            removeTab(deletedName){
                if(deletedName==='/Home' && this.tagViews.length>1){
                    this.$store.dispatch('tagViews/closeRightAll');
                    this.$router.replace('/Home');
                    return
                }
                this.$store.dispatch('tagViews/removeTagView', deletedName);
                const lastPath = this.tagViews[this.tagViews.length-1];
                this.$store.dispatch('tagViews/setActivatedPath', lastPath.path);
                this.$router.replace(lastPath.path);
            }
        },
        computed: {
            ...mapGetters([
                'showTagViews',
                'activatedPath',
                'tagViews'
            ]),
            currName: {
                get(){
                   return this.activatedPath
                },
                set(val){
                    this.$store.dispatch('tagViews/setActivatedPath', val);
                }
            }
        }
    }
</script>

<style scoped>

    .page-container {
        width: 100%;
        height: 45px;
        overflow: hidden;
        user-select: none;
    }

    .page-container >>> .el-tabs--border-card {
        height: 0;
    }

    .page-container >>> .el-tabs__item:focus.is-active.is-focus:not(:active) {
        box-shadow: none;
    }




</style>