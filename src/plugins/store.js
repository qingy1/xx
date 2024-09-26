import { defineStore } from 'pinia';
import crypto from '@/plugins/crypto';

export const useMainStore = defineStore('main', {
    state: () => ({
        // boss属性
        boss: {
            name: '',
            text: '',
            time: 0,
            desc: '',
            level: 0,
            dodge: 0,
            attack: 0,
            health: 0,
            conquer: false,
            defense: 0,
            critical: 0,
            maxhealth: 0
        },
        randomEvent: null,
        // 玩家属性
        player: {
            id: '',
            name: '',
            zc: false,
            pet: {},
            dark: false,
            npcs: [],
            wife: {},
            pets: [],
            wifes: [],
            props: {
                money: 0,
                flying: 0,
                qingyuan: 0,
                rootBone: 0,
                currency: 0,
                cultivateDan: 0,
                strengtheningStone: 0
            },
            score: 0,
            level: 0,
            dodge: 0,
            points: 0,
            attack: 10,
            health: 100,
            critical: 0,
            defense: 10,

            taskNum: 0,
            jishaNum:0,
            ggNum: 0,

            version: 0.91,
            currency: 0,
            maxHealth: 100,
            inventory: [],
            isNewbie: false,
            shopData: [],
            equipment: {
                sutra: {},
                armor: {},
                weapon: {},
                accessory: {}
            },
            achievement: {
                pet: [],
                monster: [],
                equipment: []
            },
            cultivation: 0,
            reincarnation: 0,
            maxCultivation: 100,
            backpackCapacity: 50,
            sellingEquipmentData: [],
            highestTowerFloor:1
        },
        // 怪物信息
        monster: {
            name: '',
            // 气血
            health: 0,
            // 攻击
            attack: 0,
            // 防御
            defense: 0,
            // 闪避率
            dodge: 0,
            // 暴击
            critical: 0
        },
        mapData: {
            y: 0,
            x: 0,
            map: []
        },
        mapScroll: 0,
        randomEvent: null,
        fishingMap: [],
    }),
    actions: {
        setBoss (data) {
            this.boss = data;
        },
        setRandomEvent(event) {
            this.randomEvent = event;
        },
        setPlayer (data) {
            this.player = data;
        },
        setMonster (data) {
            this.monster = data;
        },
        setMapData (data) {
            this.mapData = data;
        },
        setMapScroll (data) {
            this.mapScroll = data;
        },
        setFishingMap (data) {
            this.fishingMap = data;
        }
    },
    persist: {
        key: 'vuex',
        paths: ['boss', 'player'],
        storage: localStorage,
        serializer: {
            serialize: (state) => {
                return JSON.stringify({
                    boss: crypto.encryption(state.boss),
                    player: crypto.encryption(state.player)
                });
            },
            deserialize: (value) => {
                const state = JSON.parse(value);
                return {
                    boss: crypto.decryption(state.boss),
                    player: crypto.decryption(state.player)
                };
            }
        }
    }
});