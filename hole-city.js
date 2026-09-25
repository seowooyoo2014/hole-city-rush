import * as THREE from "./assets/vendor/three.module.js";

const canvas = document.querySelector("#gameCanvas");
const scoreValue = document.querySelector("#scoreValue");
const levelValue = document.querySelector("#levelValue");
const stageValue = document.querySelector("#stageValue");
const targetValue = document.querySelector("#targetValue");
const growthBar = document.querySelector("#growthBar");
const progressValue = document.querySelector("#progressValue");
const stageTrack = document.querySelector("#stageTrack");
const transitionTrack = document.querySelector("#transitionTrack");
const modeSelector = document.querySelector("#modeSelector");
const modeButtons = [...modeSelector.querySelectorAll("button[data-mode]")];
const objectiveText = document.querySelector("#objectiveText");
const centerMessage = document.querySelector("#centerMessage");
const startButton = document.querySelector("#startButton");
const resetButton = document.querySelector("#resetButton");
const touchPad = document.querySelector("#touchPad");
const touchStick = document.querySelector("#touchStick");
const finalCinematic = document.querySelector("#finalCinematic");
const finalBattleVideo = document.querySelector("#finalBattleVideo");
const cinematicStatus = document.querySelector("#cinematicStatus");
const cinematicSoundButton = document.querySelector("#cinematicSoundButton");
const cinematicSkipButton = document.querySelector("#cinematicSkipButton");

const tmpVector = new THREE.Vector3();
const tmpColor = new THREE.Color();

const STAGES = [
  {
    id: "city",
    name: "도시",
    nextName: "메트로",
    objective: "상자와 벤치부터 삼키세요",
    targetLabel: "도로",
    targetScore: 560,
    worldSize: 82,
    startRadius: 2.5,
    maxRadius: 8.6,
    fogNear: 48,
    fogFar: 122,
    sky: "#9fd5df",
    ground: "#6fc58a",
    road: "#4f5a58",
    accent: "#ffd166",
    cameraHeight: 18,
    cameraDistance: 19,
  },
  {
    id: "metro",
    name: "메트로",
    nextName: "행성",
    objective: "도로와 고층 빌딩을 통째로 삼키세요",
    targetLabel: "도시 블록",
    targetScore: 1450,
    worldSize: 112,
    startRadius: 3.4,
    maxRadius: 12.8,
    fogNear: 62,
    fogFar: 164,
    sky: "#c6c1ad",
    ground: "#7f9685",
    road: "#30383d",
    accent: "#ff8c61",
    cameraHeight: 24,
    cameraDistance: 27,
  },
  {
    id: "planet",
    name: "행성",
    nextName: "태양계",
    objective: "대륙, 산맥, 구름 도시를 흡수하세요",
    targetLabel: "행성 조각",
    targetScore: 3200,
    worldSize: 145,
    startRadius: 4.8,
    maxRadius: 17.5,
    fogNear: 76,
    fogFar: 210,
    sky: "#87a6d8",
    ground: "#416f91",
    road: "#6ac28d",
    accent: "#f6e27a",
    cameraHeight: 34,
    cameraDistance: 40,
  },
  {
    id: "solar",
    name: "태양계",
    nextName: "은하계",
    objective: "소행성, 위성, 행성을 빨아들이세요",
    targetLabel: "행성",
    targetScore: 6500,
    worldSize: 190,
    startRadius: 6.4,
    maxRadius: 24,
    fogNear: 92,
    fogFar: 250,
    sky: "#070914",
    ground: "#101321",
    road: "#252d44",
    accent: "#79d7ff",
    cameraHeight: 48,
    cameraDistance: 56,
  },
  {
    id: "galaxy",
    name: "은하계",
    nextName: "완료",
    objective: "별무리와 은하 코어까지 삼키세요",
    targetLabel: "은하 코어",
    targetScore: 9800,
    worldSize: 230,
    startRadius: 8,
    maxRadius: 32,
    fogNear: 110,
    fogFar: 305,
    sky: "#050611",
    ground: "#0c1020",
    road: "#21213d",
    accent: "#ff7fd1",
    cameraHeight: 62,
    cameraDistance: 72,
  },
];

const HERO_DEFS = [
  { id: "ironman", name: "아이언맨", squad: "avengers", role: "ranged", moveType: "flying", modelVariant: "armor", color: "#b51f2e", accent: "#ffd166", hp: 260, speed: 7.5, range: 11, damage: 24, cooldown: 0.68, basicAttack: "repulsor", skill: "missiles", ultimate: "unibeam" },
  { id: "captain", name: "캡틴 아메리카", squad: "avengers", role: "tank", moveType: "ground", modelVariant: "shield", color: "#2455a4", accent: "#f5f7fa", hp: 360, speed: 6, range: 7.5, damage: 27, cooldown: 0.82, basicAttack: "shield", skill: "guard", ultimate: "shieldStorm" },
  { id: "thor", name: "토르", squad: "avengers", role: "bruiser", moveType: "flying", modelVariant: "hammer", color: "#263b68", accent: "#8be9ff", hp: 390, speed: 6.2, range: 10, damage: 34, cooldown: 0.9, basicAttack: "hammer", skill: "lightning", ultimate: "stormbreaker" },
  { id: "hulk", name: "헐크", squad: "avengers", role: "tank", moveType: "leap", modelVariant: "giant", color: "#58a84f", accent: "#9d6ac4", hp: 580, speed: 5.4, range: 3, damage: 48, cooldown: 0.92, basicAttack: "smash", skill: "leap", ultimate: "slam", scale: 1.28 },
  { id: "widow", name: "블랙 위도우", squad: "avengers", role: "assassin", moveType: "ground", modelVariant: "batons", color: "#20232b", accent: "#e65f52", hp: 235, speed: 7.4, range: 5, damage: 20, cooldown: 0.46, basicAttack: "baton", skill: "stun", ultimate: "widowBurst" },
  { id: "hawkeye", name: "호크아이", squad: "avengers", role: "ranged", moveType: "ground", modelVariant: "bow", color: "#49345f", accent: "#b38cff", hp: 225, speed: 6.5, range: 13, damage: 27, cooldown: 0.7, basicAttack: "arrow", skill: "multiArrow", ultimate: "explosiveArrow" },
  { id: "warmachine", name: "워 머신", squad: "avengers", role: "ranged", moveType: "flying", modelVariant: "cannon", color: "#4c5662", accent: "#ff694d", hp: 330, speed: 6.5, range: 12, damage: 25, cooldown: 0.7, basicAttack: "repulsor", skill: "missiles", ultimate: "warBarrage" },
  { id: "falcon", name: "팔콘", squad: "avengers", role: "ranged", moveType: "flying", modelVariant: "wings", color: "#6b2630", accent: "#d5d9df", hp: 245, speed: 8.5, range: 10, damage: 20, cooldown: 0.52, basicAttack: "blaster", skill: "airStrafe", ultimate: "redwing" },
  { id: "winter", name: "윈터 솔져", squad: "avengers", role: "ranged", moveType: "ground", modelVariant: "rifle", color: "#303942", accent: "#aebac7", hp: 285, speed: 6.6, range: 11, damage: 24, cooldown: 0.58, basicAttack: "rifle", skill: "metalPunch", ultimate: "rifleBurst" },
  { id: "scarlet", name: "스칼렛 위치", squad: "mystic", role: "controller", moveType: "flying", modelVariant: "magic", color: "#8e1f3d", accent: "#ff496f", hp: 260, speed: 6.8, range: 12, damage: 30, cooldown: 0.78, basicAttack: "chaosBolt", skill: "telekinesis", ultimate: "chaosWave" },
  { id: "vision", name: "비전", squad: "avengers", role: "support", moveType: "flying", modelVariant: "cape", color: "#9e3e52", accent: "#f3df58", hp: 330, speed: 6.9, range: 11, damage: 28, cooldown: 0.74, basicAttack: "mindBeam", skill: "phase", ultimate: "mindWave" },
  { id: "spiderman", name: "스파이더맨", squad: "avengers", role: "controller", moveType: "leap", modelVariant: "web", color: "#cf2639", accent: "#2f67bb", hp: 250, speed: 8.4, range: 8, damage: 21, cooldown: 0.52, basicAttack: "web", skill: "webSnare", ultimate: "webStorm" },
  { id: "strange", name: "닥터 스트레인지", squad: "mystic", role: "controller", moveType: "flying", modelVariant: "capeMagic", color: "#1e3760", accent: "#ff9b42", hp: 275, speed: 6.4, range: 13, damage: 29, cooldown: 0.76, basicAttack: "portal", skill: "timeSlow", ultimate: "mirrorBurst" },
  { id: "wong", name: "웡", squad: "mystic", role: "support", moveType: "ground", modelVariant: "magic", color: "#6b2f3a", accent: "#ffb14d", hp: 300, speed: 5.9, range: 11, damage: 23, cooldown: 0.72, basicAttack: "portal", skill: "barrier", ultimate: "portalArmy" },
  { id: "panther", name: "블랙 팬서", squad: "wakanda", role: "assassin", moveType: "ground", modelVariant: "claws", color: "#17151e", accent: "#a985ff", hp: 310, speed: 8.6, range: 3.2, damage: 33, cooldown: 0.56, basicAttack: "claw", skill: "dash", ultimate: "kineticBurst" },
  { id: "shuri", name: "슈리", squad: "wakanda", role: "ranged", moveType: "ground", modelVariant: "gauntlets", color: "#6d3a7b", accent: "#74e7ff", hp: 235, speed: 6.7, range: 12, damage: 24, cooldown: 0.56, basicAttack: "sonic", skill: "sonicPush", ultimate: "sonicWave" },
  { id: "okoye", name: "오코예", squad: "wakanda", role: "tank", moveType: "ground", modelVariant: "spear", color: "#9d2535", accent: "#d8b46a", hp: 330, speed: 6.4, range: 4.5, damage: 29, cooldown: 0.64, basicAttack: "spear", skill: "guard", ultimate: "spearStorm" },
  { id: "antman", name: "앤트맨", squad: "avengers", role: "bruiser", moveType: "ground", modelVariant: "helmet", color: "#a92534", accent: "#d9dce2", hp: 320, speed: 6.2, range: 4, damage: 31, cooldown: 0.7, basicAttack: "punch", skill: "shrinkDodge", ultimate: "giantStomp", scale: 1.08 },
  { id: "wasp", name: "와스프", squad: "avengers", role: "assassin", moveType: "flying", modelVariant: "waspWings", color: "#282c32", accent: "#f0c83d", hp: 235, speed: 9, range: 8, damage: 22, cooldown: 0.48, basicAttack: "sting", skill: "shrinkDodge", ultimate: "waspSwarm" },
  { id: "marvel", name: "캡틴 마블", squad: "cosmic", role: "bruiser", moveType: "flying", modelVariant: "aura", color: "#1e4f91", accent: "#ffd34e", hp: 410, speed: 8.2, range: 10, damage: 38, cooldown: 0.66, basicAttack: "flare", skill: "photonDash", ultimate: "binaryBlast" },
  { id: "starlord", name: "스타로드", squad: "guardians", role: "ranged", moveType: "flying", modelVariant: "dualGuns", color: "#6d2633", accent: "#72d6ff", hp: 265, speed: 7.6, range: 11, damage: 23, cooldown: 0.5, basicAttack: "blaster", skill: "jetDash", ultimate: "quadBlaster" },
  { id: "gamora", name: "가모라", squad: "guardians", role: "assassin", moveType: "ground", modelVariant: "sword", color: "#385d45", accent: "#d8dce2", hp: 285, speed: 7.8, range: 3.5, damage: 34, cooldown: 0.58, basicAttack: "sword", skill: "dash", ultimate: "swordCombo" },
  { id: "drax", name: "드랙스", squad: "guardians", role: "bruiser", moveType: "ground", modelVariant: "knives", color: "#66796c", accent: "#d74c4c", hp: 390, speed: 6.2, range: 3.2, damage: 38, cooldown: 0.64, basicAttack: "knife", skill: "rage", ultimate: "knifeStorm" },
  { id: "rocket", name: "로켓", squad: "guardians", role: "ranged", moveType: "ground", modelVariant: "bigGun", color: "#8a6848", accent: "#ff8a4d", hp: 205, speed: 7.2, range: 13, damage: 27, cooldown: 0.58, basicAttack: "rifle", skill: "bomb", ultimate: "heavyCannon", scale: 0.7 },
  { id: "groot", name: "그루트", squad: "guardians", role: "tank", moveType: "ground", modelVariant: "tree", color: "#77543c", accent: "#8fcf72", hp: 520, speed: 4.8, range: 6, damage: 31, cooldown: 0.78, basicAttack: "branch", skill: "roots", ultimate: "grootShield", scale: 1.3 },
  { id: "mantis", name: "맨티스", squad: "guardians", role: "support", moveType: "ground", modelVariant: "antenna", color: "#395f4a", accent: "#8dffba", hp: 230, speed: 6.1, range: 8, damage: 14, cooldown: 0.72, basicAttack: "mindPulse", skill: "sleep", ultimate: "massSleep" },
  { id: "nebula", name: "네뷸라", squad: "guardians", role: "assassin", moveType: "ground", modelVariant: "cyberSword", color: "#315e8d", accent: "#c8d0d8", hp: 290, speed: 7.7, range: 4, damage: 31, cooldown: 0.58, basicAttack: "sword", skill: "cyberDash", ultimate: "bladeRush" },
  { id: "valkyrie", name: "발키리", squad: "asgard", role: "bruiser", moveType: "flying", modelVariant: "spearCape", color: "#2d3b52", accent: "#e6d8b1", hp: 340, speed: 7.4, range: 5.5, damage: 34, cooldown: 0.66, basicAttack: "spear", skill: "skyCharge", ultimate: "valkyrieDive" },
  { id: "korg", name: "코르그", squad: "asgard", role: "tank", moveType: "ground", modelVariant: "rock", color: "#7a8790", accent: "#c5d4dd", hp: 540, speed: 4.6, range: 3.2, damage: 39, cooldown: 0.82, basicAttack: "smash", skill: "rockGuard", ultimate: "rockQuake", scale: 1.24 },
  { id: "rescue", name: "레스큐", squad: "avengers", role: "support", moveType: "flying", modelVariant: "rescueArmor", color: "#7750a5", accent: "#72eaff", hp: 300, speed: 7.2, range: 11, damage: 22, cooldown: 0.64, basicAttack: "repulsor", skill: "rescueHeal", ultimate: "rescueBarrier" },
];

const HERO_DISPLAY_SCALE = 2.3;
const HERO_VISUALS = {
  ironman: { build: "armored", face: "ironMask", skin: "#d7aa87", secondary: "#e6a72e", hair: null, chest: "reactor" },
  captain: { build: "athletic", face: "cowl", skin: "#d7aa87", secondary: "#c8343c", hair: "#7b583b", chest: "star" },
  thor: { build: "broad", face: "open", skin: "#dfb08a", secondary: "#9d2635", hair: "#d5b56f", beard: true, chest: "discs" },
  hulk: { build: "massive", face: "open", skin: "#62ad55", secondary: "#684789", hair: "#202622", chest: "bare" },
  widow: { build: "slim", face: "open", skin: "#d7a27f", secondary: "#3d434c", hair: "#b34b32", chest: "belt" },
  hawkeye: { build: "athletic", face: "visor", skin: "#d5a27f", secondary: "#171a20", hair: "#694735", chest: "strap" },
  warmachine: { build: "armored", face: "warMask", skin: "#6f4b3d", secondary: "#7b858d", hair: null, chest: "reactor" },
  falcon: { build: "athletic", face: "goggles", skin: "#76503d", secondary: "#d4d9df", hair: "#201a18", chest: "harness" },
  winter: { build: "athletic", face: "open", skin: "#d0a17f", secondary: "#8e9aa6", hair: "#3d3029", chest: "strap", metalArm: true },
  scarlet: { build: "slim", face: "crown", skin: "#d7a17f", secondary: "#321a2b", hair: "#8b3d2d", chest: "corset" },
  vision: { build: "athletic", face: "vision", skin: "#a84d63", secondary: "#d9bf45", hair: null, chest: "gem" },
  spiderman: { build: "slim", face: "webMask", skin: "#cf2639", secondary: "#28539d", hair: null, chest: "spider" },
  strange: { build: "athletic", face: "open", skin: "#d4a17c", secondary: "#a92435", hair: "#2b2525", beard: true, chest: "amulet" },
  wong: { build: "broad", face: "open", skin: "#c28d67", secondary: "#da9b42", hair: "#24201e", chest: "sash" },
  panther: { build: "athletic", face: "pantherMask", skin: "#674734", secondary: "#6e56a5", hair: null, chest: "necklace" },
  shuri: { build: "slim", face: "open", skin: "#714a36", secondary: "#1b252b", hair: "#1d1918", chest: "necklace" },
  okoye: { build: "athletic", face: "open", skin: "#704733", secondary: "#d2a95b", hair: null, chest: "armor" },
  antman: { build: "armored", face: "antHelmet", skin: "#d3a17e", secondary: "#c9cdd3", hair: null, chest: "disc" },
  wasp: { build: "slim", face: "waspHelmet", skin: "#d2a07d", secondary: "#d0ae36", hair: null, chest: "harness" },
  marvel: { build: "athletic", face: "open", skin: "#d9a580", secondary: "#c72c39", hair: "#d2ae67", chest: "star" },
  starlord: { build: "athletic", face: "starHelmet", skin: "#d4a17c", secondary: "#303944", hair: "#704a32", chest: "jacket" },
  gamora: { build: "slim", face: "open", skin: "#55945f", secondary: "#171a1d", hair: "#291f25", chest: "armor" },
  drax: { build: "broad", face: "open", skin: "#82958a", secondary: "#7e3034", hair: null, chest: "tattoo" },
  rocket: { build: "compact", face: "rocket", skin: "#8b6849", secondary: "#243745", hair: "#5c4938", chest: "harness" },
  groot: { build: "tree", face: "groot", skin: "#7a583f", secondary: "#4f8a52", hair: null, chest: "bark" },
  mantis: { build: "slim", face: "antennae", skin: "#d0a17d", secondary: "#243d31", hair: "#262120", chest: "panel" },
  nebula: { build: "slim", face: "cyber", skin: "#4c7ead", secondary: "#8e2946", hair: null, chest: "armor" },
  valkyrie: { build: "athletic", face: "open", skin: "#81583f", secondary: "#e3ded3", hair: "#29211e", chest: "armor" },
  korg: { build: "rock", face: "rock", skin: "#87949d", secondary: "#5a6871", hair: null, chest: "rock" },
  rescue: { build: "armored", face: "rescueMask", skin: "#d2a17f", secondary: "#c8a8e6", hair: null, chest: "reactor" },
};

