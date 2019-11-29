<template>
    <div class="home">
        <h1>欢迎您，{{ userInfo.realName }}</h1>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name: 'home',
        mounted() {

        },
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        }

    }
</script>

<style scoped lang="scss">
    .home {
        height: 100%;
    }
</style>
