"use strict";

const BOARD_W = 1000;
const BOARD_H = 620;

const PATH_POINTS = [
  { x: 42, y: 110 },
  { x: 230, y: 110 },
  { x: 230, y: 210 },
  { x: 112, y: 210 },
  { x: 112, y: 332 },
  { x: 330, y: 332 },
  { x: 330, y: 494 },
  { x: 542, y: 494 },
  { x: 542, y: 180 },
  { x: 770, y: 180 },
  { x: 770, y: 392 },
  { x: 934, y: 392 },
  { x: 934, y: 548 }
];

function buildPathMetrics(points) {
  const segments = [];
  let totalLength = 0;

  for (let i = 1; i < points.length; i += 1) {
    const from = points[i - 1];
    const to = points[i];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    segments.push({
      from: from,
      to: to,
      dx: dx,
      dy: dy,
      length: length,
      start: totalLength,
      end: totalLength + length
    });

    totalLength += length;
  }

  return {
    segments: segments,
    totalLength: totalLength
  };
}

function createIdMap(list) {
  const map = new Map();

  list.forEach(function (item) {
    if (item && item.id != null) {
      map.set(item.id, item);
    }
  });

  return map;
}

const PLACEMENT_SLOTS = [
  { id: "s1", x: 80, y: 70, zone: "front" },
  { id: "s2", x: 168, y: 70, zone: "front" },
  { id: "s3", x: 292, y: 74, zone: "front" },
  { id: "s4", x: 308, y: 154, zone: "front" },
  { id: "s5", x: 184, y: 164, zone: "front" },
  { id: "s6", x: 72, y: 252, zone: "front" },
  { id: "s7", x: 190, y: 268, zone: "front" },
  { id: "s8", x: 78, y: 390, zone: "front" },
  { id: "s9", x: 212, y: 406, zone: "front" },
  { id: "s10", x: 300, y: 280, zone: "mid" },
  { id: "s11", x: 416, y: 282, zone: "mid" },
  { id: "s12", x: 430, y: 420, zone: "mid" },
  { id: "s13", x: 302, y: 560, zone: "mid" },
  { id: "s14", x: 454, y: 558, zone: "mid" },
  { id: "s15", x: 612, y: 556, zone: "mid" },
  { id: "s16", x: 614, y: 430, zone: "mid" },
  { id: "s17", x: 614, y: 308, zone: "mid" },
  { id: "s18", x: 500, y: 156, zone: "mid" },
  { id: "s19", x: 622, y: 132, zone: "mid" },
  { id: "s20", x: 730, y: 112, zone: "back" },
  { id: "s21", x: 854, y: 138, zone: "back" },
  { id: "s22", x: 854, y: 266, zone: "back" },
  { id: "s23", x: 720, y: 322, zone: "back" },
  { id: "s24", x: 832, y: 502, zone: "back" },
  { id: "s25", x: 730, y: 560, zone: "back" }
];

const RARITY_LABEL = {
  common: "コモン",
  rare: "レア",
  epic: "エピック",
  legendary: "レジェンド"
};

const SYNERGY_INFO = [
  { id: "studio", name: "スピーディーワード", description: "配信系レリックが2個以上。攻撃速度 +8%", bonusText: "攻撃速度 +8%" },
  { id: "dream", name: "スローホイップ", description: "夢系レリックが2個以上。スロウ中の敵に追加被ダメージ", bonusText: "スロウ中に被ダメージ +12%" },
  { id: "candy", name: "ボムタルト", description: "お菓子系レリックが2個以上。会心で追加爆発", bonusText: "クリティカルで追加爆発" }
];

function pack(enemyId, count, interval, start, family) {
  return {
    enemyId: enemyId,
    count: count,
    interval: interval,
    start: start || 0,
    family: family || "normal"
  };
}

const ABILITY_LABELS = {
  single: "単体",
  rapid: "連射",
  splash: "範囲",
  slow: "スロウ",
  heavy: "重撃",
  crit: "会心",
  burst: "連鎖",
  shield: "シールド",
  regen: "再生",
  fast: "高速",
  split: "分裂",
  summon: "召喚",
  jamPulse: "妨害",
  jamLine: "妨害",
  shieldDome: "防壁"
};

// Add new characters to this array to expand the character roster.
const characters = [
  {
    id: "rimu",
    name: "夢愛ド リム",
    description: "夢の余韻で敵を遅らせ、範囲内タワーにスロウ付与とダメージ強化を与える配信主。",
    spriteName: "sprite-rimu",
    cssClass: "char-rimu",
    iconKey: "rimu",
    imageUrl: "images/characters/rimu.png",
    cutinImageUrl: "images/characters/rimu2.png",
    stats: { damage: 16, range: 180, cooldown: 1.65, crit: 0.08, critMultiplier: 1.8, projectileSpeed: 340 },
    aura: { range: 220, buffs: { slowAdd: 0.18, damageBonus: 0.08 }, label: "夢心地" },
    skill: { id: "dream_curtain", name: "ドリームタイム！", description: "全敵に開幕ダメージを与え、8秒間35%スロウ。", chargesPerStage: 1 }
  },
  {
    id: "planner",
    name: "甘乃あもこ",
    description: "コメントを煽り、範囲内タワーの攻撃力を押し上げる。",
    spriteName: "sprite-planner",
    cssClass: "char-planner",
    iconKey: "planner",
    imageUrl: "images/characters/amoko.png",
    cutinImageUrl: "images/characters/amoko2.png",
    stats: { damage: 14, range: 100, cooldown: 1.78, crit: 0.05, critMultiplier: 1.7, projectileSpeed: 320 },
    aura: { range: 320, buffs: { damageBonus: 0.18 }, label: "甘いもの苦手" },
    skill: { id: "script_rewrite", name: "やりたい放題！", description: "8秒間、敵全体が受けるダメージを35%増加。", chargesPerStage: 1 }
  },
  {
    id: "hype",
    name: "ふぃなどん",
    description: "ウソ泣きをし、範囲内タワーの回転率を大きく高める。",
    spriteName: "sprite-hype",
    cssClass: "char-hype",
    iconKey: "hype",
    imageUrl: "images/characters/fina.png",
    cutinImageUrl: "images/characters/fina2.png",
    stats: { damage: 11, range: 80, cooldown: 1.52, crit: 0.06, critMultiplier: 1.7, projectileSpeed: 360 },
    aura: { range: 160, buffs: { speedBonus: 0.52 }, label: "左フックと右アッパー" },
    skill: { id: "encore_rush", name: "やっちゃえ！みんな！", description: "8秒間、タワー攻撃速度が大幅上昇。", chargesPerStage: 1 }
  },
  {
    id: "patissier",
    name: "白河よふね",
    description: "弱点を特定し、会心率を大きく上げる。",
    spriteName: "sprite-patissier",
    cssClass: "char-patissier",
    iconKey: "patissier",
    imageUrl: "images/characters/yohu.png",
    cutinImageUrl: "images/characters/yohu2.png",
    stats: { damage: 15, range: 240, cooldown: 1.72, crit: 0.08, critMultiplier: 1.85, projectileSpeed: 330 },
    aura: { range: 200, buffs: { rangeAdd: 28, critAdd: 0.10 }, label: "この広い島に" },
    skill: { id: "sugar_orchestra", name: "行くのよ！ユキちゃん！", description: "8秒間、タワー射程と範囲効果を強化。", chargesPerStage: 1 }
  },
  {
    id: "moderator",
    name: "花緑青アニス",
    description: "幻覚の霧でタワーの弾にスロウを付与し、攻撃速度をわずかに高める。",
    spriteName: "sprite-moderator",
    cssClass: "char-moderator",
    iconKey: "moderator",
    imageUrl: "images/characters/anise.png",
    cutinImageUrl: "images/characters/anise2.png",
    stats: { damage: 12, range: 140, cooldown: 1.84, crit: 0.05, critMultiplier: 1.7, projectileSpeed: 350 },
    aura: { range: 260, buffs: { slowAdd: 0.22, speedBonus: 0.06 }, label: "幻覚魔法" },
    skill: { id: "moderation_wall", name: "アブサンを飲め！", description: "敵全体の進行方向を一定時間逆転させる。", chargesPerStage: 1 }
  },
  {
    id: "clipmaster",
    name: "如月ヒガン",
    description: "こん棒で風を引き起こし、強烈な打点を生み出す。",
    spriteName: "sprite-clipmaster",
    cssClass: "char-clipmaster",
    iconKey: "clipmaster",
    imageUrl: "images/characters/higan.png",
    cutinImageUrl: "images/characters/higan2.png",
    stats: { damage: 18, range: 160, cooldown: 1.86, crit: 0.12, critMultiplier: 1.95, projectileSpeed: 360 },
    aura: { range: 180, buffs: { critAdd: 0.18, critDamageBonus: 0.72 }, label: "血肉湧き踊る" },
    skill: { id: "viral_splice", name: "鬼の金棒！", description: "画面内の敵すべてに大ダメージを与える刹那のスキル。", chargesPerStage: 1 }
  }
];

const towers = [
  { id: "mic_tower", name: "コメント弾幕砲", description: "標準的な単体火力。配信を司る主砲。", spriteName: "tower-mic", cssClass: "tower-mic", iconKey: "mic_tower", imageUrl: "images/towers/tower01.png", stats: { damage: 24, range: 134, cooldown: 0.92, crit: 0.12, critMultiplier: 1.8, projectileSpeed: 470 }, abilities: ["single"] },
  { id: "mixer_tower", name: "ポロロッカマシンガン", description: "高速で小粒の弾を連射。攻速バフと好相性。", spriteName: "tower-mixer", cssClass: "tower-mixer", iconKey: "mixer_tower", imageUrl: "images/towers/tower02.png", stats: { damage: 12, range: 118, cooldown: 0.38, crit: 0.06, critMultiplier: 1.65, projectileSpeed: 420 }, abilities: ["rapid"] },
  { id: "comment_cannon", name: "コマクヤブリー", description: "広めの爆発でまとめて吹き飛ばす範囲砲台。", spriteName: "tower-comment", cssClass: "tower-comment", iconKey: "comment_cannon", imageUrl: "images/towers/tower03.png", stats: { damage: 38, range: 148, cooldown: 1.46, crit: 0.09, critMultiplier: 1.85, projectileSpeed: 330, splash: 46 }, abilities: ["splash"] },
  { id: "candy_shooter", name: "キャンディシューター", description: "軽い減速付きの連射塔。序盤から終盤まで便利。", spriteName: "tower-candy", cssClass: "tower-candy", iconKey: "candy_shooter", imageUrl: "images/towers/tower04.png", stats: { damage: 9, range: 112, cooldown: 0.28, crit: 0.04, critMultiplier: 1.6, projectileSpeed: 450, slow: 0.08 }, abilities: ["rapid", "slow"] },
  { id: "macaron_launcher", name: "マカロンランチャー", description: "重い一撃と大きな爆発。高難度での突破力担当。", spriteName: "tower-macaron", cssClass: "tower-macaron", iconKey: "macaron_launcher", imageUrl: "images/towers/tower05.png", stats: { damage: 60, range: 162, cooldown: 2.08, crit: 0.16, critMultiplier: 2.1, projectileSpeed: 290, splash: 64, heavy: true }, abilities: ["heavy", "splash"] },
  { id: "signal_prism", name: "パフェフレークイヤダー", description: "高い会心率と範囲爆発を持つ上級塔。クリティカルを軸に火力を出す。", spriteName: "tower-prism", cssClass: "tower-prism", iconKey: "signal_prism", imageUrl: "images/towers/tower06.png", stats: { damage: 22, range: 144, cooldown: 0.74, crit: 0.18, critMultiplier: 1.95, projectileSpeed: 410, splash: 24 }, abilities: ["crit", "burst"] }
];

const relics = [
  { id: "holy_comments", name: "神コメントログ", description: "全タワー攻撃力 +10%。", spriteName: "relic-comments", cssClass: "relic-comments", iconKey: "comment", imageUrl: "images/relic/relic01.png", rarity: "common", tags: ["studio"], modifiers: { towerDamageBonus: 0.1 } },
  { id: "buzz_clip", name: "アーカイブコメント", description: "全タワー攻撃速度 +14%。", spriteName: "relic-clip", cssClass: "relic-clip", iconKey: "clip", imageUrl: "images/relic/relic02.png", rarity: "rare", tags: ["studio"], modifiers: { towerSpeedBonus: 0.14 } },
  { id: "sugar_zoom", name: "ブレベミルク", description: "全タワー射程 +10%。", spriteName: "relic-zoom", cssClass: "relic-zoom", iconKey: "zoom", imageUrl: "images/relic/relic03.png", rarity: "common", tags: ["candy"], modifiers: { towerRangeBonus: 0.1 } },
  { id: "syrup_dream", name: "夢シロップ", description: "スロウ効果がさらに強くなる。", spriteName: "relic-syrup", cssClass: "relic-syrup", iconKey: "dream", imageUrl: "images/relic/relic04.png", rarity: "rare", tags: ["dream"], modifiers: { slowPowerBonus: 0.25 } },
  { id: "backstage_coffee", name: "1日2回ストリーム", description: "各自キャラスキルの使用回数 +1。", spriteName: "relic-coffee", cssClass: "relic-coffee", iconKey: "coffee", imageUrl: "images/relic/relic05.png", rarity: "legendary", tags: ["studio"], modifiers: { skillChargeBonus: 1 } },
  { id: "overload_fader", name: "ロングストリーム", description: "攻撃力 +30% だが射程 -10%。", spriteName: "relic-fader", cssClass: "relic-fader", iconKey: "overload", imageUrl: "images/relic/relic06.png", rarity: "epic", tags: ["studio"], modifiers: { towerDamageBonus: 0.3, towerRangeBonus: -0.1 } },
  { id: "superchat_rain", name: "レインボースパチャ", description: "連鎖撃破に応じて追加火力が伸びる。", spriteName: "relic-rain", cssClass: "relic-rain", iconKey: "rain", imageUrl: "images/relic/relic07.png", rarity: "rare", tags: ["candy"], modifiers: { chainBonusPerKill: 0.03, chainWindowBonus: 0.8 } },
  { id: "archive_sugar", name: "不意な一人称オレ", description: "全タワー会心率 +8%。", spriteName: "relic-archive", cssClass: "relic-archive", iconKey: "archive", imageUrl: "images/relic/relic08.png", rarity: "common", tags: ["candy"], modifiers: { towerCritBonus: 0.08 } },
  { id: "midnight_mixer", name: "神リプライ", description: "自キャラ攻撃力 +18%、タワー攻撃力 +8%。", spriteName: "relic-midnight", cssClass: "relic-midnight", iconKey: "mixer", imageUrl: "images/relic/relic09.png", rarity: "epic", tags: ["dream"], modifiers: { towerDamageBonus: 0.08, characterDamageBonus: 0.18 } },
  { id: "prop_rack", name: "ゲストはこちら", description: "次回以降の報酬候補数 +1。", spriteName: "relic-rack", cssClass: "relic-rack", iconKey: "rack", imageUrl: "images/relic/relic10.png", rarity: "rare", tags: ["studio"], modifiers: { rewardBonusChoices: 1 } },
  { id: "dream_loop", name: "フォエバードリーム", description: "スロウ中の敵に毎秒追加ダメージ。", spriteName: "relic-loop", cssClass: "relic-loop", iconKey: "loop", imageUrl: "images/relic/relic11.png", rarity: "epic", tags: ["dream"], modifiers: { slowDot: 5 } },
  { id: "sugar_battery", name: "爆発落ちなんてサイテー！", description: "爆発半径が拡大し、範囲塔の制圧力が伸びる。", spriteName: "relic-battery", cssClass: "relic-battery", iconKey: "battery", imageUrl: "images/relic/relic12.png", rarity: "rare", tags: ["candy"], modifiers: { splashBonus: 16 } },
{ 
  id: "clipstorm",
  name: "コラボ配信！",
  description: "強力な全体攻撃スキル『ドリームアタック！』を解禁。",
  spriteName: "relic-trend",
  cssClass: "relic-trend",
  iconKey: "trend",
  imageUrl: "images/relic/dreamattack01.png",
  cutinImageUrl: "images/relic/dreamattack02.png",
  rarity: "legendary",
  tags: ["studio"],
  modifiers: {
    activeSkill: {
      id: "sparkrain",
      name: "ドリームアタック！",
      description: "みんなで敵をタコ殴り。全敵に大ダメージ。",
      chargesPerStage: 1,
      imageUrl: "dreamattack02.png"
    }
  }
}
];

const enemies = [
  { id: "gummy_runner", name: "グミナッツ", spriteName: "enemy-gummy", iconKey: "enemy-speed", imageUrl: "images/enemy/enemy01.png", stats: { hp: 58, speed: 86, shield: 0, threat: 0.9 }, roleIcon: "»", roleText: "速い敵", abilities: [] },
  { id: "chat_blob", name: "キャンディースパイシー", spriteName: "enemy-blob", iconKey: "enemy-blob", imageUrl: "images/enemy/enemy02.png", stats: { hp: 86, speed: 68, shield: 0, threat: 1 }, roleIcon: "◌", roleText: "通常敵", abilities: [] },
  { id: "wafer_guard", name: "ワッフルソフト", spriteName: "enemy-wafer", iconKey: "enemy-shield", imageUrl: "images/enemy/enemy03.png", stats: { hp: 162, speed: 54, shield: 52, threat: 1.3 }, roleIcon: "▣", roleText: "硬い敵", abilities: ["shield"] },
  { id: "noise_imp", name: "ワイファイヨワイ", spriteName: "enemy-noise", iconKey: "enemy-noise", imageUrl: "images/enemy/enemy04.png", stats: { hp: 96, speed: 70, shield: 0, threat: 1.2 }, roleIcon: "≈", roleText: "妨害敵", abilities: ["jamPulse"] },
  { id: "pop_meringue", name: "メレンゲシットリ", spriteName: "enemy-pop", iconKey: "enemy-speed", imageUrl: "images/enemy/enemy05.png", stats: { hp: 52, speed: 104, shield: 0, threat: 1.05 }, roleIcon: "»", roleText: "速い敵", abilities: [] }
];