const ENEMY_DEFS = {
  chitauri: { name: "치타우리", color: "#596b70", accent: "#72d7e8", hp: 58, speed: 4.7, range: 8, damage: 9, cooldown: 1.05, basicAttack: "enemyBolt", scale: 0.82 },
  outrider: { name: "아웃라이더", color: "#403b46", accent: "#d96b6b", hp: 72, speed: 6.2, range: 2.3, damage: 11, cooldown: 0.8, basicAttack: "melee", scale: 0.76 },
  ultronDrone: { name: "울트론 드론", color: "#6e737b", accent: "#ff5555", hp: 54, speed: 5.4, range: 9, damage: 10, cooldown: 0.92, basicAttack: "enemyBolt", scale: 0.78, flying: true },
  sakaaran: { name: "사카아란", color: "#6b4e42", accent: "#ff9a5d", hp: 66, speed: 4.8, range: 3, damage: 10, cooldown: 0.94, basicAttack: "melee", scale: 0.82 },
  thanos: { name: "타노스", color: "#6f4c87", accent: "#d7ae52", hp: 1800, speed: 4.2, range: 5, damage: 31, cooldown: 0.78, basicAttack: "gauntlet", skill: "boss", ultimate: "infinityWave", scale: 1.62 },
  loki: { name: "로키", color: "#234f3b", accent: "#d8b94d", hp: 620, speed: 6.8, range: 10, damage: 22, cooldown: 0.66, basicAttack: "scepter", skill: "clone", ultimate: "lokiBlast", scale: 1.02 },
  ultron: { name: "울트론", color: "#5f6670", accent: "#ff4141", hp: 850, speed: 6.4, range: 11, damage: 25, cooldown: 0.62, basicAttack: "enemyBolt", skill: "droneSummon", ultimate: "ultronBeam", scale: 1.1, flying: true },
  hela: { name: "헬라", color: "#173b2e", accent: "#7cff9f", hp: 900, speed: 7.2, range: 9, damage: 28, cooldown: 0.64, basicAttack: "blade", skill: "bladeStorm", ultimate: "helaRain", scale: 1.08 },
  ronan: { name: "로난", color: "#313d56", accent: "#8b7dff", hp: 980, speed: 4.7, range: 4.5, damage: 36, cooldown: 0.86, basicAttack: "hammer", skill: "ronanSlam", ultimate: "powerStone", scale: 1.28 },
  redskull: { name: "레드 스컬", color: "#982f35", accent: "#69d7ff", hp: 620, speed: 7.1, range: 10, damage: 21, cooldown: 0.7, basicAttack: "enemyBolt", skill: "teleport", ultimate: "soulDrain", scale: 1 },
  malekith: { name: "말레키스", color: "#24242e", accent: "#d24f70", hp: 720, speed: 5.8, range: 11, damage: 24, cooldown: 0.72, basicAttack: "darkBolt", skill: "darkZone", ultimate: "aetherWave", scale: 1.05 },
  killmonger: { name: "킬몽거", color: "#292631", accent: "#d3a54e", hp: 700, speed: 8, range: 3.5, damage: 30, cooldown: 0.52, basicAttack: "claw", skill: "dash", ultimate: "kineticBurst", scale: 1.02 },
  maw: { name: "에보니 모", color: "#6c6672", accent: "#b6a4ff", hp: 650, speed: 5.6, range: 13, damage: 25, cooldown: 0.7, basicAttack: "telekinesis", skill: "lift", ultimate: "debrisStorm", scale: 1.05 },
  cull: { name: "컬 옵시디언", color: "#6a5d55", accent: "#c8a877", hp: 1200, speed: 4.4, range: 3.2, damage: 41, cooldown: 0.88, basicAttack: "smash", skill: "charge", ultimate: "cullQuake", scale: 1.46 },
  proxima: { name: "프록시마 미드나이트", color: "#33455c", accent: "#71c7ff", hp: 720, speed: 7.4, range: 9, damage: 28, cooldown: 0.62, basicAttack: "spear", skill: "spearThrow", ultimate: "proximaStorm", scale: 1.04 },
  corvus: { name: "코르버스 글레이브", color: "#37333d", accent: "#c8e26b", hp: 760, speed: 7.7, range: 4.2, damage: 33, cooldown: 0.58, basicAttack: "blade", skill: "stealth", ultimate: "lifeSteal", scale: 1.06 },
};

const BOSS_ORDER = ["thanos", "loki", "ultron", "hela", "ronan", "redskull", "malekith", "killmonger", "maw", "cull", "proxima", "corvus"];
const CINEMA_TROOPS = { chitauri: 28, outrider: 26, ultronDrone: 18, sakaaran: 16 };
const PERFORMANCE_TROOPS = { chitauri: 10, outrider: 10, ultronDrone: 8, sakaaran: 8 };

function getInitialBattleMode() {
  try {
    const saved = window.localStorage.getItem("hole-city-battle-mode");
    if (saved === "cinema" || saved === "performance") return saved;
  } catch (error) {
    // Local storage can be unavailable on restricted file pages.
  }
  return window.matchMedia("(max-width: 720px)").matches ? "performance" : "cinema";
}

const state = {
  running: false,
  transitioning: false,
  score: 0,
  stageScore: 0,
  growth: 0,
  stageIndex: 0,
  level: 1,
  radius: STAGES[0].startRadius,
  velocity: new THREE.Vector2(),
  input: new THREE.Vector2(),
  touchInput: new THREE.Vector2(),
  objects: [],
  particles: [],
  escapees: [],
  traffic: [],
  environment: [],
  battleActors: [],
  battleEffects: [],
  battleEffectPool: [],
  troopMeshes: [],
  battleMode: getInitialBattleMode(),
  unlockedHeroes: new Set(),
  finalBattle: { active: false, won: false, boss: null, bossesRemaining: 0, elapsed: 0, cinematic: "idle" },
  cameraShake: 0,
  dust: [],
  transitionToken: 0,
  cinematicToken: 0,
};

const keys = new Set();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 420);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const hemi = new THREE.HemisphereLight("#ffffff", "#6e7469", 1.15);
scene.add(hemi);

const sun = new THREE.DirectionalLight("#fff1c7", 2.35);
sun.position.set(30, 42, 24);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);

const world = new THREE.Group();
scene.add(world);

const stageGroup = new THREE.Group();
world.add(stageGroup);

const objectGroup = new THREE.Group();
world.add(objectGroup);

const battleGroup = new THREE.Group();
scene.add(battleGroup);

const dustGroup = new THREE.Group();
scene.add(dustGroup);

const hole = {
  position: new THREE.Vector3(0, 0.16, 0),
  ring: null,
  disk: null,
  vortex: null,
  glow: null,
  teeth: null,
};

const sharedMaterials = {
  road: new THREE.MeshStandardMaterial({ color: "#4f5a58", roughness: 0.86 }),
  sidewalk: new THREE.MeshStandardMaterial({ color: "#b8c0b0", roughness: 0.86 }),
  roof: new THREE.MeshStandardMaterial({ color: "#d95d4f", roughness: 0.68 }),
  glass: new THREE.MeshStandardMaterial({ color: "#83c5d8", roughness: 0.45, metalness: 0.1 }),
  trunk: new THREE.MeshStandardMaterial({ color: "#8d5c38", roughness: 0.9 }),
  leaves: new THREE.MeshStandardMaterial({ color: "#2f9e62", roughness: 0.82 }),
  metal: new THREE.MeshStandardMaterial({ color: "#dad7c5", roughness: 0.54, metalness: 0.15 }),
  holeDisk: new THREE.MeshBasicMaterial({ color: "#020307", side: THREE.DoubleSide }),
  holeRing: new THREE.MeshStandardMaterial({ color: "#141b22", roughness: 0.38, metalness: 0.26 }),
  tooth: new THREE.MeshBasicMaterial({ color: "#fff7d8", side: THREE.DoubleSide }),
  vortex: new THREE.MeshBasicMaterial({ color: "#06080f", transparent: true, opacity: 0.92, side: THREE.DoubleSide }),
  glow: new THREE.MeshBasicMaterial({ color: "#72e4ff", transparent: true, opacity: 0.16, side: THREE.DoubleSide }),
  lane: new THREE.MeshStandardMaterial({ color: "#f4e7a5", roughness: 0.72 }),
  crosswalk: new THREE.MeshStandardMaterial({ color: "#eef1e8", roughness: 0.8 }),
  curb: new THREE.MeshStandardMaterial({ color: "#c9cbc3", roughness: 0.92 }),
};

function material(color, roughness = 0.72, metalness = 0.02, emissive = "#000000", emissiveIntensity = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity });
}

const characterGeometryCache = new Map();
const characterMaterialCache = new Map();
const sharedCharacterGeometries = new Set();
const sharedCharacterMaterials = new Set();

function characterGeometry(kind, ...values) {
  const key = `${kind}:${values.join(":")}`;
  if (characterGeometryCache.has(key)) return characterGeometryCache.get(key);
  let geometry;
  if (kind === "box") geometry = new THREE.BoxGeometry(...values);
  else if (kind === "capsule") geometry = new THREE.CapsuleGeometry(values[0], values[1], values[2] || 4, values[3] || 8);
  else if (kind === "sphere") geometry = new THREE.SphereGeometry(values[0], values[1] || 10, values[2] || 8);
  else if (kind === "cylinder") geometry = new THREE.CylinderGeometry(values[0], values[1], values[2], values[3] || 10);
  else if (kind === "cone") geometry = new THREE.ConeGeometry(values[0], values[1], values[2] || 6, values[3] || 1, Boolean(values[4]));
  else if (kind === "octahedron") geometry = new THREE.OctahedronGeometry(values[0], values[1] || 0);
  else if (kind === "dodecahedron") geometry = new THREE.DodecahedronGeometry(values[0], values[1] || 0);
  else if (kind === "torus") geometry = new THREE.TorusGeometry(values[0], values[1], values[2] || 6, values[3] || 18, values[4] || Math.PI * 2);
  characterGeometryCache.set(key, geometry);
  sharedCharacterGeometries.add(geometry);
  return geometry;
}

function characterMaterial(color, roughness = 0.58, metalness = 0.05, emissive = "#000000", emissiveIntensity = 0) {
  const key = `${color}:${roughness}:${metalness}:${emissive}:${emissiveIntensity}`;
  if (characterMaterialCache.has(key)) return characterMaterialCache.get(key);
  const result = material(color, roughness, metalness, emissive, emissiveIntensity);
  characterMaterialCache.set(key, result);
  sharedCharacterMaterials.add(result);
  return result;
}

function characterMesh(kind, values, color, options = {}) {
  const mesh = new THREE.Mesh(
    characterGeometry(kind, ...values),
    characterMaterial(color, options.roughness, options.metalness, options.emissive, options.emissiveIntensity),
  );
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = Boolean(options.receiveShadow);
  return mesh;
}

function buildStage(stageIndex) {
  stopFinalCinematic();
  const stage = STAGES[stageIndex];
  state.stageIndex = stageIndex;
  state.stageScore = 0;
  state.growth = 0;
  state.level = stageIndex * 6 + 1;
  state.radius = stage.startRadius;
  state.velocity.set(0, 0);
  state.touchInput.set(0, 0);
  hole.position.set(0, 0.16, 0);
  clearGroup(stageGroup, true);
  clearGroup(objectGroup, true);
  clearParticles();
  clearBattle();
  state.objects.length = 0;
  state.traffic.length = 0;
  state.environment.length = 0;
  state.unlockedHeroes.clear();
  state.finalBattle = { active: false, won: false, boss: null, bossesRemaining: 0, elapsed: 0, cinematic: "idle" };
  battleGroup.position.set(0, 0, 0);

  scene.background = new THREE.Color(stage.sky);
  scene.fog = new THREE.Fog(stage.sky, stage.fogNear, stage.fogFar);
  sharedMaterials.road.color.set(stage.road);
  sharedMaterials.glow.color.set(stage.accent);
  hemi.color.set(stage.id === "solar" || stage.id === "galaxy" ? "#9cb9ff" : "#fffdf4");
  hemi.groundColor.set(stage.id === "solar" || stage.id === "galaxy" ? "#090b18" : darken(stage.ground, 0.52));
  hemi.intensity = stage.id === "solar" || stage.id === "galaxy" ? 0.72 : 1.08;
  sun.color.set(stage.id === "planet" ? "#fff0c2" : "#fff4dd");
  sun.intensity = stage.id === "solar" || stage.id === "galaxy" ? 1.6 : 2.25;
  renderer.toneMappingExposure = stage.id === "solar" || stage.id === "galaxy" ? 1.22 : 1.04;
  sun.shadow.camera.left = -stage.worldSize * 0.65;
  sun.shadow.camera.right = stage.worldSize * 0.65;
  sun.shadow.camera.top = stage.worldSize * 0.65;
  sun.shadow.camera.bottom = -stage.worldSize * 0.65;
  sun.shadow.camera.updateProjectionMatrix();

  if (stage.id === "city") buildCityStage(stage);
  if (stage.id === "metro") buildMetroStage(stage);
  if (stage.id === "planet") buildPlanetStage(stage);
  if (stage.id === "solar") buildSolarStage(stage);
  if (stage.id === "galaxy") buildGalaxyStage(stage);

  rebuildHoleMesh();
  updateHud();
  objectiveText.textContent = stage.objective;
}

function buildBase(stage, height = 0.38) {
  const ground = new THREE.Mesh(new THREE.BoxGeometry(stage.worldSize, height, stage.worldSize), material(stage.ground, 0.86));
  ground.position.y = -height * 0.55;
  ground.receiveShadow = true;
  stageGroup.add(ground);

  const rim = new THREE.Mesh(
    new THREE.BoxGeometry(stage.worldSize + 2, 1.2, stage.worldSize + 2),
    material(darken(stage.ground, 0.66), 0.9),
  );
  rim.position.y = -0.96;
  rim.receiveShadow = true;
  stageGroup.add(rim);
}

function buildCityStage(stage) {
  buildBase(stage);
  const lanes = [-30, -15, 0, 15, 30];
  addRoadGrid(stage, lanes, false);
  addUrbanRoadDetails(stage, lanes);
  addPlaza(6.5);
  addStarterCrates(11, 6.2, 10.5);
  populateUrbanBlocks(stage, lanes, false);
  addTraffic(stage, lanes, 12, false);
}

function buildMetroStage(stage) {
  buildBase(stage, 0.42);
  const lanes = [-42, -28, -14, 0, 14, 28, 42];
  addRoadGrid(stage, lanes, true);
  addUrbanRoadDetails(stage, lanes);
  addPlaza(9.5);
  addStarterCrates(14, 7, 13);
  populateUrbanBlocks(stage, lanes, true);
  addTraffic(stage, lanes, 18, true);
}

function addUrbanRoadDetails(stage, lanes) {
  const half = stage.worldSize / 2;
  for (const lane of lanes) {
    for (let offset = -half + 4; offset < half - 2; offset += 6) {
      for (const horizontal of [true, false]) {
        const dash = new THREE.Mesh(new THREE.BoxGeometry(horizontal ? 2.5 : 0.11, 0.025, horizontal ? 0.11 : 2.5), sharedMaterials.lane);
        dash.position.set(horizontal ? offset : lane, 0.095, horizontal ? lane : offset);
        stageGroup.add(dash);
      }
    }
  }

  for (const x of lanes) {
    for (const z of lanes) {
      if (Math.hypot(x, z) < 8) continue;
      for (let stripe = -2; stripe <= 2; stripe += 1) {
        const mark = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 2.8), sharedMaterials.crosswalk);
        mark.position.set(x + stripe * 0.7, 0.105, z + 3.1);
        stageGroup.add(mark);
      }
    }
  }
}

