<template>
    <section class="app-main">
        <transition :name="pageAnimation" mode="out-in">
            <keep-alive>
                <router-view :key="key"/>
            </keep-alive>
        </transition>
    </section>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'MainContent',
        computed: {
            ...mapGetters(['pageAnimation']),
            key() {
                return this.$route.fullPath
            }
        }
    }
</script>

<style lang="scss" scoped>

    .app-main {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
    }

</style>