const eliteEnemies = [
  { id: "marsh_guard", name: "マシュマロナイト", spriteName: "elite-marsh", iconKey: "enemy-shield", imageUrl: "images/enemy/enemy06.png", stats: { hp: 260, speed: 72, shield: 120, threat: 2.1 }, roleIcon: "▣", roleText: "シールド", abilities: ["shield"], elite: true },
  { id: "regen_puff", name: "シュガープリースト", spriteName: "elite-regen", iconKey: "enemy-regen", imageUrl: "images/enemy/enemy07.png", stats: { hp: 232, speed: 74, shield: 0, threat: 2 }, roleIcon: "+", roleText: "再生", abilities: ["regen"], elite: true },
  { id: "rush_cycler", name: "ウォーターワタアメ", spriteName: "elite-rush", iconKey: "enemy-speed", imageUrl: "images/enemy/enemy08.png", stats: { hp: 180, speed: 122, shield: 0, threat: 2.15 }, roleIcon: "»", roleText: "高速", abilities: ["fast"], elite: true },
  { id: "split_toffee", name: "カットアップアイス", spriteName: "elite-split", iconKey: "enemy-split", imageUrl: "images/enemy/enemy09.png", stats: { hp: 214, speed: 78, shield: 0, threat: 2.05 }, roleIcon: "◎", roleText: "分裂", abilities: ["split"], elite: true },
  { id: "static_moth", name: "ウイスキーヨイ", spriteName: "elite-static", iconKey: "enemy-noise", imageUrl: "images/enemy/enemy10.png", stats: { hp: 246, speed: 82, shield: 0, threat: 2.3 }, roleIcon: "≈", roleText: "妨害", abilities: ["jamPulse"], elite: true }
];

const bosses = [
  { id: "archive_drake", name: "バズ喰いアーカイブ・ドラゴン", spriteName: "boss-archive", iconKey: "boss", imageUrl: "images/enemy/enemy11.png", stats: { hp: 3400, speed: 48, shield: 180, threat: 6 }, roleIcon: "◎", roleText: "ボス", abilities: ["summon", "jamLine", "shieldDome"], phaseAt: 0.55 }
];

// Add new stages to this array to expand stage flow and progression.
const stages = [
  { id: "stage1", name: "配信準備室", flavor: "SNSのアカウント作ったり、初配信の準備をしたり大変だよね", themeClass: "stage-theme-stage1", enemyScale: { hp: 0.72, speed: 0.84 }, playerBoost: { towerDamageBonus: 0.28, towerSpeedBonus: 0.14, characterDamageBonus: 0.22 }, intermission: 4.8, introDelay: 5, waves: [ { label: "Warmup", packs: [pack("gummy_runner", 6, 0.92, 0), pack("chat_blob", 3, 1.25, 2.8)] }, { label: "Sweet Check", packs: [pack("gummy_runner", 8, 0.76, 0), pack("wafer_guard", 2, 1.8, 2.4)] }, { label: "Comment Flow", packs: [pack("pop_meringue", 8, 0.64, 0), pack("noise_imp", 2, 1.9, 2.8), pack("wafer_guard", 2, 2.2, 6.1)] } ] },
  { id: "stage2", name: "初配信", flavor: "緊張と楽しさのマカロナージュ！でも大丈夫誰か来てくれる！", themeClass: "stage-theme-stage2", enemyScale: { hp: 0.88, speed: 0.94 }, playerBoost: { towerDamageBonus: 0.14, towerSpeedBonus: 0.08, characterDamageBonus: 0.1 }, intermission: 4.4, introDelay: 5, waves: [ { label: "Crunch Roll", packs: [pack("gummy_runner", 8, 0.72, 0), pack("wafer_guard", 3, 1.4, 2.8)] }, { label: "Muted Feed", packs: [pack("noise_imp", 4, 1.15, 0), pack("chat_blob", 8, 0.82, 1.2)] }, { label: "Sugar Relay", packs: [pack("pop_meringue", 12, 0.5, 0), pack("wafer_guard", 4, 1.35, 3.4), pack("gummy_runner", 6, 0.68, 5)] } ] },
  { id: "stage3", name: "コラボ配信！", flavor: "友達ができた！好きな世界をさあ楽しむぞ！", themeClass: "stage-theme-stage3", enemyScale: { hp: 1.18, speed: 1.08 }, intermission: 3.8, introDelay: 6, waves: [ { label: "Clip Hook", packs: [pack("gummy_runner", 12, 0.58, 0), pack("marsh_guard", 1, 0, 2.8, "elite"), pack("chat_blob", 12, 0.66, 3.4)] }, { label: "Backfeed", packs: [pack("noise_imp", 10, 0.8, 0), pack("regen_puff", 2, 0.2, 1.8, "elite"), pack("pop_meringue", 14, 0.42, 4.4)] }, { label: "Turn Point", packs: [pack("wafer_guard", 8, 1.04, 0), pack("rush_cycler", 2, 1.3, 1.6, "elite"), pack("split_toffee", 1, 0, 6.8, "elite")] } ] },
  { id: "stage4", name: "マカロンシリーズ開始", flavor: "軌道に乗ってどんどんリスナーも友達も増えてく！", themeClass: "stage-theme-stage4", enemyScale: { hp: 1.3, speed: 1.12 }, intermission: 3.4, introDelay: 6, waves: [ { label: "Spiral Talk", packs: [pack("marsh_guard", 2, 1.2, 0, "elite"), pack("pop_meringue", 20, 0.4, 1.8), pack("noise_imp", 10, 0.74, 4.8)] }, { label: "Relay Furnace", packs: [pack("split_toffee", 2, 1.4, 0.8, "elite"), pack("wafer_guard", 10, 0.84, 0), pack("gummy_runner", 14, 0.52, 3.2)] }, { label: "Audience Pressure", packs: [pack("regen_puff", 2, 1.2, 1.6, "elite"), pack("static_moth", 1, 0, 4.4, "elite"), pack("pop_meringue", 16, 0.4, 0), pack("chat_blob", 12, 0.66, 2.2)] } ] },
  { id: "stage5", name: "スーパーチャットタイム", flavor: "やりたいことをやってお金も入ってくる！夢！？", themeClass: "stage-theme-stage5", enemyScale: { hp: 1.46, speed: 1.16 }, intermission: 3.1, introDelay: 6, waves: [ { label: "Furnace Kick", packs: [pack("rush_cycler", 3, 1.2, 0, "elite"), pack("noise_imp", 12, 0.66, 1.4), pack("split_toffee", 2, 1.4, 5.4, "elite"), pack("wafer_guard", 12, 0.88, 0)] }, { label: "Boiling Feed", packs: [pack("marsh_guard", 2, 1.6, 0.6, "elite"), pack("regen_puff", 2, 1.4, 2.2, "elite"), pack("pop_meringue", 20, 0.34, 0), pack("noise_imp", 10, 0.56, 3.8), pack("chat_blob", 15, 0.48, 4.8)] }, { label: "Last Heat", packs: [pack("split_toffee", 2, 1.5, 0, "elite"), pack("static_moth", 2, 1.4, 2.8, "elite"), pack("rush_cycler", 3, 1.1, 4.8, "elite"), pack("wafer_guard", 10, 0.78, 1.4), pack("pop_meringue", 14, 0.34, 0)] } ] },
  { id: "stage6", name: "これからもずっと", flavor: "日々怠惰との戦い！それでもみんなと未来へ！", themeClass: "stage-theme-stage6", enemyScale: { hp: 1.6, speed: 1.2 }, intermission: 2.8, introDelay: 6, waves: [ { label: "Archive Edge", packs: [pack("marsh_guard", 2, 1.2, 0, "elite"), pack("rush_cycler", 2, 1.2, 2.4, "elite"), pack("split_toffee", 2, 1.4, 5.6, "elite"), pack("noise_imp", 12, 0.54, 0)] }, { label: "System Collapse", packs: [pack("regen_puff", 2, 1.4, 0.8, "elite"), pack("static_moth", 2, 1.4, 3.6, "elite"), pack("pop_meringue", 24, 0.3, 0), pack("wafer_guard", 12, 0.74, 2.2)] }, { label: "Last Upload", packs: [pack("marsh_guard", 2, 1.5, 0.4, "elite"), pack("rush_cycler", 2, 1.2, 2.2, "elite"), pack("split_toffee", 1, 0, 4.4, "elite"), pack("pop_meringue", 18, 0.32, 0), pack("noise_imp", 12, 0.48, 2.6)] }, { label: "Boss Finale", packs: [pack("archive_drake", 1, 0, 0, "boss"), pack("noise_imp", 6, 0.8, 8.6), pack("gummy_runner", 10, 0.42, 16)] } ] }
];

const audioState = {
  ctx: null,
  master: null,
  musicBus: null,
  sfxBus: null,
  bgmGain: null,
  specialBgmGain: null,
  started: false,
  specialUntil: 0,
  specialPulseTimer: 0,
  unlocked: false,
  specialOscillators: [],
  specialGain: null,
  lastShotAt: 0
};

function ensureAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioState.ctx) {
    const ctx = new AudioContextClass();
    const master = ctx.createGain();
    const musicBus = ctx.createGain();
    const sfxBus = ctx.createGain();
    const bgmGain = ctx.createGain();
    const specialBgmGain = ctx.createGain();

    master.gain.value = 0.82;
    musicBus.gain.value = 1;
    sfxBus.gain.value = 0.9;
    bgmGain.gain.value = 0.18;
    specialBgmGain.gain.value = 0.0001;

    bgmGain.connect(musicBus);
    specialBgmGain.connect(musicBus);
    musicBus.connect(master);
    sfxBus.connect(master);
    master.connect(ctx.destination);

    audioState.ctx = ctx;
    audioState.master = master;
    audioState.musicBus = musicBus;
    audioState.sfxBus = sfxBus;
    audioState.bgmGain = bgmGain;
    audioState.specialBgmGain = specialBgmGain;
  }

  if (audioState.ctx.state === "suspended") {
    audioState.ctx.resume();
  }
  if (!audioState.started) {
  audioState.started = true;
}
  audioState.unlocked = true;
  return audioState.ctx;
}

function ensureAudio() {
  if (!audioState.ctx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return null;
    }

    const ctx = new AudioContextClass();
    const master = ctx.createGain();
    const music = ctx.createGain();
    const sfx = ctx.createGain();
    const bgmGain = ctx.createGain();
    const specialBgmGain = ctx.createGain();

    master.gain.value = 0.8;
    music.gain.value = 0.9;
    sfx.gain.value = 0.95;
    bgmGain.gain.value = 0.18;
    specialBgmGain.gain.value = 0;

    bgmGain.connect(music);
    specialBgmGain.connect(music);
    music.connect(master);
    sfx.connect(master);
    master.connect(ctx.destination);

    audioState.ctx = ctx;
    audioState.master = master;
    audioState.music = music;
    audioState.sfx = sfx;
    audioState.bgmGain = bgmGain;
    audioState.specialBgmGain = specialBgmGain;
  }

  if (audioState.ctx.state === "suspended") {
    audioState.ctx.resume();
  }

  if (!audioState.started) {
    audioState.started = true;
    startMainBgm();
    startSpecialBgmLayer();
  }

  return audioState.ctx;
}

function createOsc(type, frequency, gainValue, destination, when, attack, release, duration) {
  const ctx = audioState.ctx;
  if (!ctx || !destination) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, when);
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, gainValue), when + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + Math.max(attack + 0.01, duration - release));
  osc.connect(gain);
  gain.connect(destination);
  osc.start(when);
  osc.stop(when + duration);
}

function createNoiseBurst(destination, when, duration, highpassFreq, gainValue) {
  const ctx = audioState.ctx;
  if (!ctx || !destination || !duration || duration <= 0) return;
  const buffer = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * duration)), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filter.type = "highpass";
  filter.frequency.value = highpassFreq || 1000;
  gain.gain.setValueAtTime(gainValue || 0.02, when);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(when);
  source.stop(when + duration);
}

function playPlacementSe() {
  const ctx = ensureAudio();
  if (!ctx) return;
  const when = ctx.currentTime;

  createOsc("triangle", 440, 0.08, audioState.sfxBus, when, 0.005, 0.08, 0.12);
  createOsc("triangle", 660, 0.05, audioState.sfxBus, when + 0.03, 0.005, 0.08, 0.1);
  createNoiseBurst(audioState.sfxBus, when, 0.035, 1800, 0.02);
}

function playShotSe(unit, stats) {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const when = ctx.currentTime;
  const isHeavy = !!stats.heavy;
  const isRapid = stats.cooldown < 0.5;
  const base = isHeavy ? 170 : isRapid ? 520 : 340;
  createOsc(isHeavy ? "sawtooth" : "square", base, isHeavy ? 0.045 : 0.03, audioState.sfxBus, when, 0.003, 0.06, isHeavy ? 0.14 : 0.08);
  createOsc("triangle", base * 1.5, 0.02, audioState.sfxBus, when + 0.01, 0.002, 0.05, 0.06);
}


function playEnemyDownSe(enemy) {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const when = ctx.currentTime;
  if (enemy && enemy.isBoss) {
    createOsc("sawtooth", 180, 0.09, audioState.sfxBus, when, 0.01, 0.35, 0.5);
    createOsc("triangle", 120, 0.1, audioState.sfxBus, when + 0.04, 0.01, 0.45, 0.65);
    createNoiseBurst(audioState.sfxBus, when, 0.18, 240, 0.05);
    return;
  }
  if (enemy && enemy.family === "elite") {
    createOsc("square", 240, 0.06, audioState.sfxBus, when, 0.005, 0.18, 0.24);
    createOsc("triangle", 180, 0.05, audioState.sfxBus, when + 0.02, 0.005, 0.16, 0.22);
    return;
  }
  createOsc("triangle", 330, 0.04, audioState.sfxBus, when, 0.003, 0.1, 0.12);
  createOsc("triangle", 247, 0.03, audioState.sfxBus, when + 0.03, 0.003, 0.12, 0.14);
}

function playSkillSe() {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const when = ctx.currentTime;
  createOsc("triangle", 1047, 0.12, audioState.sfxBus, when, 0.001, 0.04, 0.06);
  createOsc("sine", 1319, 0.08, audioState.sfxBus, when + 0.03, 0.001, 0.04, 0.05);
}

function playStageClearSe() {
  const ctx = ensureAudio();
  if (!ctx) return;
  const when = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];

  notes.forEach(function (note, index) {
    createOsc("triangle", note, 0.06, audioState.sfxBus, when + index * 0.08, 0.005, 0.18, 0.26);
  });
}

function playRewardSelectSe() {
  const ctx = ensureAudio();
  if (!ctx) return;
  const when = ctx.currentTime;

  createOsc("triangle", 660, 0.04, audioState.sfxBus, when, 0.004, 0.08, 0.1);
  createOsc("triangle", 880, 0.03, audioState.sfxBus, when + 0.04, 0.004, 0.08, 0.12);
}

function playGameOverSe() {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const when = ctx.currentTime;
  createOsc("sawtooth", 220, 0.06, audioState.sfxBus, when, 0.01, 0.3, 0.34);
  createOsc("triangle", 196, 0.06, audioState.sfxBus, when + 0.16, 0.01, 0.36, 0.42);
  createOsc("triangle", 146.83, 0.05, audioState.sfxBus, when + 0.34, 0.01, 0.48, 0.56);
}

function playWaveStartSe() {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const when = ctx.currentTime;

  createOsc("square", 392, 0.05, audioState.sfxBus, when, 0.003, 0.07, 0.08);
  createOsc("square", 523.25, 0.045, audioState.sfxBus, when + 0.07, 0.003, 0.08, 0.1);
  createOsc("triangle", 783.99, 0.04, audioState.sfxBus, when + 0.15, 0.003, 0.12, 0.16);
}

function playCountdownSe(value) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const when = ctx.currentTime;
  const freq = value <= 1 ? 880 : value === 2 ? 740 : 620;

  createOsc("square", freq, value <= 1 ? 0.05 : 0.035, audioState.sfxBus, when, 0.002, 0.05, 0.06);
}

function startMainBgm() {
  const ctx = audioState.ctx;
  const notes = [220, 261.63, 329.63, 392, 329.63, 261.63];
  const bass = [110, 110, 130.81, 146.83];
  const leadInterval = 0.5;
  const bassInterval = 1.0;

  function scheduleLead() {
    const now = ctx.currentTime;
    notes.forEach(function (note, index) {
      const when = now + index * leadInterval;
      createOsc("triangle", note, 0.018, audioState.bgmGain, when, 0.02, 0.16, 0.34);
      createOsc("sine", note * 2, 0.006, audioState.bgmGain, when, 0.02, 0.12, 0.22);
    });
  }

  function scheduleBass() {
    const now = ctx.currentTime;
    bass.forEach(function (note, index) {
      const when = now + index * bassInterval;
      createOsc("sine", note, 0.02, audioState.bgmGain, when, 0.02, 0.24, 0.7);
    });
  }

  scheduleLead();
  scheduleBass();
  window.setInterval(scheduleLead, notes.length * leadInterval * 1000);
  window.setInterval(scheduleBass, bass.length * bassInterval * 1000);
}

function startMusicLayer() {
  const ctx = ensureAudioContext();
  if (!ctx || !audioState.bgmGain) return;

  const notes = [261.63, 329.63, 392.0, 329.63];
  const interval = 0.42;

  function pulse() {
    const now = ctx.currentTime;

    notes.forEach(function (note, index) {
      const when = now + index * interval;
      createOsc("triangle", note, 0.018, audioState.bgmGain, when, 0.02, 0.16, 0.34);
      createOsc("sine", note * 2, 0.006, audioState.bgmGain, when, 0.02, 0.12, 0.22);
    });
  }

  pulse();
  window.setInterval(pulse, 1600);
}

function startSpecialBgmLayer() {
  const ctx = ensureAudioContext();
  if (!ctx || !audioState.specialBgmGain) return;
  const notes = [523.25, 659.25, 783.99, 659.25];
  const interval = 0.25;

  function pulse() {
    const now = ctx.currentTime;

    if (state && state.now < audioState.specialUntil) {
      audioState.specialBgmGain.gain.cancelScheduledValues(now);
      audioState.specialBgmGain.gain.setTargetAtTime(0.16, now, 0.08);

      notes.forEach(function (note, index) {
        const when = now + index * interval;
        createOsc("sawtooth", note, 0.012, audioState.specialBgmGain, when, 0.01, 0.12, 0.18);
      });
    } else {
      audioState.specialBgmGain.gain.cancelScheduledValues(now);
      audioState.specialBgmGain.gain.setTargetAtTime(0.0001, now, 0.12);
    }
  }

  audioState.specialPulseTimer = window.setInterval(pulse, 700);
}

function triggerSpecialBgm(duration) {
  const ctx = ensureAudio();
  if (!ctx) return;
  audioState.specialUntil = Math.max(audioState.specialUntil, state.now + duration);
}

