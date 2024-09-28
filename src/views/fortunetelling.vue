<template>
  <div class="fortune-telling">
    <el-button @click="tellFortune" :disabled="!canTellFortune" class="fortune-button">
      {{ canTellFortune ? '开始算卦' : '今日已算卦' }}
    </el-button>
    <div v-if="result" class="result">
      <p>{{ result.message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FortuneTelling',
  data() {
    return {
      result: null,
    }
  },
  computed: {
    player() {
      return this.$store.player;
    },
    canTellFortune() {
      const now = new Date();
      const lastFortune = new Date(this.player.fortuneTellingDate);
      return !this.player.fortuneTellingDate || 
             now.toDateString() !== lastFortune.toDateString();
    }
  },
  methods: {
    tellFortune() {
      if (!this.canTellFortune) return;

      const fortunes = [
        '大吉', '中吉', '小吉', '吉', '末吉', '凶', '大凶'
      ];
      const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      const reward = fortune === '大吉' ? 50 : (fortune === '中吉' ? 30 : (fortune === '小吉' ? 20 : 0));

      this.result = {
        message: `您的运势是: ${fortune}${reward > 0 ? `，获得 ${reward} 灵石！` : ''}`
      };

      this.player.fortuneTellingDate = new Date().toISOString();
      this.player.props.money += reward;

      //this.$store.commit('updatePlayer', this.player);
      this.$emit('game-result', { success: reward > 0, reward });
    }
  }
}
</script>

<style scoped>
.fortune-telling {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.fortune-button {
  width: 100%;
  background-color: #5856d6;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.fortune-button:disabled {
  background-color: #b0b0b0;
}

.result {
  margin-top: 20px;
  font-size: 16px;
  color: #1c1c1e;
}
</style>