<template>
    <div class="spirit-farm">
        <!-- 农场信息面板，显示灵田相关的各种信息 -->
        <div class="farm-info">
            <div class="tag attribute">
                灵田等级: {{ player.farm.level }}
            </div>
            <div class="tag attribute">
                灵田数量: {{ player.farm.plots.length }}/9
            </div>
            <div class="tag attribute">
                熟练度: {{ player.farm.experience }}/{{ experienceNeeded }}
            </div>
            <div class="tag attribute">
                灵石: {{ player.props.money }}
            </div>
            <div class="tag attribute">
                天气: {{ currentWeather }}
            </div>
        </div>
        
        <!-- 灵田网格，显示每一块灵田的状态 -->
        <div class="farm-grid">
            <div v-for="(plot, index) in player.farm.plots" :key="index" class="plot">
                <!-- 如果灵田中种植有药草并且药草有不同的生长阶段和害虫状态 -->
                <div v-if="plot.herb" class="herb" :class="[plot.herb.stage, { 'has-pest': plot.hasPest }]">
                    {{ plot.herb.name }}
                    <p>{{ plot.herb.stage }}</p>
                    <p v-if="plot.hasPest" class="pest-warning">有害虫!</p>
                </div>
                <!-- 如果灵田中还没有种植药草，提供一个按钮来种植药草 -->
                <el-button v-else @click="showPlantModal(index)" size="small">种植</el-button>
                
                <!-- 提供对灵田中药草执行操作的按钮，例如浇水、施肥、除虫和收获 -->
                <div class="plot-actions" v-if="plot.herb">
                    <el-button @click="water(index)" size="small"
                        :disabled="plot.herb.stage === 'harvested'">浇水</el-button>
                    <el-button @click="applyFertilizer(index)" size="small"
                        :disabled="plot.herb.stage === 'harvested'">施肥</el-button>
                    <el-button @click="removePest(index)" size="small" v-if="plot.hasPest">除虫</el-button>
                    <el-button @click="harvest(index)" size="small"
                        :disabled="plot.herb.stage !== 'mature'">收获</el-button>
                </div>
            </div>
        </div>
        
        <!-- 灵田操作按钮，例如升级灵田、扩建灵田、查看仓库和市场 -->
        <div class="farm-actions">
            <el-button @click="upgradeFarm" :disabled="!canUpgrade">升级灵田 ({{ upgradeCost }}灵石)</el-button>
            <el-button @click="expandFarm" :disabled="player.farm.plots.length >= 9">扩建灵田 (1000灵石)</el-button>
            <el-button @click="showWarehouse">仓库</el-button>
            <el-button @click="showMarket">市场</el-button>
        </div>

        <!-- 种植药草的弹窗 -->
        <el-dialog v-model="plantModalVisible" title="选择药草种植" width="30%">
            <el-select v-model="selectedHerb" placeholder="选择药草">
                <el-option v-for="herb in availableHerbs" :key="herb.name" :label="herb.name" :value="herb"></el-option>
            </el-select>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="plantModalVisible = false">取消</el-button>
                    <el-button type="primary" @click="plant">种植</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 仓库的弹窗，显示当前库存的药草及数量 -->
        <el-dialog v-model="warehouseVisible" title="仓库" width="30%">
            <div v-for="(amount, herb) in player.farm.warehouse" :key="herb">
                {{ herb }}: {{ amount }}
            </div>
        </el-dialog>

        <!-- 市场的弹窗，显示可出售的药草及其价格，可操作出售 -->
        <el-dialog v-model="marketVisible" title="市场" width="30%">
            <div v-for="herb in availableHerbs" :key="herb.name">
                {{ herb.name }}: {{ herb.value }} 灵石
                <el-button @click="sellHerb(herb)" size="small"
                    :disabled="!player.farm.warehouse[herb.name]">出售</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { AVAILABLE_HERBS, WEATHERS, GROWTH_STAGES } from '@/plugins/farmConfig';
import { ElMessage } from 'element-plus';
import { ref, provide } from 'vue';

