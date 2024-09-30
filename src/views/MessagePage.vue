<template>
  <div class="message-page">
    <h2 class="page-title">修仙动态</h2>
    <div class="category-buttons">
      <button 
        v-for="category in categories" 
        :key="category" 
        @click="setActiveCategory(category)"
        :class="{ active: activeCategory === category }"
      >
        {{ category }}
      </button>
    </div>
    <div class="message-list">
      <div v-for="message in filteredMessages" :key="message.id" class="message">
        <p class="content">
          [{{ formatTime(message.timestamp) }}]
          [{{ message.category }}]:
          <template v-if="message.type === 'player'">[{{ message.name }}]: </template>
          <span v-html="formatContent(message.content)"></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, inject } from 'vue';

export default {
  name: 'MessagePage',
  setup() {
    const messages = inject('messages');
    const categories = ['全部', '世界', '宗门', '仙界', '跨服', '私聊', '系统'];
    const activeCategory = ref('全部');

    const setActiveCategory = (category) => {
      activeCategory.value = category;
    };

    const filteredMessages = computed(() => {
      if (activeCategory.value === '全部') {
        return messages.value;
      }
      return messages.value.filter(msg => msg.category === activeCategory.value);
    });

    const formatContent = (content) => {
      return content.replace(/\[color=(.*?)\](.*?)\[\/color\]/g, '<span style="color:$1">$2</span>');
    };

    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return { 
      categories, 
      activeCategory, 
      setActiveCategory, 
      filteredMessages, 
      formatContent, 
      formatTime 
    };
  }
}
</script>

<style scoped>
.message-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--el-bg-color);
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
}
h2.page-title {
  color: rgb(186, 126, 92);
}

.category-buttons {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.category-buttons button {
  padding: 5px 10px;
  border: none;
  background-color: var(--el-fill-color);
  color: var(--el-text-color-regular);
  border-radius: 5px;
  cursor: pointer;
}

.category-buttons button.active {
  background-color: var(--el-color-primary);
  color: var(--el-color-white);
}

.message-list {
  background-color: var(--el-bg-color);
  border-radius: 8px;
  padding: 10px;
}

.message {
  margin-bottom: 10px;
  padding: 5px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.content {
  font-size: 14px;
  text-align: left;
  color: var(--el-text-color-regular);
  margin: 0;
  line-height: 1.4;
}
</style>