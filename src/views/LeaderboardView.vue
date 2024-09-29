<template>
    <div class="leaderboard">


        <div class="leaderboard-content">
            <div class="leaderboard-box">
                <el-scrollbar ref="scrollbar" always>
                    <el-table :data="sortedLeaderboardData" style="width: 100%">
                        <el-table-column prop="rank" label="排名" width="80"></el-table-column>
                        <el-table-column prop="name" label="玩家名称"></el-table-column>
                        <el-table-column :prop="selectedCategory" :label="getCategoryLabel()"></el-table-column>
                    </el-table>
                </el-scrollbar>
            </div>
        </div>

        <div class="actions">
            <div class="action" v-for="category in categories" :key="category.type">
                <el-button class="item" @click="selectCategory(category.type)"
                    :type="selectedCategory === category.type ? 'primary' : ''">
                    {{ category.name }}
                </el-button>
            </div>
            <div class="action">
                <el-button class="item" @click="uploadPlayerData">
                    上传数据
                </el-button>
            </div>
            <div class="action">
                <el-button class="item" @click="$router.push('/home')">
                    返回家里
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            categories: [
                { type: 'level', name: '等级排行' },
                { type: 'kills', name: '击杀排行' },
                { type: 'power', name: '实力排行' },
                { type: 'signIn', name: '签到排行' }
            ],
            selectedCategory: 'level',
            leaderboardData: [],
            player: {},
            observer: null // 用于保存 MutationObserver 实例
        };
    },
    computed: {
        sortedLeaderboardData() {
            return this.leaderboardData
                .sort((a, b) => b[this.selectedCategory] - a[this.selectedCategory])
                .map((player, index) => ({
                    ...player,
                    rank: index + 1
                }));
        }
    },
    mounted() {
        this.player = this.$store.player;
        this.fetchLeaderboardData();
        this.setupObserver();
    },
    beforeUnmount() {
        this.stopObserving();
    },
    methods: {
        selectCategory(category) {
            this.selectedCategory = category;
        },
        getCategoryLabel() {
            const category = this.categories.find(c => c.type === this.selectedCategory);
            return category ? category.name : '';
        },
        formatProgress() {
            return '排行榜';
        },
        async fetchLeaderboardData() {
            // 从后端API获取数据
            // 示例数据
            this.leaderboardData = [
                { id: 1, name: '温某某', level: 100, kills: 1000, power: 1000, signIn: 300 },
                { id: 2, name: '水笔', level: 15, kills: 150, power: 1500, signIn: 25 },
                // ... 更多玩家数据
            ];
        },
        async uploadPlayerData() {
            try {
                // 向后端API发送数据
                // const response = await this.$http.post('/api/leaderboard/upload', {
                //   id: this.player.id,
                //   name: this.player.name,
                //   level: this.player.level,
                //   kills: this.player.jishaNum,
                //   power: this.calculatePower(this.player),
                //   signIn: this.player.signInDays
                // });

                // if (response.data.success) {
                //   this.$notifys({
                //     title: '上传成功',
                //     message: '你的数据已成功上传到排行榜',
                //     type: 'success'
                //   });
                //   this.fetchLeaderboardData();
                // }
                console.log('数据上传成功'); // 模拟上传成功
                this.$notifys({
                    title: '上传成功',
                    message: '你的数据已成功上传到排行榜',
                    type: 'success'
                });
                this.fetchLeaderboardData();
            } catch (error) {
                this.$notifys({
                    title: '上传失败',
                    message: '无法上传数据，请稍后再试',
                    type: 'error'
                });
            }
        },
        calculatePower(player) {
            // 计算玩家的总体实力
            return player.attack + player.defense + player.health;
        },
        setupObserver() {
            const element = this.$refs.scrollbar.wrapRef;
            if (element) {
                this.observer = new MutationObserver(() => {
                    this.$smoothScrollToBottom(element);
                });
                this.observer.observe(element, {
                    childList: true,
                    subtree: true
                });
            }
        },
        stopObserving() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        }
    }
}
</script>

<style scoped>
.leaderboard-box {
    max-height: 300px;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-bottom: 20px;
}

.actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.action {
    margin: 5px;
}

.item {
    width: 120px;
}
</style>