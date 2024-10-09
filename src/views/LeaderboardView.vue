<template>
    <div class="leaderboard">
        <div class="leaderboard-content">
            <div class="leaderboard-box">
                <el-scrollbar ref="scrollbar" always>
                    <el-table :data="sortedLeaderboardData" style="width: 100%">
                        <el-table-column prop="rank" label="排名" width="80"></el-table-column>
                        <el-table-column prop="name" label="道号"></el-table-column>
                        <el-table-column :prop="selectedCategory" :label="getCategoryLabel()">
                            <template v-slot="scope">
                                {{ selectedCategory === 'level' ? $levelNames(scope.row[selectedCategory]) :
                                    scope.row[selectedCategory] }}
                            </template>
                        </el-table-column>
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
import axios from 'axios';
export default {
    data() {
        return {
            categories: [
                { type: 'level', name: '境界' },
                { type: 'jishaNum', name: '击杀' },
                { type: 'score', name: '实力' },
                { type: 'checkinDays', name: '签到' },
                { type: 'highestTowerFloor', name: '无尽塔' }
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
        // ... existing methods ...
        formatLevel(level) {
            return this.$levelNames(level);
        },
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
            try {
                const response = await axios.get('/getinfo');

                // 检查返回的数据是否为JSON对象
                if (response.data && typeof response.data === 'object') {
                    this.$notifys({
                        title: '获取成功',
                        message: '',
                        type: 'success'
                    });
                    this.leaderboardData = response.data;
                    console.log(response.data);
                } else {
                    // 处理非JSON数据的情形
                    this.leaderboardData = [
                        {
                            name: '在上温某某',
                            created_at: '2024-10-09T13:48:10+00:00',
                            money: 1230000,
                            level: 20,
                            checkinDays: 200,
                            highestTowerFloor: 547,
                            jishaNum: 9999,
                            score: 230000,
                            health: 10,
                            attack: 1,
                            defense: 0.5,
                            dodge: 0.5,
                            critical: 0.5
                        }
                    ];
                    this.$notifys({
                        title: '数据格式错误',
                        message: '获取的数据不是有效的JSON格式',
                        type: 'error'
                    });
                }
            } catch (error) {
                this.$notifys({
                    title: '获取失败',
                    message: '无法获取数据，请稍后再试',
                    type: 'error'
                });
            }
        },
        async uploadPlayerData() {
            try {
                let info = [{
                    name: this.player.name,
                    money: this.player.props.money,
                    level: this.player.level,
                    checkinDays: this.player.checkinDays,
                    highestTowerFloor: this.player.highestTowerFloor,
                    jishaNum: this.player.jishaNum,
                    score: this.player.score,
                    health: this.player.health,
                    attack: this.player.attack,
                    defense: this.player.defense,
                    dodge: this.player.dodge,
                    critical: this.player.critical
                }]
                const response = await axios.post('/upload', info, { headers: { 'Content-Type': 'application/json' } });
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