function populateUrbanBlocks(stage, lanes, metro) {
  const edges = [-stage.worldSize / 2, ...lanes, stage.worldSize / 2];
  for (let ix = 0; ix < edges.length - 1; ix += 1) {
    for (let iz = 0; iz < edges.length - 1; iz += 1) {
      const minX = edges[ix] + 3.25;
      const maxX = edges[ix + 1] - 3.25;
      const minZ = edges[iz] + 3.25;
      const maxZ = edges[iz + 1] - 3.25;
      if (maxX - minX < 2.8 || maxZ - minZ < 2.8) continue;
      const centerX = (minX + maxX) / 2;
      const centerZ = (minZ + maxZ) / 2;
      if (Math.hypot(centerX, centerZ) < (metro ? 13 : 10)) continue;

      const lot = new THREE.Mesh(
        new THREE.BoxGeometry(maxX - minX + 1.2, 0.12, maxZ - minZ + 1.2),
        material(randomChoice(metro ? ["#aeb2aa", "#b7b2a6", "#98a39d"] : ["#a8bca5", "#b7bea9", "#9db59f"]), 0.94),
      );
      lot.position.set(centerX, 0.045, centerZ);
      lot.receiveShadow = true;
      stageGroup.add(lot);
      const curbWidth = maxX - minX + 1.45;
      const curbDepth = maxZ - minZ + 1.45;
      for (const curb of [
        { x: centerX, z: minZ - 0.65, w: curbWidth, d: 0.22 },
        { x: centerX, z: maxZ + 0.65, w: curbWidth, d: 0.22 },
        { x: minX - 0.65, z: centerZ, w: 0.22, d: curbDepth },
        { x: maxX + 0.65, z: centerZ, w: 0.22, d: curbDepth },
      ]) {
        const curbMesh = new THREE.Mesh(new THREE.BoxGeometry(curb.w, 0.18, curb.d), sharedMaterials.curb);
        curbMesh.position.set(curb.x, 0.12, curb.z);
        curbMesh.receiveShadow = true;
        stageGroup.add(curbMesh);
      }

      const parkLot = Math.random() < (metro ? 0.13 : 0.2);
      const slots = metro ? 2 : (Math.random() < 0.55 ? 2 : 1);
      for (let slot = 0; slot < slots; slot += 1) {
        const spread = slots === 1 ? 0 : (slot === 0 ? -1 : 1) * Math.min(2.4, (maxX - minX) * 0.22);
        const x = THREE.MathUtils.clamp(centerX + spread, minX + 1, maxX - 1);
        const z = centerZ + randomRange(-1.1, 1.1);
        let object;
        if (parkLot) object = slot === 0 ? createParkBlock(x, z, randomRange(0.62, 0.84)) : createTree(x, z, randomRange(0.8, 1.1));
        else if (metro && Math.random() < 0.7) object = createTower(x, z, randomRange(0.72, 1.08), 6, 13);
        else if (!metro && Math.random() < 0.66) object = createHouse(x, z, randomRange(0.68, 0.92));
        else object = createTower(x, z, randomRange(0.62, metro ? 0.95 : 0.8), metro ? 5 : 3, metro ? 10 : 6);
        if (object) object.rotation.y = nearestRoadRotation(x, z, lanes);
      }

      const streetX = Math.abs(centerX - edges[ix]) < Math.abs(centerX - edges[ix + 1]) ? minX - 0.55 : maxX + 0.55;
      if (Math.random() < 0.7) createLamp(streetX, centerZ, metro ? 1.08 : 0.9);
      if (Math.random() < 0.42) createBench(centerX, minZ - 0.35, metro ? 0.95 : 0.8);
    }
  }
}

function nearestRoadRotation(x, z, lanes) {
  const nearestX = Math.min(...lanes.map((lane) => Math.abs(x - lane)));
  const nearestZ = Math.min(...lanes.map((lane) => Math.abs(z - lane)));
  return nearestX < nearestZ ? (x > 0 ? -Math.PI / 2 : Math.PI / 2) : (z > 0 ? Math.PI : 0);
}

function buildPlanetStage(stage) {
  buildBase(stage, 0.5);
  addPlanetSurface(stage);
  addStarterCrates(16, 8, 16);

  placeObjects(112, stage, (x, z, roll) => {
    if (roll < 0.22) createMountain(x, z, randomRange(1.5, 3.2));
    else if (roll < 0.4) createCloudCity(x, z, randomRange(1.2, 2.4));
    else if (roll < 0.58) createOceanPatch(x, z, randomRange(1.8, 3.8));
    else if (roll < 0.78) createContinentChunk(x, z, randomRange(1.5, 3.4));
    else createCityBlock(x, z, randomRange(1.6, 2.7));
  });
}

function buildSolarStage(stage) {
  buildSpaceBase(stage);
  addOrbitLines([18, 33, 49, 67, 86]);
  addStarterCrates(18, 9, 18, "소행성");

  placeObjects(108, stage, (x, z, roll) => {
    if (roll < 0.42) createAsteroid(x, z, randomRange(1.2, 3.2));
    else if (roll < 0.67) createMoon(x, z, randomRange(1.6, 3.6));
    else if (roll < 0.88) createPlanet(x, z, randomRange(2.2, 5.2));
    else createRingPlanet(x, z, randomRange(2.6, 5.8));
  }, 10);
}

function buildGalaxyStage(stage) {
  buildSpaceBase(stage);
  addGalaxySpiral(stage);
  addStarterCrates(20, 10, 20, "별무리");

  placeObjects(128, stage, (x, z, roll) => {
    if (roll < 0.44) createStarCluster(x, z, randomRange(1.4, 3.4));
    else if (roll < 0.72) createNebula(x, z, randomRange(2.2, 5.4));
    else if (roll < 0.9) createMiniGalaxy(x, z, randomRange(3.2, 6.6));
    else createGalaxyCore(x, z, randomRange(4.8, 8.4));
  }, 12);
}

function buildSpaceBase(stage) {
  const base = new THREE.Mesh(new THREE.CylinderGeometry(stage.worldSize * 0.56, stage.worldSize * 0.56, 0.36, 80), material(stage.ground, 0.72, 0.08));
  base.position.y = -0.22;
  base.receiveShadow = true;
  stageGroup.add(base);

  for (let i = 0; i < 240; i += 1) {
    const star = new THREE.Mesh(
      new THREE.BoxGeometry(randomRange(0.08, 0.22), randomRange(0.08, 0.22), randomRange(0.08, 0.22)),
      material(randomChoice(["#ffffff", "#b9dfff", "#ffe6a3", "#ffb4e2"]), 0.5, 0, "#ffffff", 0.45),
    );
    const angle = randomRange(0, Math.PI * 2);
    const radius = randomRange(stage.worldSize * 0.16, stage.worldSize * 0.58);
    star.position.set(Math.cos(angle) * radius, randomRange(2, 18), Math.sin(angle) * radius);
    stageGroup.add(star);
    state.dust.push(star);
  }
}

function addRoadGrid(stage, lanes, edible) {
  for (const lane of lanes) {
    if (edible) {
      const segmentLength = 13.5;
      const count = Math.floor(stage.worldSize / segmentLength);
      for (let i = 0; i < count; i += 1) {
        const offset = -stage.worldSize / 2 + segmentLength * (i + 0.5);
        addRoadSegment(offset, lane, segmentLength * 0.84, 4.2, Math.PI / 2, true);
        addRoadSegment(lane, offset, segmentLength * 0.84, 4.2, 0, true);
      }
    } else {
      addRoadSegment(0, lane, stage.worldSize, 4.2, Math.PI / 2, false);
      addRoadSegment(lane, 0, stage.worldSize, 4.2, 0, false);
    }
  }
}

function addRoadSegment(x, z, length, width, rotationY, edible) {
  const group = new THREE.Group();
  const road = new THREE.Mesh(new THREE.BoxGeometry(width, 0.08, length), sharedMaterials.road);
  road.receiveShadow = true;
  group.add(road);
  group.position.set(x, 0.03, z);
  group.rotation.y = rotationY;
  if (edible) {
    objectGroup.add(group);
    registerObject(group, width * 0.88, Math.round(length * 2.8), "도로");
  } else {
    stageGroup.add(group);
  }
}

function addTraffic(stage, lanes, count, metro) {
  const usable = lanes.filter((lane) => Math.abs(lane) >= (metro ? 14 : 15));
  const loopSizes = [...new Set(usable.map((lane) => Math.abs(lane)))];
  for (let i = 0; i < count; i += 1) {
    const radius = loopSizes[i % loopSizes.length];
    const side = i % 2 ? 1.1 : -1.1;
    const route = [
      new THREE.Vector3(-radius, 0, -radius + side),
      new THREE.Vector3(radius, 0, -radius + side),
      new THREE.Vector3(radius - side, 0, radius),
      new THREE.Vector3(-radius, 0, radius),
    ];
    const routeIndex = i % route.length;
    const start = route[routeIndex];
    const car = createCar(start.x, start.z, randomRange(metro ? 0.9 : 0.72, metro ? 1.2 : 1.02));
    car.userData.route = route;
    car.userData.routeIndex = (routeIndex + 1) % route.length;
    car.userData.speed = randomRange(metro ? 4.8 : 3.7, metro ? 7.2 : 5.8);
    car.userData.turnSpeed = randomRange(4.2, 6.2);
    car.userData.traffic = true;
    state.traffic.push(car);
  }
}

function addPlaza(radius) {
  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.09, 8), sharedMaterials.sidewalk);
  plaza.position.set(0, 0.045, 0);
  plaza.rotation.y = Math.PI / 8;
  plaza.receiveShadow = true;
  stageGroup.add(plaza);
}

function addPlanetSurface(stage) {
  for (let i = 0; i < 18; i += 1) {
    const patch = new THREE.Mesh(
      new THREE.CylinderGeometry(randomRange(5, 12), randomRange(5, 12), 0.12, 7),
      material(randomChoice(["#6bc48d", "#e8cf86", "#69a9cf", "#8bc6a4"]), 0.82),
    );
    const angle = randomRange(0, Math.PI * 2);
    const radius = randomRange(18, stage.worldSize * 0.42);
    patch.position.set(Math.cos(angle) * radius, 0.05, Math.sin(angle) * radius);
    patch.rotation.y = randomRange(0, Math.PI);
    patch.receiveShadow = true;
    stageGroup.add(patch);
  }
}

function addOrbitLines(radii) {
  for (const radius of radii) {
    const line = new THREE.Mesh(
      new THREE.RingGeometry(radius - 0.08, radius + 0.08, 96),
      new THREE.MeshBasicMaterial({ color: "#435071", transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
    );
    line.rotation.x = -Math.PI / 2;
    line.position.y = 0.03;
    stageGroup.add(line);
  }
}

function addGalaxySpiral(stage) {
  for (let arm = 0; arm < 3; arm += 1) {
    for (let i = 0; i < 42; i += 1) {
      const t = i / 42;
      const angle = arm * 2.1 + t * 6.4;
      const radius = 11 + t * stage.worldSize * 0.43;
      const node = new THREE.Mesh(
        new THREE.BoxGeometry(0.55 + t * 1.5, 0.1, 0.55 + t * 1.5),
        material(randomChoice(["#8278ff", "#ff7fd1", "#7de7ff", "#f9e27d"]), 0.58, 0, "#ffffff", 0.25),
      );
      node.position.set(Math.cos(angle) * radius, 0.08, Math.sin(angle) * radius);
      node.rotation.y = angle;
      stageGroup.add(node);
    }
  }
}

function addStarterCrates(count, minDistance, maxDistance, label = "상자") {
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2 + randomRange(-0.16, 0.16);
    const distance = randomRange(minDistance, maxDistance);
    if (label === "상자") createCrate(Math.cos(angle) * distance, Math.sin(angle) * distance, randomRange(0.85, 1.25));
    else createAsteroid(Math.cos(angle) * distance, Math.sin(angle) * distance, randomRange(0.8, 1.35), label);
  }
}

function placeObjects(count, stage, factory, margin = 7) {
  const occupied = [];
  for (let i = 0; i < count; i += 1) {
    const spot = findSpot(occupied, stage.worldSize, margin);
    if (!spot) continue;
    factory(spot.x, spot.z, Math.random());
    occupied.push(spot);
  }
}

function findSpot(occupied, worldSize, margin) {
  const half = worldSize / 2;
  for (let attempts = 0; attempts < 90; attempts += 1) {
    const x = randomRange(-half + margin, half - margin);
    const z = randomRange(-half + margin, half - margin);
    if (Math.hypot(x, z) < margin + 4) continue;
    const clear = occupied.every((spot) => Math.hypot(spot.x - x, spot.z - z) > spot.r + 3.8);
    if (clear) return { x, z, r: randomRange(2.1, 4.6) };
  }
  return null;
}

function createHouse(x, z, scale = 1) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.6 * scale, 2.2 * scale, 2.2 * scale), material(randomChoice(["#f4d6a6", "#d7e5ee", "#f2b6a0", "#d8dbc5", "#c4d7b2"]), 0.72));
  body.position.y = 1.1 * scale;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.9 * scale, 1.15 * scale, 4), sharedMaterials.roof);
  roof.position.y = 2.75 * scale;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  group.add(roof);

  addWindow(group, -0.65 * scale, 1.25 * scale, 1.13 * scale, scale);
  addWindow(group, 0.65 * scale, 1.25 * scale, 1.13 * scale, scale);
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.5 * scale, 0.9 * scale, 0.08), material("#76513b", 0.84));
  door.position.set(0, 0.45 * scale, 1.15 * scale);
  group.add(door);
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.34 * scale, 0.78 * scale, 0.34 * scale), material("#8f6552", 0.9));
  chimney.position.set(0.75 * scale, 3.05 * scale, 0.15 * scale);
  chimney.castShadow = true;
  group.add(chimney);
  return placeRegistered(group, x, z, 1.35 * scale, Math.round(35 * scale), "집");
}

function addWindow(group, x, y, z, scale) {
  const win = new THREE.Mesh(new THREE.BoxGeometry(0.44 * scale, 0.48 * scale, 0.045), sharedMaterials.glass);
  win.position.set(x, y, z);
  group.add(win);
}

function createTower(x, z, scale = 1, minFloors = 3, maxFloors = 7) {
  const group = new THREE.Group();
  const floors = Math.floor(randomRange(minFloors, maxFloors));
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.4 * scale, floors * 1.15 * scale, 2.4 * scale), material(randomChoice(["#9ab6bd", "#c5c2b1", "#aeb8cc", "#deb887"]), 0.62));
  body.position.y = floors * 0.575 * scale;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  for (let i = 1; i < floors; i += 1) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.5 * scale, 0.13 * scale, 2.5 * scale), sharedMaterials.glass);
    stripe.position.y = i * 1.15 * scale;
    group.add(stripe);
  }
  const roofUnit = new THREE.Mesh(new THREE.BoxGeometry(0.72 * scale, 0.42 * scale, 0.72 * scale), sharedMaterials.metal);
  roofUnit.position.y = floors * 1.15 * scale + 0.2 * scale;
  roofUnit.castShadow = true;
  group.add(roofUnit);
  return placeRegistered(group, x, z, 1.55 * scale, Math.round(70 * scale * floors / 4), "빌딩");
}

function createTree(x, z, scale = 1) {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * scale, 0.28 * scale, 1.2 * scale, 6), sharedMaterials.trunk);
  trunk.position.y = 0.6 * scale;
  trunk.castShadow = true;
  group.add(trunk);

  const variant = Math.floor(randomRange(0, 3));
  if (variant === 0) {
    const leaves = new THREE.Mesh(new THREE.ConeGeometry(0.9 * scale, 1.9 * scale, 7), sharedMaterials.leaves);
    leaves.position.y = 1.75 * scale;
    leaves.castShadow = true;
    group.add(leaves);
  } else {
    const crownCount = variant === 1 ? 2 : 3;
    for (let i = 0; i < crownCount; i += 1) {
      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry((0.62 + i * 0.08) * scale, 0), material(i % 2 ? "#3a9c5c" : "#2f8750", 0.86));
      crown.position.set((i - 1) * 0.38 * scale, (1.55 + i * 0.23) * scale, Math.sin(i * 2.2) * 0.24 * scale);
      crown.castShadow = true;
      group.add(crown);
    }
  }
  const registered = placeRegistered(group, x, z, 0.72 * scale, Math.round(18 * scale), "나무");
  state.environment.push({ object: registered, kind: "tree", phase: randomRange(0, Math.PI * 2), baseY: registered.rotation.y });
  return registered;
}

function createCar(x, z, scale = 1) {
  const group = new THREE.Group();
  const variant = Math.floor(randomRange(0, 3));
  const carMaterial = material(randomChoice(["#f15b5b", "#4b7bec", "#f6c85f", "#47b881"]), 0.58, 0.04);
  const bodyLength = variant === 2 ? 2.75 : 2.2;
  const bodyHeight = variant === 1 ? 0.72 : 0.58;
  const body = new THREE.Mesh(new THREE.BoxGeometry(bodyLength * scale, bodyHeight * scale, 1.08 * scale), carMaterial);
  body.position.y = 0.45 * scale;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry((variant === 2 ? 1.42 : 1.05) * scale, (variant === 1 ? 0.62 : 0.46) * scale, 0.82 * scale), sharedMaterials.glass);
  cabin.position.y = 0.95 * scale;
  cabin.castShadow = true;
  group.add(cabin);

  for (const sx of [-0.74, 0.74]) {
    for (const sz of [-0.45, 0.45]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.18 * scale, 0.18 * scale, 10), sharedMaterials.holeDisk);
      wheel.position.set(sx * scale, 0.18 * scale, sz * scale);
      wheel.rotation.x = Math.PI / 2;
      group.add(wheel);
    }
  }
  return placeRegistered(group, x, z, 1.05 * scale, Math.round(24 * scale), "자동차");
}

function createLamp(x, z, scale = 1) {
  const group = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08 * scale, 0.11 * scale, 2.4 * scale, 8), sharedMaterials.metal);
  pole.position.y = 1.2 * scale;
  pole.castShadow = true;
  group.add(pole);

  const light = new THREE.Mesh(new THREE.BoxGeometry(0.58 * scale, 0.28 * scale, 0.36 * scale), material("#fff2a8", 0.48, 0, "#a87522", 0.45));
  light.position.set(0.28 * scale, 2.45 * scale, 0);
  light.castShadow = true;
  group.add(light);
  const registered = placeRegistered(group, x, z, 0.45 * scale, Math.round(12 * scale), "가로등");
  state.environment.push({ object: registered, kind: "lamp", phase: randomRange(0, Math.PI * 2), baseY: registered.rotation.y });
  return registered;
}

