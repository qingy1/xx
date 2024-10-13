<template>
  <div class="refining-page">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="炼器" name="refining">
        <div class="refining-level">
          <h3>{{ $refining[refiningLevel-1]}}炼器师</h3>
          <el-progress :percentage="refiningExpPercentage" :format="formatRefiningExp"></el-progress>
        </div>
        <div class="refining-container">
          <!-- 材料选择区 -->
          <div class="materials-section">
            <h3>材料</h3>
            <div class="material-list">
              <tag v-for="material in materials" :key="material.id" :type="material.quality"
                @click="selectMaterial(material)" class="material-item">
                {{ material.name }} ({{ material.count }})
              </tag>
            </div>
          </div>

          <!-- 炼器主界面 -->
          <div class="refining-main">
            <div class="refining-device" :class="{ 'refining-active': isRefining }">
              <template v-if="!isRefining">
                <tag v-if="selectedEquipments.length > 0" :type="selectedEquipments[0].quality"
                  class="selected-equipment">
                  {{ selectedEquipments.length }}件装备待炼制
                </tag>
              </template>
              <template v-else>
                <el-progress type="circle" :percentage="Number(refiningProgress.toFixed(0))"></el-progress>
              </template>
            </div>
            <el-button type="primary" @click="startRefining" :disabled="!canRefine || isRefining">
              开始炼器
            </el-button>
            <p v-if="isRefining">剩余时间: {{ remainingTime }}秒</p>
          </div>
        </div>

        <!-- 炼器结果展示区 -->
        <div class="result-section" v-if="refinedEquipments.length > 0">
          <h3>炼器结果</h3>
          <div class="equipment-list-container">
            <div class="equipment-list">
              <tag v-for="(equipment, index) in refinedEquipments" :key="index" :type="equipment.quality"
                @click="showEquipmentDetails(equipment)" class="equipment-item">
                {{ equipment.name }}
              </tag>
            </div>
          </div>
          <el-button @click="collectAllRefinedEquipments">全部收入背包</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="精炼" name="refine">
        <div class="refine-container">
          <div class="inventory-section">
            <h3>背包</h3>
            <div class="equipment-list-container">
              <div class="equipment-list">
                <tag v-for="(equipment, index) in player.inventory" :key="index" :type="equipment.quality"
                  @click="selectEquipmentForRefine(equipment)" :class="{ 'selected': isSelectedForRefine(equipment) }"
                  class="equipment-item">
                  {{ equipment.name }}
                </tag>
              </div>
            </div>
          </div>

          <div class="refine-main">
            <el-radio-group v-model="refineMode">
              <el-radio :value="'random'">随机精炼</el-radio>
              <el-radio :value="'targeted'">定向精炼</el-radio>
            </el-radio-group>

            <template v-if="refineMode === 'random'">
              <h3>已选择装备 ({{ selectedForRefine.length }}/5)</h3>
              <div class="selected-equipments">
                <tag v-for="(equipment, index) in selectedForRefine" :key="index" :type="equipment.quality"
                  @click="unselectEquipmentForRefine(equipment)" class="equipment-item">
                  {{ equipment.name }}
                </tag>
              </div>
              <el-button type="primary" @click="startRandomRefine" :disabled="selectedForRefine.length !== 5">
                开始随机精炼
              </el-button>
            </template>

            <template v-else>
              <h3>选择装备进行定向精炼</h3>
              <div class="selected-equipments">
                <tag v-if="selectedForTargetedRefine" :type="selectedForTargetedRefine.quality"
                  @click="unselectEquipmentForTargetedRefine" class="equipment-item">
                  {{ selectedForTargetedRefine.name }}
                </tag>
              </div>
              <p>需要陨铁: {{ requiredMeteoriteIron }}</p>
              <el-button type="primary" @click="startTargetedRefine">
                开始定向精炼
              </el-button>
              <el-button v-if="refinedEquipments.length > 0" type="success" @click="collectRefinedEquipment">
                收入背包
              </el-button>
            </template>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="矿场" name="mining">
        <div class="mining-container">
          <div class="mining-info">
            <h3> {{  $refining[miningLevel-1] }}采矿师</h3>
            <el-progress :percentage="miningExpPercentage" :format="formatMiningExp"></el-progress>
          </div>
          <div class="ore-list">
            <tag v-for="ore in player.materials" :key="ore.id" :type="ore.quality" class="ore-item">
              {{ ore.name }}: {{ ore.count }}
            </tag>
          </div>
          <div class="mining-area">
            <div class="mining-device" :class="{ 'mining-active': isMining }">
              <template v-if="!isMining">
                <p>点击开始挖矿</p>
              </template>
              <template v-else>
                <el-progress type="circle" :percentage="Number(miningProgress.toFixed(2))"></el-progress>
              </template>
            </div>
            <el-button type="primary" @click="toggleMining">
              {{ isMining ? '停止挖矿' : '开始挖矿' }}
            </el-button>
            <p v-if="isMining">已挖矿: {{ miningTime }}秒</p>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-button class="attribute-label" @click="$router.push('/home')">返回家中</el-button>
    <!-- 装备详情弹窗 -->
    <el-dialog v-model="equipmentDetailsVisible" title="装备详情">
      <div v-if="selectedEquipmentDetails">
        <p>名称: {{ selectedEquipmentDetails.name }}</p>
        <p>品质: {{ $levels[selectedEquipmentDetails.quality] }}</p>
        <p>攻击: {{ selectedEquipmentDetails.attack }}</p>
        <p>防御: {{ selectedEquipmentDetails.defense }}</p>
        <p>生命: {{ selectedEquipmentDetails.health }}</p>
        <p>闪避: {{ (selectedEquipmentDetails.dodge * 100) }}%</p>
        <p>暴击: {{ (selectedEquipmentDetails.critical * 100) }}%</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="equipmentDetailsVisible = false">关闭</el-button>
          <el-button type="primary" @click="collectSingleEquipment">收入背包</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import tag from '@/components/tag.vue';
