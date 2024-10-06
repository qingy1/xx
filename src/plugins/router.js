import map from '../views/mapExploration.vue';
import boss from '../views/bossPage.vue';
import home from '../views/homePage.vue';
import index from '../views/indexPage.vue';
import explore from '../views/explorePage.vue';
import cultivate from '../views/cultivatePage.vue';
import game from '../views/game/game.vue'
import endlesstower from '../views/endlessPage.vue'
import spiritfarm from '../views/spiritfarm.vue'
import youli from '../views/npc.vue'
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'index',
        meta: {
            keepAlive: false
        },
        component: index
    },
    {
        path: '/home',
        name: 'home',
        meta: {
            keepAlive: false
        },
        component: home
    },
    {
        path: '/cultivate',
        name: 'cultivate',
        meta: {
            keepAlive: false
        },
        component: cultivate
    },
    {
        path: '/map',
        name: 'map',
        meta: {
            keepAlive: false
        },
        component: map
    },
    {
        path: '/explore',
        name: 'explore',
        meta: {
            keepAlive: false
        },
        component: explore
    },
    {
        path: '/boss',
        name: 'boss',
        meta: {
            keepAlive: false
        },
        component: boss
    },
    {
        path: '/endlesstower',
        name: 'endlesstower',
        meta: {
            keepAlive: false
        },
        component: endlesstower
    },
    {
        path: '/game',
        name: 'game',
        meta: {
            keepAlive: false
        },
        component: game
    },
    {
        path: '/spiritfarm',
        name: 'spiritfarm',
        meta: {
            keepAlive: false
        },
        component: spiritfarm
    },
    {
        path: '/youli',
        name: 'youli',
        meta: {
            keepAlive: false
        },
        component: youli
    },
    {
        path: '/messages',
        name: 'Messages',
        component: () => import('@/views/MessagePage.vue')
      },
      {
          path: '/leaderboardView',
          name: 'LeaderboardView',
          component: () => import('@/views/LeaderboardView.vue')
        },
        {
            path: '/alchemy',
            name: 'alchemy',
            component: () => import('@/views/alchemyPage.vue')
          },
          {
            path: '/refining',
            name: 'refining',
            component: () => import('@/views/refiningPage.vue')
          }
       
];
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