const refs = {
  appShell: document.getElementById("appShell"),
  boardFrame: document.getElementById("boardFrame"),
  stageTicker: document.getElementById("stageTicker"),
  waveTicker: document.getElementById("waveTicker"),
  dangerTicker: document.getElementById("dangerTicker"),
  relicBar: document.getElementById("relicBar"),
  characterReserve: document.getElementById("characterReserve"),
  towerReserve: document.getElementById("towerReserve"),
  stageName: document.getElementById("stageName"),
  stageFlavor: document.getElementById("stageFlavor"),
  countdownDisplay: document.getElementById("countdownDisplay"),
  selectionTitle: document.getElementById("selectionTitle"),
  selectionReadout: document.getElementById("selectionReadout"),
  selectionTags: document.getElementById("selectionTags"),
  selectionStats: document.getElementById("selectionStats"),
  battleStartButton: document.getElementById("battleStartButton"),
  speedToggleButton: document.getElementById("speedToggleButton"),
  pauseToggleButton: document.getElementById("pauseToggleButton"),
  boardInner: document.getElementById("boardInner"),
  routePath: document.getElementById("routePath"),
  routePathShadow: document.getElementById("routePathShadow"),
  slotLayer: document.getElementById("slotLayer"),
  rangeLayer: document.getElementById("rangeLayer"),
  unitLayer: document.getElementById("unitLayer"),
  projectileLayer: document.getElementById("projectileLayer"),
  enemyLayer: document.getElementById("enemyLayer"),
  warningLayer: document.getElementById("warningLayer"),
  effectLayer: document.getElementById("effectLayer"),
  cutinLayer: document.getElementById("cutinLayer"),
  stageBanner: document.getElementById("stageBanner"),
  chainBanner: document.getElementById("chainBanner"),
  metricStage: document.getElementById("metricStage"),
  metricWave: document.getElementById("metricWave"),
  metricRemaining: document.getElementById("metricRemaining"),
  metricElite: document.getElementById("metricElite"),
  metricBoss: document.getElementById("metricBoss"),
  metricDeploy: document.getElementById("metricDeploy"),
  pressureLabel: document.getElementById("pressureLabel"),
  pressureFill: document.getElementById("pressureFill"),
  synergyFeed: document.getElementById("synergyFeed") || document.createElement("div"),
  skillBar: document.getElementById("skillBar"),
  startOverlay: document.getElementById("startOverlay"),
  startCharacterLane: document.getElementById("startCharacterLane"),
  startTowerLane: document.getElementById("startTowerLane"),
  startSummary: document.getElementById("startSummary"),
  startRunButton: document.getElementById("startRunButton"),
  rewardOverlay: document.getElementById("rewardOverlay"),
  rewardRelicLane: document.getElementById("rewardRelicLane"),
  rewardCharacterLane: document.getElementById("rewardCharacterLane"),
  rewardTowerLane: document.getElementById("rewardTowerLane"),
  rewardSummary: document.getElementById("rewardSummary"),
  confirmRewardButton: document.getElementById("confirmRewardButton"),
  coinBurst: document.getElementById("coinBurst"),
  endOverlay: document.getElementById("endOverlay"),
  endKicker: document.getElementById("endKicker"),
  endTitle: document.getElementById("endTitle"),
  endMessage: document.getElementById("endMessage"),
  endStageStat: document.getElementById("endStageStat"),
  endRelicList: document.getElementById("endRelicList"),
  endCharacterList: document.getElementById("endCharacterList"),
  endTowerList: document.getElementById("endTowerList"),
  restartButton: document.getElementById("restartButton"),
  tooltip: document.getElementById("tooltip")
};

const pathMetrics = buildPathMetrics(PATH_POINTS);
const pathDistances = [420, 760, 1140, 1480];
const jamLineYs = [176, 332, 494];

const characterMap = createIdMap(characters);
const towerMap = createIdMap(towers);
const relicMap = createIdMap(relics);
const normalEnemyMap = createIdMap(enemies);
const eliteEnemyMap = createIdMap(eliteEnemies);
const bossMap = createIdMap(bosses);

let slotElements = {};
let state = createInitialState();

init();

function createInitialState() {
  return {
    lastFrame: performance.now(),
    now: 0,
    status: "start",
    stageIndex: 0,
    phase: "idle",
    introTimer: 0,
    intermissionTimer: 0,
    waveElapsed: 0,
    lastCountdownValue: null,
    currentWaveIndex: -1,
    selectedStart: { characterId: null, towerId: null },
    selectedPlacement: null,
    collection: { characterIds: [], towerStocks: {}, relicIds: [] },
    stageHistory: [],
    units: [],
    enemies: [],
    projectiles: [],
    warnings: [],
    currentWaveSpawns: [],
    enemySerial: 0,
    unitSerial: 0,
    placedOrder: 0,
    hoverRange: null,
    inspectTarget: null,
    rewardState: null,
    skillCharges: {},
    gameSpeed: 1,
    paused: false,
    globalBuffs: { scriptRewriteUntil: 0, encoreRushUntil: 0, sugarOrchestraUntil: 0, jamShieldUntil: 0, reverseUntil: 0, globalSlowUntil: 0, globalSlowAmount: 0 },
    chainState: { count: 0, lastKillTime: 0 },
    shakePower: 0,
    boardLayout: { scale: 1, offsetX: 0, offsetY: 0, shakeX: 0, shakeY: 0 }
  };
}

function init() {
  // 画像プリロード
  const preloadImages = [];
  [...characters, ...towers, ...relics].forEach(function(def) {
    if (def.imageUrl && def.imageUrl !== "") {
      const img = new Image();
      img.src = def.imageUrl;
      preloadImages.push(img);
    }
    if (def.cutinImageUrl && def.cutinImageUrl !== "") {
      const img = new Image();
      img.src = def.cutinImageUrl;
      preloadImages.push(img);
    }
  });

  bindStaticEvents();
  initAudioUnlock();

  renderRoute();
  renderSlots();
  renderStartSelection();
  renderSynergyFeed();
  renderRelics();
  renderReserves();
  renderSkills();
  renderSelectionPanel();
  updatePlaybackControls();
  updateHud();

  window.addEventListener("resize", fitBoardToFrame);
  window.requestAnimationFrame(gameLoop);

  setTimeout(function() {
    fitBoardToFrame();
    setTimeout(fitBoardToFrame, 200);
  }, 100);
}

function bindStaticEvents() {
  refs.startRunButton.addEventListener("click", startRun);
  refs.battleStartButton.addEventListener("click", beginBattleFromDeploy);
  refs.confirmRewardButton.addEventListener("click", confirmRewardSelections);
  refs.restartButton.addEventListener("click", restartRun);
  if (refs.speedToggleButton) {
    refs.speedToggleButton.addEventListener("click", cycleGameSpeed);
  }
  if (refs.pauseToggleButton) {
    refs.pauseToggleButton.addEventListener("click", togglePause);
  }
  refs.boardInner.addEventListener("mouseleave", function () {
    if (!state.selectedPlacement) {
      state.hoverRange = null;
      renderRange();
    }
    hideTooltip();
  });
  window.addEventListener("blur", hideTooltip);
}

function renderRoute() {
  const pathData = PATH_POINTS.map(function (point, index) {
    return (index === 0 ? "M" : "L") + " " + point.x + " " + point.y;
  }).join(" ");
  refs.routePath.setAttribute("d", pathData);
  refs.routePathShadow.setAttribute("d", pathData);
}

function renderSlots() {
  refs.slotLayer.innerHTML = "";
  slotElements = {};
  PLACEMENT_SLOTS.forEach(function (slot) {
    const element = document.createElement("button");
    element.className = "board-slot " + slot.zone;
    element.type = "button";
    element.dataset.zone = slot.zone.toUpperCase().slice(0, 1);
    positionElement(element, slot.x, slot.y);
    element.addEventListener("click", function () { onSlotClick(slot.id); });
    element.addEventListener("mouseenter", function () { onSlotHover(slot.id); });
    element.addEventListener("mousemove", function (event) { moveTooltip(event); });
    element.addEventListener("mouseleave", function () { onSlotLeave(); });
    refs.slotLayer.appendChild(element);
    slotElements[slot.id] = element;
  });
  refreshSlotStates();
}

function renderStartSelection() {
  renderSelectionLane(refs.startCharacterLane, ["rimu", "planner", "hype"], "character", state.selectedStart.characterId, handleStartCharacterChoice);
  renderSelectionLane(refs.startTowerLane, ["mic_tower", "comment_cannon", "candy_shooter"], "tower", state.selectedStart.towerId, handleStartTowerChoice, true);
  updateStartSummary();
}

function renderSelectionLane(container, ids, type, selectedId, onSelect, starterTower) {
  container.innerHTML = "";
  ids.forEach(function (id) {
    const def = type === "character" ? characterMap.get(id) : towerMap.get(id);
    const strip = createSelectorStrip(def, type, selectedId === id, starterTower ? "x2" : "");
    strip.addEventListener("click", function () {
      onSelect(id);
    });
    bindTooltip(strip, type === "character" ? buildCharacterTooltip(def) : buildTowerTooltip(def));
    container.appendChild(strip);
  });
}

function handleStartCharacterChoice(id) {
  state.selectedStart.characterId = id;
  renderStartSelection();
}

function handleStartTowerChoice(id) {
  state.selectedStart.towerId = id;
  renderStartSelection();
}

function updateStartSummary() {
  const selectedCharacterLabel = state.selectedStart.characterId ? characterMap.get(state.selectedStart.characterId).name : "未選択";
  const selectedTowerLabel = state.selectedStart.towerId ? towerMap.get(state.selectedStart.towerId).name + " x2" : "未選択";
  refs.startSummary.textContent = "自キャラ: " + selectedCharacterLabel + " / タワー: " + selectedTowerLabel;
  refs.startRunButton.disabled = !(state.selectedStart.characterId && state.selectedStart.towerId);
}

function startRun() {
  ensureAudioContext();
  if (!audioState.started) {
    startMainBgm();
    startSpecialBgmLayer();
    audioState.started = true;
  }

  if (!state.selectedStart.characterId || !state.selectedStart.towerId) {
    return;
  }

  const selectedCharacter = state.selectedStart.characterId;
  const selectedTower = state.selectedStart.towerId;
  state = createInitialState();
  state.selectedStart.characterId = selectedCharacter;
  state.selectedStart.towerId = selectedTower;
  state.collection.characterIds = [selectedCharacter];
  state.collection.towerStocks[selectedTower] = 2;
  refs.startOverlay.classList.remove("overlay-visible");
  refs.startOverlay.classList.add("overlay-hidden");
  prepareStage(0);
}

function prepareStage(stageIndex) {
  const stage = stages[stageIndex];
  const carriedUnits = state.units.slice();
  state.status = "deploy";
  state.stageIndex = stageIndex;
  state.phase = "deploy";
  state.introTimer = 0;
  state.intermissionTimer = 0;
  state.waveElapsed = 0;
  state.currentWaveIndex = -1;
  state.currentWaveSpawns = [];
  state.enemies = [];
  state.projectiles = [];
  state.warnings = [];
  state.units = carriedUnits;
  state.enemySerial = 0;
  state.selectedPlacement = null;
  state.hoverRange = null;
  state.inspectTarget = null;
  state.rewardState = null;
  state.shakePower = 0;
  state.paused = false;
  state.gameSpeed = 1;
  state.chainState = { count: 0, lastKillTime: 0 };
  state.globalBuffs = { scriptRewriteUntil: 0, encoreRushUntil: 0, sugarOrchestraUntil: 0, jamShieldUntil: 0, reverseUntil: 0, globalSlowUntil: 0, globalSlowAmount: 0 };
  state.units.forEach(function (unit) {
    unit.cooldownLeft = randomRange(0.08, 0.26);
    unit.disabledUntil = 0;
    unit.disruptUntil = 0;
  });
  resetSkillCharges();
  refs.appShell.className = "app-shell " + stage.themeClass;
  refs.stageName.textContent = stage.name;
  refs.stageFlavor.textContent = stage.flavor;
  refs.enemyLayer.innerHTML = "";
  refs.projectileLayer.innerHTML = "";
  refs.warningLayer.innerHTML = "";
  refs.effectLayer.innerHTML = "";
  refs.cutinLayer.innerHTML = "";
  refs.countdownDisplay.textContent = "配置待機中";
  fitBoardToFrame();
  renderRelics();
  renderReserves();
  autoSelectNextPlacement();
  syncSelectionPanelWithCurrentPlacement();
  renderSkills();
  refreshSlotStates();
  renderRange();
  updatePlaybackControls();
  updateBattleStartButton();
  updateHud();
  showStageBanner("Stage " + String(stageIndex + 1) + "  " + stage.name, stage.flavor);
}

function beginBattleFromDeploy() {
  const stage = stages[state.stageIndex];
  if (state.status !== "deploy" || !stage || !hasPlacedStarterLoadout()) return;

  state.status = "battle";
  state.phase = "intro";
  state.paused = false;
  state.introTimer = Math.min(3, stage.introDelay || 3);
  state.lastCountdownValue = null;
  refs.countdownDisplay.textContent = String(Math.ceil(state.introTimer));
  refs.selectionReadout.textContent = state.selectedPlacement
    ? ((state.selectedPlacement.kind === "character" ? characterMap.get(state.selectedPlacement.id).name : towerMap.get(state.selectedPlacement.id).name) + " を選択中。必要なら残りユニットもそのまま配置できます。")
    : "開演カウント中。必要なら残りユニットもそのまま配置できます。";
  updateBattleStartButton();
  updatePlaybackControls();
  updateHud();
  syncSelectionPanelWithCurrentPlacement("戦闘中も残りユニットを追加配置できます。");
  renderSkills();
  showStageBanner("BATTLE START", "配信を開始");
}

function resetSkillCharges() {
  const profile = getRelicProfile();
  state.skillCharges = {};
  state.collection.characterIds.forEach(function (characterId) {
    const def = characterMap.get(characterId);
    state.skillCharges[characterId] = def.skill.chargesPerStage + profile.skillChargeBonus;
  });
  profile.activeSkills.forEach(function (skill) {
    state.skillCharges[skill.id] = skill.chargesPerStage;
  });
}

function renderReserves() {
  refs.characterReserve.innerHTML = "";
  state.collection.characterIds.slice().sort(function (a, b) {
    const aPlaced = findPlacedCharacter(a) ? 1 : 0;
    const bPlaced = findPlacedCharacter(b) ? 1 : 0;
    if (aPlaced !== bPlaced) {
      return aPlaced - bPlaced;
    }
    return characterMap.get(a).name.localeCompare(characterMap.get(b).name, "ja");
  }).forEach(function (characterId) {
    const def = characterMap.get(characterId);
    const placed = !!findPlacedCharacter(characterId);
    const selected = state.selectedPlacement && state.selectedPlacement.kind === "character" && state.selectedPlacement.id === characterId;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "reserve-button " + (placed ? "depleted" : "available") + (selected ? " selected" : "");
    button.innerHTML = createReserveInner(def);
    if (!placed) {
      button.addEventListener("click", function () {
        selectPlacement("character", characterId);
      });
    }
    bindTooltip(button, buildCharacterTooltip(def));
    refs.characterReserve.appendChild(button);
  });

  refs.towerReserve.innerHTML = "";
  Object.keys(state.collection.towerStocks).sort(function (a, b) {
    const remainingDiff = getRemainingTowerCount(b) - getRemainingTowerCount(a);
    if (remainingDiff !== 0) {
      return remainingDiff;
    }
    return towerMap.get(a).name.localeCompare(towerMap.get(b).name, "ja");
  }).forEach(function (towerId) {
    const def = towerMap.get(towerId);
    const remaining = getRemainingTowerCount(towerId);
    const selected = state.selectedPlacement && state.selectedPlacement.kind === "tower" && state.selectedPlacement.id === towerId;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "reserve-button " + (remaining > 0 ? "available" : "depleted") + (selected ? " selected" : "");
    button.innerHTML = createReserveInner(def);
    if (remaining > 0) {
      button.addEventListener("click", function () {
        selectPlacement("tower", towerId);
      });
    }
    bindTooltip(button, buildTowerTooltip(def));
    refs.towerReserve.appendChild(button);
  });

  updateBattleStartButton();
}

function createReserveInner(def) {
  return [
    '<span class="reserve-icon">', iconImg(def), "</span>",
    '<span class="reserve-name">', def.name, "</span>"
  ].join("");
}

function renderSkills() {
  refs.skillBar.innerHTML = "";
  const relicProfile = getRelicProfile();

  state.collection.characterIds.forEach(function (characterId) {
    const def = characterMap.get(characterId);
    const charges = state.skillCharges[characterId] || 0;
    const placed = !!findPlacedCharacter(characterId);
    const ready = charges > 0 && placed && state.status === "battle";
    const button = document.createElement("button");

    button.type = "button";
    button.className =
      "skill-button" +
      (ready ? " ready" : "") +
      (charges <= 0 ? " used" : (!placed ? " disabled" : ""));

    button.innerHTML = [
      '<span class="skill-icon">', iconImg(def), "</span>",
      '<span class="skill-name">', def.skill.name, "</span>",
      '<span class="charges">', placed ? ("残り " + String(charges)) : "未配置", "</span>"
    ].join("");

    if (ready) {
      button.addEventListener("click", function () {
        useCharacterSkill(characterId);
      });
    }

    bindTooltip(button, buildSkillTooltip(def));
    refs.skillBar.appendChild(button);
  });

  relicProfile.activeSkills.forEach(function (activeSkill) {
    const charges = state.skillCharges[activeSkill.id] || 0;
    const ready = charges > 0 && state.status === "battle";
    const button = document.createElement("button");

    button.type = "button";
    button.className =
      "skill-button" +
      (ready ? " ready" : "") +
      (charges <= 0 ? " used" : "");

    const relicDefForSkill = Array.from(relicMap.values()).find(function (r) {
      return r.modifiers && r.modifiers.activeSkill && r.modifiers.activeSkill.id === activeSkill.id;
    });

    const skillIconHtml =
      relicDefForSkill && relicDefForSkill.imageUrl && relicDefForSkill.imageUrl !== ""
        ? '<img src="' + relicDefForSkill.imageUrl + '" style="width:100%;height:100%;object-fit:cover;" alt="">'
        : iconSvg("trend");

    button.innerHTML = [
      '<span class="skill-icon">', skillIconHtml, "</span>",
      '<span class="skill-name">', activeSkill.name, "</span>",
      '<span class="charges">残り ', String(charges), "</span>",
      '<span class="skill-meta"><span class="meta-chip">レリック技</span><span class="meta-chip">全体攻撃</span></span>'
    ].join("");

    if (ready) {
      button.addEventListener("click", function () {
        useRelicSkill(activeSkill.id);
      });
    }

    bindTooltip(button, activeSkill.description);
    refs.skillBar.appendChild(button);
  });
}

function renderRelics() {
  refs.relicBar.innerHTML = "";
  const relicProfile = getRelicProfile();

  state.collection.relicIds.forEach(function (relicId) {
    const def = relicMap.get(relicId);
    const active = relicProfile.activeSynergyIds.indexOf(def.tags[0]) >= 0;
    const element = document.createElement("div");

    element.className = "relic-entry " + def.rarity + (active ? " synergy-lit" : "");
    element.innerHTML = '<span class="relic-icon">' + iconImg(def) + "</span>";

    bindTooltip(element, buildRelicTooltip(def, active));
    refs.relicBar.appendChild(element);
  });
}