export default {
    name: 'SpiritFarm',
    data() {
        return {
            player: {}, // 存储玩家信息的对象
            plantModalVisible: false, // 控制种植药草的弹窗可见性
            warehouseVisible: false, // 控制仓库弹窗的可见性
            marketVisible: false, // 控制市场弹窗的可见性
            selectedHerb: null, // 当前选择的药草
            selectedPlot: null, // 当前选择的灵田编号
            availableHerbs: AVAILABLE_HERBS, // 可供种植的药草列表
            currentWeather: '晴朗', // 当前天气
            weathers: WEATHERS, // 可供选择的天气列表
            weatherInterval: null, // 用于存储天气变化的定时器
        };
    },
    computed: {
        // 计算升级需要的经验值
        experienceNeeded() {
            return this.player.farm.level * 100;
        },
        // 计算升级需要的灵石数量
        upgradeCost() {
            return this.player.farm.level * 500;
        },
        // 判断是否符合升级条件（经验足够且灵石足够）
        canUpgrade() {
            return this.player.farm.experience >= this.experienceNeeded && this.player.props.money >= this.upgradeCost;
        },
    },
    created() {
        // 初始化玩家数据
        this.player = this.$store.player;
console.log(this.player.farm)
        // 确保 player.farm 存在并且有所有必要的字段
        if (!this.player.farm) {
            this.player.farm = {
                level: 1,
                plots: [{ herb: null, hasPest: false }],
                experience: 0,
                warehouse: {},
            };
        }

        // 确保灵田 plots 存在并初始化
        if (!this.player.farm.plots || this.player.farm.plots.length === 0) {
            this.player.farm.plots = [{ herb: null, hasPest: false }];
        }
        if (!this.player.farm.warehouse) {
            this.player.farm.warehouse = {};
        }
        if (typeof this.player.farm.level !== 'number') {
            this.player.farm.level = 1;
        }
        if (typeof this.player.farm.experience !== 'number') {
            this.player.farm.experience = 0;
        }

        // 开始天气循环
        this.startWeatherCycle();
    },
    beforeUnmount() {
        // 组件卸载前停止天气循环
        this.stopWeatherCycle();
    },
    methods: {
        // 显示种植药草的弹窗
        showPlantModal(index) {
            this.selectedPlot = index;
            this.plantModalVisible = true;
        },
        // 进行药草种植操作
        plant() {
            if (this.selectedHerb && this.selectedPlot !== null) {
                const newHerb = { ...this.selectedHerb, stage: 'seed' };
                this.player.farm.plots[this.selectedPlot].herb = newHerb;
                this.growHerb(this.selectedPlot);
                ElMessage.success(`成功种植了${this.selectedHerb.name}`);
            }
            this.plantModalVisible = false;
            this.selectedHerb = null;
        },
        // 使药草成长的函数
        growHerb(plotIndex) {
            const plot = this.player.farm.plots[plotIndex];
            const herb = plot.herb;
            let currentStageIndex = 0;

            // 内部函数，用于根据生长阶段变化以及天气调整生长时间
            const grow = () => {
                if (currentStageIndex < GROWTH_STAGES.length - 1) {
                    currentStageIndex++;
                    herb.stage = GROWTH_STAGES[currentStageIndex];

                    let growthTime = herb.growthTime / 3;
                    if (this.currentWeather === '炎热') growthTime *= 0.8;
                    if (this.currentWeather === '寒冷') growthTime *= 1.2;

                    if (Math.random() > herb.pestResistance) {
                        plot.hasPest = true;
                        this.$addMessage({
                            category: '系统',
                            type: 'system',
                            content: `[color=#FF0000]灵田[/color]里出现害虫啦，记得去除虫哦!`
                        });
                    }

                    setTimeout(grow, growthTime);
                }
            };

            setTimeout(grow, herb.growthTime / 3);
        },
        // 浇水操作
        water(plotIndex) {
            const herb = this.player.farm.plots[plotIndex].herb;
            if (herb && herb.stage !== 'mature') {
                const currentIndex = GROWTH_STAGES.indexOf(herb.stage);
                if (currentIndex < GROWTH_STAGES.length - 1) {
                    herb.stage = GROWTH_STAGES[currentIndex + 1];
                    ElMessage.success('浇水成功，植物生长加速');
                }
            }
        },
        // 施肥操作
        applyFertilizer(plotIndex) {
            const herb = this.player.farm.plots[plotIndex].herb;
            if (herb && herb.stage !== 'mature' && this.player.props.money >= 50) {
                this.player.props.money -= 50;
                const currentIndex = GROWTH_STAGES.indexOf(herb.stage);
                if (currentIndex < GROWTH_STAGES.length - 1) {
                    herb.stage = GROWTH_STAGES[currentIndex + 1];
                    ElMessage.success('施肥成功，植物生长加速');
                }
            } else {
                ElMessage.warning('灵石不足或植物已成熟，无法施肥');
            }
        },
        // 除虫操作
        removePest(plotIndex) {
            if (this.player.props.money >= 30) {
                this.player.props.money -= 30;
                this.player.farm.plots[plotIndex].hasPest = false;
                ElMessage.success('除虫成功');
            } else {
                ElMessage.warning('灵石不足，无法除虫');
            }
        },
        // 收获操作
        harvest(plotIndex) {
            const herb = this.player.farm.plots[plotIndex].herb;
            if (herb && herb.stage === 'mature') {
                this.player.farm.warehouse[herb.name] = (this.player.farm.warehouse[herb.name] || 0) + 1;
                this.player.farm.experience += 10;
                this.player.farm.plots[plotIndex].herb = null;
                this.checkLevelUp();
                ElMessage.success(`成功收获了${herb.name}`);
            }
        },
        // 升级灵田操作
        upgradeFarm() {
            if (this.canUpgrade) {
                this.player.props.money -= this.upgradeCost;
                this.player.farm.level++;
                this.player.farm.experience = 0;
                ElMessage.success(`灵田升级成功，当前等级：${this.player.farm.level}`);
            } else {
                ElMessage.warning('经验或灵石不足，无法升级灵田');
            }
        },
        // 扩建灵田操作
        expandFarm() {
            if (this.player.farm.plots.length < 9 && this.player.props.money >= 1000) {
                this.player.props.money -= 1000;
                this.player.farm.plots.push({ herb: null, hasPest: false });
                ElMessage.success('成功扩建了一块灵田');
            } else {
                ElMessage.warning('灵石不足或已达到最大灵田数量，无法扩建');
            }
        },
        // 检查是否满足升级条件
        checkLevelUp() {
            if (this.player.farm.experience >= this.experienceNeeded) {
                this.player.farm.experience -= this.experienceNeeded;
                this.player.farm.level++;
                ElMessage.success(`灵田等级提升，当前等级：${this.player.farm.level}`);
            }
        },
        // 显示仓库弹窗
        showWarehouse() {
            this.warehouseVisible = true;
        },
        // 显示市场弹窗
        showMarket() {
            this.marketVisible = true;
        },
        // 出售药草操作
        sellHerb(herb) {
            if (this.player.farm.warehouse[herb.name] > 0) {
                this.player.farm.warehouse[herb.name]--;
                this.player.props.money += herb.value;
                ElMessage.success(`成功出售${herb.name}，获得${herb.value}灵石`);
            } else {
                ElMessage.warning(`${herb.name}库存不足，无法出售`);
            }
        },
        // 开始天气循环，每五分钟随机改变一次天气
        startWeatherCycle() {
            this.weatherInterval = setInterval(() => {
                this.currentWeather = this.weathers[getRandomInt(0, this.weathers.length - 1)];
                ElMessage.info(`天气变化，当前天气：${this.currentWeather}`);
            }, 300000);
        },
        // 停止天气循环
        stopWeatherCycle() {
            if (this.weatherInterval) {
                clearInterval(this.weatherInterval);
            }
        },
    },
};
</script>

