<template>
    <div class="message-preview">
      <div class="message-list">
        <div v-for="message in previewMessages.slice(0, 3)" :key="message.id" class="message">
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
  import { inject } from 'vue';
  
  export default {
    name: 'MessagePreview',
    setup() {
      const previewMessages = inject('previewMessages');
      const formatContent = (content) => {
        return content.replace(/\[color=(.*?)\](.*?)\[\/color\]/g, '<span style="color:$1">$2</span>');
      };
  
      const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };
  
      return { previewMessages, formatContent, formatTime };
    }
  }
  </script>
  
  <style scoped>
  .message-preview {
    background-color: var(--el-bg-color);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 1px;
    border-radius: 1px;
    box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.1);
  }
  
  .preview-title {
    font-size: 18px;
    font-weight: bold;
    margin: 0 0 10px 0;
    text-align: center;
    color: var(--el-text-color-primary);
  }
  
  .message-list {
    background-color: var(--el-bg-color);
  }
  
  .message {
    margin-bottom: 8px;
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
  
  .view-all {
    display: block;
    text-align: center;
    margin-top: 10px;
    color: var(--el-color-primary);
    text-decoration: none;
  }
  
  .view-all:hover {
    text-decoration: underline;
  }
  </style>