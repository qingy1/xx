<template>
    <div class="map-page md3-background">
      <div class="content-wrapper">

        <div class="location-info md3-card">
          <h3 class="md3-title"> {{ currentLocation.name }}</h3>
          <p class="md3-content">{{ currentLocation.description }}</p>
        </div>
  

  
        <div class="event-log md3-card">
          <h3 class="md3-title">事件日志</h3>
          <div class="md3-content log-content" ref="logContent">
            <div v-for="(text, index) in texts" :key="index" v-html="text"></div>
          </div>
        </div>

        <div class="interactions md3-card">
          <h3 class="md3-title">互动</h3>
          <div class="md3-content">
            <button v-for="npc in currentLocation.npcs" 
                    :key="npc.name" 
                    @click="interactWithNPC(npc)"
                    class="md3-button">
               {{ npc.name }}
            </button>
            <div class="md3-content">
            <button v-for="direction in currentLocation.directions" 
                    :key="direction.name" 
                    @click="move(direction.name)"
                    class="md3-button">
              {{ direction.name }}
            </button>
          </div>
          </div>
        </div>
  


      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MapPage',
    data() {
      return {
        texts: [],
        player: {},
        currentLocation: {},
        worldMap: {
          '映日湖': {
            name: '映日湖',
            description: '城郊的一片大湖，环湖而行至少有千里的路程，四周人迹罕至。湖水清澈幽深不见底，似乎能感受到一般不寻常的气息。',
            coordinates: { x: 0, y: 0 },
            npcs: [
              { name: '邪派散修', type: 'enemy' },
              { name: '云渺仙子', type: 'quest' },
            ],
            directions: [
              { name: '往东走', destination: '东林', dx: 1, dy: 0 },
              { name: '往西走', destination: '金城', dx: -1, dy: 0 },
              { name: '往南走', destination: '村落', dx: 0, dy: -1 },
            ]
          },
          '东林': {
            name: '东林',
            description: '一片茂密的森林，树木高大，枝叶繁茂。',
            coordinates: { x: 1, y: 0 },
            npcs: [
              { name: '猎户', type: 'friendly' }
            ],
            directions: [
              { name: '往西走', destination: '映日湖', dx: -1, dy: 0 },
              { name: '往北走', destination: '山洞', dx: 0, dy: 1 },
            ]
          },
          '金城': {
            name: '金城',
            description: '繁华的主城，街道上人来人往。',
            coordinates: { x: -1, y: 0 },
            npcs: [
              { name: '商人', type: 'friendly' },

              { name: '城主', type: 'quest' }
            ],
            directions: [
              { name: '往东走', destination: '映日湖', dx: 1, dy: 0 },
              { name: '往南走', destination: '市场', dx: 0, dy: -1 },
            ]
          },
          '村落': {
            name: '村落',
            description: '一个安静的小村庄，炊烟袅袅。',
            coordinates: { x: 0, y: -1 },
            npcs: [
              { name: '村长', type: 'quest' }
            ],
            directions: [
              { name: '往北走', destination: '映日湖', dx: 0, dy: 1 },
            ]
          },
        },
        randomEvents: [
          { type: 'resource', name: '灵石', amount: 100, description: '你发现了一堆灵石！' },
          { type: 'cultivation', name: '顿悟', amount: 500, description: '你突然顿悟，修为大涨！' },
          { type: 'item', name: '丹药', effect: '增加100点修为', description: '你获得了一颗珍贵的丹药！' },
          { type: 'skill', name: '剑法', effect: '增加10%攻击力', description: '你领悟了一门高深剑法！' },
          { type: 'lucky', name: '雷劫', effect: '修为降低10%', description: '你遭遇了雷劫！' },
        ]
      };
    },
    computed: {
      cultivationPercentage() {
        return (this.player.cultivation / this.player.maxCultivation) * 100;
      }
    },
    mounted() {
        this.player = this.$store.player;
      this.currentLocation = this.worldMap['映日湖']; // 初始位置
      this.addLog('你来到了修仙世界...');
    },
    updated() {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    methods: {
      move(direction) {
        const chosenDirection = this.currentLocation.directions.find(dir => dir.name === direction);
        if (chosenDirection) {
          const newLocation = this.worldMap[chosenDirection.destination];
          if (newLocation) {
            this.currentLocation = newLocation;
            this.addLog(`你${direction}，来到了${newLocation.name}`);
            this.checkForRandomEvent();
          } else {
            this.addLog(`你想${direction}，但是那里似乎无路可走。`);
          }
        } else {
          this.addLog(`你不能往那个方向走。`);
        }
      },
      interactWithNPC(npc) {
        if (npc.type === 'enemy') {
          this.addLog(`你遇到了${npc.name}，准备战斗！`);
          // 实现战斗逻辑
        } else if (npc.type === 'friendly') {
          this.addLog(`你与${npc.name}进行了友好的交谈。`);
          // 实现对话逻辑
        } else if (npc.type === 'quest') {
          this.addLog(`${npc.name}似乎有什么任务要交给你。`);
          // 实现任务逻辑
        }
      },
      checkForRandomEvent() {
        if (Math.random() < 0.3) { // 30% 触发随机事件的概率
          const event = this.randomEvents[Math.floor(Math.random() * this.randomEvents.length)];
          this.addLog(event.description);
          this.handleEvent(event);
        }
      },
      handleEvent(event) {
        switch(event.type) {
          case 'resource':
            this.player.props.money += event.amount;
            break;
          case 'cultivation':
            this.player.cultivation += event.amount;
            break;
          case 'item':
            // 添加物品到背包逻辑
            break;
          case 'skill':
            // 学习技能逻辑
            break;
          case 'lucky':
            this.player.cultivation *= 0.9; // 降低10%修为
            break;
        }
        // 更新玩家状态
        this.$store.commit('setPlayer', this.player);
      },
      scrollToBottom() {
        const logContent = this.$refs.logContent;
        logContent.scrollTop = logContent.scrollHeight;
      },
      addLog(text) {
        this.texts.push(text);
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    }
  }
  </script>
  
  <style scoped>
  .map-page {
    font-family: 'Roboto', sans-serif;
    background-color: #f5f5f5;
    min-height: 100vh;
    padding: 20px;
  }
  
  .content-wrapper {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .md3-background {
    background-color: #f0f0f0;
  }
  
  .md3-card {
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    overflow: hidden;
  }
  
  .md3-title {
    font-size: 1.25rem;
    font-weight: 500;
    padding: 16px;
    margin: 0;
    background-color: #a19ba9;
    color: #ffffff;
  }
  
  .md3-content {
    padding: 16px;
  }
  
  .md3-button {
    background-color: #d5cae4;
    color: #ffffff;
    border: none;
    padding: 10px 16px;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-right: 8px;
    margin-bottom: 8px;
  }
  
  .md3-button:hover {
    background-color: #c1bbce;
  }
  
  .cultivation-bar {
    width: 100%;
    height: 10px;
    background-color: #e0e0e0;
    border-radius: 5px;
    overflow: hidden;
    margin-top: 10px;
  }
  
  .cultivation-progress {
    height: 100%;
    background-color: #c6bed2;
    transition: width 0.3s ease;
  }
  
  .log-content {
    max-height: 200px;
    overflow-y: auto;
    scroll-behavior: smooth;
  }
  
  .log-content div {
    margin-bottom: 8px;
  }
  
  @media (max-width: 600px) {
    .md3-card {
      border-radius: 0;
    }
  }
  </style>