function renderSynergyFeed() {
  if (!refs.synergyFeed) return;
  const relicProfile = getRelicProfile();
  refs.synergyFeed.innerHTML = "";
  SYNERGY_INFO.forEach(function (synergy) {
    const chip = document.createElement("div");
    chip.className = "synergy-chip" + (relicProfile.activeSynergyIds.indexOf(synergy.id) >= 0 ? " active" : "");
    chip.innerHTML = "<strong>" + synergy.name + "</strong><br>" + synergy.bonusText;
    refs.synergyFeed.appendChild(chip);
  });
}

function refreshSlotStates() {
  PLACEMENT_SLOTS.forEach(function (slot) {
    const element = slotElements[slot.id];
    const occupied = !!findUnitBySlot(slot.id);
    element.className = "board-slot " + slot.zone + (occupied ? " occupied" : "") + (!occupied && state.selectedPlacement && canPlaceSelectedOnSlot() ? " placeable" : "");
  });
}

function selectPlacement(kind, id) {
  if (!canManagePlacements()) {
    return;
  }

  if (state.selectedPlacement && state.selectedPlacement.kind === kind && state.selectedPlacement.id === id) {
    state.selectedPlacement = null;
    state.hoverRange = null;
    refs.selectionReadout.textContent = "配置選択を解除しました。";
  } else {
    state.selectedPlacement = { kind: kind, id: id };
    const def = kind === "character" ? characterMap.get(id) : towerMap.get(id);
    refs.selectionReadout.textContent = def.name + " を選択中。盤面の空きマスをクリックしてください。";
  }
  if (!state.selectedPlacement) {
    renderSelectionPanel("配置選択を解除しました。");
  } else {
    inspectPlacement(kind, id, "盤面の空きマスをクリックして配置してください。");
  }
  renderReserves();
  refreshSlotStates();
  renderRange();
}

function onSlotClick(slotId) {
  if (!state.selectedPlacement || !canManagePlacements()) {
    return;
  }

  if (findUnitBySlot(slotId)) {
    const unit = findUnitBySlot(slotId);
    showRangePreview(unit.x, unit.y, getCombatStats(unit).range);
    inspectUnit(unit, "配置済みユニットの詳細です。");
    return;
  }

  if (state.selectedPlacement.kind === "character" && findPlacedCharacter(state.selectedPlacement.id)) {
    return;
  }

  if (state.selectedPlacement.kind === "tower" && getRemainingTowerCount(state.selectedPlacement.id) <= 0) {
    return;
  }

  const slot = getSlot(slotId);
  const def = state.selectedPlacement.kind === "character" ? characterMap.get(state.selectedPlacement.id) : towerMap.get(state.selectedPlacement.id);
  const unit = {
    id: "unit-" + String(++state.unitSerial),
    kind: state.selectedPlacement.kind,
    defId: def.id,
    slotId: slotId,
    x: slot.x,
    y: slot.y,
    placedAt: ++state.placedOrder,
    cooldownLeft: randomRange(0.08, 0.42),
    disabledUntil: 0,
    disruptUntil: 0
  };
  unit.element = createUnitElement(unit);
  state.units.push(unit);
  playPlacementSe();
  refs.unitLayer.appendChild(unit.element);
  state.selectedPlacement = null;
  autoSelectNextPlacement(def.name + " を配置しました。");
  syncSelectionPanelWithCurrentPlacement(def.name + " を配置しました。");
  renderSkills();
  showRangePreview(unit.x, unit.y, getCombatStats(unit).range);
}

function onSlotHover(slotId) {
  if (!state.selectedPlacement || findUnitBySlot(slotId)) {
    return;
  }
  const slot = getSlot(slotId);
  const def = state.selectedPlacement.kind === "character" ? characterMap.get(state.selectedPlacement.id) : towerMap.get(state.selectedPlacement.id);
  const tempUnit = { kind: state.selectedPlacement.kind, defId: def.id, x: slot.x, y: slot.y, slotId: slotId, placedAt: 9999 };
  const attackRange = getCombatStats(tempUnit).range;
  const auraRange = state.selectedPlacement.kind === "character" && def.aura ? def.aura.range : null;
  showRangePreview(slot.x, slot.y, attackRange, auraRange);
}

function onSlotLeave() {
  if (state.selectedPlacement) {
    state.hoverRange = null;
    renderRange();
  }
}

function createUnitElement(unit) {
  const def = unit.kind === "character" ? characterMap.get(unit.defId) : towerMap.get(unit.defId);
  const element = document.createElement("button");
  element.type = "button";
  element.className = "unit " + unit.kind;
  element.innerHTML = [
    '<span class="unit-charge"></span>',
    iconImg(def),
    '<span class="unit-label">', def.name, "</span>"
  ].join("");
  positionElement(element, unit.x, unit.y);
  element.addEventListener("click", function () {
    showRangePreview(unit.x, unit.y, getCombatStats(unit).range);
    inspectUnit(unit, "配置済みユニットの詳細です。");
  });
  bindTooltip(element, unit.kind === "character" ? buildCharacterTooltip(def) : buildTowerTooltip(def));
  return element;
}

function renderRange() {
  refs.rangeLayer.innerHTML = "";
  if (!state.hoverRange) {
    return;
  }
  // オーラ範囲（既存の青緑）
  if (state.hoverRange.auraRadius) {
    const auraRing = document.createElement("div");
    auraRing.className = "range-ring";
    auraRing.style.width = String(state.hoverRange.auraRadius * 2) + "px";
    auraRing.style.height = String(state.hoverRange.auraRadius * 2) + "px";
    positionElement(auraRing, state.hoverRange.x, state.hoverRange.y);
    refs.rangeLayer.appendChild(auraRing);
  }
  // 攻撃範囲（赤）
  const ring = document.createElement("div");
  ring.className = "range-ring" + (state.hoverRange.isAttack ? " range-ring-attack" : "");
  ring.style.width = String(state.hoverRange.radius * 2) + "px";
  ring.style.height = String(state.hoverRange.radius * 2) + "px";
  positionElement(ring, state.hoverRange.x, state.hoverRange.y);
  refs.rangeLayer.appendChild(ring);
}

function showRangePreview(x, y, radius, auraRadius) {
  state.hoverRange = { x: x, y: y, radius: radius, auraRadius: auraRadius || null, isAttack: true };
  renderRange();
}

function gameLoop(frameTime) {
  const dt = Math.min(0.05, (frameTime - state.lastFrame) / 1000);
  state.lastFrame = frameTime;
  const scaledDt = state.paused ? 0 : dt * state.gameSpeed;
  state.now += scaledDt;

  if (state.status === "battle" && !state.paused) {
    updateBattle(scaledDt);
  }

  updateBoardShake(scaledDt);
  window.requestAnimationFrame(gameLoop);
}

function updateBattle(dt) {
  const stage = stages[state.stageIndex];

  if (state.phase === "intro") {
    state.introTimer -= dt;

    const countdownValue = state.introTimer > 0 ? Math.ceil(state.introTimer) : 0;
    refs.countdownDisplay.textContent = countdownValue > 0 ? String(countdownValue) : "Wave Start";

    if (countdownValue > 0 && state.lastCountdownValue !== countdownValue) {
      playCountdownSe(countdownValue);
      state.lastCountdownValue = countdownValue;
    }

    if (state.introTimer <= 0) {
      state.lastCountdownValue = null;
      startWave(0);
    }
  } else if (state.phase === "intermission") {
    state.intermissionTimer -= dt;

    const countdownValue = state.intermissionTimer > 0 ? Math.ceil(state.intermissionTimer) : 0;
    refs.countdownDisplay.textContent = countdownValue > 0 ? "WAVE " + String(countdownValue) : "Wave Start";

    if (countdownValue > 0 && state.lastCountdownValue !== countdownValue) {
      playCountdownSe(countdownValue);
      state.lastCountdownValue = countdownValue;
    }

    updateProjectiles(dt);
    cleanupDeadEnemies();
    updateUnits(dt);
    refreshUnitStates();
    updateHud();

    if (state.intermissionTimer <= 0) {
      state.lastCountdownValue = null;
      startWave(state.currentWaveIndex + 1);
    }
  } else if (state.phase === "wave") {
    refs.countdownDisplay.textContent = "配信中";
    state.waveElapsed += dt;
    spawnScheduledEnemies();
    updateWarnings();
    updateEnemies(dt);
    updateUnits(dt);
    updateProjectiles(dt);
    cleanupDeadEnemies();
    refreshUnitStates();
    updateHud();

    if (Math.random() < 0.6) {
      spawnAuraParticles();
    }

    if (state.phase === "wave" && state.currentWaveSpawns.length === 0 && state.enemies.length === 0) {
      if (state.currentWaveIndex >= stage.waves.length - 1) {
        onStageClear();
      } else {
        state.phase = "intermission";
        state.intermissionTimer = stage.intermission;
        state.lastCountdownValue = null;
        showStageBanner("WAVE " + String(state.currentWaveIndex + 1) + " CLEAR", "...");
      }
    }
  }
}

function startWave(waveIndex) {
  const stage = stages[state.stageIndex];
  const wave = stage.waves[waveIndex];

  state.phase = "wave";
  state.currentWaveIndex = waveIndex;
  state.waveElapsed = 0;
  state.currentWaveSpawns = buildWaveSpawnQueue(wave);

  refs.metricWave.textContent =
    String(waveIndex + 1) + "/" + String(stage.waves.length);

  showStageBanner("WAVE " + String(waveIndex + 1), wave.label);
}

function buildWaveSpawnQueue(wave) {
  const queue = [];
  wave.packs.forEach(function (entry) {
    const interval = entry.interval || 0;
    for (let i = 0; i < entry.count; i += 1) {
      queue.push({ at: entry.start + interval * i, enemyId: entry.enemyId, family: entry.family });
    }
  });
  queue.sort(function (a, b) {
    return a.at - b.at;
  });
  return queue;
}

function spawnScheduledEnemies() {
  while (state.currentWaveSpawns.length && state.currentWaveSpawns[0].at <= state.waveElapsed) {
    const spawn = state.currentWaveSpawns.shift();
    spawnEnemy(spawn.enemyId, spawn.family, 0);
  }
}

function spawnEnemy(enemyId, family, startDistance) {
  const def = family === "elite" ? eliteEnemyMap.get(enemyId) : family === "boss" ? bossMap.get(enemyId) : normalEnemyMap.get(enemyId);
  if (!def) return;
  const stage = stages[state.stageIndex];
  const position = getPathPosition(startDistance || 0);
  const enemy = {
    id: "enemy-" + String(++state.enemySerial),
    defId: enemyId,
    family: family,
    x: position.x,
    y: position.y,
    distance: startDistance || 0,
    hp: def.stats.hp * stage.enemyScale.hp,
    maxHp: def.stats.hp * stage.enemyScale.hp,
    shield: (def.stats.shield || 0) * stage.enemyScale.hp,
    speed: def.stats.speed * stage.enemyScale.speed,
    dead: false,
    slows: [],
    dotTimer: state.now + 1,
    nextJamPulse: state.now + randomRange(5.4, 7.2),
    jamRadius: def.elite ? 124 : 98,
    jamDuration: def.elite ? 2.8 : 1.8,
    splitCount: def.abilities.indexOf("split") >= 0 ? 2 : 0,
    regenPerSecond: def.abilities.indexOf("regen") >= 0 ? 12 : 0,
    isBoss: family === "boss",
    bossPhaseShifted: false,
    nextBossSummon: state.now + 9,
    nextBossJam: state.now + 12,
    nextBossShield: state.now + 16,
    shieldedUntil: 0
  };
  enemy.element = createEnemyElement(enemy, def);
  refs.enemyLayer.appendChild(enemy.element);
  state.enemies.push(enemy);
}

function createEnemyElement(enemy, def) {
  const element = document.createElement("div");
  element.className = "enemy" + (def.elite ? " elite" : "") + (enemy.isBoss ? " boss" : "");
  const iconHtml = def.imageUrl && def.imageUrl !== ""
    ? '<img src="' + def.imageUrl + '" style="position:absolute;width:100%;height:100%;object-fit:cover;border-radius:50%;top:0;left:0;" alt="">'
    : "";
  element.innerHTML = [
    iconHtml,
    '<span class="enemy-hp"><span class="enemy-hp-fill"></span></span>',
    '<span class="enemy-role">', def.roleIcon, "</span>"
  ].join("");
  positionElement(element, enemy.x, enemy.y);
  bindTooltip(element, def.name + " / " + def.roleText);
  return element;
}

function updateEnemies(dt) {
  const relicProfile = getRelicProfile();
  for (let i = 0; i < state.enemies.length; i += 1) {
    const enemy = state.enemies[i];
    if (enemy.dead) {
      continue;
    }

    const def = getEnemyDefinition(enemy);
    cleanupExpiredSlows(enemy);

    if (enemy.regenPerSecond > 0 && enemy.hp > 0) {
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + enemy.regenPerSecond * dt);
    }

    if (enemy.isBoss) {
      updateBoss(enemy);
    } else if (def.abilities.indexOf("jamPulse") >= 0 && state.now >= enemy.nextJamPulse) {
      triggerEnemyJamPulse(enemy);
      enemy.nextJamPulse = state.now + randomRange(5.4, 7.4);
    }

    if (relicProfile.slowDot > 0 && getSlowAmount(enemy) > 0 && state.now >= enemy.dotTimer) {
      enemy.dotTimer = state.now + 1;
      damageEnemy(enemy, relicProfile.slowDot, { slow: 0, critChance: 0, critMultiplier: 1, damageVsSlowed: 0, chainBonusPerKill: 0 });
    }

    const speedFactor = 1 - getSlowAmount(enemy);
    const reverseActive = state.globalBuffs.reverseUntil > state.now;
    const moveDirection = reverseActive ? -1 : 1;
    enemy.distance += moveDirection * enemy.speed * Math.max(0.2, speedFactor) * dt;
    enemy.distance = clamp(enemy.distance, 0, pathMetrics.totalLength);

    if (!reverseActive && enemy.distance >= pathMetrics.totalLength) {
      onEnemyGoal();
      return;
    }

    const point = getPathPosition(enemy.distance);
    enemy.x = point.x;
    enemy.y = point.y;
    positionElement(enemy.element, enemy.x, enemy.y);
    enemy.element.classList.toggle("slowed", getSlowAmount(enemy) > 0);
    enemy.element.querySelector(".enemy-hp-fill").style.width = String(Math.max(0, (enemy.hp / enemy.maxHp) * 100)) + "%";
  }
}

function updateBoss(enemy) {
  if (!enemy.bossPhaseShifted && enemy.hp / enemy.maxHp <= bosses[0].phaseAt) {
    enemy.bossPhaseShifted = true;
    enemy.speed *= 1.16;
    showStageBanner("PHASE SHIFT", "ボスが形態を変えた");
    shakeBoard(1.6);
    spawnWarningCircle(pathDistances[2], 110, 1.4, function () {
      spawnEnemy("marsh_guard", "elite", pathDistances[2]);
      spawnEnemy("static_moth", "elite", pathDistances[2] + 30);
    });
  }

  if (state.now >= enemy.nextBossSummon) {
    enemy.nextBossSummon = state.now + (enemy.bossPhaseShifted ? 11 : 13);
    const distance = pickRandom(pathDistances);
    spawnWarningCircle(distance, 130, 1.5, function () {
      spawnEnemy("split_toffee", "elite", distance);
      spawnEnemy("gummy_runner", "normal", distance + 12);
      spawnEnemy("gummy_runner", "normal", distance + 28);
    });
  }

  if (state.now >= enemy.nextBossJam) {
    enemy.nextBossJam = state.now + (enemy.bossPhaseShifted ? 10 : 12.8);
    const targetY = pickRandom(jamLineYs);
    spawnWarningLine(500, targetY, 860, 1.35, function () {
      applyDisruptionLine(targetY, 54, 3.2, true);
      shakeBoard(1.2);
    });
  }

  if (state.now >= enemy.nextBossShield) {
    enemy.nextBossShield = state.now + (enemy.bossPhaseShifted ? 14 : 16);
    enemy.shieldedUntil = state.now + 4.2;
    spawnImpact(enemy.x, enemy.y, 118);
  }
}

function triggerEnemyJamPulse(enemy) {
  spawnWarningCircle({ x: enemy.x, y: enemy.y }, enemy.jamRadius, 1.1, function () {
    applyDisruptionAround(enemy.x, enemy.y, enemy.jamRadius, enemy.jamDuration, false);
  });
}

function updateUnits(dt) {
  for (let i = 0; i < state.units.length; i += 1) {
    const unit = state.units[i];
    unit.cooldownLeft -= dt;
    if (unit.cooldownLeft > 0 || unit.disabledUntil > state.now) {
      continue;
    }

    const stats = getCombatStats(unit);
    const target = pickTargetForUnit(unit, stats.range);
    if (!target) {
      unit.cooldownLeft = 0.12;
      continue;
    }

    fireFromUnit(unit, target, stats);
    unit.cooldownLeft = stats.cooldown;
  }
}

function updateProjectiles(dt) {
  for (let i = state.projectiles.length - 1; i >= 0; i -= 1) {
    const projectile = state.projectiles[i];
    const target = findEnemyById(projectile.targetId);
    const targetX = target && !target.dead ? target.x : projectile.fallbackX;
    const targetY = target && !target.dead ? target.y : projectile.fallbackY;
    const dx = targetX - projectile.x;
    const dy = targetY - projectile.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    const step = projectile.speed * dt;

    if (distance <= step + 8) {
      projectile.x = targetX;
      projectile.y = targetY;
      positionElement(projectile.element, projectile.x, projectile.y);
      explodeProjectile(projectile, targetX, targetY);
      projectile.element.remove();
      state.projectiles.splice(i, 1);
      continue;
    }

    projectile.x += (dx / distance) * step;
    projectile.y += (dy / distance) * step;
    positionElement(projectile.element, projectile.x, projectile.y);
  }
}

function fireFromUnit(unit, target, stats) {
  playShotSe(unit, stats);
  const def = unit.kind === "character" ? characterMap.get(unit.defId) : towerMap.get(unit.defId);
  const palette = getFxPalette(def.iconKey);
  flashUnit(unit);
  playShotSe(unit, stats);
  spawnTrail(unit.x, unit.y, target.x, target.y, palette, stats.heavy);

  const projectile = {
    id: "p-" + String(Math.random()),
    sourceId: unit.id,
    targetId: target.id,
    x: unit.x,
    y: unit.y,
    fallbackX: target.x,
    fallbackY: target.y,
    speed: stats.projectileSpeed,
    damage: stats.damage,
    slow: stats.slow,
    splash: stats.splash,
    critChance: stats.crit,
    critMultiplier: stats.critMultiplier,
    heavy: stats.heavy,
    damageVsSlowed: stats.damageVsSlowed,
    chainBonusPerKill: stats.chainBonusPerKill
  };
  projectile.element = document.createElement("div");
  projectile.element.className = "projectile" + (projectile.heavy ? " heavy" : "");
  projectile.element.style.setProperty("--shot-a", palette.primary);
  projectile.element.style.setProperty("--shot-b", palette.secondary);
  projectile.element.style.setProperty("--shot-glow", palette.glow);
  positionElement(projectile.element, projectile.x, projectile.y);
  refs.projectileLayer.appendChild(projectile.element);
  state.projectiles.push(projectile);
}

