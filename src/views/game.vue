<template>
    <div class="entertainment">
      <div class="game-options">
        <el-button v-for="(item, index) in buttonData" 
                   :key="index" 
                   @click="item.click" 
                   :class="{ 'active': selectedGame && selectedGame.name === item.game.name }"
                   v-text="item.text" />
      </div>
      <div v-if="selectedGame" class="game-container">
      <component :is="selectedGame.component" @game-result="handleGameResult"></component>
    </div>
      <div class="stats">
        <div class="attribute-box">
          <div class="attribute" v-for="(item, index) in statsData" :key="index">
            <span class="attribute-label">{{ item.name }}</span>
            <span class="attribute-value">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import tag from '@/components/tag.vue';
  import DiceGame from './Dicegame.vue';
  import RockPaperScissors from './rock.vue';
  import FortuneTelling from './fortunetelling.vue';
  import CheckIn from './checkin.vue';
  import GamblingStone from './GamblingStone.vue';
  
  export default {
  components: {
    tag: () => import('@/components/tag.vue'),
    DiceGame: () => import('./Dicegame.vue'),
    RockPaperScissors: () => import('./rock.vue'),
    FortuneTelling: () => import('./fortunetelling.vue'),
    CheckIn: () => import('./checkin.vue'),
    GamblingStone: () => import('./GamblingStone.vue'),
  },
  data() {
    return {
      player: {},
      selectedGame: null,
      games: [
        { name: 'checkin', label: '签到', component: 'CheckIn' },
        { name: 'dice', label: '骰子游戏', component: 'DiceGame' },
        { name: 'rps', label: '剪刀石头布', component: 'RockPaperScissors' },
        { name: 'fortune', label: '算卦', component: 'FortuneTelling' },
        { name: 'gambling-stone', label: '赌石游戏', component: 'GamblingStone' },
      ],
    }
  },
    created() {
      this.player = this.$store.player;
      // 默认选择签到游戏
      this.$nextTick(() => {
    this.selectGame(this.games.find(game => game.name === 'checkin'));
  });
   
    

    },
    mounted() {
      this.checkDailyReset();
    },
    components: {
      tag,
      DiceGame,
      RockPaperScissors,
      FortuneTelling,
      CheckIn,
      GamblingStone,
    },
    computed: {
      buttonData() {
        return this.games.map(game => ({
          text: game.label,
          click: () => this.selectGame(game),
          game: game
        }));
      },
      statsData() {
        return [
          { name: '签到天数', value: this.player.checkinDays },
          { name: '灵石', value: this.player.props.money },
          { name: '胜利次数', value: this.player.gameWins },
          { name: '失败次数', value: this.player.gameLosses },
        ];
      }
    },
    methods: {
      selectGame(game) {
        this.$nextTick(() => {
      this.selectedGame = game;
    });
      },
      handleGameResult(result) {
        if (result.success) {
          this.player.gameWins++;
          if (result.reward) {
            if (typeof result.reward === 'object') {
              for (const [key, value] of Object.entries(result.reward)) {
                this.player.props[key] += value;
              }
            } else {
              this.player.props.money += result.reward;
            }
          }
        } else {
          this.player.gameLosses++;
        }
        // 如果您的 store 支持，请取消下面这行的注释
        // this.$store.commit('updatePlayer', this.player);
      },
      checkDailyReset() {
        const now = new Date();
        const lastCheckin = new Date(this.player.lastCheckinDate);
        if (now.getDate() !== lastCheckin.getDate() || now.getMonth() !== lastCheckin.getMonth() || now.getFullYear() !== lastCheckin.getFullYear()) {
          this.player.checkedInToday = false;
          // 如果您的 store 支持，请取消下面这行的注释
          // this.$store.commit('setPlayer', this.player);
        }
      },
    }
  }
  </script>
  
  <style scoped>
  .entertainment {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }
  
  .game-options {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    background-color: #f2f2f7;
    border-radius: 10px;
    padding: 10px;
  }
  
  .game-options .el-button {
    background-color: transparent;
    border: none;
    color: #007aff;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .game-options .el-button.active {
    background-color: #007aff;
    color: #ffffff;
    border-radius: 8px;
  }
  
  .game-container {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .stats {
    background-color: #f2f2f7;
    padding: 15px;
    border-radius: 12px;
  }
  
  .attribute-box {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .attribute {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1 1 calc(50% - 5px);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .attribute-label {
    font-weight: 500;
    color: #3a3a3c;
  }
  
  .attribute-value {
    font-weight: 600;
    color: #007aff;
  }
  
  @media (max-width: 768px) {
    .game-options {
      flex-wrap: wrap;
    }
  
    .game-options .el-button {
      flex: 1 0 40%;
      margin: 5px;
    }
  
    .attribute {
      flex: 1 1 100%;
    }
  }
  </style>