<template>
    <section class="layout-container">
        <el-container>
            <el-header height="60px" :style="{'background-color': themeBgColor}">
                <main-header></main-header>
            </el-header>
            <el-container>
                <el-aside width="auto" :style="{'background-color': themeBgColor}">
                    <main-menu></main-menu>
                </el-aside>
                <el-main>
                    <tag-views></tag-views>
                    <main-content></main-content>
                </el-main>
            </el-container>
        </el-container>
        <system-setting></system-setting>
    </section>
</template>

<script>
    import getDictList from 'mixin/getDictList'
    import MainHeader from 'components/MainHeader'
    import MainMenu from 'components/MainMenu'
    import TagViews from "../components/TagViews"
    import MainContent from 'components/MainContent'
    import SystemSetting from 'components/SystemSetting'
    import {mapGetters} from 'vuex'
    export default {
        name:"layout",
        components: {MainHeader, MainMenu, TagViews, MainContent, SystemSetting},
        mixins: [getDictList],
        computed: {
            ...mapGetters(['themeBgColor'])
        },
    }
</script>

<style lang="scss" scoped>
    .layout-container {
        width: 100vw;
        min-height: 100vh;
        position: relative;
        overflow: hidden;
    }

    .el-header {
        padding: 0 25px;
        line-height: 60px;
        box-shadow: 0 0 5px #222;
        z-index: 2;
    }

    .el-aside {
        height: calc(100vh - 60px);
        overflow: hidden;
        user-select: none;
    }

    .el-main {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 60px);
        overflow-x: hidden;
        padding: 0;
    }

</style>
