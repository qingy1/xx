<template>
    <div class="explore-index">
        <div class="dungeons-list">
            <div v-for="dungeon in dungeons" :key="dungeon.id" class="dungeon-card">
                <h3 class="dungeon-name" v-text="dungeon.name"></h3>
                <p>推荐等级: {{ dungeon.recommendedLevel }}</p>
                <p v-text="dungeon.description"></p>
                <p>奖励: {{ dungeon.rewards }}</p>
                <el-button type="primary" @click="exploreDungeon(dungeon)">开始探索</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dungeons: [
                {
                    id: 1,
                    name: "紫玄秘境",
                    recommendedLevel: 20,
                    description: "传说中只有有缘人才能进入",
                    rewards: "紫玄仙剑"
                },
                {
                    id: 2,
                    name: "太古仙境探秘",
                    recommendedLevel: 1,
                    description: "太古仙境探秘",
                    rewards: "灵石"
                }
            ]
        };
    },
    methods: {
        exploreDungeon(dungeon) {
            this.$router.push({ name: 'storyPage', params: { dungeonId: dungeon.id } });
        }
    }
};
</script>

<style scoped>
    .explore-index {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background-color: var(--el-bg-color);
        border-radius: 10px;
        box-shadow: var(--el-box-shadow-light);
    }
    .page-title {
        text-align: center;
        font-size: 1.8em;
        color: var(--el-color-primary);
        margin-bottom: 20px;
    }
    .dungeons-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
    .dungeon-card {
        padding: 15px;
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 8px;
        background-color: var(--el-fill-color-light);
        text-align: center;
    }
    .dungeon-name {
        font-size: 1.4em;
        margin-bottom: 10px;
        color: var(--el-color-primary);
    }
    .el-button {
        margin-top: 10px;
    }
</style>