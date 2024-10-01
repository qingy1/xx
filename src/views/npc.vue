<template>
  <div class="npc-interaction md3-background">
    <div class="content-wrapper">
      <div class="location-info md3-card">
        <h3 class="md3-title">{{ currentLocation.name }}</h3>
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
                  @click="interactWithNpc(npc)"
                  class="md3-button">
             {{ npc.name }}
          </button>
        </div>
      </div>
      <div class="task-system md3-card" v-if="currentNPC">
        <h3 class="md3-title">任务系统 - {{ currentNPC.name }}</h3>
        <div class="md3-content">
          <div v-if="currentNPC.tasks && currentNPC.tasks.length">
            <h4>可用任务</h4>
            <ul>
              <li v-for="task in availableTasks" :key="task.id">
                {{ task.title }}
                <button @click="acceptTask(task)" class="md3-button">接受任务</button>
              </li>
            </ul>
            
            <h4>进行中的任务</h4>
            <ul>
              <li v-for="task in activeTasks" :key="task.id">
                {{ task.title }} - 进度: {{ task.objective.current }}/{{ task.objective.amount }}
                <button v-if="task.objective.current >= task.objective.amount" 
                        @click="completeTask(task)"
                        class="md3-button">
                  完成任务
                </button>
              </li>
            </ul>
          </div>
          <p v-else>该 NPC 当前没有可用任务。</p>
        </div>
      </div>
      <div class="navigation md3-card">
        <h3 class="md3-title">导航</h3>
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
</template>

