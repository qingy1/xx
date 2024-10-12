<template>
    <div class="story-page" v-if="currentPart">
        <div class="story-header">
            <h1 class="story-title">{{ currentDungeonName }}</h1>
        </div>
        <div class="story-content">
            <p class="story-text" v-text="currentPart.text"></p>
            <div v-if="currentPart.choices" class="choices">
                <p>你选择了：</p>
                <el-button v-for="(choice, idx) in currentPart.choices" :key="idx" class="choice-button" size="small"
                    type="primary" @click="makeChoice(choice)">
                    {{ choice.text }}
                </el-button>
            </div>
        </div>
        <div v-if="currentReward" class="reward">
            <p class="reward-text">恭喜你获得了奖励：{{ currentReward }}</p>
        </div>
        <el-scrollbar class="log-content" height="150px" ref="scrollbar" always>
            <p v-for="(log, index) in logs" :key="index" class="log-text" v-html="log" />
        </el-scrollbar>
        
            <el-button type="danger" @click="$router.push('/combined-exploration')">退出秘境</el-button>
       
    </div>
</template>

<script>
export default {
    data() {
        return {
            dungeonsData: {
                1:
                {
    "name": "锁妖塔秘境",
    "parts": [
        {
            "id": 1,
            "text": "你是《仙剑奇侠传》中的一名修仙者，机缘巧合之下，你听闻了一座神秘的锁妖塔，据说塔内封印着无数妖魔，也藏有上古遗留下来的珍宝与秘籍。传说中，能成功通过锁妖塔考验的人，将获得前人无法想象的力量。于是，你决定前往一探究竟。",
            "choices": [
                {
                    "text": "立即前往锁妖塔",
                    "result": "你整理行装，朝着锁妖塔的方向出发。",
                    "nextPartIndex": 2
                },
                {
                    "text": "先准备好充足的丹药再出发",
                    "result": "你花时间准备了大量的丹药，以备不时之需。",
                    "reward": {
                        "item": ["回元丹 x5", "补血散 x5"]
                    },
                    "nextPartIndex": 2
                }
            ]
        },
        {
            "id": 2,
            "text": "经过数日跋涉，你终于来到了锁妖塔的入口。塔身高耸入云，周围弥漫着一股阴森的气息。入口处有一块石碑，上书'锁妖塔，入者慎之'。你深吸一口气，迈入了塔内。",
            "choices": [
                {
                    "text": "勇敢踏入塔内",
                    "result": "你步入塔内，发现四周一片昏暗。",
                    "nextPartIndex": 3
                },
                {
                    "text": "环顾四周，寻找线索",
                    "result": "你在入口附近仔细观察，发现了一本古老的手札。",
                    "item": ["古老的手札"],
                    "nextPartIndex": 4
                }
            ]
        },
        {
            "id": 3,
            "text": "进入塔内，你感到一阵寒意。突然，一只低级妖怪从黑暗中扑来！",
            "choices": [
                {
                    "text": "拔剑迎战",
                    "result": "你轻松击败了妖怪，获得了一些经验。",
                    "reward": {
                        "cultivation": 20,
                        "item": ["妖怪之牙"]
                    },
                    "nextPartIndex": 5
                },
                {
                    "text": "转身逃跑",
                    "result": "你错失了锻炼的机会。",
                    "nextPartIndex": 5
                }
            ]
        },
        {
            "id": 4,
            "text": "手札中记录了锁妖塔的隐藏机关和一些前人留下的经验。你了解到塔内共有七层，每一层都有不同的挑战。",
            "choices": [
                {
                    "text": "仔细阅读手札",
                    "result": "你获得了大量有用的信息。",
                    "reward": {
                        "cultivation": 30
                    },
                    "nextPartIndex": 5
                },
                {
                    "text": "将手札收进口袋",
                    "result": "你决定以后再研究。",
                    "nextPartIndex": 5
                }
            ]
        },
        {
            "id": 5,
            "text": "第一层相对简单，你顺利通过，来到第二层。这里的环境变得更加诡异，四周充满了迷雾，让人难以辨别方向。",
            "choices": [
                {
                    "text": "继续前进",
                    "result": "你坚定地向前走，希望尽快找到出口。",
                    "nextPartIndex": 6
                },
                {
                    "text": "使用手札寻找线索",
                    "condition": {
                        "item": "古老的手札"
                    },
                    "result": "根据手札的指引，你找到了通往下一层的快捷路径。",
                    "nextPartIndex": 8
                }
            ]
        },
        {
            "id": 6,
            "text": "迷雾中，你听到有人在呼救。循声望去，发现一名女子被困在妖怪的包围中。",
            "choices": [
                {
                    "text": "出手相救",
                    "result": "你冲上前去，帮助女子击退了妖怪。",
                    "reward": {
                        "cultivation": 50,
                        "item": ["神秘女子的谢礼"]
                    },
                    "nextPartIndex": 7
                },
                {
                    "text": "置之不理，继续前进",
                    "result": "你无视了呼救声，独自前行。",
                    "nextPartIndex": 8
                }
            ]
        },
        {
            "id": 7,
            "text": "女子感激地对你道谢，告诉你她的名字叫做灵儿。她表示愿意与你同行，共同探索锁妖塔。你是否愿意接受她的同行请求？",
            "choices": [
                {
                    "text": "接受她的请求",
                    "result": "你们结伴而行，彼此有了照应。",
                    "nextPartIndex": 9
                },
                {
                    "text": "婉言拒绝，独自前行",
                    "result": "你决定独自冒险，避免拖累。",
                    "nextPartIndex": 8
                }
            ]
        },
        {
            "id": 8,
            "text": "你继续前进，终于找到了通往第三层的阶梯。在你准备踏上阶梯时，一只巨大的妖兽突然出现，挡住了你的去路。",
            "choices": [
                {
                    "text": "立即战斗",
                    "result": "你与妖兽展开了激烈的战斗。",
                    "nextPartIndex": 10
                },
                {
                    "text": "寻找妖兽的弱点",
                    "result": "你仔细观察，试图找到战胜妖兽的办法。",
                    "nextPartIndex": 11
                }
            ]
        },
        {
            "id": 9,
            "text": "有了灵儿的帮助，你们的行动更加顺利。她熟知锁妖塔的一些秘密，能够帮助你避开许多危险。",
            "choices": [
                {
                    "text": "询问灵儿的来历",
                    "result": "灵儿告诉你，她是苗疆的公主，来此寻找解救族人的方法。",
                    "nextPartIndex": 12
                },
                {
                    "text": "专注于眼前的挑战",
                    "result": "你们默契配合，继续前进。",
                    "nextPartIndex": 13
                }
            ]
        },
        {
            "id": 10,
            "text": "妖兽力量强大，你感到有些吃力。",
            "choices": [
                {
                    "text": "使用全力攻击",
                    "result": "你集中全部力量，一举击败了妖兽。",
                    "reward": {
                        "cultivation": 80,
                        "item": ["妖兽之鳞"]
                    },
                    "nextPartIndex": 14
                },
                {
                    "text": "选择防守，寻找机会",
                    "result": "你耐心等待，最终找到破绽，将妖兽击败。",
                    "reward": {
                        "cultivation": 70,
                        "item": ["妖兽之角"]
                    },
                    "nextPartIndex": 14
                }
            ]
        },
        {
            "id": 11,
            "text": "通过观察，你发现妖兽有一个致命弱点。",
            "choices": [
                {
                    "text": "攻击弱点",
                    "result": "你精准地攻击了妖兽的弱点，轻松将其击败。",
                    "reward": {
                        "cultivation": 100,
                        "item": ["妖兽之魂"]
                    },
                    "nextPartIndex": 14
                },
                {
                    "text": "用计引诱妖兽入陷阱",
                    "result": "你利用地形，成功困住了妖兽。",
                    "reward": {
                        "cultivation": 90,
                        "equipment": "妖兽之牙剑"
                    },
                    "nextPartIndex": 14
                }
            ]
        },
        {
            "id": 12,
            "text": "得知她的身份后，你对她的勇气感到佩服。你决定帮助她一起寻找解救族人的方法。",
            "choices": [
                {
                    "text": "誓要帮助灵儿",
                    "result": "灵儿对你充满感激之情。",
                    "nextPartIndex": 13
                },
                {
                    "text": "继续保持同行",
                    "result": "你们默契配合，继续前进。",
                    "nextPartIndex": 13
                }
            ]
        },
        {
            "id": 13,
            "text": "在灵儿的指引下，你们顺利到达了第三层。这里的压力更大，但有了她的帮助，你们如鱼得水。",
            "choices": [
                {
                    "text": "继续探索",
                    "result": "你们决定挑战更高的层数。",
                    "nextPartIndex": 15
                },
                {
                    "text": "暂时休息，恢复体力",
                    "result": "你们找了一处安全的地方，稍作休息。",
                    "healthChange": 30,
                    "nextPartIndex": 16
                }
            ]
        },
        {
            "id": 14,
            "text": "击败妖兽后，你获得了通往第三层的钥匙。你是否要继续前进？",
            "choices": [
                {
                    "text": "继续前进",
                    "result": "你踏上了通往第三层的阶梯。",
                    "nextPartIndex": 17
                },
                {
                    "text": "暂时休息，恢复体力",
                    "result": "你在原地休息，准备迎接更大的挑战。",
                    "healthChange": 20,
                    "nextPartIndex": 17
                }
            ]
        },
        {
            "id": 15,
            "text": "第四层的妖气更重，你们需要更加小心。突然，一个巨大阴影出现在你们面前。",
            "choices": [
                {
                    "text": "立即攻击",
                    "result": "你们毫不犹豫地展开了攻击。",
                    "nextPartIndex": 18
                },
                {
                    "text": "尝试与之交谈",
                    "result": "灵儿上前与阴影交谈，试图化解敌意。",
                    "nextPartIndex": 19
                }
            ]
        },
        {
            "id": 16,
            "text": "休息过后，你们精神焕发，继续向上攀登。",
            "choices": [
                {
                    "text": "直奔第四层",
                    "result": "你们毅然踏上了通往第四层的阶梯。",
                    "nextPartIndex": 15
                },
                {
                    "text": "探索第三层的秘密",
                    "result": "你们在第三层仔细探索，发现了隐藏的宝箱。",
                    "reward": {
                        "item": ["神秘宝箱"]
                    },
                    "nextPartIndex": 20
                }
            ]
        },
        {
            "id": 17,
            "text": "第三层的挑战更加艰巨，你需要更加谨慎。",
            "choices": [
                {
                    "text": "小心前进",
                    "result": "你保持警惕，避免了许多陷阱。",
                    "nextPartIndex": 21
                },
                {
                    "text": "加快脚步，争取时间",
                    "result": "你加快步伐，试图赶在日落前通过。",
                    "nextPartIndex": 22
                }
            ]
        },
        {
            "id": 18,
            "text": "阴影化作一只巨大的妖怪，力量惊人。你们陷入了苦战。",
            "choices": [
                {
                    "text": "全力以赴，合力击败妖怪",
                    "result": "你们最终战胜了妖怪。",
                    "reward": {
                        "cultivation": 150,
                        "equipment": "封妖之剑"
                    },
                    "nextPartIndex": 23
                },
                {
                    "text": "寻找机会逃脱",
                    "result": "你们利用地形，成功逃离。",
                    "nextPartIndex": 24
                }
            ]
        },
        {
            "id": 19,
            "text": "阴影竟然是一个被封印的前辈仙人，他被困于此多年。灵儿的纯净之心打动了他。",
            "choices": [
                {
                    "text": "请求指点",
                    "result": "前辈仙人传授了你们一些高级法术。",
                    "reward": {
                        "cultivation": 200,
                        "item": ["高级法术卷轴"]
                    },
                    "nextPartIndex": 23
                },
                {
                    "text": "帮助他解除封印",
                    "result": "你们合力破除封印，仙人得以重获自由。",
                    "reward": {
                        "cultivation": 250,
                        "equipment": "仙人之袍"
                    },
                    "nextPartIndex": 23
                }
            ]
        },
        {
            "id": 20,
            "text": "宝箱中装有一颗神秘的珠子，散发着淡淡的光芒。",
            "choices": [
                {
                    "text": "收起珠子，继续前进",
                    "result": "你将珠子小心收藏。",
                    "item": ["神秘珠子"],
                    "nextPartIndex": 15
                },
                {
                    "text": "尝试激活珠子",
                    "result": "珠子突然爆发出强烈的光芒，你感到力量涌入体内。",
                    "reward": {
                        "cultivation": 120
                    },
                    "nextPartIndex": 15
                }
            ]
        },
        {
            "id": 21,
            "text": "你的谨慎让你避开了许多危险，顺利到达了第四层。",
            "choices": [
                {
                    "text": "继续保持谨慎",
                    "result": "你在第四层也小心翼翼。",
                    "nextPartIndex": 25
                },
                {
                    "text": "放松警惕",
                    "result": "你有些放松，忽略了周围的危险。",
                    "nextPartIndex": 26
                }
            ]
        },
        {
            "id": 22,
            "text": "你的急躁让你陷入了陷阱，受了些伤。",
            "choices": [
                {
                    "text": "调整心态，继续前进",
                    "result": "你吸取教训，变得谨慎起来。",
                    "healthChange": -20,
                    "nextPartIndex": 25
                },
                {
                    "text": "寻找出口，退出塔外",
                    "result": "你决定放弃，离开锁妖塔。",
                    "nextPartIndex": null
                }
            ]
        },
        {
            "id": 23,
            "text": "你们成功通过了第四层的考验，来到了第五层。这里充满了幻象，让人分不清真实与虚幻。",
            "choices": [
                {
                    "text": "依靠心神定力，辨别真假",
                    "result": "你抵御住了幻象的诱惑。",
                    "nextPartIndex": 27
                },
                {
                    "text": "借助灵儿的力量",
                    "condition": {
                        "companion": "灵儿"
                    },
                    "result": "灵儿的仙术帮助你们看穿了幻象。",
                    "nextPartIndex": 27
                }
            ]
        },
        {
            "id": 24,
            "text": "你们成功逃脱，但错过了获得宝物的机会。",
            "choices": [
                {
                    "text": "继续前进",
                    "result": "你们踏上了通往第五层的阶梯。",
                    "nextPartIndex": 27
                },
                {
                    "text": "返回寻找宝物",
                    "result": "你们决定冒险，回去寻找机会。",
                    "nextPartIndex": 18
                }
            ]
        },
        {
            "id": 25,
            "text": "你的谨慎再次起到了作用，你在第五层也避免了许多危险。",
            "choices": [
                {
                    "text": "继续攀登",
                    "result": "你对自己的判断更加自信。",
                    "nextPartIndex": 28
                },
                {
                    "text": "寻找隐藏的宝物",
                    "result": "你在角落里发现了一件宝物。",
                    "reward": {
                        "equipment": "隐身披风"
                    },
                    "nextPartIndex": 28
                }
            ]
        },
        {
            "id": 26,
            "text": "你的放松让你陷入了幻象，迷失了方向。",
            "choices": [
                {
                    "text": "努力清醒过来",
                    "result": "你恢复了理智，但浪费了不少时间。",
                    "nextPartIndex": 27
                },
                {
                    "text": "随波逐流，顺其自然",
                    "result": "你陷入了更深的幻境，难以自拔。",
                    "nextPartIndex": null
                }
            ]
        },
        {
            "id": 27,
            "text": "你成功通过了幻象的考验，来到了第六层。这里的妖气已经浓郁得化不开。",
            "choices": [
                {
                    "text": "鼓起勇气，继续前进",
                    "result": "你毫不畏惧，坚定地向前走。",
                    "nextPartIndex": 29
                },
                {
                    "text": "稍作休息，恢复状态",
                    "result": "你决定整理一下，准备迎接更大的挑战。",
                    "healthChange": 40,
                    "nextPartIndex": 29
                }
            ]
        },
        {
            "id": 28,
            "text": "你的坚持让你距离终点越来越近。第六层的挑战更加严峻。",
            "choices": [
                {
                    "text": "全力以赴，迎接挑战",
                    "result": "你做好了充分的准备。",
                    "nextPartIndex": 29
                },
                {
                    "text": "退缩，考虑退出塔外",
                    "result": "你犹豫不决，是否要继续前进。",
                    "nextPartIndex": 30
                }
            ]
        },
        {
            "id": 29,
            "text": "在第六层，你遇到了锁妖塔的守护者，他阻止你继续前进。",
            "choices": [
                {
                    "text": "与守护者战斗",
                    "result": "一场激烈的战斗之后，你成功击败了守护者。",
                    "reward": {
                        "cultivation": 300,
                        "equipment": "守护者之盾"
                    },
                    "nextPartIndex": 31
                },
                {
                    "text": "说服守护者放行",
                    "result": "你以理服人，守护者被你的诚意打动。",
                    "nextPartIndex": 31
                }
            ]
        },
        {
            "id": 30,
            "text": "你最终决定放弃挑战，离开了锁妖塔。",
            "choices": [
                {
                    "text": "退出锁妖塔",
                    "result": "你带着遗憾离开了这里。",
                    "nextPartIndex": null
                }
            ]
        },
        {
            "id": 31,
            "text": "你终于来到了第七层，也是最后一层。这里光芒耀眼，似乎藏着巨大的秘密。",
            "choices": [
                {
                    "text": "探索第七层的秘密",
                    "result": "你发现了一本上古秘籍。",
                    "reward": {
                        "item": ["上古秘典"],
                        "cultivation": 500
                    },
                    "nextPartIndex": 32
                },
                {
                    "text": "寻找锁妖塔的核心",
                    "result": "你发现了锁妖塔的力量源泉。",
                    "nextPartIndex": 33
                }
            ]
        },
        {
            "id": 32,
            "text": "通过阅读秘籍，你的实力得到了极大的提升。",
            "choices": [
                {
                    "text": "尝试突破境界",
                    "result": "你成功突破了自身的桎梏。",
                    "reward": {
                        "cultivation": 800,
                        "equipment": "上古之剑"
                    },
                    "nextPartIndex": null
                },
                {
                    "text": "继续探索其他秘密",
                    "result": "你对其他未知的领域充满了好奇。",
                    "nextPartIndex": 33
                }
            ]
        },
        {
            "id": 33,
            "text": "你发现锁妖塔的核心竟然是一颗被封印的魔珠。",
            "choices": [
                {
                    "text": "尝试解开封印",
                    "result": "你成功解除了封印，但魔珠的力量过于强大。",
                    "nextPartIndex": 34
                },
                {
                    "text": "将魔珠封印得更紧",
                    "result": "你加强了封印，防止魔珠的力量外泄。",
                    "reward": {
                        "cultivation": 600,
                        "equipment": "封印之符"
                    },
                    "nextPartIndex": null
                }
            ]
        },
        {
            "id": 34,
            "text": "魔珠的力量冲击着你的身体，你感到自己快要失去控制。",
            "choices": [
                {
                    "text": "抵抗魔珠的侵蚀",
                    "result": "你成功驾驭了魔珠的力量。",
                    "reward": {
                        "cultivation": 1000,
                        "equipment": "魔珠之力"
                    },
                    "nextPartIndex": null
                },
                {
                    "text": "放弃抵抗，被魔珠吞噬",
                    "result": "你被魔珠彻底控制，迷失了自我。",
                    "nextPartIndex": null
                }
            ]
        }
    ]
},

                2: {
                    "name": "太古仙境探秘",
                    "parts": [
                        {
                            "text": "你来到一座被云雾环绕的山峰前，传说这里隐藏着上古仙人的传承。一座巨大的石门矗立在你面前，石门上篆刻着“太古仙境”四个古老的篆字，散发着神秘的光芒。",
                            "choices": [
                                { "text": "推开石门，进入仙境", "result": "你鼓起勇气，推开石门，迈步进入太古仙境。", "nextPartIndex": 1 },
                                { "text": "观望一番，暂不进入", "result": "你决定谨慎行事，先在周围观察一番。", "nextPartIndex": 2 }
                            ]
                        },
                        {
                            "text": "你进入仙境，发现这里灵气浓郁，四周充满了生机。前方有三条小径，通往不同的方向，每条小径旁都立着一块石碑，上面刻着不同的文字。",
                            "choices": [
                                { "text": "选择左边刻有“试炼”字样的小径", "result": "你踏上了左边的小径，准备接受试炼。", "nextPartIndex": 3 },
                                { "text": "选择中间刻有“宝藏”字样的小径", "result": "你走向中间的小径，期待寻找宝藏。", "nextPartIndex": 10 },
                                { "text": "选择右边刻有“幻境”字样的小径", "result": "你步入右边的小径，进入未知的幻境。", "nextPartIndex": 17 }
                            ]
                        },
                        {
                            "text": "你走在试炼之路上，四周逐渐变得昏暗。一只巨大的石像鬼突然从天而降，挡在你的面前。",
                            "choices": [
                                { "text": "与石像鬼战斗", "result": "你拔出武器，准备迎战石像鬼。", "nextPartIndex": 4 },
                                { "text": "寻找躲避的机会", "result": "你试图寻找掩体，避开石像鬼的攻击。", "nextPartIndex": 6 }
                            ]
                        },
                        {
                            "text": "你与石像鬼展开激烈的战斗，双方势均力敌。战斗过程中，你发现石像鬼的背部有一处弱点。",
                            "choices": [
                                {
                                    "text": "攻击石像鬼的弱点",
                                    "result": "你瞄准石像鬼的弱点，成功将其击败！",
                                    "reward": {
                                        "cultivation": 500,
                                        "equipment": "稀有装备【石像鬼之翼】"
                                    },
                                    "nextPartIndex": 5
                                },
                                {
                                    "text": "继续正面攻击",
                                    "result": "你坚持正面进攻，但石像鬼力量强大，你受到了重创。",
                                    "healthChange": -30,
                                    "nextPartIndex": 6
                                }
                            ]
                        },
                        {
                            "text": "石像鬼倒下后，一道光芒指引着你继续前进。前方出现了一个岔路口。",
                            "choices": [
                                { "text": "选择通往山顶的小径", "result": "你沿着小径向山顶进发。", "nextPartIndex": 7 },
                                { "text": "选择通往山洞的小径", "result": "你决定进入山洞探险。", "nextPartIndex": 8 }
                            ]
                        },
                        {
                            "text": "你在躲避中不慎被石像鬼击中，受了伤。你发现一处隐蔽的小道，可以暂时躲避。",
                            "choices": [
                                { "text": "沿着小道撤退", "result": "你选择暂时撤退，保全自身。", "healthChange": -20, "nextPartIndex": 2 },
                                { "text": "鼓起勇气反击", "result": "你决定背水一战，向石像鬼发起反击。", "nextPartIndex": 4 }
                            ]
                        },
                        {
                            "text": "你攀爬到山顶，视野开阔。一位白发苍苍的老者出现在你面前，他似乎在等待着你。",
                            "choices": [
                                { "text": "向老者行礼", "result": "你恭敬地向老者行礼，老者微笑着点头。", "nextPartIndex": 9 },
                                { "text": "质问老者的身份", "result": "你提高警惕，询问老者是谁。", "nextPartIndex": 9 }
                            ]
                        },
                        {
                            "text": "你进入山洞，发现洞内光线昏暗，但隐约可见壁画和陈旧的器物。洞内深处传来奇异的声音。",
                            "choices": [
                                { "text": "深入山洞探索", "result": "你小心翼翼地深入山洞。", "nextPartIndex": 14 },
                                { "text": "返回出口，选择其他道路", "result": "你觉得此地危险，决定离开。", "nextPartIndex": 5 }
                            ]
                        },
                        {
                            "text": "老者看着你，缓缓说道：“年轻人，你通过了试炼，证明了你的勇气和实力。我这里有一份传承，愿意授予你。”",
                            "choices": [
                                {
                                    "text": "接受传承",
                                    "result": "你接受了老者的传承，修为大增！",
                                    "reward": {
                                        "cultivation": 1000,
                                        "skill": "获得技能【太古仙法】"
                                    },
                                    "nextPartIndex": 2
                                },
                                { "text": "婉拒传承", "result": "你谢绝了老者的好意，表示希望靠自己修炼。", "nextPartIndex": 2 }
                            ]
                        },
                        {
                            "text": "你走在通往宝藏的小径上，路旁开满了奇异的花朵，空气中弥漫着芬芳的气息。忽然，一阵迷雾升起，你感觉到有些眩晕。",
                            "choices": [
                                { "text": "继续前行，不受迷雾影响", "result": "你坚定信念，继续向前。", "nextPartIndex": 11 },
                                { "text": "停下来，暂时休息", "result": "你决定停下来，恢复精神。", "nextPartIndex": 12 }
                            ]
                        },
                        {
                            "text": "你深入迷雾，发现自己来到了一片花海中央。一个身穿白衣的女子出现在你面前，眼神中带着一丝哀伤。",
                            "choices": [
                                { "text": "上前询问女子", "result": "你关切地询问女子为何独自在此。", "nextPartIndex": 13 },
                                { "text": "警惕地后退，准备防御", "result": "你感到不对劲，做好了战斗准备。", "nextPartIndex": 15 }
                            ]
                        },
                        {
                            "text": "你坐下休息，渐渐感觉到困意袭来。不知不觉中，你进入了梦乡，梦中似乎有人在低语。",
                            "choices": [
                                { "text": "努力醒来", "result": "你竭力从睡梦中醒来，发现周围的迷雾已经消散。", "nextPartIndex": 11 },
                                { "text": "继续沉睡，聆听低语", "result": "你放松身心，仔细聆听那低语声。", "nextPartIndex": 16 }
                            ]
                        },
                        {
                            "text": "女子叹了口气：“我是被困在此地的魂魄，需要你的帮助才能解脱。”",
                            "choices": [
                                { "text": "答应帮助她", "result": "你决定帮助女子，解救她的魂魄。", "nextPartIndex": 18 },
                                { "text": "拒绝，觉得有诈", "result": "你觉得事情可疑，决定离开。", "nextPartIndex": 15 }
                            ]
                        },
                        {
                            "text": "你保持警惕，突然间，女子的身影变得模糊，化作一只妖魅扑向你！",
                            "choices": [
                                { "text": "立即还击", "result": "你迅速出手，将妖魅击退。", "nextPartIndex": 19 },
                                { "text": "转身逃跑", "result": "你选择逃离此地，但被妖魅追上，受了伤。", "healthChange": -20, "nextPartIndex": 19 }
                            ]
                        },
                        {
                            "text": "你在梦中得到了一段古老的口诀，醒来后，你发现自己的修为有所精进。",
                            "reward": { "cultivation": 500, "skill": "学会技能【梦境感悟】" },
                            "nextPartIndex": 11
                        },
                        {
                            "text": "你进入山洞深处，发现了一座祭坛，祭坛上放着一块闪烁着蓝色光芒的宝石。",
                            "choices": [
                                {
                                    "text": "拿起宝石",
                                    "result": "你伸手拿起宝石，感到一股力量涌入体内。",
                                    "reward": { "equipment": "法宝【蓝灵宝石】" },
                                    "nextPartIndex": 20
                                },
                                { "text": "不动宝石，继续观察", "result": "你决定谨慎行事，先观察周围。", "nextPartIndex": 21 }
                            ]
                        },
                        {
                            "text": "你击退了妖魅，迷雾渐渐散去。你发现地上有一枚古老的戒指。",
                            "reward": { "equipment": "装备【古戒】" },
                            "choices": [
                                {
                                    "text": "戴上戒指",
                                    "result": "你戴上戒指，感觉到力量提升。",
                                    "reward": { "cultivation": 300 },
                                    "nextPartIndex": 2
                                },
                                { "text": "收好戒指", "result": "你将戒指收好，准备日后研究。", "nextPartIndex": 2 }
                            ]
                        },
                        {
                            "text": "女子感谢你的帮助，她的魂魄逐渐消散，化作一缕清风。一束光芒落在你的手中，是一柄精致的短剑。",
                            "reward": { "equipment": "武器【魂影剑】" },
                            "nextPartIndex": 2
                        },
                        {
                            "text": "你继续在幻境中前行，发现这里的一切都似真似幻。突然，你的面前出现了过去的种种回忆。",
                            "choices": [
                                { "text": "沉浸于回忆中", "result": "你沉浸在回忆中，感到一阵温暖。", "nextPartIndex": 22 },
                                { "text": "挣脱幻觉，继续前进", "result": "你意识到这是幻觉，努力清醒过来。", "nextPartIndex": 23 }
                            ]
                        },
                        {
                            "text": "你从幻觉中醒来，发现自己已经走出了幻境。你的心境得到了提升。",
                            "reward": { "cultivation": 500 },
                            "nextPartIndex": 2
                        },
                        {
                            "text": "你拿起宝石，突然，整个山洞开始震动。一只巨大的石兽从祭坛后方出现，怒视着你。",
                            "choices": [
                                { "text": "与石兽战斗", "result": "你准备与石兽展开战斗。", "nextPartIndex": 24 },
                                { "text": "归还宝石，尝试平息石兽", "result": "你将宝石放回原处，希望石兽平静下来。", "nextPartIndex": 25 }
                            ]
                        },
                        {
                            "text": "你环顾四周，发现祭坛上刻着古老的文字，似乎是一种封印。",
                            "choices": [
                                { "text": "研究封印，解除封印", "result": "你仔细研究，试图解开封印。", "nextPartIndex": 26 },
                                { "text": "离开山洞，放弃宝石", "result": "你觉得此地凶险，决定离开。", "nextPartIndex": 5 }
                            ]
                        },
                        {
                            "text": "你沉浸在过去的回忆中，感到一阵温暖，但同时也失去了前进的动力。",
                            "healthChange": -10,
                            "choices": [
                                { "text": "努力醒来", "result": "你挣扎着从回忆中醒来。", "nextPartIndex": 23 },
                                { "text": "继续沉迷", "result": "你无法自拔，最终迷失在幻境中。", "healthChange": -999, "nextPartIndex": null }
                            ]
                        },
                        {
                            "text": "你清醒过来，发现自己站在一片广阔的草原上。前方有一条小溪，溪水清澈见底。",
                            "choices": [
                                { "text": "在溪边休息", "result": "你在溪边稍作休息，恢复了体力。", "healthChange": 20, "nextPartIndex": 2 },
                                { "text": "沿着溪流前进", "result": "你沿着溪流继续探索。", "nextPartIndex": 27 }
                            ]
                        },
                        {
                            "text": "你与石兽展开激烈的战斗，最终成功击败了它。石兽化作一股青烟消失，留下一块碎片。",
                            "reward": { "attack": 100 },
                            "nextPartIndex": 28
                        },
                        {
                            "text": "石兽见你归还宝石，慢慢平息下来，重新回到了祭坛后方。你感到一阵安心。",
                            "choices": [
                                { "text": "再次拿起宝石", "result": "你决定再次尝试拿起宝石。", "nextPartIndex": 20 },
                                { "text": "离开山洞", "result": "你觉得不宜多留，离开了山洞。", "nextPartIndex": 5 }
                            ]
                        },
                        {
                            "text": "你成功解开了封印，祭坛上出现了一本古老的书籍。",
                            "reward": { "item": "秘籍【古神之书】" },
                            "nextPartIndex": 2
                        },
                        {
                            "text": "你沿着溪流前进，发现了一座小木屋。木屋前坐着一位中年人，正在悠闲地喝茶。",
                            "choices": [
                                { "text": "上前与中年人交谈", "result": "你向中年人问好，展开交谈。", "nextPartIndex": 29 },
                                { "text": "悄悄绕过木屋，继续前进", "result": "你决定不打扰中年人，继续探险。", "nextPartIndex": 30 }
                            ]
                        },
                        {
                            "text": "你收集了碎片，发现它可以增强你的装备。",
                            "reward": { "attack": 100 },
                            "nextPartIndex": 2
                        },
                        {
                            "text": "中年人微笑着邀请你一起喝茶。他说：“此茶名为‘悟道茶’，可增长修为。”",
                            "choices": [
                                {
                                    "text": "接受邀请，品尝悟道茶",
                                    "result": "你喝下悟道茶，感觉到灵魂得到了洗礼。",
                                    "reward": { "cultivation": 800 },
                                    "nextPartIndex": 2
                                },
                                { "text": "婉拒邀请，询问他人身份", "result": "你礼貌地拒绝了茶水，询问他的身份。", "nextPartIndex": 31 }
                            ]
                        },
                        {
                            "text": "你绕过木屋，发现了一片药田，田里种植着许多珍贵的灵药。",
                            "choices": [
                                {
                                    "text": "采摘灵药",
                                    "result": "你小心地采摘了一些灵药。",
                                    "reward": { "item": ["百年人参 x2", "灵芝草 x3"] },
                                    "nextPartIndex": 2
                                },
                                { "text": "不动灵药，继续前进", "result": "你尊重他人财物，未动灵药，继续前进。", "nextPartIndex": 2 }
                            ]
                        },
                        {
                            "text": "中年人笑而不语，随后他起身说道：“你我有缘，我这里有一件礼物赠与你。”",
                            "reward": { "item": "特殊道具【神秘玉佩】" },
                            "nextPartIndex": 2
                        },
                        {
                            "text": "你完成了太古仙境的探索，获得了丰富的收获。你感到自己的实力有了显著的提升。现在，你可以选择离开仙境，或者继续探索。",
                            "choices": [
                                { "text": "离开仙境", "result": "你决定离开仙境，返回现实世界。", "nextPartIndex": 33 },
                                { "text": "继续探索", "result": "你觉得仙境中还有更多的秘密，决定继续探索。", "nextPartIndex": 1 }
                            ]
                        },
                        {
                            "text": "你走出太古仙境的石门，回头望去，石门已经消失。你知道，自己的修炼之路才刚刚开始。",
                            "reward": {
                                "cultivation": 2000,
                                "money": 500,
                                "item": "稀有道具【仙境之钥】"
                            },
                            "nextPartIndex": 0
                        }
                    ]
                }



            },
            storyParts: [],
            currentIndex: 0,
            currentReward: null,
            logs: []
        };
    },
    computed: {
        currentPart() {
            return this.storyParts[this.currentIndex];
        },
        currentDungeonName() {
            const dungeonId = this.$route.params.dungeonId;
            return this.dungeonsData[dungeonId] ? this.dungeonsData[dungeonId].name : '';
        },
        playerStats() {
            return {
                health: this.$store.player.health,
                cultivation: this.$store.player.cultivation,
                money: this.$store.player.props.money
            };
        }
    },
    mounted() {
        const dungeonId = this.$route.params.dungeonId;
        if (this.dungeonsData[dungeonId]) {
            this.storyParts = this.dungeonsData[dungeonId].parts;
            this.logs.push(`进入冒险：${this.dungeonsData[dungeonId].name}`);
        }
    },
    methods: {
   
        makeChoice(choice) {
            this.logs.push(`你选择了${choice.text}，${choice.result}`);

            // 处理奖励
            if (choice.reward) {
                if (choice.reward.money) {
                    this.$store.player.props.money += choice.reward.money;
                    this.currentReward = `灵石${choice.reward.money}`;
                }
                if (choice.reward.cultivation) {
                    this.$store.player.cultivation += choice.reward.cultivation;
                    this.currentReward = `修为 ${choice.reward.equipment}`;
                }
                if (choice.reward.attack) {
                    this.$store.player.attack += choice.reward.attack;
                    this.currentReward = `攻击 + ${choice.reward.attack}`;
                }

                if (choice.reward.equipment) {
                    this.currentReward = `${choice.reward.cultivation}`;
                    let xj = {
                        id: Date.now(), // 装备ID
                        name: "紫玄仙剑", //装备名字
                        type: "weapon", // 装备类型
                        lock: true,
                        level: 20, // 装备等级
                        score: 99999, // 装备评分
                        dodge: 0,// 闪避率
                        attack: 1000000,// 攻击力
                        health: 0,// 血量
                        defense: 0,// 防御
                        critical: 0,// 暴击率
                        // 初始数据
                        initial: {
                            dodge: 0,// 闪避率
                            attack: 0,// 攻击力
                            health: 0,// 血量
                            defense: 0,// 防御
                            critical: 1,// 暴击率
                        },
                        quality: "pink",
                        strengthen: 0 // 炼器等级
                    };
                    if (choice.reward.equipment.match(/仙剑/)) this.$store.player.inventory.push(xj);
                }
            }
            if (choice.healthChange) {
                this.$store.player.health += choice.healthChange;
            }
             // 检查nextPartIndex是否为null
    if (choice.nextPartIndex === null) {
        this.currentIndex = 0;
    } else {
        this.currentIndex = choice.nextPartIndex-1;
    }
          
            this.$nextTick(() => {
            const scrollbarRef = this.$refs.scrollbar?.wrapRef;
            if (scrollbarRef) {
                scrollbarRef.scrollTop = scrollbarRef.scrollHeight;
            }
        });
        }
    }
};
</script>

<style scoped>
.story-page {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background-color: var(--el-bg-color-light);
    border-radius: 10px;
    box-shadow: var(--el-box-shadow);
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.story-header {
    text-align: center;
    margin-bottom: 10px;
}

.story-title {
    font-size: 1.8em;
    font-weight: bold;
    color: var(--el-color-primary);
}

.story-content {
    margin-bottom: 20px;
}

.story-text {
    font-size: 1.2em;
    line-height: 1.5;
}

.choices {
    margin-top: 15px;
}

.choice-button {
    margin-right: 10px;
    margin-bottom: 10px;
}

.reward {
    text-align: center;
    padding: 10px;
    background-color: var(--el-color-success-light-9);
    border-radius: 6px;
}

.reward-text {
    font-weight: bold;
    color: var(--el-color-success);
}

.log-content {
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 4px;
    padding: 10px;
    background-color: var(--el-bg-color);
}

.log-text {
    font-size: 0.9em;
    color: var(--el-color-info);
}
</style>