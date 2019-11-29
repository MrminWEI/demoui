<template>
    <div class="page-container">
        <el-scrollbar :native="false" wrap-style="overflow-x: hidden;">
            <transition name="fade" mode="out-in">
                <div class="menu-icon-container" v-show="showMenuBtn">
                    <i @click="changeMenuState"
                       :class="[menuOpenState?'el-icon-s-fold':'el-icon-s-unfold', 'menu-btn']"
                       :style="{'margin-right': menuOpenState? 0: '8px'}"
                    ></i>
                </div>
            </transition>
            <el-menu :background-color="themeBgColor"
                     text-color="#bfcbd9"
                     active-text-color="#66b1ff"
                     :collapse="!menuOpenState"
                     :default-active="$route.path"
                     router
            >
                <template v-for="pNode in menuTree">
                    <template v-if="pNode['children'] && pNode['children'].length > 0">
                        <el-submenu :index="pNode['text']">
                            <template slot="title">
                                <i class="menu-icon" :class="pNode['iconCls']"></i>
                                <span>{{pNode['text']}}</span>
                            </template>
                            <el-menu-item v-for="cNode in pNode['children']" :key="cNode['path']" :index="`/${cNode['path']}`">{{cNode['text']}}</el-menu-item>
                        </el-submenu>
                    </template>
                    <template v-else>
                        <el-menu-item :index="`/${pNode['path']}`">
                            <template slot="title">
                                <i class="menu-icon" :class="pNode['iconCls']"></i>
                                <span>{{pNode['text']}}</span>
                            </template>
                        </el-menu-item>
                    </template>
                </template>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: 'MainMenu',
        data() {
            return {

            }
        },
        methods: {
            changeMenuState(){
                this.$store.dispatch('sysSetting/changeMenuState');
            }
        },
        computed: {
            ...mapGetters([
                'menuTree',
                'showMenuBtn',
                'menuOpenState',
                'themeBgColor'
            ])
        },
    }
</script>

<style scoped lang="scss">
    @import "styles/variables.scss";
    .page-container {
        width: 100%;
        height: 100%;
    }

    .el-scrollbar {
        height: calc(100vh - 60px) !important;
    }

    .el-menu {
        border: 0;
    }

    .el-menu:not(.el-menu--collapse) {
        width: $menuWidth;
    }

    .menu-icon {
        display: inline-block;
        width: 18px;
        height: 18px;
        font-size: 18px;
        margin-right: 10px;
        color: #bfcbd9;
    }

    .menu-icon-container {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 10px 15px;
        border-bottom: 1px dashed #bfcbd9;
    }

    .menu-btn {
        font-size: 25px;
        color: #bfcbd9;
        transition: all .5s;
        cursor: pointer;
    }

</style>

<style lang="scss">
    .el-menu--vertical ul {
        max-height: calc(100vh - 65px);
        overflow-x: hidden;
        overflow-y: auto;
    }
    .el-menu--vertical ul::-webkit-scrollbar {
        display: none;
    }
</style>
