<template>
    <div class="games">
        <el-tabs v-model="tabs">
            <el-tab-pane v-for="(item, index) in gameList" :label="item.label" :name="item.name">
                <component :is="item.component"  />
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
    import tag from '@/components/tag.vue';
    import mapExploration from './mapExploration.vue';
import ExploreIndex from './exploreIndex.vue';
   import ExPage from './ex.vue';

    export default {
        components: {
            mapExploration,
ExploreIndex,
ExPage
        },
        data () {
            return {
                tabs: 'mapExploration',
                player: {},
                selectedGame: null,
                gameList: [
                    { name: 'mapExploration', label: '探索', component: 'mapExploration' },
                    { name: 'ExploreIndex', label: '副本', component: 'ExploreIndex' },
                    { name: 'ExPage', label: '刷怪', component: 'ExPage' },
                ]
            }
        },
        watch: {
            tabs (type) {
                this.selectedGame = type;
            }
        },
        created () {
            this.player = this.$store.player;
        },
        mounted () {
           
        },
        computed: {
            attributeList () {
                return [
                    { name: '签到天数', unit: '天', value: this.player.checkinDays },
                    { name: '拥有灵石', unit: '', value: this.player.props.money },
                    { name: '胜利次数', unit: '次', value: this.player.gameWins },
                    { name: '失败次数', unit: '次', value: this.player.gameLosses }
                ];
            }
        },
        methods: {

        }
    }
</script>

<style scoped>


    .attribute-box {
        margin-bottom: 10px;
    }

    .attribute-col {
        margin-top: 10px;
    }

    .attribute-label {
        margin: 15px 0;
        width: 40%;
    }
</style>