function createBench(x, z, scale = 1) {
  const group = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8 * scale, 0.22 * scale, 0.52 * scale), sharedMaterials.trunk);
  seat.position.y = 0.55 * scale;
  seat.castShadow = true;
  group.add(seat);

  const back = new THREE.Mesh(new THREE.BoxGeometry(1.8 * scale, 0.62 * scale, 0.18 * scale), sharedMaterials.trunk);
  back.position.set(0, 0.86 * scale, -0.28 * scale);
  back.castShadow = true;
  group.add(back);
  return placeRegistered(group, x, z, 0.82 * scale, Math.round(16 * scale), "벤치");
}

function createCrate(x, z, scale = 1) {
  const group = new THREE.Group();
  const crate = new THREE.Mesh(new THREE.BoxGeometry(0.82 * scale, 0.82 * scale, 0.82 * scale), material(randomChoice(["#d49a45", "#8cc084", "#e6c76f"]), 0.82));
  crate.position.y = 0.41 * scale;
  crate.castShadow = true;
  crate.receiveShadow = true;
  group.add(crate);

  const band = new THREE.Mesh(new THREE.BoxGeometry(0.9 * scale, 0.08 * scale, 0.9 * scale), sharedMaterials.metal);
  band.position.y = 0.76 * scale;
  group.add(band);
  placeRegistered(group, x, z, 0.48 * scale, Math.round(10 * scale), "상자");
}

function createParkBlock(x, z, scale = 1) {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(4.8 * scale, 0.18 * scale, 4.8 * scale), material("#75ba80", 0.88));
  base.position.y = 0.08 * scale;
  base.receiveShadow = true;
  group.add(base);
  for (let i = 0; i < 4; i += 1) {
    const tree = new THREE.Mesh(new THREE.ConeGeometry(0.55 * scale, 1.25 * scale, 6), sharedMaterials.leaves);
    tree.position.set(randomRange(-1.7, 1.7) * scale, 0.9 * scale, randomRange(-1.7, 1.7) * scale);
    tree.castShadow = true;
    group.add(tree);
  }
  return placeRegistered(group, x, z, 2.45 * scale, Math.round(80 * scale), "공원");
}

function createCityBlock(x, z, scale = 1) {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(4.6 * scale, 0.2 * scale, 4.6 * scale), sharedMaterials.sidewalk);
  base.position.y = 0.1 * scale;
  base.receiveShadow = true;
  group.add(base);
  for (let i = 0; i < 4; i += 1) {
    const tower = new THREE.Mesh(new THREE.BoxGeometry(randomRange(0.8, 1.4) * scale, randomRange(2.5, 6) * scale, randomRange(0.8, 1.4) * scale), material(randomChoice(["#a8b2bf", "#c4b89f", "#92a8ad"]), 0.62));
    tower.position.set(randomRange(-1.3, 1.3) * scale, tower.geometry.parameters.height / 2 + 0.2, randomRange(-1.3, 1.3) * scale);
    tower.castShadow = true;
    tower.receiveShadow = true;
    group.add(tower);
  }
  placeRegistered(group, x, z, 2.8 * scale, Math.round(140 * scale), "도시 블록");
}

function createMountain(x, z, scale = 1) {
  const group = new THREE.Group();
  const mountain = new THREE.Mesh(new THREE.ConeGeometry(1.5 * scale, 4.2 * scale, 7), material("#8b8f83", 0.84));
  mountain.position.y = 2.1 * scale;
  mountain.castShadow = true;
  group.add(mountain);
  const snow = new THREE.Mesh(new THREE.ConeGeometry(0.62 * scale, 1.25 * scale, 7), material("#f5f0df", 0.76));
  snow.position.y = 3.55 * scale;
  snow.castShadow = true;
  group.add(snow);
  placeRegistered(group, x, z, 1.55 * scale, Math.round(110 * scale), "산맥");
}

function createCloudCity(x, z, scale = 1) {
  const group = new THREE.Group();
  for (let i = 0; i < 5; i += 1) {
    const cloud = new THREE.Mesh(new THREE.SphereGeometry(randomRange(0.65, 1.2) * scale, 10, 8), material("#f3f6f4", 0.38, 0.02));
    cloud.scale.y = 0.42;
    cloud.position.set(randomRange(-1.2, 1.2) * scale, randomRange(1.1, 2.1) * scale, randomRange(-1.2, 1.2) * scale);
    cloud.castShadow = true;
    group.add(cloud);
  }
  placeRegistered(group, x, z, 1.8 * scale, Math.round(120 * scale), "구름 도시");
}

function createOceanPatch(x, z, scale = 1) {
  const group = new THREE.Group();
  const ocean = new THREE.Mesh(new THREE.CylinderGeometry(2.1 * scale, 2.1 * scale, 0.22 * scale, 9), material("#3d91c8", 0.48, 0.03));
  ocean.position.y = 0.12 * scale;
  ocean.receiveShadow = true;
  group.add(ocean);
  placeRegistered(group, x, z, 2.05 * scale, Math.round(95 * scale), "바다");
}

function createContinentChunk(x, z, scale = 1) {
  const group = new THREE.Group();
  const land = new THREE.Mesh(new THREE.CylinderGeometry(2.2 * scale, 2 * scale, 0.34 * scale, 7), material(randomChoice(["#7cc47b", "#d6bf75", "#a6b36f"]), 0.82));
  land.position.y = 0.18 * scale;
  land.rotation.y = randomRange(0, Math.PI);
  land.castShadow = true;
  land.receiveShadow = true;
  group.add(land);
  placeRegistered(group, x, z, 2.15 * scale, Math.round(130 * scale), "대륙");
}

function createAsteroid(x, z, scale = 1, label = "소행성") {
  const group = new THREE.Group();
  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85 * scale, 0), material(randomChoice(["#8b8175", "#a19185", "#6f7482"]), 0.92));
  rock.position.y = 0.95 * scale;
  rock.scale.set(1.15, randomRange(0.72, 1.35), randomRange(0.8, 1.25));
  rock.rotation.set(randomRange(0, 1), randomRange(0, 1), randomRange(0, 1));
  rock.castShadow = true;
  group.add(rock);
  placeRegistered(group, x, z, 0.95 * scale, Math.round(70 * scale), label);
}

function createMoon(x, z, scale = 1) {
  const group = new THREE.Group();
  const moon = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15 * scale, 1), material("#c4c6bd", 0.84));
  moon.position.y = 1.18 * scale;
  moon.castShadow = true;
  group.add(moon);
  placeRegistered(group, x, z, 1.18 * scale, Math.round(145 * scale), "위성");
}

function createPlanet(x, z, scale = 1) {
  const group = new THREE.Group();
  const planet = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35 * scale, 2), material(randomChoice(["#4189d6", "#d68d41", "#59b779", "#cfc47a"]), 0.58, 0.03));
  planet.position.y = 1.42 * scale;
  planet.castShadow = true;
  group.add(planet);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.28 * scale, 1.28 * scale, 0.08 * scale, 18), material("#f3ead8", 0.5));
  cap.position.y = 1.44 * scale;
  cap.rotation.x = Math.PI / 2;
  group.add(cap);
  placeRegistered(group, x, z, 1.48 * scale, Math.round(240 * scale), "행성");
}

function createRingPlanet(x, z, scale = 1) {
  const group = new THREE.Group();
  const planet = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3 * scale, 2), material("#d9a35f", 0.58, 0.03));
  planet.position.y = 1.4 * scale;
  planet.castShadow = true;
  group.add(planet);
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.75 * scale, 2.45 * scale, 36), material("#e7d2a1", 0.5));
  ring.position.y = 1.42 * scale;
  ring.rotation.x = Math.PI / 2.8;
  group.add(ring);
  placeRegistered(group, x, z, 2.2 * scale, Math.round(310 * scale), "고리 행성");
}

function createStarCluster(x, z, scale = 1) {
  const group = new THREE.Group();
  for (let i = 0; i < 7; i += 1) {
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(randomRange(0.25, 0.55) * scale, 0), material(randomChoice(["#ffffff", "#7de7ff", "#ffef9d"]), 0.38, 0, "#ffffff", 0.55));
    star.position.set(randomRange(-1.2, 1.2) * scale, randomRange(0.5, 2.2) * scale, randomRange(-1.2, 1.2) * scale);
    group.add(star);
  }
  placeRegistered(group, x, z, 1.65 * scale, Math.round(180 * scale), "별무리");
}

function createNebula(x, z, scale = 1) {
  const group = new THREE.Group();
  for (let i = 0; i < 5; i += 1) {
    const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(randomRange(0.85, 1.45) * scale, 1), material(randomChoice(["#8d7bff", "#ff7fd1", "#75e5ff"]), 0.48, 0, "#ffffff", 0.18));
    puff.scale.y = randomRange(0.32, 0.65);
    puff.position.set(randomRange(-1.7, 1.7) * scale, randomRange(0.65, 2.4) * scale, randomRange(-1.7, 1.7) * scale);
    group.add(puff);
  }
  placeRegistered(group, x, z, 2.35 * scale, Math.round(260 * scale), "성운");
}

function createMiniGalaxy(x, z, scale = 1) {
  const group = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.7 * scale, 12, 8), material("#fff0a4", 0.38, 0, "#ffe27a", 0.65));
  core.position.y = 1.2 * scale;
  group.add(core);
  for (let i = 0; i < 3; i += 1) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(3.2 * scale, 0.16 * scale, 0.38 * scale), material(randomChoice(["#7de7ff", "#ff7fd1", "#9b87ff"]), 0.55, 0, "#ffffff", 0.2));
    arm.position.y = 1.18 * scale;
    arm.rotation.y = (i / 3) * Math.PI;
    group.add(arm);
  }
  placeRegistered(group, x, z, 2.9 * scale, Math.round(420 * scale), "작은 은하");
}

function createGalaxyCore(x, z, scale = 1) {
  const group = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(1.15 * scale, 16, 10), material("#ffe27a", 0.28, 0, "#ffb84d", 0.8));
  core.position.y = 1.6 * scale;
  group.add(core);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(2.1 * scale, 0.15 * scale, 10, 42), material("#ff7fd1", 0.45, 0, "#ff7fd1", 0.38));
  halo.position.y = 1.6 * scale;
  halo.rotation.x = Math.PI / 2;
  group.add(halo);
  placeRegistered(group, x, z, 3.6 * scale, Math.round(700 * scale), "은하 코어");
}

function placeRegistered(group, x, z, radius, points, label) {
  group.position.set(x, 0, z);
  group.rotation.y = randomRange(0, Math.PI * 2);
  objectGroup.add(group);
  registerObject(group, radius, points, label);
  return group;
}

function registerObject(group, radius, points, label) {
  group.userData = {
    radius,
    points,
    label,
    swallowed: false,
    sink: 0,
    wobble: randomRange(0, Math.PI * 2),
  };
  state.objects.push(group);
}

function makeHole() {
  hole.ring = new THREE.Mesh(new THREE.TorusGeometry(state.radius, 0.18, 16, 96), sharedMaterials.holeRing);
  hole.ring.rotation.x = Math.PI / 2;
  hole.ring.castShadow = true;
  scene.add(hole.ring);

  hole.disk = new THREE.Mesh(new THREE.CircleGeometry(state.radius * 0.98, 96), sharedMaterials.holeDisk);
  hole.disk.rotation.x = -Math.PI / 2;
  scene.add(hole.disk);

  hole.vortex = new THREE.Mesh(new THREE.RingGeometry(state.radius * 0.18, state.radius * 0.82, 96), sharedMaterials.vortex);
  hole.vortex.rotation.x = -Math.PI / 2;
  scene.add(hole.vortex);

  hole.glow = new THREE.Mesh(new THREE.RingGeometry(state.radius * 1.02, state.radius * 1.28, 96), sharedMaterials.glow);
  hole.glow.rotation.x = -Math.PI / 2;
  scene.add(hole.glow);

  hole.teeth = new THREE.Group();
  scene.add(hole.teeth);
  rebuildTeeth();
}

function rebuildHoleMesh() {
  for (const mesh of [hole.ring, hole.disk, hole.vortex, hole.glow]) {
    if (mesh.geometry) mesh.geometry.dispose();
  }
  hole.ring.geometry = new THREE.TorusGeometry(state.radius, 0.18, 16, 96);
  hole.disk.geometry = new THREE.CircleGeometry(state.radius * 0.98, 96);
  hole.vortex.geometry = new THREE.RingGeometry(state.radius * 0.18, state.radius * 0.82, 96);
  hole.glow.geometry = new THREE.RingGeometry(state.radius * 1.02, state.radius * 1.28, 96);
  rebuildTeeth();
  placeHoleMeshes();
}

function placeHoleMeshes() {
  hole.ring.position.copy(hole.position);
  hole.disk.position.copy(hole.position);
  hole.vortex.position.copy(hole.position).add(new THREE.Vector3(0, 0.014, 0));
  hole.glow.position.copy(hole.position).add(new THREE.Vector3(0, 0.018, 0));
  hole.teeth.position.copy(hole.position).add(new THREE.Vector3(0, 0.08, 0));
}

function rebuildTeeth() {
  clearGroup(hole.teeth, false);
  const count = Math.max(20, Math.floor(state.radius * 7));
  const toothWidth = THREE.MathUtils.clamp(state.radius * 0.16, 0.34, 1.05);
  const toothHeight = THREE.MathUtils.clamp(state.radius * 0.32, 0.72, 3);
  const toothDepth = THREE.MathUtils.clamp(state.radius * 0.42, 0.9, 3.4);
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const biteOffset = i % 2 ? 0.88 : 1.04;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(toothWidth, toothHeight, toothDepth), sharedMaterials.tooth);
    tooth.position.set(Math.cos(angle) * state.radius * biteOffset, toothHeight * 0.44, Math.sin(angle) * state.radius * biteOffset);
    tooth.rotation.y = Math.PI / 2 - angle;
    tooth.rotation.z = Math.sin(angle) * 0.18;
    tooth.castShadow = true;
    hole.teeth.add(tooth);
  }
}

function updateInput() {
  const keyboardInput = tmpVector.set(0, 0, 0);
  if (keys.has("KeyW") || keys.has("ArrowUp")) keyboardInput.z -= 1;
  if (keys.has("KeyS") || keys.has("ArrowDown")) keyboardInput.z += 1;
  if (keys.has("KeyA") || keys.has("ArrowLeft")) keyboardInput.x -= 1;
  if (keys.has("KeyD") || keys.has("ArrowRight")) keyboardInput.x += 1;
  state.input.set(keyboardInput.x + state.touchInput.x, keyboardInput.z + state.touchInput.y);
  if (state.input.lengthSq() > 1) state.input.normalize();
}

function updateHole(delta) {
  const stage = STAGES[state.stageIndex];
  updateInput();
  const speed = THREE.MathUtils.clamp(11.4 - state.radius * 0.17, 6.8, 12.4);
  const target = state.input.clone().multiplyScalar(speed);
  state.velocity.lerp(target, 1 - Math.pow(0.0007, delta));
  hole.position.x += state.velocity.x * delta;
  hole.position.z += state.velocity.y * delta;

  const half = stage.worldSize / 2;
  hole.position.x = THREE.MathUtils.clamp(hole.position.x, -half + state.radius + 1.5, half - state.radius - 1.5);
  hole.position.z = THREE.MathUtils.clamp(hole.position.z, -half + state.radius + 1.5, half - state.radius - 1.5);
  placeHoleMeshes();
  hole.ring.rotation.z -= delta * (1.15 + state.velocity.length() * 0.12);
  hole.vortex.rotation.z += delta * 2.8;
  hole.glow.rotation.z -= delta * 0.8;
}

function updateTraffic(delta) {
  for (const car of state.traffic) {
    if (car.userData.swallowed || !car.parent) continue;
    const route = car.userData.route;
    const target = route[car.userData.routeIndex];
    const dx = target.x - car.position.x;
    const dz = target.z - car.position.z;
    const distance = Math.hypot(dx, dz);
    if (distance < 0.7) {
      car.userData.routeIndex = (car.userData.routeIndex + 1) % route.length;
      continue;
    }
    const step = Math.min(distance, car.userData.speed * delta);
    car.position.x += (dx / distance) * step;
    car.position.z += (dz / distance) * step;
    const targetRotation = Math.atan2(dx, dz) + Math.PI / 2;
    car.rotation.y = lerpAngle(car.rotation.y, targetRotation, Math.min(1, delta * car.userData.turnSpeed));
  }
}

function updateEnvironment(delta) {
  const time = performance.now() * 0.001;
  state.environment = state.environment.filter((item) => item.object.parent && !item.object.userData.swallowed);
  for (const item of state.environment) {
    const sway = Math.sin(time * (item.kind === "tree" ? 1.45 : 0.9) + item.phase) * (item.kind === "tree" ? 0.025 : 0.008);
    item.object.rotation.z = THREE.MathUtils.lerp(item.object.rotation.z, sway, delta * 2.8);
  }
}

function lerpAngle(from, to, amount) {
  const difference = Math.atan2(Math.sin(to - from), Math.cos(to - from));
  return from + difference * amount;
}

function updateSwallow(delta) {
  const time = performance.now() * 0.001;
  for (const object of [...state.objects]) {
    if (object.userData.swallowed) {
      animateSwallowedObject(object, delta);
      continue;
    }

    const distance = Math.hypot(object.position.x - hole.position.x, object.position.z - hole.position.z);
    const canSwallow = object.userData.radius <= state.radius * 0.74;
    const near = distance < state.radius + object.userData.radius * 1.35;
    if (near) {
      object.rotation.y += Math.sin(time * 8 + object.userData.wobble) * delta * 1.1;
      object.position.y = Math.sin(time * 9 + object.userData.wobble) * 0.06;
    }

    if (canSwallow && distance < state.radius - object.userData.radius * 0.24) {
      object.userData.swallowed = true;
      object.userData.sink = 0;
      if (object.userData.traffic) state.traffic = state.traffic.filter((car) => car !== object);
      objectiveText.textContent = `${object.userData.label} 흡수!`;
      addScore(object.userData.points);
      spawnParticles(object.position, object.userData.radius, STAGES[state.stageIndex].accent);
      spawnEscapees(object.userData.label, object.position, object.userData.radius, object.userData.points);
      handleGalaxySwallow(object.userData.label);
    } else if (!canSwallow && near) {
      nudgeObject(object, delta);
    }
  }
}

