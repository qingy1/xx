<template>
    <div class="gambling-stone">
      <div class="bet-amount" v-if="!selectedStone">
        <el-button @click="decreaseBet" icon="el-icon-minus" :disabled="betAmount <= 100"></el-button>
        <el-input-number v-model="betAmount" :min="100" :step="100" :max="10000" placeholder="下注金额"></el-input-number>
        <el-button @click="increaseBet" icon="el-icon-plus" :disabled="betAmount >= 10000"></el-button>
      </div>
      
      <div class="stones-container" v-if="!result">
        <div v-for="(stone, index) in stones" :key="index" 
             class="stone" 
             :class="{ 'selected': selectedStone === index }"
             @click="selectStone(index)">
          <img src="../assets/原石.png" alt="原石" class="stone-image">
          <div class="stone-number">{{ index + 1 }}</div>
        </div>
      </div>
  
      <el-button @click="gamble" :disabled="!canGamble" v-if="!result">
        {{ canGamble ? '开石' : '冷却中' }}
      </el-button>
      
      <div class="result-container" v-if="result">
        <div v-for="(stone, index) in stones" :key="index" 
             class="stone" 
             :class="{ 'selected': selectedStone === index }">
          <img :src="getStoneImage(stone.type)" :alt="stone.type" class="stone-image">
          <div class="stone-type">{{ stone.type }}</div>
        </div>
      </div>
  
      <div v-if="result" class="result">
        <p>{{ result.message }}</p>
        <p v-if="result.reward > 0">获得灵石：{{ result.reward }}</p>
      </div>
      <div class="timer" v-if="!canGamble">
        下次游戏时间: {{ formatTime(nextGameTime) }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GamblingStone',
    data() {
      return {
        betAmount: 100,
        result: null,
        selectedStone: null,
        stones: Array(6).fill().map(() => ({ type: '原石' })),
        stoneTypes: [
          { name: '凡石', chance: 0.5, multiplier: 0 },
          { name: '灵石', chance: 0.1, multiplier: 2 },
          { name: '宝石', chance: 0.05, multiplier: 5 },
          { name: '仙石', chance: 0.01, multiplier: 20 }
        ]
      }
    },
    computed: {
      player() {
        return this.$store.player;
      },
      nextGameTime() {
        return this.player.nextGameTimes?.gamblingStone || 0;
      },
      canGamble() {
        return Date.now() >= this.nextGameTime && this.selectedStone !== null;
      }
    },
    methods: {
      decreaseBet() {
        if (this.betAmount > 100) {
          this.betAmount -= 100;
        }
      },
      increaseBet() {
        if (this.betAmount < 10000) {
          this.betAmount += 100;
        }
      },
      selectStone(index) {
        if (!this.result && this.canGamble) {
          this.selectedStone = index;
        }
      },
      gamble() {
        if (!this.canGamble) return;
  
        this.stones = this.stones.map(() => {
          const random = Math.random();
          let cumulativeChance = 0;
          for (const stone of this.stoneTypes) {
            cumulativeChance += stone.chance;
            if (random < cumulativeChance) {
              return { type: stone.name };
            }
          }
          return { type: '凡石' }; // 默认为凡石
        });
  
        const chosenStone = this.stones[this.selectedStone];
        const stoneType = this.stoneTypes.find(s => s.name === chosenStone.type);
        const reward = this.betAmount * stoneType.multiplier;
        
        this.result = {
          stoneName: chosenStone.type,
          message: `你开出了一块${chosenStone.type}！`,
          reward: reward
        };
  
        this.$emit('game-result', { success: reward > 0, reward });
  
        const newNextGameTime = Date.now() + 10 * 60 * 1000; // 10 minutes
        this.player.nextGameTimes.gamblingStone = newNextGameTime 
        this.$emit('update-next-game-time', { game: 'gamblingStone', time: newNextGameTime });
      },
      formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
      },
      getStoneImage(type) {
        return `/images/${type}.png`;
      }
    }
  }
  </script>
  
  <style scoped>
  .gambling-stone {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  .bet-amount {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .stones-container, .result-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 20px 0;
  }
  .stone {
    position: relative;
    width: 100px;
    height: 100px;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  .stone.selected {
    border-color: #409EFF;
    box-shadow: 0 0 10px rgba(64, 158, 255, 0.5);
  }
  .stone-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  .stone-number, .stone-type {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
  }
  .result {
    margin-top: 20px;
    text-align: center;
  }
  .timer {
    margin-top: 20px;
    font-style: italic;
  }
  </style>