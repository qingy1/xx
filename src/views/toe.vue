<template>
    <div class="tic-tac-toe">
      <div class="game-board">
        <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
          <button 
            v-for="(cell, colIndex) in row" 
            :key="colIndex" 
            @click="makeMove(rowIndex, colIndex)" 
            :disabled="cell !== ' ' || !canPlay"
            class="cell"
          >
            {{ cell }}
          </button>
        </div>
      </div>
      <p class="game-status">{{ gameStatus }}</p>
      <el-button @click="resetGame" :disabled="!gameEnded && canPlay">重新开始</el-button>
      <div class="timer" v-if="!canPlay">
        下次游戏时间: {{ formatTime(nextGameTime) }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TicTacToe',
    data() {
      return {
        board: [
          [' ', ' ', ' '],
          [' ', ' ', ' '],
          [' ', ' ', ' ']
        ],
        currentPlayer: 'X',
        gameEnded: false,
        gameStatus: '轮到玩家 X',
      }
    },
    computed: {
      player() {
        return this.$store.player;
      },
      nextGameTime() {
        return this.player.nextGameTimes?.ticTacToe || 0;
      },
      canPlay() {
        return Date.now() >= this.nextGameTime;
      }
    },
    methods: {
      makeMove(row, col) {
        if (this.board[row][col] === ' ' && !this.gameEnded && this.canPlay) {
          this.board[row][col] = this.currentPlayer;
          if (this.checkWinner()) {
            this.gameStatus = `玩家 ${this.currentPlayer} 胜利！`;
            this.gameEnded = true;
            this.endGame(true);
          } else if (this.isBoardFull()) {
            this.gameStatus = '平局！';
            this.gameEnded = true;
            this.endGame(false);
          } else {
            this.switchPlayer();
            this.computerMove();
          }
        }
      },
      computerMove() {
        if (!this.gameEnded) {
          setTimeout(() => {
            let row, col;
            do {
              row = Math.floor(Math.random() * 3);
              col = Math.floor(Math.random() * 3);
            } while (this.board[row][col] !== ' ');
            
            this.board[row][col] = this.currentPlayer;
            if (this.checkWinner()) {
              this.gameStatus = `计算机 ${this.currentPlayer} 胜利！`;
              this.gameEnded = true;
              this.endGame(false);
            } else if (this.isBoardFull()) {
              this.gameStatus = '平局！';
              this.gameEnded = true;
              this.endGame(false);
            } else {
              this.switchPlayer();
            }
          }, 500);
        }
      },
      switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.gameStatus = `轮到${this.currentPlayer === 'X' ? '玩家' : '计算机'} ${this.currentPlayer}`;
      },
      checkWinner() {
        const lines = [
          [[0,0], [0,1], [0,2]],
          [[1,0], [1,1], [1,2]],
          [[2,0], [2,1], [2,2]],
          [[0,0], [1,0], [2,0]],
          [[0,1], [1,1], [2,1]],
          [[0,2], [1,2], [2,2]],
          [[0,0], [1,1], [2,2]],
          [[0,2], [1,1], [2,0]]
        ];
        return lines.some(line => 
          line.every(([row, col]) => this.board[row][col] === this.currentPlayer)
        );
      },
      isBoardFull() {
        return this.board.every(row => row.every(cell => cell !== ' '));
      },
      resetGame() {
        this.board = this.board.map(row => row.map(() => ' '));
        this.currentPlayer = 'X';
        this.gameEnded = false;
        this.gameStatus = '轮到玩家 X';
      },
      endGame(playerWon) {
        const reward = playerWon ? 1000 : 100; // 玩家胜利获得1000，平局获得100
        this.$emit('game-result', { success: playerWon, reward });
        const newNextGameTime = Date.now() + 10 * 60 * 1000; // 10 minutes
        this.player.nextGameTimes.ticTacToe = newNextGameTime;
        this.$emit('update-next-game-time', { game: 'ticTacToe', time: newNextGameTime });
      },
      formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
      }
    }
  }
  </script>
  
  <style scoped>
.tic-tac-toe {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: var(--el-box-shadow-light);
}

.game-board {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  gap: 10px;
}

.row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.cell {
  width: 80px;
  height: 80px;
  font-size: 40px;
  font-weight: bold;
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  border: none;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cell:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.cell:hover:not(:disabled) {
  background-color: var(--el-fill-color);
}

.game-status {
  font-size: 18px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.timer {
  margin-top: 20px;
  font-style: italic;
  color: var(--el-text-color-secondary);
}

h3 {
  color: var(--el-text-color-primary);
}
</style>