function animateSwallowedObject(object, delta) {
  object.userData.sink += delta * 1.55;
  const t = THREE.MathUtils.clamp(object.userData.sink, 0, 1);
  object.position.lerp(tmpVector.set(hole.position.x, -3.6 - state.radius * 0.12, hole.position.z), delta * 5.2);
  object.rotation.y += delta * 5.5;
  object.rotation.x += delta * 3.2;
  const scale = Math.max(0.04, 1 - t * 0.94);
  object.scale.setScalar(scale);
  if (t >= 1) {
    objectGroup.remove(object);
    state.objects = state.objects.filter((item) => item !== object);
    disposeObject(object);
  }
}

function nudgeObject(object, delta) {
  const awayX = object.position.x - hole.position.x;
  const awayZ = object.position.z - hole.position.z;
  const len = Math.max(0.001, Math.hypot(awayX, awayZ));
  object.position.x += (awayX / len) * delta * 1.45;
  object.position.z += (awayZ / len) * delta * 1.45;
}

function addScore(points) {
  if (state.transitioning) return;
  const stage = STAGES[state.stageIndex];
  state.score += points;
  state.stageScore += points;
  state.growth += points;
  let growthNeed = 120 + state.level * 54 + state.stageIndex * 90;
  while (state.growth >= growthNeed) {
    state.growth -= growthNeed;
    state.level += 1;
    state.radius = Math.min(stage.maxRadius, state.radius + stage.startRadius * 0.15);
    growthNeed = 120 + state.level * 54 + state.stageIndex * 90;
    rebuildHoleMesh();
  }

  if (state.stageScore >= stage.targetScore) {
    if (state.stageIndex < STAGES.length - 1) beginStageTransition();
    else if (!state.finalBattle.active && !state.finalBattle.won) objectiveText.textContent = "은하 코어를 찾아 최종전을 시작하세요";
  }
  updateHud();
}

function beginStageTransition() {
  if (state.transitioning) return;
  const stage = STAGES[state.stageIndex];
  if (state.stageIndex >= STAGES.length - 1) {
    objectiveText.textContent = "완료! 은하계까지 삼켰습니다";
    state.running = false;
    centerMessage.querySelector("strong").textContent = "우주 정복";
    centerMessage.querySelector("span").textContent = "다시 시작해서 더 빠른 기록에 도전";
    centerMessage.classList.remove("hidden");
    return;
  }

  state.transitioning = true;
  const token = ++state.transitionToken;
  objectiveText.textContent = `${stage.nextName} 규모로 확장 중`;
  centerMessage.querySelector("strong").textContent = "규모 상승";
  centerMessage.querySelector("span").textContent = `${stage.name}에서 ${stage.nextName}로 전환`;
  renderStageTrack(transitionTrack, state.stageIndex, state.stageIndex + 1);
  modeSelector.hidden = true;
  startButton.hidden = true;
  centerMessage.classList.remove("hidden");
  setTimeout(() => {
    if (token !== state.transitionToken) return;
    buildStage(state.stageIndex + 1);
    centerMessage.classList.add("hidden");
    transitionTrack.innerHTML = "";
    modeSelector.hidden = false;
    startButton.hidden = false;
    state.transitioning = false;
    state.running = true;
  }, 1250);
}

function updateHud() {
  const stage = STAGES[state.stageIndex];
  const stageProgress = THREE.MathUtils.clamp(state.stageScore / stage.targetScore, 0, 1);
  const remaining = Math.max(0, stage.targetScore - state.stageScore);
  scoreValue.textContent = state.score.toLocaleString("ko-KR");
  levelValue.textContent = `${Math.round(stageProgress * 100)}%`;
  stageValue.textContent = `${state.stageIndex + 1}/${STAGES.length} ${stage.name}`;
  if (state.finalBattle.won) {
    targetValue.textContent = "완료";
  } else if (["loading", "awaitingInput", "playing"].includes(state.finalBattle.cinematic)) {
    targetValue.textContent = "최종전 영상";
  } else if (state.finalBattle.active) {
    targetValue.textContent = `악당 ${state.finalBattle.bossesRemaining}명`;
  } else if (stage.id === "galaxy" && state.unlockedHeroes.size) {
    targetValue.textContent = `영웅 ${state.unlockedHeroes.size}/${HERO_DEFS.length}`;
  } else if (state.stageIndex < STAGES.length - 1) {
    targetValue.textContent = `${stage.nextName}까지 ${remaining.toLocaleString("ko-KR")}점`;
  } else {
    targetValue.textContent = `최종전까지 ${remaining.toLocaleString("ko-KR")}점`;
  }
  growthBar.style.width = `${stageProgress * 100}%`;
  progressValue.textContent = `${Math.min(state.stageScore, stage.targetScore).toLocaleString("ko-KR")} / ${stage.targetScore.toLocaleString("ko-KR")}`;
  renderStageTrack(stageTrack, state.stageIndex, state.transitioning ? state.stageIndex + 1 : -1);
}

function renderStageTrack(container, currentIndex, nextIndex = -1) {
  if (container === transitionTrack) {
    container.innerHTML = STAGES.map((stage, index) => `<i data-stage="${index}">${stage.name}</i>${index < STAGES.length - 1 ? "<b>›</b>" : ""}`).join("");
  }
  for (const item of container.querySelectorAll("i[data-stage]")) {
    const index = Number(item.dataset.stage);
    item.classList.toggle("done", index < currentIndex);
    item.classList.toggle("current", index === currentIndex);
    item.classList.toggle("next", index === nextIndex);
  }
}

function setBattleMode(mode) {
  state.battleMode = mode === "performance" ? "performance" : "cinema";
  try {
    window.localStorage.setItem("hole-city-battle-mode", state.battleMode);
  } catch (error) {
    // The selected mode still applies for the current session.
  }
  updateModeButtons();
}

function updateModeButtons() {
  for (const button of modeButtons) button.classList.toggle("active", button.dataset.mode === state.battleMode);
}

function handleGalaxySwallow(label) {
  if (STAGES[state.stageIndex].id !== "galaxy") return;
  if (label === "작은 은하") {
    spawnNextHeroSquad();
    objectiveText.textContent = `인피니티 사가 영웅 집결 ${state.unlockedHeroes.size}/${HERO_DEFS.length}`;
  }
  if (label === "은하 코어" && !state.finalBattle.active && !state.finalBattle.won) beginFinalBattle();
  updateHud();
}

function spawnNextHeroSquad() {
  const squadOrder = ["avengers", "wakanda", "guardians", "mystic", "asgard", "cosmic"];
  const squad = squadOrder.find((name) => HERO_DEFS.some((hero) => hero.squad === name && !state.unlockedHeroes.has(hero.id)));
  if (!squad) return;
  const squadHeroes = HERO_DEFS.filter((hero) => hero.squad === squad && !state.unlockedHeroes.has(hero.id)).slice(0, 4);
  spawnHeroDefinitions(squadHeroes);
}

function spawnNextHeroes(count) {
  const remaining = HERO_DEFS.filter((hero) => !state.unlockedHeroes.has(hero.id));
  spawnHeroDefinitions(remaining.slice(0, count));
}

function spawnHeroDefinitions(heroes) {
  for (const hero of heroes) {
    state.unlockedHeroes.add(hero.id);
    const actor = spawnBattleActor(hero, "hero", state.unlockedHeroes.size - 1);
    spawnPortalEffect(actor.position, hero.accent);
  }
}

function beginFinalBattle() {
  spawnNextHeroes(HERO_DEFS.length);
  state.finalBattle.active = true;
  state.finalBattle.elapsed = 0;
  state.finalBattle.cinematic = "loading";
  state.cameraShake = 0.7;
  state.running = false;
  state.velocity.set(0, 0);
  state.touchInput.set(0, 0);
  objectiveText.textContent = "은하 코어 흡수 · 최종전 영상 준비";
  updateHud();

  if (previewParams.get("cinematic") === "0") {
    beginRealtimeFinalBattle();
    return;
  }
  startFinalCinematic();
}

function beginRealtimeFinalBattle() {
  stopFinalCinematic();
  state.finalBattle.active = true;
  state.finalBattle.cinematic = "fallback";
  state.running = true;
  const troopPlan = state.battleMode === "cinema" ? CINEMA_TROOPS : PERFORMANCE_TROOPS;
  const troopTotal = Object.values(troopPlan).reduce((sum, count) => sum + count, 0);
  objectiveText.textContent = `실시간 대체 전투 · 영웅 30 대 악당 ${troopTotal + BOSS_ORDER.length}`;

  let enemyIndex = 0;
  for (const [type, count] of Object.entries(troopPlan)) {
    spawnTroopActors(type, count, enemyIndex);
    enemyIndex += count;
  }
  for (const type of BOSS_ORDER) {
    const actor = spawnBattleActor(ENEMY_DEFS[type], "enemy", enemyIndex, type);
    actor.userData.isBoss = true;
    if (type === "thanos") state.finalBattle.boss = actor;
    spawnPortalEffect(actor.position, ENEMY_DEFS[type].accent);
    enemyIndex += 1;
  }
  state.finalBattle.bossesRemaining = BOSS_ORDER.length;
  updateHud();
}

async function startFinalCinematic() {
  const token = ++state.cinematicToken;
  finalCinematic.hidden = false;
  cinematicStatus.textContent = "은하계 최종전";
  cinematicSoundButton.textContent = "음소거";
  finalBattleVideo.currentTime = 0;
  finalBattleVideo.muted = false;
  finalBattleVideo.volume = 0.82;
  finalBattleVideo.load();
  setTimeout(() => {
    if (state.finalBattle.cinematic === "awaitingInput") return;
    if (token !== state.cinematicToken || !state.finalBattle.active) return;
    if (finalBattleVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      fallbackToRealtimeBattle();
      return;
    }
    if (finalBattleVideo.currentTime < 0.5) {
      finalBattleVideo.pause();
      state.finalBattle.cinematic = "awaitingInput";
      cinematicStatus.textContent = "재생을 눌러 최종전 시작";
      cinematicSoundButton.textContent = "재생";
    }
  }, 15000);

  try {
    await finalBattleVideo.play();
    if (token !== state.cinematicToken) return;
    state.finalBattle.cinematic = "playing";
    cinematicStatus.textContent = "인피니티 사가 최종전";
  } catch (error) {
    if (token !== state.cinematicToken) return;
    finalBattleVideo.muted = true;
    cinematicSoundButton.textContent = "소리 켜기";
    try {
      await finalBattleVideo.play();
      if (token !== state.cinematicToken) return;
      state.finalBattle.cinematic = "playing";
      cinematicStatus.textContent = "인피니티 사가 최종전";
    } catch (secondError) {
      state.finalBattle.cinematic = "awaitingInput";
      cinematicStatus.textContent = "재생을 눌러 최종전 시작";
      cinematicSoundButton.textContent = "재생";
    }
  }
}

function stopFinalCinematic(invalidate = true) {
  if (invalidate) state.cinematicToken += 1;
  finalBattleVideo.pause();
  finalCinematic.hidden = true;
}

function fallbackToRealtimeBattle() {
  if (!state.finalBattle.active) return;
  if (state.finalBattle.cinematic === "fallback" || state.finalBattle.cinematic === "complete") return;
  cinematicStatus.textContent = "실시간 전투로 전환";
  beginRealtimeFinalBattle();
}

function completeFinalCinematic() {
  if (state.finalBattle.cinematic === "complete" || state.finalBattle.won) return;
  state.finalBattle.cinematic = "complete";
  stopFinalCinematic();
  finishGalaxyVictory();
}

function spawnBattleActor(definition, team, index, type = definition.id) {
  const group = team === "hero" ? createHeroModel(definition) : createEnemyModel(definition, type);
  const angle = team === "hero" ? index * 0.56 : (index / 100) * Math.PI * 2;
  const radius = team === "hero" ? 11.5 + (index % 5) * 2.4 : (type === "thanos" ? 32 : 27 + (index % 4) * 2.8);
  const flying = definition.moveType === "flying" || definition.flying;
  group.position.set(Math.cos(angle) * radius, flying ? 4.2 : 0, Math.sin(angle) * radius);
  group.userData = {
    ...group.userData,
    id: definition.id || type,
    name: definition.name,
    team,
    type,
    hp: definition.hp,
    maxHp: definition.hp,
    speed: definition.speed,
    attackRange: definition.range,
    damage: definition.damage,
    cooldown: definition.cooldown,
    attackTimer: randomRange(0.1, definition.cooldown),
    role: definition.role || (team === "hero" ? "ranged" : "fighter"),
    moveType: definition.moveType || (flying ? "flying" : "ground"),
    attackType: definition.basicAttack,
    skillType: definition.skill || definition.basicAttack,
    ultimateType: definition.ultimate || definition.skill || definition.basicAttack,
    attackCount: 0,
    accent: definition.accent,
    flying: Boolean(flying),
    idleAngle: angle,
    slow: 0,
    stun: 0,
    shield: 0,
    hitFlash: 0,
    attackPose: 0,
  };
  battleGroup.add(group);
  state.battleActors.push(group);
  return group;
}

