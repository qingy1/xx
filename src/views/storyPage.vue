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
    </div>
</template>

<script>
export default {
    data() {
        return {
            dungeonsData: {
                1:
                {
                    "name": "紫玄秘境",
                    "parts": [
                        {
                            "text": "一天，你收到一份神秘的邀请函，传说中只有有缘人才能进入的紫玄秘境在今晚子时开启。秘境中有着无数珍稀的灵草、绝世的法宝，以及传说中的紫玄真仙的遗留传承。你决定踏上这次冒险之旅，提升修为，寻求突破的契机。",
                            "choices": [
                                {
                                    "text": "立即动身前往紫玄秘境入口",
                                    "result": "你带上行囊，朝着秘境入口赶去。",
                                    "nextPartIndex": 1
                                },
                                {
                                    "text": "准备充分的修炼资源再出发",
                                    "result": "你花费时间准备，但秘境的开启时间不等人。",
                                    "nextPartIndex": 2
                                }
                            ]
                        },
                        {
                            "text": "你顺利抵达紫玄秘境的入口，此时已聚集了不少修仙者。伴随着一道紫色光芒，入口缓缓打开。你深吸一口气，迈入其中。刚进入秘境，你便感受到浓郁的灵气与隐隐的威压。",
                            "choices": [
                                {
                                    "text": "跟随大部队前进",
                                    "result": "你选择与其他修仙者同行。",
                                    "nextPartIndex": 3
                                },
                                {
                                    "text": "独自一人探索",
                                    "result": "你决定避开人群，独自行动。",
                                    "nextPartIndex": 4
                                }
                            ]
                        },
                        {
                            "text": "由于你的犹豫与拖延，秘境入口已经关闭。你错过了这次机会，只能等待下一次开启。",
                            "choices": [
                                {
                                    "text": "返回宗门继续修炼",
                                    "result": "你回到宗门，努力修炼，期盼下次机会。",
                                    "nextPartIndex": null
                                }
                            ]
                        },
                        {
                            "text": "你与其他修仙者一路前行，忽然前方出现了一片灵草园，园中生长着各种珍稀的灵草。可就在此时，灵草园中出现了一只守护妖兽，凶猛异常。",
                            "choices": [
                                {
                                    "text": "与大家一起对抗妖兽",
                                    "result": "你们合力击败了妖兽，成功采摘灵草。",
                                    "reward": {
                                        "item": ["珍稀灵草 x3"],
                                        "cultivation": 50
                                    },
                                    "nextPartIndex": 5
                                },
                                {
                                    "text": "趁乱偷取灵草",
                                    "result": "你被其他修仙者发现，引起了公愤。",
                                    "healthChange": -20,
                                    "nextPartIndex": 6
                                }
                            ]
                        },
                        {
                            "text": "你独自一人漫步在秘境中，四周静谧而神秘。突然，你发现了一条分岔路：一条通向幽暗的森林，另一条通向明亮的山谷。",
                            "choices": [
                                {
                                    "text": "进入幽暗的森林",
                                    "result": "你走进森林，感到阴森恐怖。",
                                    "nextPartIndex": 7
                                },
                                {
                                    "text": "前往明亮的山谷",
                                    "result": "你来到山谷，发现了一条清澈的小溪。",
                                    "nextPartIndex": 8
                                }
                            ]
                        },
                        {
                            "text": "经过这次教训，你明白了修行道路上不能急功近利。你决定潜心修炼，提高自己的修为。",
                            "choices": [
                                {
                                    "text": "闭关修炼",
                                    "result": "你闭关多年，修为大进。",
                                    "reward": {
                                        "cultivation": 100
                                    },
                                    "nextPartIndex": null
                                }
                            ]
                        },
                        {
                            "text": "由于你的行为，其他修仙者对你充满敌意。一场战斗在所难免。",
                            "choices": [
                                {
                                    "text": "道歉并归还灵草",
                                    "result": "你的诚意打动了他们，危机解除。",
                                    "nextPartIndex": 5
                                },
                                {
                                    "text": "强硬对抗",
                                    "result": "你寡不敌众，被重伤。",
                                    "healthChange": -50,
                                    "nextPartIndex": 9
                                }
                            ]
                        },
                        {
                            "text": "在幽暗的森林中，你遇到了一只形态奇特的妖兽。它全身散发着黑气，眼中闪烁着红光。",
                            "choices": [
                                {
                                    "text": "试图与妖兽沟通",
                                    "result": "妖兽竟然能够口吐人言，与你交谈。",
                                    "nextPartIndex": 10
                                },
                                {
                                    "text": "拔剑攻击",
                                    "result": "妖兽被激怒，展开了猛烈的攻击。",
                                    "nextPartIndex": 11
                                }
                            ]
                        },
                        {
                            "text": "在山谷中，你发现了一块光滑的石头，上面刻着古老的符文。",
                            "choices": [
                                {
                                    "text": "尝试解读符文",
                                    "result": "你领悟了高级法术——火焰诀。",
                                    "reward": {
                                        "cultivation": 80,
                                        "item": ["火焰诀秘籍"]
                                    },
                                    "nextPartIndex": 12
                                },
                                {
                                    "text": "将石头带走",
                                    "result": "石头突然爆裂，你受到了冲击。",
                                    "healthChange": -10,
                                    "nextPartIndex": 13
                                }
                            ]
                        },
                        {
                            "text": "你身受重伤，无法继续冒险。你被迫退出秘境，回去疗伤。",
                            "choices": [
                                {
                                    "text": "退出秘境",
                                    "result": "你退出了秘境，错过了更多机缘。",
                                    "nextPartIndex": null
                                }
                            ]
                        },
                        {
                            "text": "妖兽告诉你，它被困在此地多年，希望你能帮助它解除封印。作为回报，它会赐予你一份珍贵的礼物。",
                            "choices": [
                                {
                                    "text": "答应帮助妖兽",
                                    "result": "你成功解除了封印，妖兽兑现了承诺。",
                                    "reward": {
                                        "item": ["妖兽内丹"],
                                        "equipment": "妖兽之戒",
                                        "cultivation": 100
                                    },
                                    "nextPartIndex": 14
                                },
                                {
                                    "text": "拒绝帮助，趁机离开",
                                    "result": "妖兽对你心生不满，但并未为难你。",
                                    "nextPartIndex": 15
                                }
                            ]
                        },
                        {
                            "text": "你与妖兽展开激烈的战斗，最终凭借实力击败了它。",
                            "choices": [
                                {
                                    "text": "获取妖兽的内丹",
                                    "result": "你获得了妖兽内丹。",
                                    "reward": {
                                        "item": ["妖兽内丹"],
                                        "cultivation": 50
                                    },
                                    "nextPartIndex": 16
                                },
                                {
                                    "text": "放过妖兽，继续前行",
                                    "result": "你展现了慈悲之心，妖兽感激地离开。",
                                    "nextPartIndex": 17
                                }
                            ]
                        },
                        {
                            "text": "你领悟了火焰诀，感到体内的灵力更加充盈。你决定继续探索。",
                            "choices": [
                                {
                                    "text": "前往秘境深处",
                                    "result": "你向着秘境深处迈进。",
                                    "nextPartIndex": 18
                                },
                                {
                                    "text": "返回入口",
                                    "result": "你决定见好就收，离开秘境。",
                                    "nextPartIndex": null
                                }
                            ]
                        },
                        {
                            "text": "石头的爆炸使你受伤。你决定离开山谷，寻找疗伤之物。",
                            "choices": [
                                {
                                    "text": "在附近寻找草药",
                                    "result": "你找到了一些草药，缓解了伤势。",
                                    "item": ["疗伤草药"],
                                    "nextPartIndex": 19
                                },
                                {
                                    "text": "继续前进，不理会伤势",
                                    "result": "伤势加重，行动困难。",
                                    "healthChange": -20,
                                    "nextPartIndex": 20
                                }
                            ]
                        },
                        {
                            "text": "妖兽内丹蕴含着巨大的能量，你的修为得到了提升。",
                            "choices": [
                                {
                                    "text": "继续探索秘境",
                                    "result": "你感觉自己实力大增，信心倍增。",
                                    "nextPartIndex": 21
                                },
                                {
                                    "text": "退出秘境",
                                    "result": "你满足于此次收获，决定离开。",
                                    "nextPartIndex": null
                                }
                            ]
                        },
                        {
                            "text": "你离开了森林，来到了一片湖泊边。湖水清澈见底，湖中心漂浮着一朵奇异的莲花。",
                            "choices": [
                                {
                                    "text": "尝试摘取莲花",
                                    "result": "湖中突然升起一道水龙，阻止了你。",
                                    "nextPartIndex": 22
                                },
                                {
                                    "text": "绕过湖泊，继续前行",
                                    "result": "你放弃了莲花，选择继续探险。",
                                    "nextPartIndex": 23
                                }
                            ]
                        },
                        {
                            "text": "你发现前方有一座巨大的祭坛，上面悬浮着一把闪耀着紫色光芒的仙剑。",
                            "choices": [
                                {
                                    "text": "上前取剑",
                                    "result": "祭坛触发了机关，你被困在了阵法中。",
                                    "nextPartIndex": 24
                                },
                                {
                                    "text": "观察祭坛周围",
                                    "result": "你发现了破解阵法的关键。",
                                    "nextPartIndex": 25
                                }
                            ]
                        },
                        {
                            "text": "你采集了草药，伤势得到缓解。",
                            "choices": [
                                {
                                    "text": "继续探索",
                                    "result": "你恢复了行动力，决定继续前进。",
                                    "nextPartIndex": 26
                                },
                                {
                                    "text": "返回入口",
                                    "result": "你决定保险起见，退出秘境。",
                                    "nextPartIndex": null
                                }
                            ]
                        },
                        {
                            "text": "伤势加重使你难以行动。突然，你遇到了一位神秘的老人。",
                            "choices": [
                                {
                                    "text": "请求帮助",
                                    "result": "老人治愈了你的伤势，并给予了指点。",
                                    "reward": {
                                        "cultivation": 100,
                                        "item": ["九转还魂丹"]
                                    },
                                    "nextPartIndex": 27
                                },
                                {
                                    "text": "避开老人",
                                    "result": "你错过了机缘，最终因伤势恶化退出秘境。",
                                    "nextPartIndex": null
                                }
                            ]
                        },
                        {
                            "text": "你感到周围的灵气越来越浓郁，前方似乎有一座宫殿的轮廓。",
                            "choices": [
                                {
                                    "text": "前往宫殿",
                                    "result": "你朝着宫殿走去，心中充满期待。",
                                    "nextPartIndex": 28
                                },
                                {
                                    "text": "警惕地观察四周",
                                    "result": "你保持警惕，避免了隐藏的陷阱。",
                                    "nextPartIndex": 29
                                }
                            ]
                        },
                        {
                            "text": "水龙告诉你，莲花是湖泊的命脉，不能被摘取。",
                            "choices": [
                                {
                                    "text": "表示理解，离开湖边",
                                    "result": "水龙对你的善意表示感谢，赠与你一滴水灵。",
                                    "reward": {
                                        "item": ["水灵珠"]
                                    },
                                    "nextPartIndex": 23
                                },
                                {
                                    "text": "执意摘取莲花",
                                    "result": "水龙大怒，与你战斗。",
                                    "nextPartIndex": 30
                                }
                            ]
                        },
                        {
                            "text": "你绕过湖泊，继续前行。前方出现了一只巨大的石头巨人，挡住了去路。",
                            "choices": [
                                {
                                    "text": "挑战巨人",
                                    "result": "一场激战之后，你击败了石头巨人。",
                                    "reward": {
                                        "equipment": "巨人之斧",
                                        "cultivation": 80
                                    },
                                    "nextPartIndex": 31
                                },
                                {
                                    "text": "寻找其他路径",
                                    "result": "你发现了一条隐秘的小路。",
                                    "nextPartIndex": 32
                                }
                            ]
                        },
                        {
                            "text": "你被困在阵法中，无法脱身。",
                            "choices": [
                                {
                                    "text": "尝试破解阵法",
                                    "result": "你集中精神，寻找破绽。",
                                    "nextPartIndex": 33
                                },
                                {
                                    "text": "呼救求援",
                                    "result": "无人回应，你只能自救。",
                                    "nextPartIndex": 34
                                }
                            ]
                        },
                        {
                            "text": "你发现了阵法的核心，成功关闭了陷阱，取下了仙剑。",
                            "choices": [
                                {
                                    "text": "挥剑试招",
                                    "result": "仙剑与心神相合，你的实力大增。",
                                    "reward": {
                                        "equipment": "紫玄仙剑",
                                        "cultivation": 150
                                    },
                                    "nextPartIndex": 35
                                },
                                {
                                    "text": "保存仙剑，继续探索",
                                    "result": "你小心翼翼地收好了仙剑。",
                                    "reward": {
                                        "equipment": "紫玄仙剑"
                                    },
                                    "nextPartIndex": 36
                                }
                            ]
                        },
                        {
                            "text": "老人告诉你，他是紫玄秘境的守护者。由于你的善良和坚持，他愿意传授你一门绝学。",
                            "choices": [
                                {
                                    "text": "拜师学艺",
                                    "result": "你跟随老人学习，修为大增。",
                                    "reward": {
                                        "cultivation": 200,
                                        "item": ["绝学——九转玄功"]
                                    },
                                    "nextPartIndex": null
                                },
                                {
                                    "text": "婉拒好意，继续前行",
                                    "result": "老人微微一笑，消失在原地。",
                                    "nextPartIndex": 26
                                }
                            ]
                        },
                        {
                            "text": "你谨慎地前往宫殿，发现宫殿内有许多珍宝。",
                            "choices": [
                                {
                                    "text": "搜索珍宝",
                                    "result": "你获得了大量的修炼资源。",
                                    "reward": {
                                        "money": 1000,
                                        "item": ["高级丹药 x5", "灵石 x100"]
                                    },
                                    "nextPartIndex": 37
                                },
                                {
                                    "text": "探索宫殿深处",
                                    "result": "你发现了隐藏的密室。",
                                    "nextPartIndex": 38
                                }
                            ]
                        },
                        {
                            "text": "你发现周围有多个隐藏的法阵。避开陷阱后，你发现了一本古老的秘籍。",
                            "choices": [
                                {
                                    "text": "阅读秘籍",
                                    "result": "你学会了高级心法——紫玄诀。",
                                    "reward": {
                                        "item": ["紫玄诀秘籍"],
                                        "cultivation": 150
                                    },
                                    "nextPartIndex": 39
                                },
                                {
                                    "text": "将秘籍收起",
                                    "result": "你决定以后再研究。",
                                    "item": ["古老的秘籍"],
                                    "nextPartIndex": 40
                                }
                            ]
                        },
                        {
                            "text": "你感受到仙剑的强大力量，决定继续探索更深处。",
                            "choices": [
                                {
                                    "text": "前往秘境核心区域",
                                    "result": "那里或许有着更大的秘密。",
                                    "nextPartIndex": 44
                                },
                                {
                                    "text": "返回入口",
                                    "result": "你决定离开秘境。",
                                    "nextPartIndex": null
                                }
                            ]
                        },
                        {
                            "text": "你收起仙剑，谨慎地离开祭坛。",
                            "choices": [
                                {
                                    "text": "探索周围",
                                    "result": "你发现了一个隐藏的洞穴。",
                                    "nextPartIndex": 45
                                },
                                {
                                    "text": "离开此地",
                                    "result": "你决定不再冒险，退出秘境。",
                                    "nextPartIndex": null
                                }
                            ]
                        },
                        {
                            "text": "你开始修炼紫玄诀，感受到体内灵力的巨大提升。",
                            "choices": [
                                {
                                    "text": "继续深入秘境",
                                    "result": "实力增强的你，决定挑战更大的机缘。",
                                    "nextPartIndex": 46
                                },
                                {
                                    "text": "退出秘境",
                                    "result": "你决定返回宗门，消化所得。",
                                    "nextPartIndex": null
                                }
                            ]
                        },
                        {
                            "text": "你将秘籍收起，准备以后慢慢研究。",
                            "choices": [
                                {
                                    "text": "离开此地",
                                    "result": "你离开了宫殿，继续探索。",
                                    "nextPartIndex": 47
                                },
                                {
                                    "text": "寻找其他宝物",
                                    "result": "你对其他宝物心存期待。",
                                    "nextPartIndex": 37
                                }
                            ]
                        },
                        {
                            "text": "洞穴内有一座古老的炼丹炉，炉火尚未熄灭。",
                            "choices": [
                                {
                                    "text": "检查炼丹炉",
                                    "result": "你找到了一炉刚炼制完成的丹药。",
                                    "reward": {
                                        "item": ["高阶丹药 x5"],
                                        "money": 500
                                    },
                                    "nextPartIndex": 48
                                },
                                {
                                    "text": "离开洞穴",
                                    "result": "你觉得此地不宜久留。",
                                    "nextPartIndex": 36
                                }
                            ]
                        },
                        {
                            "text": "你离开了宫殿，发现附近有一座古老的祭坛。",
                            "choices": [
                                {
                                    "text": "前往祭坛",
                                    "result": "祭坛上似乎有重要的东西。",
                                    "nextPartIndex": 24
                                },
                                {
                                    "text": "远离祭坛",
                                    "result": "你感觉那里充满危险，决定离开。",
                                    "nextPartIndex": 47
                                }
                            ]
                        },
                        {
                            "text": "你获得了大量的修炼资源，修为大增。",
                            "choices": [
                                {
                                    "text": "继续探索宫殿",
                                    "result": "宫殿中似乎还有更多秘密。",
                                    "nextPartIndex": 38
                                },
                                {
                                    "text": "离开宫殿",
                                    "result": "你决定离开，寻找其他机缘。",
                                    "nextPartIndex": 49
                                }
                            ]
                        },
                        {
                            "text": "密室中有一颗闪耀着紫光的珠子，周围布满了复杂的阵法。",
                            "choices": [
                                {
                                    "text": "尝试破解阵法",
                                    "result": "你成功获取了紫玄灵珠。",
                                    "reward": {
                                        "item": ["紫玄灵珠"],
                                        "cultivation": 200
                                    },
                                    "nextPartIndex": 50
                                },
                                {
                                    "text": "放弃珠子，离开密室",
                                    "result": "你觉得风险太大，选择了放弃。",
                                    "nextPartIndex": 40
                                }
                            ]
                        },
                        {
                            "text": "实力大增的你，来到了一条深不见底的峡谷。",
                            "choices": [
                                {
                                    "text": "跳入峡谷",
                                    "result": "你发现了隐藏的秘境。",
                                    "nextPartIndex": 51
                                },
                                {
                                    "text": "绕过峡谷",
                                    "result": "你继续前行，寻找其他机缘。",
                                    "nextPartIndex": 52
                                }
                            ]
                        },
                        {
                            "text": "你找到了一炉高阶丹药，感到喜出望外。",
                            "choices": [
                                {
                                    "text": "服用丹药",
                                    "result": "你的修为得到了提升。",
                                    "reward": {
                                        "cultivation": 150
                                    },
                                    "nextPartIndex": 53
                                },
                                {
                                    "text": "保存丹药",
                                    "result": "你决定以后再服用。",
                                    "item": ["高阶丹药 x5"],
                                    "nextPartIndex": 36
                                }
                            ]
                        },
                        {
                            "text": "你来到了一片花海，花香四溢，令人心旷神怡。",
                            "choices": [
                                {
                                    "text": "采摘灵花",
                                    "result": "你获得了稀有的灵花。",
                                    "reward": {
                                        "item": ["稀有灵花 x3"]
                                    },
                                    "nextPartIndex": 54
                                },
                                {
                                    "text": "继续前行",
                                    "result": "你欣赏了一番，继续冒险。",
                                    "nextPartIndex": 43
                                }
                            ]
                        },
                        {
                            "text": "你成功获得了紫玄灵珠，感受到无比强大的灵力。",
                            "choices": [
                                {
                                    "text": "吸收紫玄灵珠",
                                    "result": "你的修为突破了一个大境界。",
                                    "reward": {
                                        "cultivation": 250
                                    },
                                    "nextPartIndex": 55
                                },
                                {
                                    "text": "保存灵珠",
                                    "result": "你决定以后再吸收。",
                                    "item": ["紫玄灵珠"],
                                    "nextPartIndex": 40
                                }
                            ]
                        },
                        {
                            "text": "你继续深入秘境，发现了更多的宝物和机缘。",
                            "choices": [
                                {
                                    "text": "尝试突破境界",
                                    "result": "你冲击境界，成功晋升。",
                                    "reward": {
                                        "cultivation": 300,
                                        "equipment": "玄天宝甲"
                                    },
                                    "nextPartIndex": null
                                },
                                {
                                    "text": "稳固修为",
                                    "result": "你决定先巩固当前的实力。",
                                    "nextPartIndex": 40
                                }
                            ]
                        },
                        {
                            "text": "你继续前行，来到了一片沙漠，炎热难耐。",
                            "choices": [
                                {
                                    "text": "深入沙漠",
                                    "result": "你发现了一个绿洲。",
                                    "nextPartIndex": 56
                                },
                                {
                                    "text": "绕回原路",
                                    "result": "你选择不冒险，返回之前的路径。",
                                    "nextPartIndex": 52
                                }
                            ]
                        },
                        {
                            "text": "你发现前方有一座宏伟的宫殿，门口有两座栩栩如生的石狮子。",
                            "choices": [
                                {
                                    "text": "进入宫殿",
                                    "result": "你发现了更多的宝物和秘籍。",
                                    "nextPartIndex": 57
                                },
                                {
                                    "text": "观察石狮子",
                                    "result": "石狮子似乎蕴含着某种机关。",
                                    "nextPartIndex": 58
                                }
                            ]
                        },
                        {
                            "text": "你进入绿洲，发现了一棵结满灵果的树。",
                            "choices": [
                                {
                                    "text": "采摘灵果",
                                    "result": "你获得了珍贵的灵果。",
                                    "reward": {
                                        "item": ["灵果 x5"]
                                    },
                                    "nextPartIndex": 59
                                },
                                {
                                    "text": "休息一会儿",
                                    "result": "你恢复了体力和灵力。",
                                    "healthChange": 50,
                                    "nextPartIndex": 59
                                }
                            ]
                        },
                        {
                            "text": "你触动了石狮子的机关，被传送到了一个未知的区域。",
                            "choices": [
                                {
                                    "text": "探索未知区域",
                                    "result": "你发现了一个神秘的宝库。",
                                    "nextPartIndex": 60
                                },
                                {
                                    "text": "寻找回去的路",
                                    "result": "你迷失在了迷宫般的通道中。",
                                    "nextPartIndex": 61
                                }
                            ]
                        },
                        {
                            "text": "你在宝库中找到了传说中的神兵利器。",
                            "choices": [
                                {
                                    "text": "拿起神兵",
                                    "result": "你的实力得到极大提升。",
                                    "reward": {
                                        "equipment": "神兵——天穹之刃",
                                        "cultivation": 500
                                    },
                                    "nextPartIndex": null
                                },
                                {
                                    "text": "不动神兵",
                                    "result": "你感到此物非同小可，选择离开。",
                                    "nextPartIndex": 62
                                }
                            ]
                        },
                        {
                            "text": "你在迷宫中走了许久，终于找到了出口。",
                            "choices": [
                                {
                                    "text": "离开宫殿",
                                    "result": "你决定不再冒险，退出秘境。",
                                    "nextPartIndex": null
                                },
                                {
                                    "text": "继续探索",
                                    "result": "你对秘境的深处充满了好奇。",
                                    "nextPartIndex": 63
                                }
                            ]
                        },
                        {
                            "text": "你在沙漠中行走，突然遭遇了一群沙虫的袭击。",
                            "choices": [
                                {
                                    "text": "与沙虫战斗",
                                    "result": "你击败了沙虫，获取了沙虫的材料。",
                                    "reward": {
                                        "item": ["沙虫材料"],
                                        "cultivation": 70
                                    },
                                    "nextPartIndex": 64
                                },
                                {
                                    "text": "避开沙虫",
                                    "result": "你成功避开了危险，继续前行。",
                                    "nextPartIndex": 65
                                }
                            ]
                        },
                        {
                            "text": "你感到收获颇丰，决定结束此次秘境之行，返回宗门。",
                            "choices": [
                                {
                                    "text": "退出秘境",
                                    "result": "你带着满满的收获，回到了宗门。",
                                    "reward": {
                                        "cultivation": 50000,
                                        "money": 100000,
                                        "equipment": "紫玄仙剑"
                                    },
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
                            "nextPartIndex": null
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
                        dodge: 0.1,// 闪避率
                        attack: 20000,// 攻击力
                        health: 0,// 血量
                        defense: 20000,// 防御
                        critical: 0.5,// 暴击率
                        // 初始数据
                        initial: {
                            dodge: 0.1,// 闪避率
                            attack: 20000,// 攻击力
                            health: 0,// 血量
                            defense: 20000,// 防御
                            critical: 0.5,// 暴击率
                        },
                        quality: "pink",
                        strengthen: 10 // 炼器等级
                    };
                    if (choice.reward.equipment.match(/仙剑/)) this.$store.player.inventory.push(xj);
                }
            }
            if (choice.healthChange) {
                this.$store.player.health += choice.healthChange;
            }
            this.currentIndex = choice.nextPartIndex;
            this.$nextTick(() => {
                this.$refs.scrollbar.wrapRef.scrollTop = this.$refs.scrollbar.wrapRef.scrollHeight;
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