<script>
export default {
  name: 'NpcInteraction',
  data() {
    return {
      texts: [],
      player: {},
      currentLocation: {},
      currentNPC: null,
      worldMap: this.initializeWorldMap(),
      randomEvents: this.initializeRandomEvents()
    };
  },
  computed: {
    availableTasks() {
      return this.currentNPC && this.currentNPC.tasks 
        ? this.currentNPC.tasks.filter(task => task.status === 'available')
        : [];
    },
    activeTasks() {
      return this.player.activeTasks || [];
    }
  },
  mounted() {
    this.player = this.$store.player;
    this.currentLocation = this.worldMap['映日湖']; // 初始位置
    this.addLog('你来到了修仙世界...');
  },
  updated() {
    this.$nextTick(this.scrollToBottom);
  },
  methods: {
    move(direction) {
      const chosenDirection = this.currentLocation.directions.find(dir => dir.name === direction);
      if (!chosenDirection) {
        this.addLog(`你不能往那个方向走。`);
        return;
      }

      const newLocation = this.worldMap[chosenDirection.destination];
      if (newLocation) {
        this.currentLocation = newLocation;
        this.currentNPC = null;
        this.addLog(`你${direction}，来到了${newLocation.name}`);
        this.checkForRandomEvent();
      } else {
        this.addLog(`你想${direction}，但是那里似乎无路可走。`);
      }
    },
    interactWithNpc(npc) {
      this.currentNPC = npc;
      const interactionMessages = {
        enemy: `你遇到了${npc.name}，准备战斗！`,
        friendly: `你与${npc.name}进行了友好的交谈。`,
        quest: `${npc.name}似乎有什么任务要交给你。`
      };
      this.addLog(interactionMessages[npc.type] || `你与${npc.name}互动了一番。`);
    },
    acceptTask(task) {
      task.status = 'active';
      if (!this.player.activeTasks) {
    //    this.$set(this.player, 'activeTasks', []);
        this.player.activeTasks=[]
      }
      this.player.activeTasks.push(task);
      this.addLog(`你接受了任务：${task.title}`);
    },
    completeTask(task) {
      task.status = 'completed';
      if (!this.player.completedTasks) {
      //  this.$set(this.player, 'completedTasks', []);
        this.player.completedTasks=[]
      }
      this.player.completedTasks.push(task.id);
      this.player.activeTasks = this.player.activeTasks.filter(t => t.id !== task.id);
      this.giveRewards(task.rewards);
      this.addLog(`你完成了任务：${task.title}`);
    },
    giveRewards(rewards) {
      this.player.experience += rewards.experience;
      this.player.cultivation += rewards.cultivation;
      rewards.items.forEach(item => this.player.inventory.push(item));
      this.addLog(`获得奖励：经验 ${rewards.experience}，修为 ${rewards.cultivation}，物品 ${rewards.items.join(', ')}`);
    },
    checkForRandomEvent() {
      if (Math.random() < 0.3) {
        const event = this.randomEvents[Math.floor(Math.random() * this.randomEvents.length)];
        this.addLog(event.description);
        this.handleEvent(event);
      }
    },
    handleEvent(event) {
      const eventHandlers = {
        resource: () => { this.player.props.money += event.amount; },
        cultivation: () => { this.player.cultivation += event.amount; },
        item: () => { /* 添加物品到背包逻辑 */ },
        skill: () => { /* 学习技能逻辑 */ },
        lucky: () => { this.player.cultivation *= 0.9; }
      };
      if (eventHandlers[event.type]) {
        eventHandlers[event.type]();
     //   this.$store.commit('setPlayer', this.player);
      }
    },
    scrollToBottom() {
      const logContent = this.$refs.logContent;
      logContent.scrollTop = logContent.scrollHeight;
    },
    addLog(text) {
      this.texts.push(text);
      this.$nextTick(this.scrollToBottom);
    },
    initializeWorldMap() {
      return {
        '映日湖': {
          name: '映日湖',
          description: '城郊的一片大湖，环湖而行至少有千里的路程，四周人迹罕至。湖水清澈幽深不见底，似乎能感受到一般不寻常的气息。',
          coordinates: { x: 0, y: 0 },
          npcs: [
            { 
              name: '邪派散修', 
              type: 'enemy' 
            },
            { 
              name: '云渺仙子', 
              type: 'quest',
              tasks: [
                {
                  id: 'task1',
                  title: '收集灵草',
                  description: '为我收集10株灵草',
                  type: 'collect',
                  objective: {
                    target: '灵草',
                    amount: 10,
                    current: 0
                  },
                  rewards: {
                    experience: 100,
                    items: ['低级丹药'],
                    cultivation: 50
                  },
                  status: 'available'
                }
              ]
            }
          ],
          directions: [
            { name: '往东走', destination: '东林', dx: 1, dy: 0 },
            { name: '往西走', destination: '金城', dx: -1, dy: 0 },
            { name: '往南走', destination: '村落', dx: 0, dy: -1 }
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
            { name: '往北走', destination: '山洞', dx: 0, dy: 1 }
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
            { name: '往南走', destination: '市场', dx: 0, dy: -1 }
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
            { name: '往北走', destination: '映日湖', dx: 0, dy: 1 }
          ]
        }
      };
    },
    initializeRandomEvents() {
      return [
        { type: 'resource', name: '灵石', amount: 100, description: '你发现了一堆灵石！' },
        { type: 'cultivation', name: '顿悟', amount: 500, description: '你突然顿悟，修为大涨！' },
        { type: 'item', name: '丹药', effect: '增加100点修为', description: '你获得了一颗珍贵的丹药！' },
        { type: 'skill', name: '剑法', effect: '增加10%攻击力', description: '你领悟了一门高深剑法！' },
        { type: 'lucky', name: '雷劫', effect: '修为降低10%', description: '你遭遇了雷劫！' }
      ];
    }
  }
};
</script>

<style scoped>
.npc-interaction {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--el-bg-color);
  min-height: 100vh;
  padding: 20px;
  color: var(--el-text-color-primary);
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.md3-card {
  background-color: var(--el-bg-color-secondary);
  border-radius: 16px;
  box-shadow: var(--el-box-shadow-light);
  margin-bottom: 20px;
  overflow: hidden;
}

.md3-title {
  font-size: 1.25rem;
  font-weight: 600;
  padding: 16px;
  margin: 0;
  background-color: var(--el-color-primary-light-3);
  color: var(--el-color-primary);
}

.md3-content {
  padding: 16px;
}

.md3-button {
  background-color: var(--el-color-primary);
  color: var(--el-color-white);
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 8px;
  margin-bottom: 8px;
}

.md3-button:hover {
  background-color: var(--el-color-primary-light-3);
}

.log-content {
  max-height: 200px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.log-content div {
  margin-bottom: 8px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

@media (max-width: 600px) {
  .md3-card {
    border-radius: 12px;
  }
}
</style>