<template>
    <transition name="fade-drawer-parent" mode="out-in">
        <div class="page-container" v-show="showSetting">
            <transition name="fade-drawer" mode="out-in">
                <div class="masking" v-show="showSetting" @click.self="closeSetting"></div>
            </transition>
            <transition name="slide-drawer" mode="out-in">
                <div v-show="showSetting" class="setting-container">
                    <i @click.self="closeSetting" class="el-icon-close close-icon"></i>
                    <h3 class="sys-setting">系统设置</h3>

                    <div class="flex-between">
                        <span class="title">菜单伸缩状态</span>
                        <el-switch v-model="isOpenMenu"></el-switch>
                    </div>

                    <div class="flex-between">
                        <span class="title">菜单栏收缩按钮</span>
                        <el-switch v-model="isShowMenuBtn"></el-switch>
                    </div>

                    <div class="flex-between">
                        <span class="title">显示标签页</span>
                        <el-switch v-model="isShowTagViews"></el-switch>
                    </div>

                    <div class="flex-between">
                        <span class="title">全屏浏览</span>
                        <el-switch v-model="isScreenFull" @change="changeFull"></el-switch>
                    </div>

                    <div class="flex-column">
                        <span class="title">页面切换动画</span>
                        <div class="options-content">
                            <el-radio class="radio-style" v-model="setAnimation" label="fade-transform">卡片切换</el-radio>
                            <el-radio class="radio-style" v-model="setAnimation" label="fade">渐显渐隐</el-radio>
                        </div>
                    </div>

                    <div class="flex-column">
                        <span class="title">主题颜色 (<i class="fa fa-flask" aria-hidden="true"></i>实验功能)</span>
                        <div class="options-content">
                            <span v-for="color in themeColor" @click="changeTheme(color)" class="theme-color" :style="{'background-color': color}"></span>
                        </div>
                    </div>

                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
    import {mapGetters} from 'vuex'
    import screenfull from 'screenfull'

    export default {
        name: 'SystemSetting',
        props: {},
        data(){
            return {
                isScreenFull: false
            }
        },
        created(){
            this.themeColor = ['#304156', '#C03639', '#E65D6E', '#4AB7BD', '#FEC171'];
        },
        methods: {
            closeSetting(){
                this.$store.dispatch('sysSetting/setSettingState', false);
            },
            changeTheme(color){
                this.$store.dispatch('sysSetting/setThemeBgColor', color);
            },
            changeFull(val){
                if (val && !screenfull.enabled) {
                    this.$message({
                        message: '您的浏览器不支持该功能',
                        type: 'warning'
                    });
                    this.isScreenFull = false;
                    return false
                }
                screenfull.enabled && screenfull.toggle();
            }
        },
        computed: {
            ...mapGetters([
                'showSetting',
                'showMenuBtn',
                'menuOpenState',
                'showTagViews',
                'pageAnimation',
                'screenFull',
            ]),
            isShowMenuBtn: {
                get() {
                    return this.showMenuBtn;
                },
                set(val) {
                    this.$store.dispatch('sysSetting/showMenuBtn', val);
                }
            },
            isOpenMenu: {
                get() {
                    return this.menuOpenState;
                },
                set(val) {
                    this.$store.dispatch('sysSetting/setMenuState', val);
                }
            },
            isShowTagViews: {
                get() {
                    return this.showTagViews;
                },
                set(val) {
                    this.$store.dispatch('tagViews/setTagViewState', val);
                }
            },
            setAnimation: {
                get() {
                    return this.pageAnimation;
                },
                set(val) {
                    this.$store.dispatch('sysSetting/setPageAnimation', val);
                }
            },
        }
    }
</script>

<style scoped lang="scss">

    .page-container {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 9997;
    }

    .masking {
        position: fixed;
        width: 100vw;
        height: 100vh;
        z-index: 9998;
        background-color: rgba(0, 0, 0, 0.1);
    }

    .setting-container {
        position: fixed;
        right: 0;
        width: 260px;
        height: 100vh;
        z-index: 9999;
        padding: 40px 25px 0;
        font-size: 14px;
        line-height: 1.5;
        word-wrap: break-word;
        background-color: #fff;
        box-shadow: 0 0 30px -5px #999
    }

    .close-icon {
        position: absolute;
        top: 15px;
        right: 20px;
        font-size: 30px;
        cursor: pointer;
        transition: all .3s;
    }

    .close-icon:hover {
        color: #409EFF;
        transform: rotate(90deg);
    }

    .sys-setting {
        font-size: 15px;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.85);
    }

    .flex-between {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 12px 0;
        color: rgba(0, 0, 0, 0.65);
    }

    .flex-column {
        display: flex;
        flex-direction: column;
        padding: 12px 0;
        color: rgba(0, 0, 0, 0.65);
    }

    .options-content {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: 10px;
    }

    .radio-style {
        min-width: 70px;
        max-width: 70px;
        margin-bottom: 10px;
        margin-right: 50px;
    }

    .theme-color {
        display: inline-block;
        width: 25px;
        height: 25px;
        margin-bottom: 10px;
        margin-right: 10px;
        cursor: pointer;
    }


</style>
