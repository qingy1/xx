<template>
    <div class="alchemy-system">
      <div class="alchemy-box">
        <div class="story md3-card">
          <h3 class="md3-title">炼丹室</h3>
          <p class="md3-content" v-html="storyText"></p>
        </div>
        <div class="attributes md3-card">
          <h3 class="md3-title">炼丹师属性</h3>
          <div class="attribute-box md3-content">
            <div class="tag attribute">
              炼丹师等级: {{ player.alchemistLevel }}
            </div>
            <div class="tag attribute">
              经验值: {{ player.alchemistExperience }} / {{ experienceNeeded }}
            </div>
          </div>
        </div>
        <div class="equip-box md3-card">
          <h3 class="md3-title">炼丹操作</h3>
          <div class="inventory-box md3-content">
            <el-tabs v-model="activeTab" :stretch="true">
              <el-tab-pane label="丹方" name="formulas">
                <div class="inventory-content">
                  <div 
                    v-for="formula in unlockedFormulas" 
                    :key="formula.id" 
                    :class="['inventory-item', { selected: selectedFormula === formula }]"
                    @click="selectFormula(formula)"
                  >
                    {{ formula.name }}
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="炼丹" name="alchemy">
                <div class="inventory-content" v-if="selectedFormula">
                  <div v-for="(amount, ingredient) in selectedFormula.ingredients" :key="ingredient" class="ingredient-item">
                    <span>{{ ingredient }}: {{ amount }} / {{ player.farm.warehouse[ingredient] || 0 }}</span>
                  </div>
                  <el-button @click="startAlchemy" :disabled="!canStartAlchemy" class="alchemy-button md3-button">
                    开始炼丹
                  </el-button>
                </div>
                <div v-else class="inventory-content">
                  请先选择丹方
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="result md3-card" v-if="alchemyResult">
          <h3 class="md3-title">炼丹结果</h3>
          <div class="md3-content">
            <p>炼丹结果: {{ alchemyResult.success ? '成功' : '失败' }}</p>
            <p v-if="alchemyResult.success">丹药品质: {{ alchemyResult.quality }}</p>
            <p>获得经验: {{ alchemyResult.experience }}</p>
          </div>
        </div>
        <div class="log md3-card">
          <h3 class="md3-title">炼丹日志</h3>
          <div class="log-content md3-content">
            <p v-for="(log, index) in alchemyLogs" :key="index">{{ log }}</p>
          </div>
        </div>
        <div class="actions">
          <el-button @click="goToStore" class="action-button md3-button">进入商城</el-button>
          <el-button @click="goToSpiritFarm" class="action-button md3-button">前往种植园</el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AlchemySystem',
    data() {
      return {
        player: {
          alchemistLevel: 1,
          alchemistExperience: 0,
          farm: {
            warehouse: {
              '灵芝': 5,
              '人参': 2,
              '何首乌': 3
            }
          }
        },
        unlockedFormulas: [
          { 
            id: 1, 
            name: '灵芝丹', 
            ingredients: { '灵芝': 3, '人参': 1 },
            baseExperience: 100
          },
          { 
            id: 2, 
            name: '人参丸', 
            ingredients: { '人参': 2, '何首乌': 1 },
            baseExperience: 120
          },
        ],
        selectedFormula: null,
        alchemyResult: null,
        activeTab: 'formulas',
        storyText: '欢迎来到炼丹室，这里是提升修为的重要场所。',
        alchemyLogs: []
      }
    },
    computed: {
      experienceNeeded() {
        return Math.floor(1000 * Math.pow(1.5, this.player.alchemistLevel - 1));
      },
      canStartAlchemy() {
        if (!this.selectedFormula) return false;
        return Object.entries(this.selectedFormula.ingredients).every(([ingredient, amount]) => 
          (this.player.farm.warehouse[ingredient] || 0) >= amount
        );
      },
    },
    methods: {
      selectFormula(formula) {
        this.selectedFormula = formula;
        this.activeTab = 'alchemy';
        this.addLog(`选择了丹方：${formula.name}`);
      },
      startAlchemy() {
        if (!this.canStartAlchemy) return;
  
        Object.entries(this.selectedFormula.ingredients).forEach(([ingredient, amount]) => {
          this.player.farm.warehouse[ingredient] -= amount;
        });
  
        const successRate = 0.5 + (this.player.alchemistLevel * 0.05);
        const success = Math.random() < successRate;
        const quality = success ? ['白', '绿', '蓝', '紫', '橙'][Math.floor(Math.random() * 5)] : '失败';
        const experience = success ? this.selectedFormula.baseExperience * (1 + Math.random()) : 10;
  
        this.alchemyResult = { success, quality, experience: Math.floor(experience) };
        this.addExperience(this.alchemyResult.experience);
  
        this.storyText = success 
          ? `炼丹成功！你炼制出了一颗${quality}品质的${this.selectedFormula.name}。`
          : '炼丹失败，请再接再厉。';
  
        this.addLog(this.storyText);
      },
      addExperience(amount) {
        this.player.alchemistExperience += amount;
        while (this.player.alchemistExperience >= this.experienceNeeded) {
          this.player.alchemistLevel++;
          this.player.alchemistExperience -= this.experienceNeeded;
          this.addLog(`恭喜！炼丹师等级提升到${this.player.alchemistLevel}级`);
        }
      },
      addLog(message) {
        this.alchemyLogs.unshift(message);
        if (this.alchemyLogs.length > 5) {
          this.alchemyLogs.pop();
        }
      },
      goToStore() {
        this.$router.push('/store');
      },
      goToSpiritFarm() {
        this.$router.push('/spiritfarm');
      },
    },
  }
  </script>
  
  <style scoped>
  .alchemy-system {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--el-bg-color);
    min-height: 100vh;
    padding: 20px;
    color: var(--el-text-color-primary);
  }
  
  .alchemy-box {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .md3-card {
    background-color: var(--el-bg-color-secondary);
    border-radius: 16px;
    box-shadow: var(--el-box-shadow-light);
    overflow: hidden;
  }
  
  .md3-title {
    font-size: 1.25rem;
    font-weight: 500;
    padding: 16px;
    margin: 0;
    background-color: var(--el-color-primary-light-3);
    color: var(--el-color-primary);
  }
  
  .md3-content {
    padding: 16px;
  }
  
  .attribute-box {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .tag.attribute {
    background-color: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    padding: 5px 10px;
    border-radius: 4px;
    flex-grow: 1;
    flex-basis: calc(50% - 5px);
  }
  
  .inventory-content {
    max-height: 300px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .inventory-item {
    cursor: pointer;
    flex-basis: calc(33.333% - 10px);
    text-align: center;
    padding: 10px;
    background-color: var(--el-color-primary-light-8);
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  .inventory-item:hover {
    background-color: var(--el-color-primary-light-5);
  }
  
  .inventory-item.selected {
    background-color: var(--el-color-primary);
    color: white;
  }
  
  .ingredient-item {
    margin: 10px 0;
    width: 100%;
  }
  
  .md3-button {
    background-color: var(--el-color-primary);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .md3-button:hover {
    background-color: var(--el-color-primary-light-3);
  }
  
  .md3-button:disabled {
    background-color: var(--el-color-info);
    cursor: not-allowed;
  }
  
  .alchemy-button {
    width: 100%;
    margin-top: 10px;
  }
  
  .log-content {
    max-height: 150px;
    overflow-y: auto;
  }
  
  .actions {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  
  .action-button {
    flex-grow: 1;
  }
  
  @media (max-width: 600px) {
    .alchemy-box {
      padding: 10px;
    }
  
    .attribute-box {
      flex-direction: column;
    }
  
    .tag.attribute {
      flex-basis: 100%;
    }
  
    .inventory-item {
      flex-basis: calc(50% - 5px);
    }
  
    .actions {
      flex-direction: column;
    }
  
    .action-button {
      width: 100%;
      margin: 5px 0;
    }
  }
  </style>