function explodeProjectile(projectile, x, y) {
  spawnImpact(x, y, projectile.splash > 0 ? projectile.splash : projectile.heavy ? 42 : 26);
  const victims = projectile.splash > 0 ? getEnemiesInRadius(x, y, projectile.splash) : [findEnemyById(projectile.targetId)].filter(Boolean);
  victims.forEach(function (enemy) {
    damageEnemy(enemy, projectile.damage, projectile);
  });
}

function damageEnemy(enemy, baseDamage, payload) {
  if (!enemy || enemy.dead) {
    return;
  }

  const relicProfile = getRelicProfile();
  let damage = baseDamage;
  if (payload.damageVsSlowed > 0 && getSlowAmount(enemy) > 0) {
    damage *= 1 + payload.damageVsSlowed;
  }
  if (relicProfile.damageVsSlowed > 0 && getSlowAmount(enemy) > 0) {
    damage *= 1 + relicProfile.damageVsSlowed;
  }
  if (enemy.shieldedUntil > state.now) {
    damage *= 0.38;
  }
  if (payload.chainBonusPerKill > 0) {
    damage *= 1 + Math.min(0.4, state.chainState.count * payload.chainBonusPerKill);
  }

  let critical = false;
  if (payload.critChance > 0 && Math.random() < payload.critChance) {
    critical = true;
    damage *= payload.critMultiplier;
  }

  let remaining = damage;
  if (enemy.shield > 0) {
    const absorbed = Math.min(enemy.shield, remaining);
    enemy.shield -= absorbed;
    remaining -= absorbed;
  }
  if (remaining > 0) {
    enemy.hp -= remaining;
  }

  const shownDamage = Math.max(1, Math.round(damage));
  spawnFloatingText(enemy.x, enemy.y - 18, shownDamage, critical);

  if (payload.slow > 0) {
    addSlow(enemy, payload.slow, 2.4);
  }
  if (shownDamage >= 50 || critical) {
    spawnImpact(enemy.x, enemy.y, critical ? 58 : 42);
    shakeBoard(critical ? 0.95 : 0.6);
  }
  if (enemy.hp <= 0) {
    killEnemy(enemy);
    if (critical && relicProfile.critSplash > 0) {
      getEnemiesInRadius(enemy.x, enemy.y, 36).forEach(function (splashTarget) {
        if (splashTarget.id !== enemy.id) {
          damageEnemy(splashTarget, relicProfile.critSplash, { slow: 0, critChance: 0, critMultiplier: 1, damageVsSlowed: 0, chainBonusPerKill: 0 });
        }
      });
    }
  }
}

function killEnemy(enemy) {
  playEnemyDownSe(enemy);
  enemy.dead = true;
  playEnemyDownSe(enemy);
  enemy.element.remove();
  spawnImpact(enemy.x, enemy.y, enemy.isBoss ? 160 : enemy.family === "elite" ? 78 : 48);
  registerChainKill();
  spawnEnemyBlast(enemy);
  if (enemy.splitCount > 0) {
    for (let i = 0; i < enemy.splitCount; i += 1) {
      spawnEnemy("gummyrunner", "normal", enemy.distance - 8 + i * 10);
    }
  }
}

function spawnEnemyBlast(enemy) {
  const count = enemy.isBoss ? 12 : enemy.family === "elite" ? 6 : 3;
  for (let i = 0; i < count; i += 1) {
    const shard = document.createElement("div");
    shard.className = "enemy-shard";
    let angle, speed, size, color;
    if (enemy.isBoss) {
      // ボス：全方向に大きく爆散
      angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      speed = randomRange(80, 180);
      size = randomRange(8, 18);
      color = "#ff4444";
    } else if (enemy.family === "elite") {
      // エリート：斜め上に強く吹き飛ぶ
      angle = -Math.PI / 2 + randomRange(-0.8, 0.8);
      speed = randomRange(60, 120);
      size = randomRange(5, 10);
      color = "#ffd700";
    } else {
      // 通常：進行方向と逆（後方）に吹き飛ぶ
      angle = Math.PI + randomRange(-0.6, 0.6);
      speed = randomRange(30, 70);
      size = randomRange(3, 7);
      color = "#ffb84b";
    }
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const rotation = randomRange(120, 480);
    shard.style.cssText = "position:absolute;border-radius:50%;pointer-events:none;";
    shard.style.left = String(enemy.x) + "px";
    shard.style.top = String(enemy.y) + "px";
    shard.style.width = String(size) + "px";
    shard.style.height = String(size) + "px";
    shard.style.background = color;
    shard.style.boxShadow = "0 0 6px " + color;
    shard.style.setProperty("--vx", String(vx) + "px");
    shard.style.setProperty("--vy", String(vy) + "px");
    shard.style.setProperty("--rot", String(rotation) + "deg");
    shard.style.animation = "shardBlast 0.6s ease-out forwards";
    shard.style.animationDelay = String(randomRange(0, 0.08)) + "s";
    refs.effectLayer.appendChild(shard);
    window.setTimeout(function() { shard.remove(); }, 700);
  }
}

function cleanupDeadEnemies() {
  state.enemies = state.enemies.filter(function (enemy) {
    return !enemy.dead;
  });
}

function refreshUnitStates() {
  const towerBuffActive =
    state.globalBuffs.scriptRewriteUntil > state.now ||
    state.globalBuffs.encoreRushUntil > state.now ||
    state.globalBuffs.sugarOrchestraUntil > state.now;

  state.units.forEach(function (unit) {
    unit.element.classList.toggle("disabled", unit.disabledUntil > state.now);
    if (unit.kind === "tower") {
      unit.element.classList.toggle("gold-buff", towerBuffActive);
    }
  });
}

function onStageClear() {
  playStageClearSe();
  state.stageHistory.push(stages[state.stageIndex].id);
  if (state.stageIndex >= stages.length - 1) {
    openEndOverlay(true);
    return;
  }
  openRewardOverlay();
}

function openRewardOverlay() {
  state.status = "reward";
  state.phase = "idle";
  state.paused = false;
  state.rewardState = {
    selected: { relicId: null, characterId: null, towerId: null },
    options: {
      relics: pickRelicOptions(),
      characters: pickCharacterOptions(),
      towers: pickTowerOptions()
    }
  };
  renderRewardOverlay();
  spawnCoinBurst();
  refs.rewardOverlay.classList.remove("overlay-hidden");
  refs.rewardOverlay.classList.add("overlay-visible");
  updatePlaybackControls();
}

function renderRewardOverlay() {
  renderRewardLane(refs.rewardRelicLane, state.rewardState.options.relics, "relic");
  renderRewardLane(refs.rewardCharacterLane, state.rewardState.options.characters, "character");
  renderRewardLane(refs.rewardTowerLane, state.rewardState.options.towers, "tower", true);
  updateRewardSummary();
}

function renderRewardLane(container, options, laneType, towerDouble) {
  container.innerHTML = "";
  options.forEach(function (id) {
    const def = laneType === "relic" ? relicMap.get(id) : laneType === "character" ? characterMap.get(id) : towerMap.get(id);
    const selectedId = laneType === "relic" ? state.rewardState.selected.relicId : laneType === "character" ? state.rewardState.selected.characterId : state.rewardState.selected.towerId;
    const strip = createSelectorStrip(def, laneType, selectedId === id, towerDouble ? "x2" : "");
    if (laneType === "relic") {
      strip.classList.add(def.rarity);
    }
    strip.addEventListener("click", function () {
      if (laneType === "relic") {
        state.rewardState.selected.relicId = id;
      } else if (laneType === "character") {
        state.rewardState.selected.characterId = id;
      } else {
        state.rewardState.selected.towerId = id;
      }
      renderRewardOverlay();
    });
    bindTooltip(strip, laneType === "relic" ? buildRelicTooltip(def, false) : laneType === "character" ? buildCharacterTooltip(def) : buildTowerTooltip(def));
    container.appendChild(strip);
  });
}

function updateRewardSummary() {
  const selected = state.rewardState.selected;
  const ready = selected.relicId && selected.characterId && selected.towerId;
  const parts = [
    selected.relicId ? relicMap.get(selected.relicId).name : "レリック未選択",
    selected.characterId ? characterMap.get(selected.characterId).name : "自キャラ未選択",
    selected.towerId ? towerMap.get(selected.towerId).name + " x2" : "タワー未選択"
  ];
  refs.rewardSummary.textContent = parts.join(" / ");
  refs.confirmRewardButton.disabled = !ready;
}

function confirmRewardSelections() {
  const selected = state.rewardState.selected;
  if (!selected.relicId || !selected.characterId || !selected.towerId) return;

  playRewardSelectSe();

  if (state.collection.relicIds.indexOf(selected.relicId) < 0) {
    state.collection.relicIds.push(selected.relicId);
  }
  if (state.collection.characterIds.indexOf(selected.characterId) < 0) {
    state.collection.characterIds.push(selected.characterId);
  }
  state.collection.towerStocks[selected.towerId] =
    (state.collection.towerStocks[selected.towerId] || 0) + 2;

  refs.rewardOverlay.classList.remove("overlay-visible");
  refs.rewardOverlay.classList.add("overlay-hidden");
  renderRelics();
  renderSynergyFeed();
  prepareStage(state.stageIndex + 1);
}

function pickRelicOptions() {
  const owned = state.collection.relicIds.slice();
  const profile = getRelicProfile();
  const count = Math.min(relics.length - owned.length, 3 + profile.rewardBonusChoices);
  const pool = relics.filter(function (relic) {
    return owned.indexOf(relic.id) < 0;
  }).map(function (relic) {
    return relic.id;
  });
  return pickSeveral(pool, count);
}

function pickCharacterOptions() {
  const pool = characters.filter(function (character) {
    return state.collection.characterIds.indexOf(character.id) < 0;
  }).map(function (character) {
    return character.id;
  });
  return pickSeveral(pool, Math.min(3, pool.length));
}

function pickTowerOptions() {
  return pickSeveral(towers.map(function (tower) { return tower.id; }), 3);
}

function useCharacterSkill(characterId) {
  if ((state.skillCharges[characterId] || 0) <= 0 || !findPlacedCharacter(characterId)) {
    return;
  }
    const def = characterMap.get(characterId);
  state.skillCharges[characterId] -= 1;
  playSkillSe();
  // キャラ登場演出を先に呼ぶ
  const placedChar = findPlacedCharacter(characterId);
  const buffDur = def.skill.id === "encorerush" ? 7 : 8;
  if (placedChar) { showCharacterEntrance(def.iconKey, placedChar, buffDur / (state.gameSpeed || 1)); }
  showCutin(
  def.name,
  def.skill.name,
  def.iconKey,
  def.imageUrl || def.cutinImageUrl || ""
  );
  shakeBoard(1.1);
  
  if (def.skill.id === "dream_curtain") {
  state.globalBuffs.globalSlowUntil = state.now + 8;
  state.globalBuffs.globalSlowAmount = 0.35;
  state.enemies.forEach(function (enemy) {
    addSlow(enemy, 0.35, 8);
    damageEnemy(enemy, 22, {
      slow: 0,
      critChance: 0,
      critMultiplier: 1,
      damageVsSlowed: 0,
      chainBonusPerKill: 0
    });
  });
} else if (def.skill.id === "script_rewrite") {
  state.globalBuffs.scriptRewriteUntil = state.now + 8;
  triggerBuffGlow(8);
} else if (def.skill.id === "encore_rush") {
  state.globalBuffs.encoreRushUntil = state.now + 7;
  triggerBuffGlow(7);
} else if (def.skill.id === "sugar_orchestra") {
  state.globalBuffs.sugarOrchestraUntil = state.now + 8;
  triggerBuffGlow(8);
} else if (def.skill.id === "moderation_wall") {
  state.globalBuffs.reverseUntil = state.now + 3.8;
} else if (def.skill.id === "viral_splice") {
  state.enemies.slice().forEach(function (enemy) {
    damageEnemy(enemy, 54, {
      slow: 0,
      critChance: 0.16,
      critMultiplier: 1.9,
      damageVsSlowed: 0,
      chainBonusPerKill: 0
    });
  });
}
renderSkills();
updateHud();
}

function useRelicSkill(skillId) {
  if ((state.skillCharges[skillId] || 0) <= 0) return;

  const activeSkill = getRelicProfile().activeSkills.find(function (skill) {
    return skill.id === skillId;
  });

  state.skillCharges[skillId] -= 1;

  playSkillSe();

  const dreamRelic = relicMap.get("clipstorm");

  showDreamAttack();
  showCutin("", activeSkill ? activeSkill.name : (dreamRelic ? dreamRelic.name : ""), "trend");

  shakeBoard(1.5);

  state.enemies.slice().forEach(function (enemy) {
    damageEnemy(enemy, 86, {
      slow: 0,
      critChance: 0.2,
      critMultiplier: 2,
      damageVsSlowed: 0,
      chainBonusPerKill: 0
    });
  });

  renderSkills();
}

function showDreamAttack() {
  const palette = { primary: "#79d7ff", secondary: "#ffd36b", glow: "rgba(121,215,255,0.6)" };

  // 1. カットイン表示
  showCutin("レリック", "ドリームアタック！", "trend");

  // 2. 大きいキャラ画像を左に表示
  const el = document.createElement("div");
  el.className = "char-entrance dream-attack-entrance";
  el.style.setProperty("--entrance-color", palette.primary);
  el.style.setProperty("--entrance-glow", palette.glow);
  el.innerHTML = '<img src="images/relic/dreamattack02.png" style="width:100%;height:100%;object-fit:contain;" alt="">';
  el.style.left = "500px";
  el.style.top = "310px";
  el.style.transform = "translate(-50%,-50%) scale(2)";
  el.style.opacity = "0";
  refs.cutinLayer.appendChild(el);

  // フェードイン
  requestAnimationFrame(function() {
    el.style.transition = "opacity 0.2s ease";
    el.style.opacity = "1";
  });

  // 3. 画面フラッシュ連続
  for (let i = 0; i < 4; i++) {
    window.setTimeout(function() {
      spawnSkillFlash({ primary: "#79d7ff", secondary: "#ffffff", glow: "rgba(121,215,255,0.8)" });
    }, i * 300);
  }

  // 4. シェイク連続
  for (let i = 0; i < 6; i++) {
    window.setTimeout(function() {
      shakeBoard(1.8);
    }, i * 200);
  }

  // 5. 画面中央にDREAM ATTACKテキスト
  window.setTimeout(function() {
    const banner = document.createElement("div");
    banner.className = "dream-attack-banner";
    banner.textContent = "DREAM ATTACK!!";
    refs.cutinLayer.appendChild(banner);
    window.setTimeout(function() { banner.remove(); }, 2000);
  }, 300);

  // 6. 光の粒を大量に散乱
  for (let i = 0; i < 40; i++) {
    window.setTimeout(function() {
      const shard = document.createElement("div");
      shard.className = "dream-shard";
      shard.style.left = String(Math.random() * 1000) + "px";
      shard.style.top = String(Math.random() * 620) + "px";
      const size = 4 + Math.random() * 12;
      shard.style.width = String(size) + "px";
      shard.style.height = String(size) + "px";
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 120;
      shard.style.setProperty("--vx", String(Math.cos(angle) * speed) + "px");
      shard.style.setProperty("--vy", String(Math.sin(angle) * speed) + "px");
      refs.effectLayer.appendChild(shard);
      window.setTimeout(function() { shard.remove(); }, 800);
    }, Math.random() * 1500);
  }

  // 7. ガラスが砕けるエフェクト（1.5秒後）
  window.setTimeout(function() {
    el.classList.add("dream-shatter");
    // 破片を生成
    for (let i = 0; i < 16; i++) {
      const piece = document.createElement("div");
      piece.className = "shatter-piece";
      piece.style.left = "500px";
      piece.style.top = "310px";
      const angle = (i / 16) * Math.PI * 2;
      const speed = 80 + Math.random() * 160;
      piece.style.setProperty("--vx", String(Math.cos(angle) * speed) + "px");
      piece.style.setProperty("--vy", String(Math.sin(angle) * speed) + "px");
      piece.style.setProperty("--rot", String(Math.random() * 720) + "deg");
      piece.style.width = String(20 + Math.random() * 60) + "px";
      piece.style.height = String(20 + Math.random() * 60) + "px";
      piece.style.background = "rgba(121,215,255," + (0.4 + Math.random() * 0.5) + ")";
      piece.style.boxShadow = "0 0 12px rgba(121,215,255,0.8)";
      refs.effectLayer.appendChild(piece);
      window.setTimeout(function() { piece.remove(); }, 1000);
    }
    // 元画像をフェードアウト
    el.style.transition = "opacity 0.3s ease";
    el.style.opacity = "0";
    window.setTimeout(function() { el.remove(); }, 300);
  }, 1800);
}

