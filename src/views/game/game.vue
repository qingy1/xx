<template>
  <div class="entertainment">
    <div class="game-options">
      <el-button v-for="(item, index) in buttonData" :key="index" @click="item.click"
        :class="{ 'active': selectedGame && selectedGame.name === item.game.name }" v-text="item.text" />
    </div>

    <div class="game-container">
      <router-view></router-view>
      <MessagePreview />
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
import MessagePreview from '../MessagePreview.vue';
import tag from '@/components/tag.vue';
import DiceGame from './Dicegame.vue';
import RockPaperScissors from './rock.vue';
import FortuneTelling from './fortunetelling.vue';
import CheckIn from './checkin.vue';
import toe from './toe.vue';
import SecretRealm from './SecretRealm.vue';  
export default {
  components: {
    MessagePreview,
    tag,
    DiceGame,
    RockPaperScissors,
    FortuneTelling,
    CheckIn,
    toe,
    SecretRealm ,
  },
  data() {
    return {
      player: {},
      selectedGame: null,
      games: [
        { name: 'checkin', label: '签到', component: 'CheckIn' },
        { name: 'dice', label: '骰子', component: 'DiceGame' },
        { name: 'rps', label: '猜拳', component: 'RockPaperScissors' },
        { name: 'fortune', label: '算卦', component: 'FortuneTelling' },
        { name: 'toe', label: '井棋', component: 'toe' },
        { name: 'secret-realm', label: '秘境', component: 'SecretRealm' } ,
      ],
    }
  },
  created() {
    this.player = this.$store.player;
    this.$nextTick(() => {
      this.selectGame(this.games.find(game => game.name === 'checkin'));
    });

  },
  mounted() {
    this.checkDailyReset();
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
        this.player.props.money -= result.reward;
        this.player.gameLosses++;
      }
      this.$addMessage({
        category: '系统',
        type: 'system',
        content: `[color=red]温某[/color]在[color=#FF0000]${this.selectedGame.label}中[/color]${result.success ? "成功" : "失败"}，${result.success ? "赢取" : "输掉"}了${result.reward}灵石。`
      });
    },
    checkDailyReset() {
      const now = new Date();
      const lastCheckin = new Date(this.player.lastCheckinDate);
      if (now.getDate() !== lastCheckin.getDate() || now.getMonth() !== lastCheckin.getMonth() || now.getFullYear() !== lastCheckin.getFullYear()) {
        this.player.checkedInToday = false;
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
  background-color: var(--el-fill-color-light);
  border-radius: 10px;
  padding: 10px;
}

.game-options .el-button {
  background-color: transparent;
  border: none;
  color: var(--el-color-primary);
  font-weight: 500;
  transition: all 0.3s ease;
}

.game-options .el-button.active {
  background-color: var(--el-color-primary);
  color: var(--el-color-white);
  border-radius: 8px;
}

.game-container {
  background-color: var(--el-bg-color);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: var(--el-box-shadow-light);
}

.stats {
  background-color: var(--el-fill-color-light);
  padding: 15px;
  border-radius: 12px;
}

.attribute-box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.attribute {
  background-color: var(--el-bg-color);
  border-radius: 8px;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 1 calc(50% - 5px);
  box-shadow: var(--el-box-shadow-lighter);
}

.attribute-label {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.attribute-value {
  font-weight: 600;
  color: var(--el-color-primary);
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