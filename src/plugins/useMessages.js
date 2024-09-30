// src/plugins/useMessages.js
import { ref, computed, watch } from 'vue';

const MAX_PREVIEW_MESSAGES = 5;

export function useMessages() {
  const messages = ref(JSON.parse(localStorage.getItem('messages') || '[]'));

  watch(messages, (newMessages) => {
    localStorage.setItem('messages', JSON.stringify(newMessages));
  }, { deep: true });

  const addMessage = (message) => {
    messages.value.push({
      id: Date.now(),
      timestamp: Date.now(),
      category: message.category || '系统',
      type: message.type || 'system',
      name: message.name,
      content: message.content
    });
  };

  const previewMessages = computed(() => {
    return messages.value.slice(-MAX_PREVIEW_MESSAGES).reverse();
  });

  return {
    messages,
    addMessage,
    previewMessages
  };
}