function updateHud() {
  const stage = stages[state.stageIndex] || stages[0];
  refs.stageTicker.textContent = "Stage " + String(state.stageIndex + 1);
  refs.waveTicker.textContent = "Wave " + String(Math.max(0, state.currentWaveIndex + 1)) + " / " + String(stage.waves.length);
  refs.metricStage.textContent = String(state.stageIndex + 1) + " / " + String(stages.length);
  refs.metricWave.textContent = String(Math.max(0, state.currentWaveIndex + 1)) + " / " + String(stage.waves.length);

  const remaining = getRemainingEnemyCount();
  const eliteCount = state.enemies.filter(function (enemy) {
    return enemy.family === "elite";
  }).length;
  const bossAlive = state.enemies.some(function (enemy) {
    return enemy.family === "boss";
  });
  refs.metricRemaining.textContent = String(remaining);
  refs.metricElite.textContent = String(eliteCount);
  if (refs.metricDeploy) {
    refs.metricDeploy.textContent = String(getRemainingDeployCount());
  }

  refs.metricBoss.textContent = bossAlive ? "ボス出現中" : state.stageIndex === stages.length - 1 ? "最終ステージで出現" : "ボス未出現";
  const danger = calculateDanger();
  refs.pressureFill.style.width = String(Math.min(100, danger * 100)) + "%";
  refs.pressureLabel.textContent = danger < 0.25 ? "CALM" : danger < 0.5 ? "LIVE" : danger < 0.75 ? "HOT" : "OVERLOAD";
  refs.dangerTicker.textContent = "Pressure " + refs.pressureLabel.textContent;
  updateBattleStartButton();
  normalizeBattleStartButtonLabel();
  updatePlaybackControls();
    // バフインジケーター更新
  const buffBar = document.getElementById("buffIndicatorBar");
  if (buffBar) {
    const buffs = [
      { key: "globalSlowUntil", label: "ドリームタイム", color: "#79d7ff", icon: "❄" },
      { key: "scriptRewriteUntil", label: "やりたい放題", color: "#ffd36b", icon: "⚡" },
      { key: "encoreRushUntil", label: "やっちゃえ！", color: "#ff7354", icon: "🔥" },
      { key: "sugarOrchestraUntil", label: "行くのよ！", color: "#5de6cb", icon: "✦" },
      { key: "reverseUntil", label: "アブサンを飲め", color: "#ff7aa1", icon: "↺" }
    ];
    buffBar.innerHTML = "";
    buffs.forEach(function(buff) {
      const remaining = (state.globalBuffs[buff.key] || 0) - state.now;
      if (remaining <= 0) return;
      const chip = document.createElement("div");
      chip.className = "buff-chip";
      chip.style.setProperty("--buff-color", buff.color);
      chip.innerHTML = '<span class="buff-icon">' + buff.icon + '</span><span class="buff-label">' + buff.label + '</span><span class="buff-timer">' + remaining.toFixed(1) + 's</span>';
      buffBar.appendChild(chip);
    });
  }
}

function updatePlaybackControls() {
  const isBattle = state.status === "battle";
  if (refs.speedToggleButton) {
    refs.speedToggleButton.disabled = !isBattle;
    refs.speedToggleButton.textContent = "速度 " + String(state.gameSpeed) + "x";
    refs.speedToggleButton.classList.toggle("active", isBattle && state.gameSpeed > 1);
  }
  if (refs.pauseToggleButton) {
    refs.pauseToggleButton.disabled = !isBattle;
    refs.pauseToggleButton.textContent = state.paused ? "再開" : "ポーズ";
    refs.pauseToggleButton.classList.toggle("active", isBattle && state.paused);
  }
  refs.appShell.classList.toggle("is-paused", isBattle && state.paused);
}

function cycleGameSpeed() {
  if (state.status !== "battle") {
    return;
  }
  const speeds = [1, 2, 3, 5, 10];
  const currentIndex = speeds.indexOf(state.gameSpeed);
  state.gameSpeed = speeds[(currentIndex + 1) % speeds.length];
  updatePlaybackControls();
}

function togglePause() {
  if (state.status !== "battle") {
    return;
  }
  state.paused = !state.paused;
  updatePlaybackControls();
}

function getRemainingDeployCount() {
  let remaining = 0;
  state.collection.characterIds.forEach(function (characterId) {
    if (!findPlacedCharacter(characterId)) {
      remaining += 1;
    }
  });
  Object.keys(state.collection.towerStocks).forEach(function (towerId) {
    remaining += getRemainingTowerCount(towerId);
  });
  return remaining;
}

function inspectPlacement(kind, id, message) {
  state.inspectTarget = { mode: "placement", kind: kind, id: id, message: message || "" };
  renderSelectionPanel();
}

function inspectUnit(unit, message) {
  state.inspectTarget = { mode: "unit", unitId: unit.id, message: message || "" };
  renderSelectionPanel();
}

function renderSelectionPanel(messageOverride) {
  if (!refs.selectionTitle || !refs.selectionReadout) {
    return;
  }

  const target = resolveInspectTarget();
  renderInfoChips(refs.selectionTags, []);
  renderInfoChips(refs.selectionStats, []);

  if (!target) {
    refs.selectionTitle.textContent = state.status === "battle" ? "戦闘ガイド" : "配置ガイド";
    refs.selectionReadout.textContent = messageOverride || getDefaultSelectionMessage();
    return;
  }

  const def = target.kind === "character" ? characterMap.get(target.defId) : towerMap.get(target.defId);
  if (!def) {
    refs.selectionTitle.textContent = state.status === "battle" ? "戦闘ガイド" : "配置ガイド";
    refs.selectionReadout.textContent = messageOverride || getDefaultSelectionMessage();
    return;
  }

  const stats = getCombatStats(target.mode === "unit" ? target.unit : { kind: target.kind, defId: target.defId });
  refs.selectionTitle.textContent = def.name;
  refs.selectionReadout.textContent = messageOverride || target.message || def.description;
  renderInfoChips(refs.selectionTags, buildSelectionTags(target, def));
  renderInfoChips(refs.selectionStats, buildSelectionStats(target, def, stats));
}

function syncSelectionPanelWithCurrentPlacement(message) {
  if (state.selectedPlacement) {
    inspectPlacement(state.selectedPlacement.kind, state.selectedPlacement.id, message || "盤面の空きマスをクリックして配置してください。");
    return;
  }
  renderSelectionPanel(message || getDefaultSelectionMessage());
}

function resolveInspectTarget() {
  if (!state.inspectTarget) {
    return null;
  }
  if (state.inspectTarget.mode === "unit") {
    const unit = state.units.find(function (entry) {
      return entry.id === state.inspectTarget.unitId;
    });
    if (!unit) {
      return null;
    }
    return {
      mode: "unit",
      kind: unit.kind,
      defId: unit.defId,
      unit: unit,
      message: state.inspectTarget.message || ""
    };
  }
  return {
    mode: "placement",
    kind: state.inspectTarget.kind,
    defId: state.inspectTarget.id,
    message: state.inspectTarget.message || ""
  };
}

function getDefaultSelectionMessage() {
  if (state.status === "start") {
    return "開始前に自キャラと初期タワーを選択してください。";
  }
  if (state.status === "battle") {
    return "配置済みユニットをクリックすると、射程と役割をすぐ確認できます。";
  }
  return "配置したいユニットを下のバーから選んで、盤面の空きマスをクリックしてください。";
}

function buildSelectionTags(target, def) {
  const tags = [];
  pushUnique(tags, target.kind === "character" ? "自キャラ" : "タワー");
  if (target.kind === "character" && def.skill) {
    pushUnique(tags, def.skill.name);
  }
  if (def.aura) {
    pushUnique(tags, def.aura.label);
  }
  (def.abilities || []).forEach(function (ability) {
    pushUnique(tags, ABILITY_LABELS[ability] || ability);
  });
  return tags.slice(0, 6);
}

function buildSelectionStats(target, def, stats) {
  const chips = [];
  chips.push("射程 " + String(Math.round(stats.range)));
  chips.push("火力 " + String(Math.round(stats.damage)));
  chips.push("間隔 " + stats.cooldown.toFixed(2) + "s");
  if (def.stats.splash) {
    chips.push("爆発 " + String(def.stats.splash));
  }
  if (def.stats.slow) {
    chips.push("スロウ " + String(Math.round(def.stats.slow * 100)) + "%");
  }
  if (target.kind === "tower") {
    const total = state.collection.towerStocks[def.id] || 0;
    chips.push("在庫 " + String(getRemainingTowerCount(def.id)) + "/" + String(total));
  } else {
    chips.push(findPlacedCharacter(def.id) ? "配置済み" : "未配置");
    if (def.aura) {
      chips.push("支援範囲 " + String(Math.round(def.aura.range)));
    }
  }
  if (target.mode === "unit" && target.unit) {
    chips.push("マス " + target.unit.slotId.toUpperCase());
  }
  return chips.slice(0, 6);
}

function renderInfoChips(container, values) {
  if (!container) {
    return;
  }
  container.innerHTML = "";
  values.forEach(function (value) {
    const chip = document.createElement("span");
    chip.className = "info-chip";
    chip.textContent = value;
    container.appendChild(chip);
  });
}

function pushUnique(list, value) {
  if (value && list.indexOf(value) < 0) {
    list.push(value);
  }
}

function calculateDanger() {
  if (!state.enemies.length) {
    return 0.08;
  }
  let threat = 0;
  state.enemies.forEach(function (enemy) {
    const progress = enemy.distance / pathMetrics.totalLength;
    const enemyThreat = getEnemyDefinition(enemy).stats.threat || 1;
    threat += enemyThreat * (0.3 + progress * 0.9);
  });
  return clamp(threat / 26, 0.08, 1);
}

function getRemainingEnemyCount() {
  const stage = stages[state.stageIndex];
  let future = state.currentWaveSpawns.length;
  if (stage && state.currentWaveIndex + 1 < stage.waves.length) {
    for (let i = state.currentWaveIndex + 1; i < stage.waves.length; i += 1) {
      stage.waves[i].packs.forEach(function (entry) {
        future += entry.count;
      });
    }
  }
  return future + state.enemies.length;
}

function openEndOverlay(victory) {
  if (!victory) {
    playGameOverSe();
  }

  state.status = victory ? "victory" : "gameover";
  state.paused = false;
  refs.endKicker.textContent = victory ? "Show Complete" : "Run Result";
  refs.endTitle.textContent = victory ? "ゲームクリア！おめでとう！" : "ゲームオーバー";
  refs.endMessage.textContent = victory ? "ボスを撃破しました。配信は大成功だ！" : "敵がゴールへ到達したため、配信失敗です。";
  refs.endStageStat.textContent = String(victory ? 6 : state.stageIndex + 1) + " / 6";
  refs.endRelicList.innerHTML = "";
  refs.endCharacterList.innerHTML = "";
  refs.endTowerList.innerHTML = "";
  state.collection.relicIds.forEach(function (relicId) { refs.endRelicList.appendChild(createEndTag(relicMap.get(relicId))); });
  state.collection.characterIds.forEach(function (characterId) { refs.endCharacterList.appendChild(createEndTag(characterMap.get(characterId))); });
  Object.keys(state.collection.towerStocks).forEach(function (towerId) {
    const def = towerMap.get(towerId);
    const tag = createEndTag(def);
    tag.textContent = def.name + " x" + String(state.collection.towerStocks[towerId]);
    refs.endTowerList.appendChild(tag);
  });
  refs.endOverlay.classList.remove("overlay-hidden");
  refs.endOverlay.classList.add("overlay-visible");
  updatePlaybackControls();
}

function onEnemyGoal() {
  if (state.status !== "battle") return;
  playGameOverSe();
  openEndOverlay(false);
}

function restartRun() {
  refs.endOverlay.classList.remove("overlay-visible");
  refs.endOverlay.classList.add("overlay-hidden");
  refs.rewardOverlay.classList.remove("overlay-visible");
  refs.rewardOverlay.classList.add("overlay-hidden");
  state = createInitialState();
  refs.startOverlay.classList.remove("overlay-hidden");
  refs.startOverlay.classList.add("overlay-visible");
  refs.unitLayer.innerHTML = "";
  refs.enemyLayer.innerHTML = "";
  refs.projectileLayer.innerHTML = "";
  refs.warningLayer.innerHTML = "";
  refs.effectLayer.innerHTML = "";
  refs.cutinLayer.innerHTML = "";
  renderStartSelection();
  renderRelics();
  renderReserves();
  renderSkills();
  renderSynergyFeed();
  fitBoardToFrame();
  renderSelectionPanel();
  updateHud();
  updatePlaybackControls();
  refreshSlotStates();
  renderRange();
}

function autoSelectNextPlacement(prefixText) {
  const messagePrefix = prefixText ? prefixText + " " : "";
  state.hoverRange = null;

  const nextCharacterId = state.collection.characterIds.find(function (characterId) {
    return !findPlacedCharacter(characterId);
  });
  if (nextCharacterId) {
    const def = characterMap.get(nextCharacterId);
    state.selectedPlacement = { kind: "character", id: nextCharacterId };
    refs.selectionReadout.textContent = messagePrefix + def.name + " を選択中。盤面の空きマスをクリックしてください。";
    renderReserves();
    refreshSlotStates();
    renderRange();
    return;
  }

  const nextTowerId = Object.keys(state.collection.towerStocks).sort().find(function (towerId) {
    return getRemainingTowerCount(towerId) > 0;
  });
  if (nextTowerId) {
    const def = towerMap.get(nextTowerId);
    state.selectedPlacement = { kind: "tower", id: nextTowerId };
    refs.selectionReadout.textContent = messagePrefix + def.name + " を選択中。盤面の空きマスをクリックしてください。";
    renderReserves();
    refreshSlotStates();
    renderRange();
    return;
  }

  state.selectedPlacement = null;
  refs.selectionReadout.textContent = state.status === "deploy"
    ? messagePrefix + "すべて配置済みです。開始ボタンでウェーブを始められます。"
    : messagePrefix + "すべての所持ユニットを配置済みです。";
  renderReserves();
  refreshSlotStates();
  renderRange();
}

function updateBattleStartButton() {
  const button = refs.battleStartButton;
  if (!button) {
    return;
  }

  button.classList.remove("primed");

  if (state.status === "deploy") {
    button.disabled = !hasPlacedStarterLoadout();
    if (!state.units.some(function (unit) { return unit.kind === "character"; })) {
      button.textContent = "自キャラを配置";
    } else if (!state.units.some(function (unit) { return unit.kind === "tower"; })) {
      button.textContent = "タワーを配置";
    } else {
      button.textContent = "開始";
      button.classList.add("primed");
    }
    return;
  }

  button.disabled = true;
  button.textContent = state.status === "battle" ? (state.phase === "intro" ? "開演中..." : "進行中") : "開始";
}

function normalizeBattleStartButtonLabel() {
  const button = refs.battleStartButton;
  if (!button) {
    return;
  }
  if (state.status === "deploy") {
    if (!state.units.some(function (unit) { return unit.kind === "character"; })) {
      button.textContent = "自キャラを配置";
    } else if (!state.units.some(function (unit) { return unit.kind === "tower"; })) {
      button.textContent = "タワーを配置";
    } else {
      button.textContent = "戦闘開始";
    }
    return;
  }
  button.textContent = state.status === "battle" ? (state.phase === "intro" ? "開始準備中..." : "進行中") : "開始";
}

function createSelectorStrip(def, type, selected, suffix) {
  const strip = document.createElement("button");
  const rarityClass = def.rarity ? " " + def.rarity : "";
  strip.type = "button";
  strip.className = "selector-strip" + rarityClass + (selected ? " selected" : "");
  const meta = [];
  if (type === "relic") {
    meta.push(RARITY_LABEL[def.rarity]);
    meta.push((def.tags || []).join(" / "));
  } else if (type === "character") {
    meta.push("自キャラ");
    meta.push("支援 + 攻撃");
  } else {
    meta.push("タワー");
    meta.push(def.abilities.join(" / "));
  }
  strip.innerHTML = [
    '<span class="selector-icon">', iconImg(def), "</span>",
    def.rarity ? '<span class="selector-rarity">' + RARITY_LABEL[def.rarity] + "</span>" : "",
    '<span class="selector-name">', def.name, suffix ? " " + suffix : "", "</span>",
    '<span class="selector-meta"><span class="meta-chip">', meta[0], '</span><span class="meta-chip">', meta[1], "</span></span>",
    '<div class="selector-description">', def.description, "</div>"
  ].join("");
  return strip;
}

function createEndTag(def) {
  const tag = document.createElement("span");
  tag.className = "ending-tag";
  tag.textContent = def.name;
  return tag;
}

function buildCharacterTooltip(def) {
  return [
    "<strong>", def.name, "</strong><br>",
    def.description, "<br>",
    "射程 ", String(Math.round(def.stats.range)), " / 攻撃 ", String(def.stats.damage), " / 間隔 ", def.stats.cooldown.toFixed(2), "秒<br>",
    "バフ: ", def.aura.label, "（範囲 ", String(def.aura.range), "）"
  ].join("");
}

function buildTowerTooltip(def) {
  return [
    "<strong>", def.name, "</strong><br>",
    def.description, "<br>",
    "射程 ", String(Math.round(def.stats.range)), " / 攻撃 ", String(def.stats.damage), " / 間隔 ", def.stats.cooldown.toFixed(2), "秒",
    def.stats.splash ? "<br>範囲 " + String(def.stats.splash) : "",
    def.stats.slow ? "<br>スロウ付与あり" : ""
  ].join("");
}

function buildSkillTooltip(def) {
  return [
    "<strong>", def.skill.name, "</strong><br>",
    def.skill.description, "<br>",
    "使用回数: ステージごとに ", String(def.skill.chargesPerStage), " 回"
  ].join("");
}

function buildRelicTooltip(def, synergyActive) {
  return [
    "<strong>", def.name, "</strong><br>",
    def.description, "<br>",
    "レア度: ", RARITY_LABEL[def.rarity], "<br>",
    synergyActive ? "シナジー成立中" : "シナジー未成立"
  ].join("");
}

function bindTooltip(element, html) {
  element.addEventListener("mouseenter", function (event) {
    refs.tooltip.innerHTML = html;
    refs.tooltip.classList.remove("hidden");
    moveTooltip(event);
  });
  element.addEventListener("mousemove", moveTooltip);
  element.addEventListener("mouseleave", hideTooltip);
}

function moveTooltip(event) {
  refs.tooltip.style.left = String(event.clientX + 16) + "px";
  refs.tooltip.style.top = String(event.clientY + 16) + "px";
}

function hideTooltip() {
  refs.tooltip.classList.add("hidden");
}

function getCombatStats(unit) {
  const relicProfile = getRelicProfile();
  const stage = stages[state.stageIndex] || stages[0];
  const stageBoost = stage.playerBoost || {};
  const def = unit.kind === "character" ? characterMap.get(unit.defId) : towerMap.get(unit.defId);
  let damage = def.stats.damage;
  let cooldown = def.stats.cooldown;
  let range = def.stats.range;
  let crit = def.stats.crit || 0;
  let critMultiplier = def.stats.critMultiplier || 1.7;
  let splash = def.stats.splash || 0;
  let slow = def.stats.slow || 0;
  let projectileSpeed = def.stats.projectileSpeed || 360;
  let jamResist = 0;

  if (unit.kind === "tower") {
  damage *= 1 + (stageBoost.towerDamageBonus || 0);
  cooldown *= 1 - (stageBoost.towerSpeedBonus || 0);
  damage *= 1 + relicProfile.towerDamageBonus;
  cooldown *= 1 - relicProfile.towerSpeedBonus;
  range *= 1 + relicProfile.towerRangeBonus;
  crit += relicProfile.towerCritBonus;
  splash += relicProfile.splashBonus;
  slow += relicProfile.slowPowerBonus;

  getAffectingCharacters(unit).forEach(function (characterUnit) {
    const aura = characterMap.get(characterUnit.defId).aura.buffs;
    damage *= 1 + (aura.damageBonus || 0);
    cooldown *= 1 - (aura.speedBonus || 0);
    range += aura.rangeAdd || 0;
    crit += aura.critAdd || 0;
    critMultiplier += aura.critDamageBonus || 0;
    slow += aura.slowAdd || 0;
    jamResist += aura.jamResist || 0;
  });

  if (state.globalBuffs.scriptRewriteUntil > state.now) {
    damage *= 1.35;
  }

  if (state.globalBuffs.encoreRushUntil > state.now) {
    cooldown *= 0.62;
  }

  if (state.globalBuffs.sugarOrchestraUntil > state.now) {
    damage *= 1.2;
    range += 28;
    crit += 0.12;
    splash += 18;
  }
}else {
    damage *= 1 + (stageBoost.characterDamageBonus || 0);
    damage *= 1 + relicProfile.characterDamageBonus;
  }

  if (unit.disruptUntil > state.now) {
    cooldown *= 1.55;
  }

  return {
    damage: damage,
    cooldown: cooldown,
    range: range,
    crit: crit,
    critMultiplier: critMultiplier,
    splash: splash,
    slow: slow,
    projectileSpeed: projectileSpeed,
    damageVsSlowed: relicProfile.damageVsSlowed,
    chainBonusPerKill: relicProfile.chainBonusPerKill,
    heavy: !!def.stats.heavy,
    jamResist: jamResist
  };
}

