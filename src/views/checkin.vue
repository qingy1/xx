<template>
    <div class="check-in">
      <h3>每日签到</h3>
      <div class="check-in-calendar">
        <div v-for="day in 7" :key="day" class="day-box" :class="{ 'checked': isCheckedIn(day), 'current': isCurrentDay(day) }">
          <span class="day-number">{{ day }}</span>
          <span class="reward">{{ getReward(day) }}</span>
        </div>
      </div>
      <el-button @click="checkIn" :disabled="!canCheckIn" class="check-in-button">
        {{ canCheckIn ? '签到' : '今日已签到' }}
      </el-button>
      <p class="streak-info">当前连续签到: {{ player.checkinStreak }} 天</p>
      <p class="next-bonus">距离下次额外奖励: {{ daysUntilNextBonus }} 天</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CheckIn',
    data() {
      return {
        rewards: [100, 200, 300, 400, 500, 1000, 2000],
        bonusRewards: [100, 2000, 5000]
      }
    },
    computed: {
      player() {
        return this.$store.player;
      },
      canCheckIn() {
        const now = new Date();
        const lastCheckin = new Date(this.player.lastCheckinDate);
        return !this.player.lastCheckinDate || 
               now.toDateString() !== lastCheckin.toDateString();
      },
      daysUntilNextBonus() {
        return 7 - (this.player.checkinStreak % 7);
      }
    },
    methods: {
      isCheckedIn(day) {
        return day <= (this.player.checkinStreak % 7);
      },
      isCurrentDay(day) {
        return day === ((this.player.checkinStreak % 7) + 1);
      },
      getReward(day) {
        return this.rewards[day - 1] + (day === 7 ? this.bonusRewards[Math.floor(this.player.checkinStreak / 7)] : 0);
      },
      checkIn() {
        if (!this.canCheckIn) return;
  
        const dayInStreak = (this.player.checkinStreak % 7) + 1;
        let reward = this.rewards[dayInStreak - 1];
  
        if (dayInStreak === 7) {
          const bonusLevel = Math.floor(this.player.checkinStreak / 7);
          reward += this.bonusRewards[Math.min(bonusLevel, 2)];
        }
  
        this.player.checkinStreak++;
        this.player.lastCheckinDate = new Date().toISOString();
        this.player.props.cultivateDan += reward;
  
        this.$store.commit('updatePlayer', this.player);
        this.$emit('game-result', { success: true, reward });
  
        this.$notify({
          title: '签到成功',
          message: `获得 ${reward} 培养丹！`,
          type: 'success'
        });
      }
    }
  }
  </script>
<style scoped>
.check-in {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: #000000;
}

.dark .check-in {
  background-color: #2c2c2e;
  color: #ffffff;
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);
}

h3 {
  color: #000000;
}

.dark h3 {
  color: #ffffff;
}

.check-in-calendar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.day-box {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  font-size: 14px;
  transition: all 0.3s ease;
  color: #000000;
}

.dark .day-box {
  background-color: #3a3a3c;
  color: #ffffff;
}

.day-box.checked {
  background-color: #4cd964;
  color: white;
}

.dark .day-box.checked {
  background-color: #30d158;
}

.day-box.current {
  border: 2px solid #007aff;
}

.dark .day-box.current {
  border-color: #0a84ff;
}

.day-number {
  font-weight: bold;
}

.reward {
  font-size: 12px;
}

.check-in-button {
  width: 100%;
  margin-top: 20px;
  background-color: #007aff;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.dark .check-in-button {
  background-color: #0a84ff;
}

.check-in-button:disabled {
  background-color: #b0b0b0;
}

.dark .check-in-button:disabled {
  background-color: #636366;
}

.streak-info, .next-bonus {
  margin-top: 10px;
  font-size: 14px;
  color: #8e8e93;
}

.dark .streak-info, .dark .next-bonus {
  color: #98989d;
}
</style>