function spawnTroopActors(type, count, startIndex) {
  const definition = ENEMY_DEFS[type];
  const geometry = new THREE.CapsuleGeometry(0.34, 0.72, 3, 6);
  const troopMaterial = material(definition.color, 0.7, type === "ultronDrone" ? 0.18 : 0.03, definition.accent, 0.04);
  const mesh = new THREE.InstancedMesh(geometry, troopMaterial, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.castShadow = state.battleMode === "cinema";
  battleGroup.add(mesh);
  state.troopMeshes.push(mesh);
  for (let i = 0; i < count; i += 1) {
    const actor = new THREE.Object3D();
    const index = startIndex + i;
    const angle = (index / Math.max(1, Object.values(state.battleMode === "cinema" ? CINEMA_TROOPS : PERFORMANCE_TROOPS).reduce((sum, value) => sum + value, 0))) * Math.PI * 2;
    const radius = 17 + (index % 5) * 2.2;
    actor.position.set(Math.cos(angle) * radius, definition.flying ? 2.4 : 0.8, Math.sin(angle) * radius);
    actor.scale.setScalar(definition.scale || 1);
    actor.userData = {
      id: `${type}-${i}`,
      name: definition.name,
      team: "enemy",
      type,
      hp: definition.hp,
      maxHp: definition.hp,
      speed: definition.speed,
      attackRange: definition.range,
      damage: definition.damage,
      cooldown: definition.cooldown,
      attackTimer: randomRange(0.1, definition.cooldown),
      attackType: definition.basicAttack,
      skillType: definition.basicAttack,
      ultimateType: definition.basicAttack,
      attackCount: 0,
      accent: definition.accent,
      flying: Boolean(definition.flying),
      role: definition.range > 5 ? "ranged" : "fighter",
      idleAngle: angle,
      slow: 0,
      stun: 0,
      shield: 0,
      hitFlash: 0,
      isTroop: true,
      instanceMesh: mesh,
      instanceIndex: i,
    };
    battleGroup.add(actor);
    state.battleActors.push(actor);
    syncTroopInstance(actor);
    if (i % 8 === 0) spawnPortalEffect(actor.position, definition.accent);
  }
  mesh.instanceMatrix.needsUpdate = true;
}

function syncTroopInstance(actor, hidden = false) {
  if (!actor.userData.instanceMesh) return;
  if (hidden) actor.scale.setScalar(0.001);
  actor.updateMatrix();
  actor.userData.instanceMesh.setMatrixAt(actor.userData.instanceIndex, actor.matrix);
  actor.userData.instanceMesh.instanceMatrix.needsUpdate = true;
}

function createHeroModel(definition) {
  const group = new THREE.Group();
  const visual = HERO_VISUALS[definition.id] || { build: "athletic", face: "open", skin: "#d7aa87", secondary: definition.accent };
  const builds = {
    slim: { shoulder: 0.92, waist: 0.82, depth: 0.88, limb: 0.9, head: 0.98 },
    athletic: { shoulder: 1, waist: 0.9, depth: 1, limb: 1, head: 1 },
    broad: { shoulder: 1.18, waist: 1.02, depth: 1.08, limb: 1.12, head: 1.04 },
    armored: { shoulder: 1.16, waist: 0.98, depth: 1.12, limb: 1.12, head: 1.04 },
    massive: { shoulder: 1.34, waist: 1.15, depth: 1.2, limb: 1.3, head: 1.06 },
    compact: { shoulder: 1.08, waist: 1, depth: 1, limb: 0.9, head: 1.24 },
    tree: { shoulder: 1.2, waist: 0.9, depth: 1.05, limb: 1.18, head: 0.92 },
    rock: { shoulder: 1.3, waist: 1.12, depth: 1.18, limb: 1.22, head: 1.03 },
  };
  const shape = builds[visual.build] || builds.athletic;
  const suit = definition.color;
  const secondary = visual.secondary || definition.accent;
  const skin = visual.skin || "#d7aa87";
  const isArmored = ["armored", "rock"].includes(visual.build);

  const pelvis = characterMesh("box", [0.72 * shape.waist, 0.34, 0.44 * shape.depth], secondary, { roughness: 0.62, metalness: isArmored ? 0.26 : 0.04 });
  pelvis.position.y = 1.14;
  group.add(pelvis);

  const torso = characterMesh("capsule", [0.38 * shape.shoulder, 0.58, 5, 8], suit, { roughness: isArmored ? 0.34 : 0.62, metalness: isArmored ? 0.42 : 0.04 });
  torso.scale.set(1, 1, 0.68 * shape.depth);
  torso.position.y = 1.78;
  group.add(torso);

  const belt = characterMesh("box", [0.77 * shape.waist, 0.13, 0.48 * shape.depth], definition.accent, { roughness: 0.46, metalness: 0.16 });
  belt.position.set(0, 1.34, 0.02);
  group.add(belt);

  const neck = characterMesh("cylinder", [0.12, 0.14, 0.22, 8], skin, { castShadow: false });
  neck.position.y = 2.38;
  group.add(neck);

  const maskedFaces = ["ironMask", "warMask", "cowl", "vision", "webMask", "pantherMask", "antHelmet", "waspHelmet", "starHelmet", "cyber", "rescueMask", "rock", "groot", "rocket"];
  const headColor = maskedFaces.includes(visual.face) ? (visual.face === "vision" || visual.face === "groot" || visual.face === "rock" || visual.face === "rocket" ? skin : suit) : skin;
  const head = characterMesh("sphere", [0.34 * shape.head, 12, 9], headColor, { roughness: isArmored ? 0.38 : 0.58, metalness: isArmored ? 0.28 : 0.02 });
  head.scale.set(0.92, 1.08, 0.9);
  head.position.y = 2.75;
  group.add(head);

  const rig = { torso, pelvis, head, leftArm: null, rightArm: null, leftLeg: null, rightLeg: null, cape: null, wings: [] };
  const makeArm = (side) => {
    const arm = new THREE.Group();
    arm.position.set(side * 0.52 * shape.shoulder, 2.15, 0);
    const upperColor = visual.metalArm && side < 0 ? "#aebac7" : suit;
    const upper = characterMesh("capsule", [0.105 * shape.limb, 0.36, 4, 7], upperColor, { roughness: isArmored ? 0.38 : 0.62, metalness: visual.metalArm && side < 0 ? 0.62 : isArmored ? 0.35 : 0.03 });
    upper.position.y = -0.27;
    arm.add(upper);
    const forearm = new THREE.Group();
    forearm.position.y = -0.53;
    const lower = characterMesh("capsule", [0.095 * shape.limb, 0.32, 4, 7], visual.metalArm && side < 0 ? "#c1cad1" : secondary, { roughness: 0.48, metalness: visual.metalArm && side < 0 ? 0.68 : isArmored ? 0.24 : 0.03 });
    lower.position.y = -0.24;
    forearm.add(lower);
    const hand = characterMesh("sphere", [0.13 * shape.limb, 8, 6], visual.metalArm && side < 0 ? "#c1cad1" : skin, { roughness: 0.5, metalness: visual.metalArm && side < 0 ? 0.58 : 0.01 });
    hand.scale.set(0.8, 1, 0.82);
    hand.position.y = -0.5;
    forearm.add(hand);
    arm.add(forearm);
    group.add(arm);
    arm.userData.forearm = forearm;
    arm.userData.hand = hand;
    return arm;
  };
  rig.leftArm = makeArm(-1);
  rig.rightArm = makeArm(1);

  const makeLeg = (side) => {
    const leg = new THREE.Group();
    leg.position.set(side * 0.22 * shape.waist, 1.03, 0);
    const upper = characterMesh("capsule", [0.13 * shape.limb, 0.34, 4, 7], suit, { roughness: 0.62, metalness: isArmored ? 0.2 : 0.02 });
    upper.position.y = -0.25;
    leg.add(upper);
    const shin = new THREE.Group();
    shin.position.y = -0.49;
    const lower = characterMesh("capsule", [0.115 * shape.limb, 0.3, 4, 7], secondary, { roughness: 0.52, metalness: isArmored ? 0.25 : 0.02 });
    lower.position.y = -0.22;
    shin.add(lower);
    const boot = characterMesh("box", [0.27 * shape.limb, 0.2, 0.39 * shape.limb], darken(suit, 0.68), { roughness: 0.68, metalness: isArmored ? 0.2 : 0.02 });
    boot.position.set(0, -0.47, 0.07);
    shin.add(boot);
    leg.add(shin);
    group.add(leg);
    leg.userData.shin = shin;
    return leg;
  };
  rig.leftLeg = makeLeg(-1);
  rig.rightLeg = makeLeg(1);

  addHeroFace(group, definition, visual, head, shape);
  addHeroChest(group, definition, visual, torso);
  addHeroEquipment(group, definition, visual, rig);
  group.userData.rig = rig;
  group.userData.visualScale = HERO_DISPLAY_SCALE;
  group.scale.setScalar(1.05 * HERO_DISPLAY_SCALE * (definition.scale || 1));
  return group;
}

function addHeroFace(group, definition, visual, head, shape) {
  const frontZ = 0.3 * shape.head;
  const addEyePair = (color, width = 0.1, height = 0.12, glow = 0.18) => {
    for (const side of [-1, 1]) {
      const eye = characterMesh("box", [width, height, 0.035], color, { roughness: 0.3, emissive: color, emissiveIntensity: glow, castShadow: false });
      eye.position.set(side * 0.12, 2.78, frontZ);
      eye.rotation.z = side * -0.12;
      group.add(eye);
    }
  };

  if (["ironMask", "warMask", "rescueMask"].includes(visual.face)) {
    const plate = characterMesh("box", [0.43, 0.42, 0.08], visual.secondary, { roughness: 0.32, metalness: 0.54 });
    plate.position.set(0, 2.72, frontZ - 0.01);
    group.add(plate);
    addEyePair("#bff8ff", 0.11, 0.045, 0.72);
  } else if (["webMask", "pantherMask", "antHelmet", "waspHelmet", "starHelmet", "vision", "cyber", "rock"].includes(visual.face)) {
    addEyePair(visual.face === "webMask" ? "#f8fbff" : definition.accent, visual.face === "webMask" ? 0.12 : 0.09, visual.face === "webMask" ? 0.18 : 0.08, 0.38);
  } else {
    addEyePair("#17212a", 0.055, 0.055, 0);
  }

  if (visual.hair) {
    const hair = characterMesh("sphere", [0.35 * shape.head, 10, 7], visual.hair, { roughness: 0.9, castShadow: false });
    hair.scale.set(0.96, 0.48, 0.92);
    hair.position.set(0, 2.94, -0.035);
    group.add(hair);
  }
  if (visual.beard) {
    const beard = characterMesh("cone", [0.21, 0.34, 7], visual.hair || "#5b4030", { roughness: 0.9, castShadow: false });
    beard.position.set(0, 2.56, 0.18);
    beard.rotation.x = 0.16;
    group.add(beard);
  }
  if (visual.face === "crown") {
    for (const side of [-1, 1]) {
      const crown = characterMesh("cone", [0.07, 0.46, 5], definition.accent, { roughness: 0.42, metalness: 0.18 });
      crown.position.set(side * 0.19, 3.05, 0.02);
      crown.rotation.z = side * 0.3;
      group.add(crown);
    }
  }
  if (visual.face === "antennae") {
    for (const side of [-1, 1]) {
      const antenna = characterMesh("cylinder", [0.018, 0.025, 0.48, 5], "#272420", { castShadow: false });
      antenna.position.set(side * 0.14, 3.08, 0);
      antenna.rotation.z = side * 0.2;
      group.add(antenna);
      const tip = characterMesh("sphere", [0.045, 6, 5], definition.accent, { emissive: definition.accent, emissiveIntensity: 0.24, castShadow: false });
      tip.position.set(side * 0.19, 3.31, 0);
      group.add(tip);
    }
  }
  if (visual.face === "rocket") {
    for (const side of [-1, 1]) {
      const ear = characterMesh("cone", [0.16, 0.34, 5], visual.hair, { roughness: 0.94 });
      ear.position.set(side * 0.24, 3.03, 0);
      ear.rotation.z = side * -0.18;
      group.add(ear);
    }
    const muzzle = characterMesh("sphere", [0.16, 8, 6], "#c7ae8b", { castShadow: false });
    muzzle.scale.set(1, 0.62, 0.72);
    muzzle.position.set(0, 2.65, 0.27);
    group.add(muzzle);
  }
  if (visual.face === "groot") {
    for (let i = -2; i <= 2; i += 1) {
      const crown = characterMesh("cone", [0.08, 0.34 + Math.abs(i) * 0.04, 5], visual.skin, { roughness: 0.94 });
      crown.position.set(i * 0.13, 3.08 + (i % 2) * 0.04, 0);
      group.add(crown);
    }
  }
}

function addHeroChest(group, definition, visual) {
  const glow = ["reactor", "gem", "amulet", "disc"].includes(visual.chest);
  const markerKind = ["star", "spider"].includes(visual.chest) ? "octahedron" : visual.chest === "bare" ? "box" : "cylinder";
  const dimensions = markerKind === "octahedron" ? [0.16, 0] : markerKind === "cylinder" ? [0.14, 0.14, 0.055, 10] : [0.3, 0.11, 0.04];
  const marker = characterMesh(markerKind, dimensions, visual.chest === "bare" ? visual.secondary : definition.accent, { roughness: 0.34, metalness: 0.2, emissive: glow ? definition.accent : "#000000", emissiveIntensity: glow ? 0.7 : 0, castShadow: false });
  marker.position.set(0, 1.9, 0.3);
  marker.rotation.x = markerKind === "cylinder" ? Math.PI / 2 : 0;
  if (visual.chest === "bare") marker.scale.set(1.8, 0.5, 1);
  group.add(marker);
}

function addHeroEquipment(group, definition, visual, rig) {
  const attachWeapon = (arm, color, length = 0.9, width = 0.1, glow = false) => {
    const weapon = characterMesh("box", [width, length, width * 1.35], color, { roughness: 0.4, metalness: 0.32, emissive: glow ? color : "#000000", emissiveIntensity: glow ? 0.55 : 0 });
    weapon.position.set(0, -0.68, 0.16);
    weapon.rotation.z = -0.16;
    arm.add(weapon);
    return weapon;
  };
  const addCape = (color) => {
    const cape = characterMesh("cone", [0.68, 1.45, 6, 1, 1], color, { roughness: 0.82, castShadow: false });
    cape.position.set(0, 1.62, -0.31);
    cape.rotation.x = 0.12;
    group.add(cape);
    rig.cape = cape;
  };
  const addWings = (color, insect = false) => {
    for (const side of [-1, 1]) {
      const wing = characterMesh("box", [insect ? 0.82 : 1.36, 0.09, insect ? 0.55 : 0.38], color, { roughness: 0.36, metalness: 0.34, emissive: insect ? color : "#000000", emissiveIntensity: insect ? 0.15 : 0, castShadow: false });
      wing.position.set(side * 0.92, 1.92, -0.22);
      wing.rotation.y = side * (insect ? 0.5 : 0.26);
      wing.rotation.z = side * 0.18;
      group.add(wing);
      rig.wings.push(wing);
    }
  };
  const addMagic = (color) => {
    for (const side of [-1, 1]) {
      const ring = characterMesh("torus", [0.29, 0.035, 6, 20], color, { roughness: 0.28, emissive: color, emissiveIntensity: 0.7, castShadow: false });
      ring.position.set(side * 0.7, 1.44, 0.28);
      ring.rotation.y = Math.PI / 2;
      group.add(ring);
    }
  };

  if (["armor", "cannon", "rescueArmor"].includes(definition.modelVariant)) {
    for (const side of [-1, 1]) {
      const shoulder = characterMesh("box", [0.36, 0.18, 0.48], visual.secondary, { roughness: 0.34, metalness: 0.48 });
      shoulder.position.set(side * 0.58, 2.15, 0);
      shoulder.rotation.z = side * 0.16;
      group.add(shoulder);
    }
  }

  switch (definition.modelVariant) {
    case "shield": {
      const shield = characterMesh("cylinder", [0.54, 0.54, 0.09, 24], "#c9313c", { roughness: 0.4, metalness: 0.32 });
      shield.rotation.x = Math.PI / 2;
      shield.position.set(-0.66, 1.43, 0.38);
      group.add(shield);
      const center = characterMesh("octahedron", [0.16, 0], "#f5f7fa", { metalness: 0.22, castShadow: false });
      center.position.set(-0.66, 1.43, 0.44);
      group.add(center);
      break;
    }
    case "hammer": {
      attachWeapon(rig.rightArm, "#84765c", 0.92, 0.08);
      const hammer = characterMesh("box", [0.54, 0.35, 0.34], "#cfd5da", { roughness: 0.38, metalness: 0.64 });
      hammer.position.set(0, -1.14, 0.16);
      rig.rightArm.add(hammer);
      addCape("#9f2634");
      break;
    }
    case "giant":
      rig.torso.scale.x *= 1.12;
      break;
    case "batons":
      attachWeapon(rig.leftArm, "#72e4ff", 0.72, 0.075, true);
      attachWeapon(rig.rightArm, "#72e4ff", 0.72, 0.075, true);
      break;
    case "bow": {
      const bow = characterMesh("torus", [0.48, 0.045, 6, 18, Math.PI], definition.accent, { roughness: 0.72 });
      bow.position.set(0, -0.72, 0.18);
      bow.rotation.y = Math.PI / 2;
      rig.leftArm.add(bow);
      break;
    }
    case "cannon":
      attachWeapon(rig.rightArm, "#373d45", 0.88, 0.18);
      addWings("#69737d");
      break;
    case "wings":
      addWings("#cfd6dd");
      break;
    case "rifle":
    case "bigGun":
      attachWeapon(rig.rightArm, definition.modelVariant === "bigGun" ? "#333941" : "#858f99", definition.modelVariant === "bigGun" ? 1.38 : 1.05, definition.modelVariant === "bigGun" ? 0.22 : 0.13);
      break;
    case "magic":
      addMagic(definition.accent);
      break;
    case "capeMagic":
      addCape("#a92435");
      addMagic(definition.accent);
      break;
    case "cape":
      addCape("#e0c753");
      break;
    case "web":
      break;
    case "claws":
    case "gauntlets":
      for (const arm of [rig.leftArm, rig.rightArm]) {
        for (let i = -1; i <= 1; i += 1) {
          const claw = characterMesh("box", [0.025, 0.38, 0.025], definition.accent, { roughness: 0.28, metalness: 0.48, emissive: definition.modelVariant === "gauntlets" ? definition.accent : "#000000", emissiveIntensity: 0.3, castShadow: false });
          claw.position.set(i * 0.055, -0.68, 0.12);
          arm.add(claw);
        }
      }
      break;
    case "spear":
    case "spearCape": {
      attachWeapon(rig.rightArm, definition.accent, 1.65, 0.07);
      const tip = characterMesh("cone", [0.12, 0.36, 5], "#e7edf0", { roughness: 0.3, metalness: 0.68 });
      tip.position.set(0, -1.56, 0.16);
      tip.rotation.z = Math.PI;
      rig.rightArm.add(tip);
      if (definition.modelVariant === "spearCape") addCape("#e6e3dc");
      break;
    }
    case "waspWings":
      addWings("#d6f1ff", true);
      break;
    case "aura": {
      const aura = characterMesh("torus", [0.72, 0.055, 6, 26], definition.accent, { roughness: 0.28, emissive: definition.accent, emissiveIntensity: 0.72, castShadow: false });
      aura.position.y = 1.55;
      aura.rotation.x = Math.PI / 2;
      group.add(aura);
      rig.aura = aura;
      break;
    }
    case "dualGuns":
      attachWeapon(rig.leftArm, "#6b7782", 0.62, 0.13);
      attachWeapon(rig.rightArm, "#6b7782", 0.62, 0.13);
      break;
    case "sword":
    case "cyberSword":
      attachWeapon(rig.rightArm, definition.accent, 1.24, 0.09, definition.modelVariant === "cyberSword");
      break;
    case "knives":
      attachWeapon(rig.leftArm, "#d7dde2", 0.66, 0.075);
      attachWeapon(rig.rightArm, "#d7dde2", 0.66, 0.075);
      break;
    case "tree":
      for (const side of [-1, 1]) {
        const branch = characterMesh("cylinder", [0.05, 0.1, 0.78, 5], "#6d4b34", { roughness: 0.94 });
        branch.position.set(side * 0.72, 2.26, 0);
        branch.rotation.z = side * 0.7;
        group.add(branch);
      }
      break;
    case "antenna":
      break;
    case "rock": {
      for (const side of [-1, 1]) {
        const rock = characterMesh("dodecahedron", [0.28, 0], "#a4afb5", { roughness: 0.94 });
        rock.position.set(side * 0.52, 2.14, 0);
        group.add(rock);
      }
      break;
    }
    case "rescueArmor":
      addWings(definition.accent, true);
      addMagic(definition.accent);
      break;
    default:
      break;
  }
}

function createEnemyModel(definition, type) {
  const group = new THREE.Group();
  const scale = 1.22 * (definition.scale || 1);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.38 * scale, 0.9 * scale, 5, 8), material(definition.color, 0.62, type === "thanos" ? 0.16 : 0.05));
  body.position.y = 1.02 * scale;
  body.castShadow = true;
  group.add(body);
  const villainHeadColors = { thanos: "#7d5a91", redskull: "#9b3437", hela: "#c7d5c9", malekith: "#d9d4d4", maw: "#b8adb8" };
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.32 * scale, 9, 7), material(villainHeadColors[type] || "#69706e", 0.66));
  head.position.y = 1.82 * scale;
  head.castShadow = true;
  group.add(head);
  const armor = new THREE.Mesh(new THREE.BoxGeometry(0.82 * scale, 0.32 * scale, 0.54 * scale), material(definition.accent, 0.45, 0.22, definition.accent, type === "thanos" ? 0.12 : 0));
  armor.position.set(0, 1.32 * scale, 0.12 * scale);
  group.add(armor);
  const addVillainWeapon = (color, length = 1.5, side = 0.72) => {
    const weapon = new THREE.Mesh(new THREE.BoxGeometry(0.14 * scale, length * scale, 0.22 * scale), material(color, 0.42, 0.3, color, 0.08));
    weapon.position.set(side * scale, 1.12 * scale, 0);
    weapon.rotation.z = 0.18;
    group.add(weapon);
  };
  if (type === "thanos") addVillainWeapon("#d2bd78", 1.72);
  if (["ronan", "cull"].includes(type)) addVillainWeapon(definition.accent, 1.9, 0.78);
  if (["proxima", "corvus", "malekith"].includes(type)) addVillainWeapon(definition.accent, 1.65, 0.64);
  if (type === "killmonger") {
    addVillainWeapon("#d3a54e", 0.48, -0.48);
    addVillainWeapon("#d3a54e", 0.48, 0.48);
  }
  if (["loki", "hela"].includes(type)) {
    for (const side of [-1, 1]) {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.09 * scale, (type === "hela" ? 0.9 : 0.62) * scale, 5), material(definition.accent, 0.45, 0.2));
      horn.position.set(side * 0.22 * scale, 2.18 * scale, 0);
      horn.rotation.z = side * 0.38;
      group.add(horn);
    }
  }
  if (["maw", "redskull", "ultron"].includes(type)) {
    const power = new THREE.Mesh(new THREE.TorusGeometry(0.28 * scale, 0.045 * scale, 6, 18), material(definition.accent, 0.3, 0, definition.accent, 0.5));
    power.position.set(0.52 * scale, 1.25 * scale, 0.12 * scale);
    power.rotation.y = Math.PI / 2;
    group.add(power);
  }
  return group;
}