import equip from '@/plugins/equip';

export default {
  components: { tag },
  data() {
    return {
      activeTab: 'refining',
      selectedEquipments: [],
      isRefining: false,
      refiningProgress: 0,
      remainingTime: 0,
      refinedEquipments: [],
      player: this.$store.player,
      equipmentDetailsVisible: false,
      selectedEquipmentDetails: null,
      selectedForRefine: [],
      isMining: false,
      miningProgress: 0,
      miningTime: 0,
      miningInterval: null,
      refineMode: 'random',
      selectedForTargetedRefine: null,
      requiredMeteoriteIron: 50,
    };
  },
  computed: {
    canRefine() {
      return this.selectedEquipments.length > 0;
    },
    materials() {
      return this.$store.player.materials;
    },
    refiningLevel() {
      return Math.min(9, Math.floor(Math.sqrt(this.player.refiningExp / 1000)) + 1);
    },
    refiningExpPercentage() {
      const nextLevelExp = this.calculateNextLevelExp(this.refiningLevel);
      const currentLevelExp = this.calculateNextLevelExp(this.refiningLevel - 1);
      const per = (this.player.refiningExp - currentLevelExp) / (nextLevelExp - currentLevelExp)* 100;
      return Math.min(per, 100);
    },
    miningLevel() {
      return Math.min(9, Math.floor(Math.sqrt(this.player.miningExp / 1000)) + 1);
    },
    miningExpPercentage() {
      const nextLevelExp = this.calculateNextLevelExp(this.miningLevel);
      const currentLevelExp = this.calculateNextLevelExp(this.miningLevel - 1);
      const per = (this.player.miningExp - currentLevelExp) / (nextLevelExp - currentLevelExp)* 100;
      return Math.min(per, 100);
    },
    canStartTargetedRefine() {
      return this.selectedForTargetedRefine &&
        this.player.materials.find(m => m.name === '陨铁')?.count >= this.requiredMeteoriteIron;
    }
  },
  methods: {
    selectEquipmentForRefine(equipment) {
      if (this.refineMode === 'random') {
        if (this.selectedForRefine.length < 5 && !this.selectedForRefine.includes(equipment)) {
          this.selectedForRefine.push(equipment);
        }
      } else {
        this.selectedForTargetedRefine = equipment;
        this.calculateRequiredMeteoriteIron();
      }
    },
    unselectEquipmentForRefine(equipment) {
      if (this.refineMode === 'random') {
        const index = this.selectedForRefine.indexOf(equipment);
        if (index > -1) {
          this.selectedForRefine.splice(index, 1);
        }
      }
    },
    unselectEquipmentForTargetedRefine() {
      this.requiredMeteoriteIron = 50;
    },
    isSelectedForRefine(equipment) {
      return this.refineMode === 'random'
        ? this.selectedForRefine.includes(equipment)
        : this.selectedForTargetedRefine === equipment;
    },
    calculateRequiredMeteoriteIron() {
      if (this.selectedForTargetedRefine) {
        const refineTimes = this.selectedForTargetedRefine.refineTimes || 0;
        this.requiredMeteoriteIron = 50 + refineTimes * 10;
      }
    },
    startRandomRefine() {
      if (this.selectedForRefine.length !== 5) return;
      const baseQuality = this.selectedForRefine[0].quality;
      if (!this.selectedForRefine.every(e => e.quality === baseQuality)) {
        this.$notifys({ title: '精炼失败', message: '请选择相同品质的装备' });
        return;
      }
      const qualityOrder = ['info', 'success', 'primary', 'purple', 'warning', 'danger', 'pink'];
      const currentQualityIndex = qualityOrder.indexOf(baseQuality);
      if (currentQualityIndex === qualityOrder.length - 1) {
        this.$notifys({ title: '精炼失败', message: '已达到最高品质，无法继续精炼' });
        return;
      }
      const newQuality = qualityOrder[currentQualityIndex + 1];
      const newEquipment = this.generateRandomEquipment({ name: '精炼', quality: newQuality });
      this.selectedForRefine.forEach(e => {
        const index = this.player.inventory.indexOf(e);
        if (index > -1) {
          this.player.inventory.splice(index, 1);
        }
      });
      this.player.inventory.push(newEquipment);
      this.$notifys({ title: '精炼成功', message: `成功精炼出${this.$levels[newQuality]}品质的${newEquipment.name}` });
      this.selectedForRefine = [];
    },
    startTargetedRefine() {
        if (!this.canStartTargetedRefine) return;
        const meteoriteIron = this.player.materials.find(m => m.name === '陨铁');
        const equipment = this.selectedForTargetedRefine;
       if (equipment.refineTimes >= 15) {
            this.$notifys({ title: '精炼限制', message: `${equipment.name} 达到最大精炼等级，无法继续精炼。` });
            return;
        }
        const needm = 50+ (equipment.refineTimes || 0) *10;
        meteoriteIron.count += needm;
        const successRate = Math.min(0.9, 0.5 + this.refiningLevel * 0.02);
        if (Math.random() < successRate) {
            const enhancedEquipment = this.enhanceEquipment(equipment);
            enhancedEquipment.refineTimes = (enhancedEquipment.refineTimes || 0) + 1;
            const originalIndex = this.player.inventory.findIndex(e => e === equipment);
            if (originalIndex !== -1) {
                this.player.inventory.splice(originalIndex, 1);  
            }
            this.refinedEquipments = [enhancedEquipment];
            this.selectedForTargetedRefine = enhancedEquipment
            this.$notifys({ 
                title: '精炼成功', 
                message: `${enhancedEquipment.name} 属性提升！点击"收入背包"按钮以保存，或继续精炼。`
            });
        } else {
            this.$notifys({ title: '精炼失败', message: `${equipment.name} 精炼失败，但未被损坏。` });
        }
        
        this.gainRefiningExp();
        this.calculateRequiredMeteoriteIron();
    },
    collectRefinedEquipment() {
        if (this.refinedEquipments.length === 0) return;
        
        const refinedEquipment = this.refinedEquipments[0];
        // 在点击“收入背包”时，将精炼的装备添加回去
        if (this.player.inventory.length < this.player.backpackCapacity) {
            this.player.inventory.push(refinedEquipment);
            this.$notifys({ title: '新装备入库', message: `${refinedEquipment.name} 已放入背包` });
        } else {
            this.$notifys({ title: '背包已满', message: '无法收入新的装备' });
        }
        
        // 清空已精炼的装备
        this.refinedEquipments = [];
        this.selectedForTargetedRefine = null;
    },
    selectMaterial(material) {
      if (material.count >= 50) {
        const newEquipment = this.generateRandomEquipment(material);
        this.selectedEquipments.push(newEquipment);
        material.count -= 50;
      }
    },
    generateRandomEquipment(material, quality) {
      const equipmentType = ['weapon', 'armor', 'accessory', 'sutra'][Math.floor(Math.random() * 4)];
      const equipmentLevel = this.player.level;
      let equipment;
      switch (equipmentType) {
        case 'weapon':
          equipment = equip.equip_Weapons(equipmentLevel, false);
          break;
        case 'armor':
          equipment = equip.equip_Armors(equipmentLevel, false);
          break;
        case 'accessory':
          equipment = equip.equip_Accessorys(equipmentLevel, false);
          break;
        case 'sutra':
          equipment = equip.equip_Sutras(equipmentLevel, false);
          break;
      }
      const random = Math.random() * 100;
      switch (material.name) {
        case '陨铁':
          equipment.quality = random < 1.1 ? 'pink' : 'danger';
          break;
        case '寒铁':
          equipment.quality = random < 10 ? 'danger' : 'warning';
          break;
        case '玄铁':
          if (random < 1) {
            equipment.quality = 'warning';
          } else if (random < 30) {
            equipment.quality = 'purple';
          } else {
            equipment.quality = 'primary';
          }
          break;
        case '精铁':
          if (random < 1) {
            equipment.quality = 'purple';
          } else if (random < 21) {
            equipment.quality = 'primary';
          } else {
            equipment.quality = 'success';
          }
          break;
        case '精炼':
          equipment.quality = material.quality;
          break;
      }
      return equipment;
    },
    startRefining() {
      if (!this.canRefine) return;
      this.isRefining = true;
      this.remainingTime = 60 * this.selectedEquipments.length;
      this.refiningProgress = 0;
      const refiningInterval = setInterval(() => {
        this.remainingTime--;
        this.refiningProgress = Math.floor((60 * this.selectedEquipments.length - this.remainingTime) / (60 * this.selectedEquipments.length) * 100);
        if (this.remainingTime <= 0) {
          clearInterval(refiningInterval);
          this.completeRefining();
        }
      }, 1000);
    },
    completeRefining() {
      this.isRefining = false;
      this.refinedEquipments = this.selectedEquipments.map(equipment => this.enhanceEquipment(equipment));
      this.selectedEquipments = [];
      this.gainRefiningExp();
    },
    enhanceEquipment(equipment) {
      const enhancedEquipment = { ...equipment };
      const enhanceRate = 0.05 + (this.refiningLevel * 0.02);
      enhancedEquipment.refineTimes = (equipment.refineTimes || 0);
      enhancedEquipment.attack = Math.floor(enhancedEquipment.attack * (1 + enhanceRate));
      enhancedEquipment.defense = Math.floor(enhancedEquipment.defense * (1 + enhanceRate));
      enhancedEquipment.health = Math.floor(enhancedEquipment.health * (1 + enhanceRate));
      enhancedEquipment.dodge = Math.min(enhancedEquipment.dodge * (1 + enhanceRate), 0.5);
      enhancedEquipment.critical = Math.min(enhancedEquipment.critical * (1 + enhanceRate), 0.5);
      enhancedEquipment.score = equip.calculateEquipmentScore(
        enhancedEquipment.dodge,
        enhancedEquipment.attack,
        enhancedEquipment.health,
        enhancedEquipment.critical,
        enhancedEquipment.defense
      );
      return enhancedEquipment;
    },
    gainRefiningExp() {
      const qualityExpMap = {
        'info': 1,
        'success': 1,
        'primary': 1,
        'purple': 3,
        'warning': 5,
        'danger': 10,
        'pink': 10
      };

      let totalExp = this.refinedEquipments.reduce((acc, equipment) => {
        return acc + qualityExpMap[equipment.quality] || 0;
      }, 0);
      this.player.refiningExp += totalExp;
      const oldLevel = this.refiningLevel;
      const newLevel = Math.min(9, Math.floor(Math.sqrt(this.player.refiningExp / 1000)) + 1);

      if (newLevel > oldLevel) {
        this.$notifys({ title: '炼器等级提升', message: `炼器等级提升到${newLevel}级！` });
      }
    },
    calculateNextLevelExp(level) {
      return 1000 * Math.pow(level, 2);
    },
    formatRefiningExp(percentage) {
      const currentLevelExp = this.calculateNextLevelExp(this.refiningLevel - 1);
      const nextLevelExp = this.calculateNextLevelExp(this.refiningLevel);
      const currentExp = this.player.refiningExp - currentLevelExp;
      const neededExp = nextLevelExp - currentLevelExp;
      return `${currentExp}/${neededExp}`;
    },
    showEquipmentDetails(equipment) {
      this.selectedEquipmentDetails = equipment;
      this.equipmentDetailsVisible = true;
    },
    collectSingleEquipment() {
      if (this.player.inventory.length >= this.player.backpackCapacity) {
        this.$notifys({ title: '背包已满', message: '无法收入新的装备' });
        return;
      }

      this.player.inventory.push(this.selectedEquipmentDetails);
      this.refinedEquipments = this.refinedEquipments.filter(e => e !== this.selectedEquipmentDetails);
      this.$notifys({ title: '炼器成功', message: `${this.selectedEquipmentDetails.name} 已加入背包` });
      this.equipmentDetailsVisible = false;
    },
    collectAllRefinedEquipments() {
      const availableSpace = this.player.backpackCapacity - this.player.inventory.length;
      const equipmentsToCollect = this.refinedEquipments.slice(0, availableSpace);
      this.player.inventory.push(...equipmentsToCollect);
      this.refinedEquipments = this.refinedEquipments.slice(availableSpace);
      if (equipmentsToCollect.length > 0) {
        this.$notifys({ title: '炼器成功', message: `${equipmentsToCollect.length}件装备已加入背包` });
      }

      if (this.refinedEquipments.length > 0) {
        this.$notifys({ title: '背包已满', message: `还有${this.refinedEquipments.length}件装备未能收入背包` });
      }
    },
    toggleMining() {
      if (this.isMining) {
        this.stopMining();
      } else {
        this.startMining();
      }
    },
    startMining() {
      this.isMining = true;
      this.miningTime = 0;
      this.miningProgress = 0;

      this.miningInterval = setInterval(() => {
        this.miningTime++;
        this.miningProgress = (this.miningTime % 60) / 60 * 100;
        if (this.miningTime % 60 === 0) {
          this.completeMining();
        }
      }, 1000);
    },
    stopMining() {
      this.isMining = false;
      clearInterval(this.miningInterval);
  //    this.completeMining();
    },
    completeMining() {
      const miningResults = this.calculateMiningResults();
      this.updateOreCount(miningResults);
      this.gainMiningExp(miningResults);

      let resultMessage = "挖矿完成，获得：";
      for (const [oreName, count] of Object.entries(miningResults)) {
        if (count > 0) {
          resultMessage += `${oreName} x${count}, `;
        }
      }
      this.$notifys({ title: '挖矿结果', message: resultMessage.slice(0, -2) });
    },
    calculateMiningResults() {
      const results = { 精铁: 0, 玄铁: 0, 寒铁: 0, 陨铁: 0 };
      const totalOres = 10 + Math.floor(this.miningLevel / 2); // 每次挖矿基础获得10个，每2级增加1个

      for (let i = 0; i < totalOres; i++) {
        const random = Math.random() * 100;
        if (random < 1 * this.miningLevel) {
          results.陨铁++;
        } else if (random < 5 * this.miningLevel) {
          results.寒铁++;
        } else if (random < 20 * this.miningLevel) {
          results.玄铁++;
        } else {
          results.精铁++;
        }
      }

      return results;
    },
    updateOreCount(results) {
      for (const ore of this.player.materials) {
        ore.count += results[ore.name] || 0;
      }
    },
    gainMiningExp(results) {
      const expGained = this.miningLevel * 10;
      this.player.miningExp += expGained;

      const oldLevel = this.miningLevel;
      const newLevel = Math.min(9, Math.floor(Math.sqrt(this.player.miningExp / 1000)) + 1);

      if (newLevel > oldLevel) {
        this.$notifys({ title: '挖矿等级提升', message: `挖矿等级提升到${newLevel}级！` });
      }
    },
    formatMiningExp(percentage) {
      const currentLevelExp = this.calculateNextLevelExp(this.miningLevel - 1);
      const nextLevelExp = this.calculateNextLevelExp(this.miningLevel);
      const currentExp = this.player.miningExp - currentLevelExp;
      const neededExp = nextLevelExp - currentLevelExp;
      return `${currentExp}/${neededExp}`;
    },
  }
}
</script>