<style scoped>
.spirit-farm {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: var(--el-bg-color);
    border-radius: 12px;
    box-shadow: var(--el-box-shadow-light);
}

.farm-info {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 20px;
}

.attribute {
    width: calc(50% - 8px);
    margin: 4px;
    background-color: var(--el-fill-color-light);
    border-radius: 8px;
    text-align: center;
    font-size: 14px;
    color: var(--el-text-color-primary);
}

.farm-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 20px;
    width: 100%;
}

.plot {
    background-color: var(--el-fill-color-light);
    border-radius: 8px;
    padding: 10px;
    text-align: center;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.herb {
    font-weight: bold;
    color: var(--el-color-primary);
}

.herb.seed {
    color: var(--el-color-info);
}

.herb.sprout {
    color: var(--el-color-success);
}

.herb.growing {
    color: var(--el-color-warning);
}

.herb.mature {
    color: var(--el-color-danger);
}

.herb.has-pest {
    background-color: rgba(255, 0, 0, 0.1);
}

.pest-warning {
    color: var(--el-color-danger);
    font-size: 12px;
}

.plot-actions {
    margin-top: 10px;
}

.farm-actions {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
}

.el-button {
    display: flex;
    justify-content: center;  /* 水平居中 */
    align-items: center; 
}

@media (max-width: 768px) {
    .farm-actions {
        flex-direction: column;
    }

    .farm-actions .el-button {
        width: 100%;
    }
}
</style>