function spawnPortalEffect(position, color) {
  for (let i = 0; i < 7; i += 1) {
    const angle = (i / 7) * Math.PI * 2;
    spawnBattleEffect(
      position.clone().add(new THREE.Vector3(Math.cos(angle) * 1.8, 0.3, Math.sin(angle) * 1.8)),
      position.clone().add(new THREE.Vector3(0, 1.4, 0)),
      color,
      "portal",
      0.72,
    );
  }
}

function updateBattle(delta) {
  if (!state.battleActors.length && !state.battleEffects.length) return;
  battleGroup.position.x = THREE.MathUtils.lerp(battleGroup.position.x, hole.position.x, delta * 1.7);
  battleGroup.position.z = THREE.MathUtils.lerp(battleGroup.position.z, hole.position.z, delta * 1.7);
  state.finalBattle.elapsed += state.finalBattle.active ? delta : 0;
  const time = performance.now() * 0.001;

  for (const actor of [...state.battleActors]) {
    actor.userData.attackTimer -= delta;
    actor.userData.slow = Math.max(0, actor.userData.slow - delta);
    actor.userData.stun = Math.max(0, actor.userData.stun - delta);
    actor.userData.shield = Math.max(0, actor.userData.shield - delta * 2.4);
    actor.userData.hitFlash = Math.max(0, actor.userData.hitFlash - delta);
    actor.userData.attackPose = Math.max(0, (actor.userData.attackPose || 0) - delta);
    if (actor.userData.stun > 0) {
      animateBattleActor(actor, time, false);
      if (actor.userData.isTroop) syncTroopInstance(actor);
      continue;
    }
    const opponents = state.battleActors.filter((candidate) => candidate.userData.team !== actor.userData.team && candidate.parent);
    if (!state.finalBattle.active || !opponents.length) {
      if (actor.userData.team === "hero") {
        const idleRadius = 11.5 + (HERO_DEFS.findIndex((hero) => hero.id === actor.userData.id) % 4) * 2.4;
        const idle = tmpVector.set(Math.cos(actor.userData.idleAngle + time * 0.18) * idleRadius, actor.userData.flying ? 4.2 + Math.sin(time * 2) * 0.5 : 0, Math.sin(actor.userData.idleAngle + time * 0.18) * idleRadius);
        actor.position.lerp(idle, Math.min(1, delta * 1.8));
      }
      animateBattleActor(actor, time, true);
      continue;
    }

    let target = opponents[0];
    let bestDistance = actor.position.distanceToSquared(target.position);
    for (const candidate of opponents.slice(1)) {
      const distance = actor.position.distanceToSquared(candidate.position);
      if (distance < bestDistance) {
        target = candidate;
        bestDistance = distance;
      }
    }
    const distance = Math.sqrt(bestDistance);
    let moving = false;
    actor.lookAt(target.position.x, actor.position.y, target.position.z);
    if (actor.userData.role === "ranged" && distance < actor.userData.attackRange * 0.42) {
      const retreat = actor.position.clone().sub(target.position).setY(0).normalize();
      actor.position.addScaledVector(retreat, delta * actor.userData.speed * 0.55);
      moving = true;
    } else if (distance > actor.userData.attackRange) {
      const direction = target.position.clone().sub(actor.position).setY(0).normalize();
      const speed = actor.userData.speed * (actor.userData.slow > 0 ? 0.46 : 1);
      actor.position.addScaledVector(direction, delta * speed);
      actor.position.y = actor.userData.flying ? 4.2 + Math.sin(time * 3 + actor.userData.idleAngle) * 0.5 : 0;
      moving = true;
    } else if (actor.userData.attackTimer <= 0) {
      performBattleAttack(actor, target);
      actor.userData.attackTimer = actor.userData.cooldown;
    }
    animateBattleActor(actor, time, moving);
    if (actor.userData.isTroop) syncTroopInstance(actor);
  }
  updateBattleEffects(delta);
}

function animateBattleActor(actor, time, moving) {
  const rig = actor.userData.rig;
  if (!rig) return;
  const phase = time * (moving ? 7.2 : 2.2) + actor.userData.idleAngle;
  const stride = Math.sin(phase) * (moving ? 0.58 : 0.08);
  const attack = actor.userData.attackPose > 0 ? Math.sin((actor.userData.attackPose / 0.22) * Math.PI) : 0;
  rig.leftLeg.rotation.x = stride;
  rig.rightLeg.rotation.x = -stride;
  rig.leftArm.rotation.x = -stride * 0.72 - attack * 0.35;
  rig.rightArm.rotation.x = stride * 0.72 - attack * 1.35;
  rig.rightArm.rotation.z = -attack * 0.42;
  rig.leftArm.rotation.z = attack * 0.18;
  rig.torso.rotation.z = Math.sin(phase * 0.5) * (moving ? 0.035 : 0.018);
  rig.pelvis.rotation.y = Math.sin(phase) * (moving ? 0.07 : 0.025);
  rig.head.rotation.y = Math.sin(phase * 0.42) * 0.08;
  if (rig.cape) rig.cape.rotation.x = 0.12 + Math.sin(time * 3.4 + actor.userData.idleAngle) * 0.08 + (moving ? 0.1 : 0);
  for (let index = 0; index < rig.wings.length; index += 1) {
    rig.wings[index].rotation.z = (index === 0 ? -1 : 1) * (0.18 + Math.sin(time * 6 + index) * 0.08);
  }
  if (rig.aura) rig.aura.rotation.z += 0.035;
}

function performBattleAttack(attacker, target) {
  attacker.userData.attackCount += 1;
  attacker.userData.attackPose = 0.22;
  const type = attacker.userData.attackCount % 8 === 0
    ? attacker.userData.ultimateType
    : attacker.userData.attackCount % 3 === 0
      ? attacker.userData.skillType
      : attacker.userData.attackType;
  const start = attacker.position.clone().add(new THREE.Vector3(0, 1.4, 0));
  const end = target.position.clone().add(new THREE.Vector3(0, 1, 0));
  let damage = attacker.userData.damage;
  let effectType = "projectile";

  if (["guard", "barrier", "grootShield", "rockGuard", "rescueBarrier"].includes(type)) {
    applyBattleShield(attacker, type === "rescueBarrier" ? 160 : 105, type === "guard" ? 5 : 9);
    spawnBattleEffect(start, start.clone().add(new THREE.Vector3(0, 2, 0)), attacker.userData.accent, "shockwave", 0.58);
    return;
  }
  if (type === "rescueHeal") {
    healLowestAlly(attacker, 120);
    spawnBattleEffect(start, start.clone().add(new THREE.Vector3(0, 2.6, 0)), attacker.userData.accent, "portal", 0.65);
    return;
  }
  if (["phase", "shrinkDodge", "stealth"].includes(type)) {
    attacker.userData.shield = Math.max(attacker.userData.shield, type === "phase" ? 135 : 85);
    attacker.position.add(new THREE.Vector3(randomRange(-2.5, 2.5), 0, randomRange(-2.5, 2.5)));
    spawnBattleEffect(start, attacker.position.clone().add(new THREE.Vector3(0, 1, 0)), attacker.userData.accent, "portal", 0.38);
    return;
  }

  const areaAttacks = ["slam", "lightning", "stormbreaker", "missiles", "warBarrage", "chaosWave", "mindWave", "mirrorBurst", "kineticBurst", "sonicWave", "giantStomp", "binaryBlast", "bomb", "heavyCannon", "rockQuake", "boss", "infinityWave", "bladeStorm", "helaRain", "ronanSlam", "powerStone", "darkZone", "aetherWave", "debrisStorm", "cullQuake", "proximaStorm", "lokiBlast", "ultronBeam"];
  if (areaAttacks.includes(type)) {
    effectType = "shockwave";
    const isUltimate = attacker.userData.attackCount % 8 === 0;
    const radius = ["boss", "infinityWave", "powerStone"].includes(type) ? 8.5 : isUltimate ? 7 : 5.2;
    damage *= isUltimate ? 1.65 : 1.12;
    for (const candidate of [...state.battleActors]) {
      if (candidate.userData.team !== attacker.userData.team && candidate.position.distanceTo(target.position) < radius) {
        damageBattleActor(candidate, damage * (candidate === target ? 1 : 0.58), attacker.position);
      }
    }
    state.cameraShake = Math.max(state.cameraShake, ["boss", "infinityWave", "giantStomp"].includes(type) ? 0.48 : 0.25);
  } else {
    if (["web", "webSnare", "roots", "telekinesis", "lift", "timeSlow", "darkBolt"].includes(type)) target.userData.slow = type === "timeSlow" ? 4 : 2.4;
    if (["stun", "sleep", "massSleep", "soulDrain"].includes(type)) target.userData.stun = type === "massSleep" ? 3.2 : 1.6;
    if (["dash", "cyberDash", "photonDash", "skyCharge", "charge", "metalPunch", "leap"].includes(type)) {
      damage *= 1.28;
      attacker.position.lerp(target.position, 0.42);
    }
    if (["unibeam", "heavyCannon", "ultronBeam", "binaryBlast"].includes(type)) damage *= 1.5;
    if (["clone", "droneSummon", "portalArmy", "redwing", "waspSwarm"].includes(type)) damage *= 1.35;
    damageBattleActor(target, damage, attacker.position);
    if (type === "shield") {
      const second = state.battleActors.find((actor) => actor !== target && actor.userData.team === target.userData.team && actor.position.distanceTo(target.position) < 5);
      if (second) damageBattleActor(second, damage * 0.55, target.position);
    }
  }
  spawnBattleEffect(start, end, attacker.userData.accent, effectType, ["repulsor", "flare", "unibeam", "mindBeam"].includes(type) ? 0.28 : 0.46);
}

function applyBattleShield(source, amount, radius) {
  for (const ally of state.battleActors) {
    if (ally.userData.team === source.userData.team && ally.position.distanceTo(source.position) <= radius) {
      ally.userData.shield = Math.max(ally.userData.shield, amount);
    }
  }
}

function healLowestAlly(source, amount) {
  const allies = state.battleActors
    .filter((actor) => actor.userData.team === source.userData.team && actor.parent)
    .sort((a, b) => (a.userData.hp / a.userData.maxHp) - (b.userData.hp / b.userData.maxHp));
  if (!allies.length) return;
  allies[0].userData.hp = Math.min(allies[0].userData.maxHp, allies[0].userData.hp + amount);
}

function damageBattleActor(actor, amount, sourcePosition) {
  if (!actor.parent) return;
  if (actor.userData.type === "thanos" && state.finalBattle.bossesRemaining > 1) amount *= 0.28;
  const absorbed = Math.min(actor.userData.shield, amount);
  actor.userData.shield -= absorbed;
  actor.userData.hp -= amount - absorbed;
  if (actor.userData.type === "thanos" && state.finalBattle.bossesRemaining > 1) actor.userData.hp = Math.max(1, actor.userData.hp);
  actor.userData.hitFlash = 0.12;
  const knockback = actor.position.clone().sub(sourcePosition).setY(0).normalize();
  actor.position.addScaledVector(knockback, actor.userData.type === "thanos" ? 0.16 : 0.48);
  if (actor === state.finalBattle.boss) updateHud();
  if (actor.userData.hp > 0) return;
  const wasBoss = Boolean(actor.userData.isBoss);
  spawnBurst(actor.position.clone().add(new THREE.Vector3(0, 1, 0)), actor.userData.accent, wasBoss ? 16 : 5);
  if (actor.userData.isTroop) syncTroopInstance(actor, true);
  battleGroup.remove(actor);
  state.battleActors = state.battleActors.filter((candidate) => candidate !== actor);
  if (!actor.userData.isTroop) disposeObject(actor);
  if (wasBoss) {
    state.finalBattle.bossesRemaining = Math.max(0, state.finalBattle.bossesRemaining - 1);
    if (actor.userData.type === "thanos") state.finalBattle.boss = null;
    objectiveText.textContent = `이름 있는 악당 ${state.finalBattle.bossesRemaining}명 남음`;
    updateHud();
    if (state.finalBattle.bossesRemaining === 0) finishGalaxyVictory();
  }
}

function spawnBattleEffect(start, end, color, type = "projectile", life = 0.45) {
  let effect = state.battleEffectPool.pop();
  if (!effect) effect = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true }));
  effect.visible = true;
  effect.material.color.set(color);
  effect.material.opacity = 1;
  effect.position.copy(start);
  effect.scale.setScalar(type === "shockwave" ? 1.8 : type === "portal" ? 1.25 : 1);
  effect.userData = { start: start.clone(), end: end.clone(), life, maxLife: life, type };
  battleGroup.add(effect);
  state.battleEffects.push(effect);
  const effectLimit = state.battleMode === "cinema" ? 200 : 80;
  while (state.battleEffects.length > effectLimit) recycleBattleEffect(state.battleEffects.shift());
}

function updateBattleEffects(delta) {
  for (const effect of [...state.battleEffects]) {
    effect.userData.life -= delta;
    const t = 1 - THREE.MathUtils.clamp(effect.userData.life / effect.userData.maxLife, 0, 1);
    effect.position.lerpVectors(effect.userData.start, effect.userData.end, t);
    effect.rotation.x += delta * 8;
    effect.rotation.y += delta * 11;
    if (effect.userData.type === "shockwave") effect.scale.set(1 + t * 10, 0.18, 1 + t * 10);
    else if (effect.userData.type === "portal") effect.scale.setScalar(1.2 - t * 0.8);
    effect.material.opacity = 1 - t;
    if (effect.userData.life <= 0) recycleBattleEffect(effect);
  }
}

function recycleBattleEffect(effect) {
  battleGroup.remove(effect);
  effect.visible = false;
  state.battleEffects = state.battleEffects.filter((candidate) => candidate !== effect);
  if (state.battleEffectPool.length < 100) state.battleEffectPool.push(effect);
  else disposeObject(effect);
}

function spawnBurst(position, color, count) {
  for (let i = 0; i < count; i += 1) {
    const end = position.clone().add(new THREE.Vector3(randomRange(-4, 4), randomRange(0.5, 4), randomRange(-4, 4)));
    spawnBattleEffect(position, end, color, "projectile", randomRange(0.4, 0.8));
  }
}

function finishGalaxyVictory() {
  if (state.finalBattle.won) return;
  stopFinalCinematic();
  state.finalBattle.active = false;
  state.finalBattle.won = true;
  state.finalBattle.cinematic = "complete";
  state.score += 5000;
  state.running = false;
  objectiveText.textContent = "승리! 인피니티 사가의 악당들을 모두 물리쳤습니다";
  centerMessage.querySelector("strong").textContent = "인피니티 사가 승리";
  centerMessage.querySelector("span").textContent = "영웅 30명이 은하계를 지켜냈습니다";
  modeSelector.hidden = true;
  transitionTrack.innerHTML = "";
  centerMessage.classList.remove("hidden");
  updateHud();
}

function clearBattle() {
  for (const actor of state.battleActors) {
    battleGroup.remove(actor);
    disposeObject(actor);
  }
  for (const effect of [...state.battleEffects, ...state.battleEffectPool]) {
    battleGroup.remove(effect);
    disposeObject(effect);
  }
  for (const mesh of state.troopMeshes) {
    battleGroup.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  }
  state.battleActors.length = 0;
  state.battleEffects.length = 0;
  state.battleEffectPool.length = 0;
  state.troopMeshes.length = 0;
}

function spawnParticles(position, radius, accent) {
  for (let i = 0; i < 12; i += 1) {
    const particle = new THREE.Mesh(
      new THREE.BoxGeometry(0.14 + radius * 0.025, 0.14 + radius * 0.025, 0.14 + radius * 0.025),
      material(randomChoice([accent, "#f7fbf5", "#ffd166", "#72e4ff", "#ff7fd1"]), 0.64, 0, accent, 0.12),
    );
    particle.position.copy(position).add(new THREE.Vector3(randomRange(-radius, radius), randomRange(0.2, 1.9 + radius * 0.2), randomRange(-radius, radius)));
    particle.userData.velocity = new THREE.Vector3(randomRange(-2.4, 2.4), randomRange(1.3, 4.6), randomRange(-2.4, 2.4));
    particle.userData.life = randomRange(0.5, 0.9);
    particle.castShadow = true;
    scene.add(particle);
    state.particles.push(particle);
  }
}