<style scoped>
.refining-page {
  padding: 10px;
  max-width: 100%;
  margin: 0 auto;
}

.refining-level {
  margin-bottom: 20px;
}

.refining-level h3 {
  margin-bottom: 10px;
}

.refining-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
}

.materials-section,
.refining-main {
  width: 48%;
  margin-bottom: 20px;
}

.result-section {
  width: 100%;
}

.material-list,
.equipment-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.material-item {
  cursor: pointer;
}

.refining-active {
  border-color: #409eff;
  animation: pulse 2s infinite;
}

.selected-equipment {
  font-size: 16px;
  margin-bottom: 10px;
}

.equipment-list-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  max-height: 200px;
  overflow-y: auto;
}

.equipment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.equipment-item {
  cursor: pointer;
}

.refining-main {
  width: 48%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.refining-device,
.mining-device {
  width: 150px;
  height: 150px;
  border: 2px solid #dcdfe6;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;
  position: relative;
}

.refining-device>*,
.mining-device>* {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.refining-main button {
  align-self: center;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.4);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(64, 158, 255, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0);
  }
}

.refine-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.inventory-section,
.refine-main {
  width: 100%;
  margin-bottom: 20px;
}

.selected-equipments {
  min-height: 100px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.equipment-item.selected {
  border: 2px solid #409eff;
}

.mining-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mining-info {
  width: 100%;
  margin-bottom: 20px;
}

.mining-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.mining-active {
  border-color: #409eff;
  animation: pulse 2s infinite;
}

.mining-results {
  width: 100%;
}

.ore-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ore-item {
  cursor: default;
}

@media (max-width: 768px) {

  .materials-section,
  .refining-main {
    width: 100%;
  }

  .refining-main {
    width: 100%;
  }

  .refining-device,
  .mining-device {
    width: 120px;
    height: 120px;
  }

  .selected-equipment {
    font-size: 14px;
  }
}
</style>