function getRelicProfile() {
  const profile = {
    towerDamageBonus: 0,
    towerSpeedBonus: 0,
    towerRangeBonus: 0,
    towerCritBonus: 0,
    characterDamageBonus: 0,
    slowPowerBonus: 0,
    splashBonus: 0,
    skillChargeBonus: 0,
    rewardBonusChoices: 0,
    chainBonusPerKill: 0,
    chainWindowBonus: 0,
    slowDot: 0,
    damageVsSlowed: 0,
    critSplash: 0,
    activeSkills: [],
    tagCounts: { studio: 0, dream: 0, candy: 0 },
    activeSynergyIds: []
  };

  state.collection.relicIds.forEach(function (relicId) {
    const def = relicMap.get(relicId);
    (def.tags || []).forEach(function (tag) {
      profile.tagCounts[tag] = (profile.tagCounts[tag] || 0) + 1;
    });
    const modifiers = def.modifiers || {};
    profile.towerDamageBonus += modifiers.towerDamageBonus || 0;
    profile.towerSpeedBonus += modifiers.towerSpeedBonus || 0;
    profile.towerRangeBonus += modifiers.towerRangeBonus || 0;
    profile.towerCritBonus += modifiers.towerCritBonus || 0;
    profile.characterDamageBonus += modifiers.characterDamageBonus || 0;
    profile.slowPowerBonus += modifiers.slowPowerBonus || 0;
    profile.splashBonus += modifiers.splashBonus || 0;
    profile.skillChargeBonus += modifiers.skillChargeBonus || 0;
    profile.rewardBonusChoices += modifiers.rewardBonusChoices || 0;
    profile.chainBonusPerKill += modifiers.chainBonusPerKill || 0;
    profile.chainWindowBonus += modifiers.chainWindowBonus || 0;
    profile.slowDot += modifiers.slowDot || 0;
    if (modifiers.activeSkill) {
      profile.activeSkills.push(modifiers.activeSkill);
    }
  });

  if (profile.tagCounts.studio >= 2) {
    profile.activeSynergyIds.push("studio");
    profile.towerSpeedBonus += 0.08;
  }
  if (profile.tagCounts.dream >= 2) {
    profile.activeSynergyIds.push("dream");
    profile.damageVsSlowed += 0.12;
  }
  if (profile.tagCounts.candy >= 2) {
    profile.activeSynergyIds.push("candy");
    profile.critSplash += 16;
  }
  return profile;
}

function getAffectingCharacters(towerUnit) {
  return state.units.filter(function (unit) {
    return unit.kind === "character";
  }).sort(function (a, b) {
    return a.placedAt - b.placedAt;
  }).filter(function (characterUnit) {
    const def = characterMap.get(characterUnit.defId);
    return distanceBetweenPoints(characterUnit, towerUnit) <= def.aura.range;
  }).slice(0, 2);
}

function pickTargetForUnit(unit, range) {
  let best = null;
  let bestProgress = -1;
  state.enemies.forEach(function (enemy) {
    const distance = distanceBetweenPoints(unit, enemy);
    if (!enemy.dead && distance <= range && enemy.distance > bestProgress) {
      best = enemy;
      bestProgress = enemy.distance;
    }
  });
  return best;
}

function getEnemiesInRadius(x, y, radius) {
  return state.enemies.filter(function (enemy) {
    return !enemy.dead && distanceBetweenPoints(enemy, { x: x, y: y }) <= radius;
  });
}

function addSlow(enemy, amount, duration) {
  enemy.slows.push({ amount: clamp(amount, 0, 0.75), until: state.now + duration });
}

function cleanupExpiredSlows(enemy) {
  enemy.slows = enemy.slows.filter(function (entry) {
    return entry.until > state.now;
  });
}

function getSlowAmount(enemy) {
  let slow = 0;
  if (state.globalBuffs.globalSlowUntil > state.now) {
    slow = Math.max(slow, state.globalBuffs.globalSlowAmount);
  }
  enemy.slows.forEach(function (entry) {
    if (entry.amount > slow) {
      slow = entry.amount;
    }
  });
  return clamp(slow, 0, 0.75);
}

function applyDisruptionAround(x, y, radius, duration, hardDisable) {
  state.units.forEach(function (unit) {
    if (unit.kind === "tower" && distanceBetweenPoints(unit, { x: x, y: y }) <= radius) {
      applyUnitDisruption(unit, duration, hardDisable);
    }
  });
}

function applyDisruptionLine(targetY, height, duration, hardDisable) {
  state.units.forEach(function (unit) {
    if (unit.kind === "tower" && Math.abs(unit.y - targetY) <= height) {
      applyUnitDisruption(unit, duration, hardDisable);
    }
  });
}

function applyUnitDisruption(unit, duration, hardDisable) {
  if (state.globalBuffs.jamShieldUntil > state.now) {
    return;
  }
  const adjusted = duration * Math.max(0.25, 1 - getCombatStats(unit).jamResist);
  if (hardDisable) {
    unit.disabledUntil = Math.max(unit.disabledUntil, state.now + adjusted);
  } else {
    unit.disruptUntil = Math.max(unit.disruptUntil, state.now + adjusted);
  }
}

function flashUnit(unit) {
  unit.element.classList.remove("preparing");
  void unit.element.offsetWidth;
  unit.element.classList.add("preparing");
}

function flashUnitGold(unit) {
  const el = unit.element;
  el.classList.add("gold-buff");
}

function removeUnitGold(unit) {
  const el = unit.element;
  el.classList.remove("gold-buff");
  el.classList.add("gold-buff-fade");
  window.setTimeout(function() { el.classList.remove("gold-buff-fade"); }, 600);
}

function triggerBuffGlow() {
  state.units.filter(function(u) { return u.kind === "tower"; }).forEach(function(towerUnit) {
    flashUnitGold(towerUnit);
  });
}

function updateBuffGlow() {
  const now = state.now;
  const buffActive = (state.globalBuffs.scriptRewriteUntil > now) ||
    (state.globalBuffs.encoreRushUntil > now) ||
    (state.globalBuffs.sugarOrchestraUntil > now);
  state.units.filter(function(u) { return u.kind === "tower"; }).forEach(function(towerUnit) {
    if (buffActive) {
      flashUnitGold(towerUnit);
    } else {
      if (towerUnit.element.classList.contains("gold-buff")) {
        removeUnitGold(towerUnit);
      }
    }
  });
}

function spawnTrail(x1, y1, x2, y2, palette, heavy) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const rotation = "rotate(" + String(Math.atan2(dy, dx)) + "rad)";
  [
    { className: "trail-line" + (heavy ? " heavy" : ""), duration: 180 },
    { className: "trail-line echo" + (heavy ? " heavy" : ""), duration: 230 }
  ].forEach(function (spec) {
    const line = document.createElement("div");
    line.className = spec.className;
    line.style.width = String(distance) + "px";
    line.style.left = String(x1) + "px";
    line.style.top = String(y1) + "px";
    line.style.transform = rotation;
    if (palette) {
      line.style.setProperty("--trail-a", palette.primary);
      line.style.setProperty("--trail-b", palette.secondary);
      line.style.setProperty("--trail-glow", palette.glow);
    }
    refs.effectLayer.appendChild(line);
    window.setTimeout(function () { line.remove(); }, spec.duration);
  });
}

function spawnAuraParticles() {
  if (state.status !== "battle") return;
  state.units.filter(function(u) { return u.kind === "character"; }).forEach(function(charUnit) {
    const charDef = characterMap.get(charUnit.defId);
    const palette = getFxPalette(charDef.iconKey);
    state.units.filter(function(u) { return u.kind === "tower"; }).forEach(function(towerUnit) {
      const dist = distanceBetweenPoints(charUnit, towerUnit);
      if (dist > charDef.aura.range) return;
      if (Math.random() > 0.18) return;
      const progress = Math.random();
      const px = charUnit.x + (towerUnit.x - charUnit.x) * progress;
      const py = charUnit.y + (towerUnit.y - charUnit.y) * progress;
      const particle = document.createElement("div");
      particle.className = "aura-particle";
      particle.style.left = String(px) + "px";
      particle.style.top = String(py) + "px";
      particle.style.setProperty("--particle-color", palette.primary || "#79d7ff");
      particle.style.setProperty("--particle-glow", palette.glow || "rgba(121,215,255,0.6)");
      const size = 3 + Math.random() * 4;
      particle.style.width = String(size) + "px";
      particle.style.height = String(size) + "px";
      const angle = Math.atan2(towerUnit.y - charUnit.y, towerUnit.x - charUnit.x);
      const speed = 18 + Math.random() * 14;
      particle.style.setProperty("--vx", String(Math.cos(angle) * speed) + "px");
      particle.style.setProperty("--vy", String(Math.sin(angle) * speed) + "px");
      refs.effectLayer.appendChild(particle);
      window.setTimeout(function() { particle.remove(); }, 600);
    });
  });
}

function spawnImpact(x, y, size) {
  const ring = document.createElement("div");
  ring.className = "impact-ring";
  ring.style.width = String(size) + "px";
  ring.style.height = String(size) + "px";
  positionElement(ring, x, y);
  refs.effectLayer.appendChild(ring);
  const flare = document.createElement("div");
  flare.className = "impact-flare" + (size >= 72 ? " heavy" : "");
  flare.style.width = String(Math.max(18, size * 0.56)) + "px";
  flare.style.height = String(Math.max(18, size * 0.56)) + "px";
  positionElement(flare, x, y);
  refs.effectLayer.appendChild(flare);
  window.setTimeout(function () {
    ring.remove();
    flare.remove();
  }, 420);
}

function spawnFloatingText(x, y, amount, critical) {
  const text = document.createElement("div");
  text.className = "floating-text" + (critical ? " critical" : "") + (amount >= 50 ? " massive" : "");
  text.textContent = String(amount);
  text.style.left = String(x) + "px";
  text.style.top = String(y) + "px";
  text.style.fontSize = String(critical ? 2.4 : amount >= 50 ? 1.92 : 1.32) + "rem";
  text.style.animation = critical ? "floatRiseCritical 0.94s ease-out forwards" : "floatRise 0.9s ease-out forwards";
  refs.effectLayer.appendChild(text);
  window.setTimeout(function () { text.remove(); }, 940);
}

function spawnWarningCircle(pathDistance, radius, telegraphDuration, onResolve) {
  const point = typeof pathDistance === "number" ? getPathPosition(pathDistance) : pathDistance;
  const circle = document.createElement("div");
  circle.className = "warning-circle";
  circle.style.width = String(radius * 2) + "px";
  circle.style.height = String(radius * 2) + "px";
  positionElement(circle, point.x, point.y);
  refs.warningLayer.appendChild(circle);
  state.warnings.push({ element: circle, resolveAt: state.now + telegraphDuration, onResolve: onResolve });
}

function spawnWarningLine(centerX, centerY, width, telegraphDuration, onResolve) {
  const line = document.createElement("div");
  line.className = "warning-line";
  line.style.width = String(width) + "px";
  positionElement(line, centerX, centerY);
  refs.warningLayer.appendChild(line);
  state.warnings.push({ element: line, resolveAt: state.now + telegraphDuration, onResolve: onResolve });
}

function updateWarnings() {
  for (let i = state.warnings.length - 1; i >= 0; i -= 1) {
    const warning = state.warnings[i];
    if (state.now >= warning.resolveAt) {
      warning.element.remove();
      if (warning.onResolve) {
        warning.onResolve();
      }
      state.warnings.splice(i, 1);
    }
  }
}

function showStageBanner(title, subtitle) {
  refs.stageBanner.innerHTML = "<strong>" + title + "</strong><br><span>" + subtitle + "</span>";
  refs.stageBanner.classList.remove("visible");
  void refs.stageBanner.offsetWidth;
  refs.stageBanner.classList.add("visible");
}

function showCutin(name, skillName, iconKey, imageUrl) {
  const palette = getFxPalette(iconKey);
  const cutin = document.createElement("div");
  cutin.className = "cutin visible";
  cutin.style.setProperty("--cutin-accent", palette.primary);
  cutin.style.setProperty("--cutin-sub", palette.secondary);
  cutin.style.setProperty("--cutin-glow", palette.glow);

  const portraitHtml = imageUrl
    ? '<img class="cutin-image" src="' + imageUrl + '" alt="' + (skillName || name || "skill") + '">'
    : iconSvg(iconKey || "trend");

  const portraitClass = imageUrl
    ? "cutin-portrait cutin-portrait-full"
    : "cutin-portrait";

  cutin.innerHTML = [
    '<span class="cutin-blade cutin-blade-a"></span>',
    '<span class="cutin-blade cutin-blade-b"></span>',
    '<span class="cutin-blade cutin-blade-c"></span>',
    '<div class="' + portraitClass + '">', portraitHtml, '</div>',
    '<div class="cutin-copy">',
      '<span class="cutin-kicker">SHOWTIME SKILL</span>',
      '<div class="cutin-title">', name || "", '</div>',
      '<div class="cutin-skill">', skillName || "", '</div>',
    '</div>',
    '<div class="cutin-slash-text">', skillName || "", '</div>'
  ].join("");

  spawnSkillFlash(palette);
  refs.cutinLayer.appendChild(cutin);

  window.setTimeout(function () {
    cutin.remove();
  }, 2200);
}

function showCharacterEntrance(iconKey, characterUnit, buffDuration) {
  const palette = getFxPalette(iconKey);

  const el = document.createElement("div");
  el.className = "char-entrance";
  el.style.setProperty("--entrance-color", palette.primary);
  el.style.setProperty("--entrance-glow", palette.glow);
  const charDefForEntrance = Array.from(characterMap.values()).find(function(c) { return c.iconKey === iconKey; });
  el.innerHTML = charDefForEntrance && charDefForEntrance.cutinImageUrl && charDefForEntrance.cutinImageUrl !== ""
    ? '<img src="' + charDefForEntrance.cutinImageUrl + '" style="width:100%;height:100%;object-fit:contain;" alt="">'
    : iconSvg(iconKey);

  // boardInner内の座標をそのまま使う
  const tx = characterUnit.x;
  const ty = characterUnit.y;

  // 初期位置：左側に大きく
  // 初期位置：左側に大きく
  el.style.left = "200px";
  el.style.top = "310px";
  el.style.transform = "translate(-50%,-50%) scale(1)";
  // フェーズ1：フェードイン（即座に）
  el.style.opacity = "0";
  refs.cutinLayer.appendChild(el);
  el.style.transition = "opacity 0.2s ease";
  requestAnimationFrame(function() {
    el.style.opacity = "1";
  });

  // フェーズ2：タワーへ縮小移動
  window.setTimeout(function() {
    el.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
    el.style.left = String(tx) + "px";
    el.style.top = String(ty) + "px";
    el.style.transform = "translate(-50%,-50%) scale(0.28)";
    el.style.opacity = "0.9";
  }, 900);

  // フェーズ3：タワーに乗った状態を維持
  window.setTimeout(function() {
    el.style.transition = "none";
    el.classList.add("char-on-tower");
  }, 1700);

  // バフ終了後に消える
  window.setTimeout(function() {
    el.style.transition = "opacity 0.4s ease";
    el.style.opacity = "0";
    window.setTimeout(function() { el.remove(); }, 400);
  }, (buffDuration * 1000) + 900);
}

function registerChainKill() {
  const relicProfile = getRelicProfile();
  const windowLength = 2.4 + relicProfile.chainWindowBonus;
  if (state.now - state.chainState.lastKillTime <= windowLength) {
    state.chainState.count += 1;
  } else {
    state.chainState.count = 1;
  }
  state.chainState.lastKillTime = state.now;
  if (state.chainState.count >= 3) {
    refs.chainBanner.innerHTML = "CHAIN " + String(state.chainState.count) + '<span class="chain-sub">SWEET BEAT</span>';
    refs.chainBanner.classList.remove("visible");
    void refs.chainBanner.offsetWidth;
    refs.chainBanner.classList.add("visible");
  }
}

function spawnSkillFlash(palette) {
  const flash = document.createElement("div");
  flash.className = "skill-flash";
  flash.style.setProperty("--flash-a", palette.primary);
  flash.style.setProperty("--flash-b", palette.secondary);
  flash.style.setProperty("--flash-glow", palette.glow);
  refs.cutinLayer.appendChild(flash);
  window.setTimeout(function () { flash.remove(); }, 700);
}

function spawnCoinBurst() {
  refs.coinBurst.innerHTML = "";
  for (let i = 0; i < 80; i += 1) {
    const coin = document.createElement("span");
    const size = randomRange(10, 28);
    coin.className = "coin" + (size > 20 ? " coin-large" : "");
    coin.style.left = String(randomRange(5, 95)) + "%";
    coin.style.top = String(randomRange(50, 95)) + "%";
    coin.style.width = String(size) + "px";
    coin.style.height = String(size) + "px";
    coin.style.setProperty("--coin-rise", String(randomRange(-420, -160)) + "px");
    coin.style.setProperty("--coin-shift", String(randomRange(-200, 200)) + "px");
    coin.style.animationDelay = String(randomRange(0, 0.6)) + "s";
    coin.style.animationDuration = String(randomRange(1.4, 2.4)) + "s";
    refs.coinBurst.appendChild(coin);
  }
}

function updateBoardShake(dt) {
  if (state.shakePower > 0.01) {
    state.shakePower = Math.max(0, state.shakePower - dt * 2.6);
    state.boardLayout.shakeX = (Math.random() - 0.5) * state.shakePower * 10;
    state.boardLayout.shakeY = (Math.random() - 0.5) * state.shakePower * 8;
  } else {
    state.boardLayout.shakeX = 0;
    state.boardLayout.shakeY = 0;
  }
  applyBoardTransform();
}

