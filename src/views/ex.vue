<template>
    <div class="exploration">

      
      <div class="map-selection">
    
        <el-select v-model="selectedMap" @change="changeMap" placeholder="选择一个地图">
          <el-option
            v-for="map in availableMaps"
            :key="map.id"
            :label="map.name"
            :value="map.id"
          />
        </el-select>
      </div>
  
      <el-card v-if="currentMap" shadow="hover" class="map-info">
        <div slot="header">{{ currentMap.name }}</div>
        <el-descriptions border>
          <el-descriptions-item label="描述">{{ currentMap.description }}</el-descriptions-item>
          <el-descriptions-item label="推荐等级">{{ currentMap.recommendedLevel }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
  
      <div class="action-buttons">
        <el-button type="primary" @click="startBattle" :disabled="isBattling">开始战斗</el-button>
        <el-button type="danger" @click="stopBattle" :disabled="!isBattling">停止战斗</el-button>
      </div>
  
      <el-card class="log-box">
        <div slot="header">战斗日志</div>
        <el-scrollbar height="200px">
          <p v-for="(log, index) in battleLogs" :key="index">{{ log }}</p>
        </el-scrollbar>
      </el-card>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        player: this.$store.player,
        selectedMap: null,
        currentMap: null,
        isBattling: false,
        battleLogs: [],
        battleTimer: null,
        availableMaps: [
          {
            id: 1,
            name: '新手村',
            description: '适合初入修仙界的修士探索的安全地带。',
            recommendedLevel: 1,
            monsters: [
              { name: '小妖怪', level: 1, reward: '10灵石' },
              { name: '虫妖', level: 2, reward: '20灵石' }
            ]
          },
          {
            id: 2,
            name: '幽冥森林',
            description: '危险与机遇并存的神秘森林。',
            recommendedLevel: 10,
            monsters: [
              { name: '幽冥狼', level: 10, reward: '50灵石' },
              { name: '森林鬼魅', level: 12, reward: '60灵石' }
            ]
          },
          {
            id: 3,
            name: '天火炼狱',
            description: '充满炙热火焰的险恶之地，蕴含无上机缘。',
            recommendedLevel: 30,
            monsters: [
              { name: '火焰魔兽', level: 30, reward: '100灵石' },
              { name: '烈焰凤凰', level: 35, reward: '120灵石' }
            ]
          }
        ]
      };
    },
    mounted() {
      this.selectedMap = this.availableMaps[0].id;
      this.changeMap();
    },
    methods: {
      changeMap() {
        this.currentMap = this.availableMaps.find(map => map.id === this.selectedMap);
      },
      startBattle() {
        if (this.isBattling) return;
        this.isBattling = true;
        this.fight();
        this.battleTimer = setInterval(this.fight, 3000);
      },
      fight() {
        const monster = this.getRandomItem(this.currentMap.monsters);
        this.addLog(`遭遇${monster.name}, 战斗胜利, 获得奖励：${monster.reward}`);
      },
      stopBattle() {
        clearInterval(this.battleTimer);
        this.isBattling = false;
        this.addLog("战斗停止");
      },
      getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
      },
      addLog(message) {
        this.battleLogs.unshift(`[${new Date().toLocaleTimeString()}] ${message}`);
      }
    }
  };
  </script>
  
  <style scoped>
  .exploration {
    padding: 20px;
    font-family: var(--el-font-family);
    background-color: var(--el-bg-color);
  }
  
  .map-selection, .map-info, .log-box {
    margin-bottom: 20px;
  }
  
  .map-selection h3, .log-box .el-card__header {
    font-weight: bold;
  }
  
  .action-buttons {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
  
  .explore-button {
    width: 100%;
    margin-top: 10px;
  }
  
  .log-box .el-scrollbar__wrap {
    background-color: var(--el-bg-color);
  }
  </style>