function spawnEscapees(label, position, radius, points) {
  const type = escapeeTypeForLabel(label);
  if (!type) return;

  const amount = escapeeCount(type, radius, points);
  for (let i = 0; i < amount; i += 1) {
    const escapee = createEscapee(type, i, amount, radius);
    const angle = randomRange(0, Math.PI * 2);
    const startRadius = randomRange(state.radius * 0.18, state.radius * 0.55);
    const flighty = type === "ufoAlien";
    escapee.position.set(
      hole.position.x + Math.cos(angle) * startRadius,
      0.35 + randomRange(0, radius * 0.22),
      hole.position.z + Math.sin(angle) * startRadius,
    );
    escapee.rotation.y = angle + Math.PI;
    escapee.userData.type = type;
    escapee.userData.velocity = new THREE.Vector3(
      Math.cos(angle) * randomRange(2.2, flighty ? 7.2 : 5.4),
      randomRange(flighty ? 5.5 : 3.8, flighty ? 10.5 : 8.2) + radius * 0.35,
      Math.sin(angle) * randomRange(2.2, flighty ? 7.2 : 5.4),
    );
    escapee.userData.walkSpeed = randomRange(1.15, flighty ? 3.4 : 2.2);
    escapee.userData.groundY = flighty ? randomRange(2.4, 6.5) : randomRange(0.18, 0.56);
    escapee.userData.life = escapeeLifetime(type);
    escapee.userData.maxLife = escapee.userData.life;
    escapee.userData.spin = randomRange(-2.4, 2.4);
    escapee.userData.float = randomRange(0, Math.PI * 2);
    escapee.userData.roamAngle = angle;
    escapee.userData.turnTimer = randomRange(0.4, 1.6);
    scene.add(escapee);
    state.escapees.push(escapee);
  }

  while (state.escapees.length > 150) {
    const stale = state.escapees.shift();
    scene.remove(stale);
    disposeObject(stale);
  }
}

function escapeeTypeForLabel(label) {
  if (["집", "빌딩", "도시 블록"].includes(label)) return "people";
  if (["산맥", "대륙", "구름 도시"].includes(label)) return "animal";
  if (label === "바다") return "marine";
  if (["행성", "고리 행성"].includes(label)) return "ufoAlien";
  return null;
}

function escapeeCount(type, radius, points) {
  if (type === "ufoAlien") return THREE.MathUtils.clamp(Math.round(radius * 1.55 + points / 150), 4, 12);
  if (type === "people") return THREE.MathUtils.clamp(Math.round(radius * 2.4 + points / 18), 6, 34);
  if (type === "marine") return THREE.MathUtils.clamp(Math.round(radius * 2.7 + points / 70), 7, 24);
  return THREE.MathUtils.clamp(Math.round(radius * 2.3 + points / 80), 7, 24);
}

function escapeeLifetime(type) {
  if (type === "ufoAlien") return randomRange(24, 34);
  if (type === "marine") return randomRange(18, 26);
  return randomRange(16, 24);
}

function createEscapee(type, index, amount, radius) {
  if (type === "people") return createMiniPerson(index, amount, radius);
  if (type === "animal") return createMiniAnimal(index, radius);
  if (type === "marine") return createMarineLife(index, radius);
  if (type === "ufoAlien") return createUfoAlien(index, radius);
  return null;
}

function createMiniPerson(index, amount, radius) {
  const group = new THREE.Group();
  const shirtColors = ["#f15b5b", "#4b7bec", "#ffd166", "#71e3b4", "#f48fb1"];
  const scale = THREE.MathUtils.clamp(0.56 + radius * 0.055, 0.56, 1.18);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.16 * scale, 0.38 * scale, 4, 6), material(shirtColors[index % shirtColors.length], 0.7));
  body.position.y = 0.42 * scale;
  group.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.15 * scale, 8, 6), material("#f2c6a0", 0.62));
  head.position.y = 0.82 * scale;
  group.add(head);

  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.48 * scale, 0.07 * scale, 0.07 * scale), material("#f2c6a0", 0.62));
  arm.position.y = 0.54 * scale;
  arm.rotation.z = Math.sin(index + amount) * 0.5;
  group.add(arm);
  group.scale.setScalar(THREE.MathUtils.clamp(1.05 + amount * 0.018, 1.05, 1.42));
  return group;
}

function createMiniAnimal(index, radius) {
  const group = new THREE.Group();
  const scale = THREE.MathUtils.clamp(0.78 + radius * 0.07, 0.78, 1.75);
  const colors = ["#d99a52", "#f0d37a", "#8cc084", "#c7a27c"];
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.34 * scale, 8, 6), material(colors[index % colors.length], 0.78));
  body.scale.set(1.45, 0.72, 0.82);
  body.position.y = 0.42 * scale;
  group.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18 * scale, 8, 6), material(colors[index % colors.length], 0.78));
  head.position.set(0.48 * scale, 0.58 * scale, 0);
  group.add(head);

  const ear = new THREE.Mesh(new THREE.ConeGeometry(0.08 * scale, 0.18 * scale, 4), material("#5b4639", 0.82));
  ear.position.set(0.53 * scale, 0.78 * scale, 0.08 * scale);
  group.add(ear);
  return group;
}

function createMarineLife(index, radius) {
  const group = new THREE.Group();
  const scale = THREE.MathUtils.clamp(0.82 + radius * 0.075, 0.82, 1.9);
  const fish = new THREE.Mesh(new THREE.SphereGeometry(0.34 * scale, 10, 7), material(randomChoice(["#4ecdc4", "#4b7bec", "#ff8c61", "#c7f464"]), 0.48, 0.02));
  fish.scale.set(1.55, 0.62, 0.78);
  fish.position.y = 0.42 * scale;
  group.add(fish);

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.22 * scale, 0.34 * scale, 3), material("#f7fbf5", 0.6));
  tail.position.set(-0.48 * scale, 0.42 * scale, 0);
  tail.rotation.z = Math.PI / 2;
  tail.rotation.y = index % 2 ? 0.4 : -0.4;
  group.add(tail);
  return group;
}

function createUfoAlien(index, radius) {
  const group = new THREE.Group();
  const scale = THREE.MathUtils.clamp(1.05 + radius * 0.07, 1.05, 2.45);
  const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.64 * scale, 0.88 * scale, 0.2 * scale, 18), material("#b9c4cf", 0.34, 0.28));
  saucer.position.y = 0.42 * scale;
  group.add(saucer);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.38 * scale, 12, 7), material("#9de8ff", 0.24, 0.05, "#4ad6ff", 0.16));
  dome.scale.y = 0.58;
  dome.position.y = 0.62 * scale;
  group.add(dome);

  const alien = new THREE.Mesh(new THREE.SphereGeometry(0.16 * scale, 10, 7), material("#8cff8c", 0.55, 0.02, "#47ff78", 0.12));
  alien.position.y = 0.78 * scale;
  alien.scale.set(0.78, 1.25, 0.78);
  group.add(alien);

  for (let i = 0; i < 3; i += 1) {
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.055 * scale, 6, 4), material(randomChoice(["#fffd87", "#ff7fd1", "#79d7ff"]), 0.35, 0, "#ffffff", 0.45));
    const angle = i * Math.PI * 2 / 3 + index;
    light.position.set(Math.cos(angle) * 0.58 * scale, 0.28 * scale, Math.sin(angle) * 0.58 * scale);
    group.add(light);
  }
  return group;
}

function updateEscapees(delta) {
  const time = performance.now() * 0.001;
  const stage = STAGES[state.stageIndex];
  const half = stage.worldSize / 2 - 3;
  for (const escapee of [...state.escapees]) {
    escapee.userData.life -= delta;
    escapee.userData.turnTimer -= delta;

    if (escapee.userData.turnTimer <= 0) {
      escapee.userData.roamAngle += randomRange(-1.2, 1.2);
      escapee.userData.turnTimer = randomRange(0.7, 2.3);
    }

    const isFlying = escapee.userData.type === "ufoAlien";
    const direction = tmpVector.set(Math.cos(escapee.userData.roamAngle), 0, Math.sin(escapee.userData.roamAngle));
    escapee.userData.velocity.x = THREE.MathUtils.lerp(escapee.userData.velocity.x, direction.x * escapee.userData.walkSpeed, delta * 1.8);
    escapee.userData.velocity.z = THREE.MathUtils.lerp(escapee.userData.velocity.z, direction.z * escapee.userData.walkSpeed, delta * 1.8);

    if (isFlying) {
      const targetY = escapee.userData.groundY + Math.sin(time * 2.6 + escapee.userData.float) * 1.2;
      escapee.userData.velocity.y = THREE.MathUtils.lerp(escapee.userData.velocity.y, (targetY - escapee.position.y) * 1.6, delta * 1.4);
    } else {
      escapee.userData.velocity.y -= delta * 6.6;
      if (escapee.position.y <= escapee.userData.groundY && escapee.userData.velocity.y < 0) {
        escapee.position.y = escapee.userData.groundY;
        escapee.userData.velocity.y = Math.sin(time * 9 + escapee.userData.float) * 0.18;
      }
    }

    escapee.position.addScaledVector(escapee.userData.velocity, delta);
    if (Math.abs(escapee.position.x) > half) {
      escapee.position.x = THREE.MathUtils.clamp(escapee.position.x, -half, half);
      escapee.userData.roamAngle = Math.PI - escapee.userData.roamAngle;
    }
    if (Math.abs(escapee.position.z) > half) {
      escapee.position.z = THREE.MathUtils.clamp(escapee.position.z, -half, half);
      escapee.userData.roamAngle *= -1;
    }

    escapee.rotation.y = Math.atan2(escapee.userData.velocity.x, escapee.userData.velocity.z);
    escapee.rotation.x = isFlying ? Math.sin(time * 3 + escapee.userData.float) * 0.12 : 0;
    escapee.rotation.z = isFlying ? Math.cos(time * 3.4 + escapee.userData.float) * 0.12 : Math.sin(time * 7 + escapee.userData.float) * 0.08;
    const fade = THREE.MathUtils.clamp(escapee.userData.life / 3, 0, 1);
    setObjectOpacity(escapee, fade);
    if (escapee.userData.life <= 0) {
      scene.remove(escapee);
      state.escapees = state.escapees.filter((item) => item !== escapee);
      disposeObject(escapee);
    }
  }
}

function setObjectOpacity(object, opacity) {
  object.traverse((child) => {
    if (!child.material) return;
    child.material.transparent = true;
    child.material.opacity = opacity;
  });
}

function updateParticles(delta) {
  for (const particle of [...state.particles]) {
    particle.userData.life -= delta;
    particle.userData.velocity.y -= delta * 6.2;
    particle.position.addScaledVector(particle.userData.velocity, delta);
    particle.rotation.x += delta * 7;
    particle.rotation.y += delta * 5;
    particle.material.opacity = Math.max(0, particle.userData.life);
    particle.material.transparent = true;
    if (particle.userData.life <= 0) {
      scene.remove(particle);
      particle.geometry.dispose();
      particle.material.dispose();
      state.particles = state.particles.filter((item) => item !== particle);
    }
  }
}

function updateDust(delta) {
  for (const dust of state.dust) {
    dust.rotation.y += delta * 0.2;
    dust.rotation.x += delta * 0.14;
  }
}

function updateCamera(delta) {
  const stage = STAGES[state.stageIndex];
  const heroCameraBoost = stage.id === "galaxy" ? Math.min(14, state.unlockedHeroes.size * 0.46) : 0;
  const cameraOffset = tmpVector.set(
    0,
    stage.cameraHeight + state.radius * 0.8 + heroCameraBoost * 0.42,
    stage.cameraDistance + state.radius * 1.2 + heroCameraBoost,
  );
  const speedBias = new THREE.Vector3(-state.velocity.x * 0.55, 0, -state.velocity.y * 0.55);
  const targetPosition = hole.position.clone().add(cameraOffset).add(speedBias);
  if (state.cameraShake > 0) {
    targetPosition.x += randomRange(-state.cameraShake, state.cameraShake);
    targetPosition.y += randomRange(-state.cameraShake * 0.4, state.cameraShake * 0.4);
    targetPosition.z += randomRange(-state.cameraShake, state.cameraShake);
    state.cameraShake = Math.max(0, state.cameraShake - delta * 1.8);
  }
  camera.position.lerp(targetPosition, 1 - Math.pow(0.006, delta));
  const lookAt = hole.position.clone();
  lookAt.y = 0.6 + state.radius * 0.02;
  camera.lookAt(lookAt);
}

function resetGame() {
  stopFinalCinematic();
  state.running = true;
  state.transitioning = false;
  state.transitionToken += 1;
  state.score = 0;
  centerMessage.querySelector("strong").textContent = "준비";
  centerMessage.querySelector("span").textContent = "작은 것부터 삼켜 은하계까지 성장";
  transitionTrack.innerHTML = "";
  modeSelector.hidden = false;
  startButton.hidden = false;
  centerMessage.classList.add("hidden");
  buildStage(0);
}

function clearGroup(group, disposeUniqueMaterials) {
  while (group.children.length) {
    const child = group.children[0];
    group.remove(child);
    disposeObject(child, disposeUniqueMaterials);
  }
}

function clearParticles() {
  for (const particle of state.particles) {
    scene.remove(particle);
    particle.geometry.dispose();
    particle.material.dispose();
  }
  state.particles.length = 0;
  for (const escapee of state.escapees) {
    scene.remove(escapee);
    disposeObject(escapee);
  }
  state.escapees.length = 0;
  state.dust.length = 0;
}

function disposeObject(object, disposeUniqueMaterials = true) {
  object.traverse((child) => {
    if (child.geometry && !sharedCharacterGeometries.has(child.geometry)) child.geometry.dispose();
    if (disposeUniqueMaterials && child.material && !Object.values(sharedMaterials).includes(child.material) && !sharedCharacterMaterials.has(child.material)) child.material.dispose();
  });
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function darken(color, amount) {
  return `#${tmpColor.set(color).multiplyScalar(amount).getHexString()}`;
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("keydown", (event) => {
  keys.add(event.code);
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.code);
});

window.addEventListener("resize", onResize);
startButton.addEventListener("click", resetGame);
resetButton.addEventListener("click", resetGame);
for (const button of modeButtons) {
  button.addEventListener("click", () => setBattleMode(button.dataset.mode));
}
finalBattleVideo.addEventListener("ended", completeFinalCinematic);
finalBattleVideo.addEventListener("error", () => {
  setTimeout(() => {
    const noPlayableSource = finalBattleVideo.error && finalBattleVideo.readyState === HTMLMediaElement.HAVE_NOTHING;
    if (state.finalBattle.active && noPlayableSource) fallbackToRealtimeBattle();
  }, 900);
});
cinematicSkipButton.addEventListener("click", completeFinalCinematic);
cinematicSoundButton.addEventListener("click", async () => {
  if (state.finalBattle.cinematic === "awaitingInput") {
    finalBattleVideo.muted = false;
    try {
      await finalBattleVideo.play();
      state.finalBattle.cinematic = "playing";
      cinematicStatus.textContent = "인피니티 사가 최종전";
      cinematicSoundButton.textContent = "음소거";
    } catch (error) {
      fallbackToRealtimeBattle();
    }
    return;
  }
  finalBattleVideo.muted = !finalBattleVideo.muted;
  cinematicSoundButton.textContent = finalBattleVideo.muted ? "소리 켜기" : "음소거";
  if (finalBattleVideo.paused) {
    try {
      await finalBattleVideo.play();
    } catch (error) {
      fallbackToRealtimeBattle();
    }
  }
});
updateModeButtons();

let activeTouch = null;
touchPad.addEventListener("pointerdown", (event) => {
  activeTouch = event.pointerId;
  touchPad.setPointerCapture(activeTouch);
  if (!state.running && !state.transitioning) resetGame();
  centerMessage.classList.add("hidden");
  updateTouch(event);
});

touchPad.addEventListener("pointermove", (event) => {
  if (event.pointerId === activeTouch) updateTouch(event);
});

touchPad.addEventListener("pointerup", clearTouch);
touchPad.addEventListener("pointercancel", clearTouch);

function updateTouch(event) {
  const rect = touchPad.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = event.clientX - centerX;
  const dy = event.clientY - centerY;
  const max = rect.width * 0.34;
  const length = Math.min(max, Math.hypot(dx, dy));
  const angle = Math.atan2(dy, dx);
  const x = Math.cos(angle) * length;
  const y = Math.sin(angle) * length;
  touchStick.style.transform = `translate(${x}px, ${y}px)`;
  state.touchInput.set(x / max, y / max);
}

function clearTouch(event) {
  if (event.pointerId !== activeTouch) return;
  activeTouch = null;
  state.touchInput.set(0, 0);
  touchStick.style.transform = "translate(0, 0)";
}

const previewParams = new URLSearchParams(window.location.search);
const previewStage = THREE.MathUtils.clamp(Number.parseInt(previewParams.get("stage") || "0", 10) || 0, 0, STAGES.length - 1);
if (["cinema", "performance"].includes(previewParams.get("mode"))) setBattleMode(previewParams.get("mode"));
makeHole();
buildStage(previewStage);
if (previewParams.get("battle") === "1" && previewStage === STAGES.length - 1) {
  state.running = true;
  centerMessage.classList.add("hidden");
  beginFinalBattle();
} else {
  centerMessage.classList.remove("hidden");
}
updateCamera(1);

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const delta = Math.min(clock.getDelta(), 0.033);
  if (state.running && !state.transitioning) {
    updateTraffic(delta);
    updateHole(delta);
    updateSwallow(delta);
  } else {
    hole.ring.rotation.z -= delta * 0.6;
    hole.vortex.rotation.z += delta * 1.4;
    hole.glow.rotation.z -= delta * 0.5;
  }
  updateParticles(delta);
  updateEscapees(delta);
  updateEnvironment(delta);
  updateBattle(delta);
  updateDust(delta);
  updateCamera(delta);
  renderer.render(scene, camera);
});