function shakeBoard(amount) {
  state.shakePower = Math.max(state.shakePower, amount);
}

function fitBoardToFrame() {
  if (!refs.boardFrame.clientWidth || !refs.boardFrame.clientHeight) {
    requestAnimationFrame(fitBoardToFrame);
    return;
  }
  const padding = 8;
  const availableWidth = Math.max(200, refs.boardFrame.clientWidth - padding);
  const availableHeight = Math.max(140, refs.boardFrame.clientHeight - padding);
  const scale = Math.min(availableWidth / BOARD_W, availableHeight / BOARD_H);
  state.boardLayout.scale = scale;
  state.boardLayout.offsetX = (availableWidth - BOARD_W * scale) / 2 + 8;
  state.boardLayout.offsetY = (availableHeight - BOARD_H * scale) / 2 + 8;
  applyBoardTransform();
}

function applyBoardTransform() {
  const layout = state.boardLayout;
  refs.boardInner.style.transform = "translate(" + (layout.offsetX + layout.shakeX).toFixed(2) + "px," + (layout.offsetY + layout.shakeY).toFixed(2) + "px) scale(" + layout.scale.toFixed(4) + ")";
}

function createIdMap(list) {
  const map = new Map();
  list.forEach(function (item) { map.set(item.id, item); });
  return map;
}

function initAudioUnlock() {
  function unlock() {
    ensureAudioContext();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
  }

  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });
  window.addEventListener("touchstart", unlock, { passive: true });
}

function createTone(freq, startTime, duration, options) {
  const ctx = ensureAudio();
  if (!ctx) return;

  const opts = options || {};
  const type = opts.type || "sine";
  const volume = opts.volume == null ? 0.12 : opts.volume;
  const attack = opts.attack == null ? 0.005 : opts.attack;
  const release = opts.release == null ? 0.08 : opts.release;
  const detune = opts.detune || 0;
  const destination =
    opts.destination && typeof opts.destination.connect === "function"
      ? opts.destination
      : audioState.sfx;

  if (!destination) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = opts.filterType || "lowpass";
  filter.frequency.value = opts.filterFrequency || 2400;
  filter.Q.value = opts.filterQ || 0.0001;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  osc.detune.setValueAtTime(detune, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + release);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  osc.start(startTime);
  osc.stop(startTime + duration + release + 0.02);
}

function playCountdownSe(count) {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freq = count <= 1 ? 1046.5 : count === 2 ? 880 : 659.25;

  createTone(freq, now, 0.08, {
    type: "square",
    volume: 0.09,
    filterFrequency: 2200
  });

  createTone(freq * 2, now + 0.012, 0.05, {
    type: "triangle",
    volume: 0.045,
    filterFrequency: 3200
  });
}

function playStageClearSe() {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  createTone(523.25, now, 0.08, { type: "triangle", volume: 0.08 });
  createTone(659.25, now + 0.08, 0.08, { type: "triangle", volume: 0.08 });
  createTone(783.99, now + 0.16, 0.1, { type: "triangle", volume: 0.08 });
  createTone(1046.5, now + 0.28, 0.24, { type: "sine", volume: 0.09 });
}

function playRewardSelectSe() {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  createTone(698.46, now, 0.05, { type: "square", volume: 0.07 });
  createTone(880, now + 0.045, 0.06, { type: "square", volume: 0.07 });
  createTone(1174.66, now + 0.09, 0.14, { type: "triangle", volume: 0.06 });
}

function stopSpecialBgm() {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  if (audioState.specialGain) {
    const now = ctx.currentTime;
    audioState.specialGain.gain.cancelScheduledValues(now);
    audioState.specialGain.gain.setValueAtTime(audioState.specialGain.gain.value, now);
    audioState.specialGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
  }

  audioState.specialOscillators.forEach(function (osc) {
    try {
      osc.stop(ctx.currentTime + 0.4);
    } catch (error) {}
  });

  audioState.specialOscillators = [];
  audioState.specialGain = null;
}

function triggerSpecialBgm(duration) {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  stopSpecialBgm();

  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.055, now + 0.2);
  gain.gain.setValueAtTime(0.055, now + Math.max(0.2, duration - 0.5));
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  gain.connect(audioState.musicBus);
  audioState.specialGain = gain;
  audioState.specialOscillators = [];

  const notes = [261.63, 329.63, 392, 523.25];
  notes.forEach(function (freq, index) {
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = index % 2 === 0 ? "sine" : "triangle";
    osc.frequency.setValueAtTime(freq, now);
    osc.detune.setValueAtTime(index * 3, now);

    oscGain.gain.value = index === 0 ? 0.5 : 0.22;

    osc.connect(oscGain);
    oscGain.connect(gain);

    osc.start(now);
    osc.stop(now + duration + 0.4);

    audioState.specialOscillators.push(osc);
  });

  window.setTimeout(function () {
    stopSpecialBgm();
  }, Math.ceil(duration * 1000));
}

function playPlacementSe() {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  createTone(523.25, now, 0.04, { type: "square", volume: 0.045, filterFrequency: 2200 });
  createTone(783.99, now + 0.025, 0.06, { type: "triangle", volume: 0.03, filterFrequency: 2600 });
}

function buildPathMetrics(points) {
  const segments = [];
  let totalLength = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i];
    const end = points[i + 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    segments.push({ start: start, end: end, length: length, from: totalLength, to: totalLength + length });
    totalLength += length;
  }
  return { segments: segments, totalLength: totalLength };
}

function getPathPosition(distanceValue) {
  const distance = clamp(distanceValue, 0, pathMetrics.totalLength);
  for (let i = 0; i < pathMetrics.segments.length; i += 1) {
    const segment = pathMetrics.segments[i];
    if (distance <= segment.to) {
      const local = (distance - segment.from) / segment.length;
      return { x: segment.start.x + (segment.end.x - segment.start.x) * local, y: segment.start.y + (segment.end.y - segment.start.y) * local };
    }
  }
  return PATH_POINTS[PATH_POINTS.length - 1];
}

function getEnemyDefinition(enemy) {
  if (enemy.family === "elite") { return eliteEnemyMap.get(enemy.defId); }
  if (enemy.family === "boss") { return bossMap.get(enemy.defId); }
  return normalEnemyMap.get(enemy.defId);
}

function getSlot(slotId) {
  return PLACEMENT_SLOTS.find(function (slot) { return slot.id === slotId; });
}

function findUnitBySlot(slotId) {
  return state.units.find(function (unit) { return unit.slotId === slotId; });
}

function findPlacedCharacter(characterId) {
  return state.units.find(function (unit) { return unit.kind === "character" && unit.defId === characterId; });
}

function findEnemyById(enemyId) {
  return state.enemies.find(function (enemy) { return enemy.id === enemyId; });
}

function getRemainingTowerCount(towerId) {
  const total = state.collection.towerStocks[towerId] || 0;
  const placed = state.units.filter(function (unit) { return unit.kind === "tower" && unit.defId === towerId; }).length;
  return Math.max(0, total - placed);
}

function canPlaceSelectedOnSlot() {
  if (!state.selectedPlacement) { return false; }
  if (state.selectedPlacement.kind === "character") {
    return !findPlacedCharacter(state.selectedPlacement.id);
  }
  return getRemainingTowerCount(state.selectedPlacement.id) > 0;
}

function canManagePlacements() {
  return state.status === "deploy" || state.status === "battle";
}

function hasPlacedStarterLoadout() {
  return state.units.some(function (unit) { return unit.kind === "character"; })
    && state.units.some(function (unit) { return unit.kind === "tower"; });
}

function positionElement(element, x, y) {
  element.style.left = String(x) + "px";
  element.style.top = String(y) + "px";
}

function distanceBetweenPoints(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function pickSeveral(pool, count) {
  const copy = pool.slice();
  const picked = [];
  while (copy.length && picked.length < count) {
    const index = Math.floor(Math.random() * copy.length);
    picked.push(copy.splice(index, 1)[0]);
  }
  return picked;
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function getFxPalette(iconKey) {
  switch (iconKey) {
    case "rimu":
      return { primary: "#6ff3ff", secondary: "#ffd36b", glow: "rgba(111, 243, 255, 0.48)" };
    case "planner":
      return { primary: "#ff8f6d", secondary: "#ffe06c", glow: "rgba(255, 143, 109, 0.44)" };
    case "hype":
      return { primary: "#ff6f95", secondary: "#ffd36b", glow: "rgba(255, 111, 149, 0.42)" };
    case "patissier":
      return { primary: "#ffbd6a", secondary: "#8ef3de", glow: "rgba(255, 189, 106, 0.44)" };
    case "moderator":
      return { primary: "#7be8c8", secondary: "#8ac3ff", glow: "rgba(123, 232, 200, 0.42)" };
    case "clipmaster":
    case "trend":
      return { primary: "#ff5f66", secondary: "#fff18e", glow: "rgba(255, 95, 102, 0.46)" };
    case "comment_cannon":
    case "macaron_launcher":
      return { primary: "#ff9656", secondary: "#fff08e", glow: "rgba(255, 150, 86, 0.44)" };
    case "candy_shooter":
      return { primary: "#6bf0d5", secondary: "#ffe06e", glow: "rgba(107, 240, 213, 0.42)" };
    case "signal_prism":
      return { primary: "#8acfff", secondary: "#ff8fbf", glow: "rgba(138, 207, 255, 0.42)" };
    default:
      return { primary: "#ffb25d", secondary: "#79d7ff", glow: "rgba(255, 178, 93, 0.42)" };
  }
}

function iconImg(def) {
  if (def && def.imageUrl && def.imageUrl !== "") {
    return '<img src="' + def.imageUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" alt="' + (def.name || "") + '">';
  }
  return iconSvg(def ? def.iconKey : "trend");
}

function iconSvg(key) {
  const stroke = "#ffe9c7";
  const fillA = "#ffb75f";
  const fillB = "#58dfcf";

  switch (key) {
    case "rimu":
      return '<svg viewBox="0 0 64 64"><path fill="' + fillA + '" d="M18 56c2-10 8-16 14-16s12 6 14 16z"/><circle cx="32" cy="22" r="12" fill="' + fillB + '"/><path fill="' + stroke + '" d="M18 20l6-10 8 6 8-6 6 10-14 8z"/></svg>';
    case "planner":
      return '<svg viewBox="0 0 64 64"><rect x="14" y="12" width="36" height="40" rx="8" fill="' + fillA + '"/><path d="M22 24h20M22 32h20M22 40h12" stroke="' + stroke + '" stroke-width="4" stroke-linecap="round"/></svg>';
    case "hype":
      return '<svg viewBox="0 0 64 64"><path d="M16 44l16-28 16 28" fill="' + fillA + '"/><path d="M22 44h20" stroke="' + stroke + '" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="24" r="6" fill="' + fillB + '"/></svg>';
    case "patissier":
      return '<svg viewBox="0 0 64 64"><circle cx="32" cy="22" r="11" fill="' + fillB + '"/><path fill="' + fillA + '" d="M16 52c3-12 10-18 16-18s13 6 16 18z"/><path d="M22 14h20" stroke="' + stroke + '" stroke-width="4" stroke-linecap="round"/></svg>';
    case "moderator":
      return '<svg viewBox="0 0 64 64"><path fill="' + fillA + '" d="M20 18h24l6 10-18 18L14 28z"/><path d="M26 26l12 12" stroke="' + stroke + '" stroke-width="4" stroke-linecap="round"/></svg>';
    case "clipmaster":
      return '<svg viewBox="0 0 64 64"><path fill="' + fillA + '" d="M16 18l24-8 8 24-24 8z"/><path d="M18 40l14 14 14-14" stroke="' + fillB + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    case "mic_tower":
      return '<svg viewBox="0 0 64 64"><rect x="22" y="10" width="20" height="28" rx="10" fill="' + fillA + '"/><path d="M32 38v12M24 50h16" stroke="' + stroke + '" stroke-width="4" stroke-linecap="round"/></svg>';
    case "mixer_tower":
      return '<svg viewBox="0 0 64 64"><rect x="12" y="16" width="40" height="32" rx="10" fill="' + fillB + '"/><circle cx="24" cy="32" r="5" fill="' + fillA + '"/><circle cx="40" cy="32" r="5" fill="' + fillA + '"/></svg>';
    case "comment_cannon":
      return '<svg viewBox="0 0 64 64"><path fill="' + fillA + '" d="M14 24h30l6 8-6 8H14z"/><circle cx="24" cy="48" r="6" fill="' + fillB + '"/><circle cx="40" cy="48" r="6" fill="' + fillB + '"/></svg>';
    case "candy_shooter":
      return '<svg viewBox="0 0 64 64"><circle cx="22" cy="22" r="10" fill="' + fillA + '"/><path d="M30 22h18" stroke="' + fillB + '" stroke-width="6" stroke-linecap="round"/><path d="M22 32v14" stroke="' + stroke + '" stroke-width="4" stroke-linecap="round"/></svg>';
    case "macaron_launcher":
      return '<svg viewBox="0 0 64 64"><circle cx="32" cy="20" r="12" fill="' + fillA + '"/><path fill="' + fillB + '" d="M18 36h28l-4 14H22z"/></svg>';
    case "signal_prism":
      return '<svg viewBox="0 0 64 64"><path fill="' + fillB + '" d="M32 10l16 16-16 28-16-28z"/><path d="M32 18v24" stroke="' + stroke + '" stroke-width="4" stroke-linecap="round"/></svg>';
    case "comment":
      return '<svg viewBox="0 0 64 64"><path fill="' + fillA + '" d="M14 16h36v22H28l-10 10v-10H14z"/></svg>';
    case "clip":
      return '<svg viewBox="0 0 64 64"><path fill="' + fillA + '" d="M18 18h28v20H30L18 50z"/><path d="M24 24l16 8-16 8" fill="' + fillB + '"/></svg>';
    case "zoom":
      return '<svg viewBox="0 0 64 64"><circle cx="28" cy="28" r="12" fill="' + fillA + '"/><path d="M38 38l10 10" stroke="' + stroke + '" stroke-width="5" stroke-linecap="round"/></svg>';
    case "dream":
      return '<svg viewBox="0 0 64 64"><path fill="' + fillB + '" d="M14 34c0-12 8-20 18-20 7 0 12 4 16 12 4 8 8 10 12 10-4 8-12 14-24 14-12 0-22-6-22-16z"/></svg>';
    case "coffee":
      return '<svg viewBox="0 0 64 64"><path fill="' + fillA + '" d="M16 20h24v22H16z"/><path d="M40 26h6c4 0 6 2 6 5s-2 5-6 5h-6" stroke="' + stroke + '" stroke-width="4" fill="none"/><path d="M22 14c0-4 4-4 4-8M32 14c0-4 4-4 4-8" stroke="' + fillB + '" stroke-width="4" stroke-linecap="round"/></svg>';
    case "overload":
      return '<svg viewBox="0 0 64 64"><path fill="' + fillA + '" d="M32 8l8 18h-8l4 10-20 20 6-18h-8z"/></svg>';
    case "rain":
      return '<svg viewBox="0 0 64 64"><path fill="' + fillB + '" d="M18 20h28a8 8 0 010 16H18a8 8 0 010-16z"/><path d="M20 42l-4 8M32 42l-4 10M44 42l-4 8" stroke="' + fillA + '" stroke-width="5" stroke-linecap="round"/></svg>';
    case "archive":
      return '<svg viewBox="0 0 64 64"><rect x="16" y="14" width="32" height="36" rx="8" fill="' + fillA + '"/><path d="M22 22h20M22 30h20M22 38h12" stroke="' + stroke + '" stroke-width="4" stroke-linecap="round"/></svg>';
    case "mixer":
      return '<svg viewBox="0 0 64 64"><circle cx="22" cy="22" r="8" fill="' + fillA + '"/><circle cx="42" cy="22" r="8" fill="' + fillB + '"/><path d="M20 42h24" stroke="' + stroke + '" stroke-width="6" stroke-linecap="round"/></svg>';
    case "rack":
      return '<svg viewBox="0 0 64 64"><rect x="16" y="12" width="8" height="40" fill="' + fillA + '"/><rect x="40" y="12" width="8" height="40" fill="' + fillA + '"/><path d="M24 20h16M24 32h16M24 44h16" stroke="' + fillB + '" stroke-width="5" stroke-linecap="round"/></svg>';
    case "loop":
      return '<svg viewBox="0 0 64 64"><path d="M22 22c8-10 22-6 22 6 0 12-14 16-22 6" stroke="' + fillA + '" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M18 18l4 4-4 4" stroke="' + fillB + '" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    case "battery":
      return '<svg viewBox="0 0 64 64"><rect x="18" y="16" width="26" height="32" rx="6" fill="' + fillA + '"/><rect x="44" y="26" width="4" height="12" fill="' + stroke + '"/><path d="M28 22v20M22 32h12" stroke="' + fillB + '" stroke-width="4" stroke-linecap="round"/></svg>';
    case "trend":
      return '<svg viewBox="0 0 64 64"><path d="M16 42l10-10 8 8 14-18" stroke="' + fillA + '" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 14h12v12" stroke="' + fillB + '" stroke-width="5" fill="none" stroke-linecap="round"/></svg>';
    case "enemy-shield":
      return '<svg viewBox="0 0 64 64"><path fill="' + fillA + '" d="M32 10l16 6v14c0 12-8 20-16 24-8-4-16-12-16-24V16z"/></svg>';
    case "enemy-noise":
      return '<svg viewBox="0 0 64 64"><path d="M14 34c8-10 14 10 22 0s14 10 22 0" stroke="' + fillB + '" stroke-width="6" fill="none" stroke-linecap="round"/></svg>';
    case "enemy-speed":
      return '<svg viewBox="0 0 64 64"><path d="M16 24h18M12 32h26M20 40h18" stroke="' + fillA + '" stroke-width="6" stroke-linecap="round"/></svg>';
    case "enemy-split":
      return '<svg viewBox="0 0 64 64"><circle cx="24" cy="32" r="10" fill="' + fillA + '"/><circle cx="42" cy="24" r="8" fill="' + fillB + '"/><circle cx="42" cy="40" r="8" fill="' + fillB + '"/></svg>';
    case "enemy-regen":
      return '<svg viewBox="0 0 64 64"><path d="M32 14v36M14 32h36" stroke="' + fillB + '" stroke-width="6" stroke-linecap="round"/><circle cx="32" cy="32" r="18" stroke="' + fillA + '" stroke-width="4" fill="none"/></svg>';
    case "boss":
      return '<svg viewBox="0 0 64 64"><path fill="' + fillA + '" d="M16 48l4-24 12 8 12-8 4 24z"/><path fill="' + fillB + '" d="M18 24L26 12l6 6 6-6 8 12-10 6H28z"/></svg>';
    default:
      return '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="18" fill="' + fillA + '"/></svg>';
  }
}