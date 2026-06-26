const stages = [
  {
    id: 1,
    name: "Seed",
    description: "A lemon tree begins as a seed with the potential to sprout after receiving enough water and nutrients.",
    className: "stage-1",
  },
  {
    id: 2,
    name: "Germination",
    description: "Roots and the first sprout emerge when the seed receives enough moisture and warmth.",
    className: "stage-2",
  },
  {
    id: 3,
    name: "Seedling",
    description: "The seed sends up a small stem and first leaves, finally fully emerging from the soil.",
    className: "stage-3",
  },
  {
    id: 4,
    name: "Sapling",
    description: "The young plant thickens and strengthens its stem as it prepares to become a full-fledged tree.",
    className: "stage-4",
  },
  {
    id: 5,
    name: "Young Tree",
    description: "The plant grows into a small tree with a woody trunk and branches.",
    className: "stage-5",
  },
  {
    id: 6,
    name: "Flowering",
    description: "Small fragrant blossoms appear, waiting to be pollinated to produce fruit.",
    className: "stage-6",
  },
  {
    id: 7,
    name: "Fruiting",
    description: "Lemons are produced after pollination and mature over weeks.",
    className: "stage-7",
  },
];

const upgrades = [
  {
    id: "click-power",
    name: "Plant New Tree",
    description: "+1 lemon per click",
    baseCost: 20,
    type: "click",
    amount: 1,
    owned: 0,
  },
  {
    id: "multiplier",
    name: "Store Branding",
    description: "x1.2 total click multiplier",
    baseCost: 120,
    type: "multiplier",
    amount: 0.2,
    owned: 0,
  },
  {
    id: "autoclicker",
    name: "Picking Assistant",
    description: "+1 lemon per second",
    baseCost: 50,
    type: "auto",
    amount: 1,
    owned: 0,
  },
  {
    id: "orchard-team",
    name: "Orchard Team",
    description: "+5 lemons per second",
    baseCost: 280,
    type: "auto",
    amount: 5,
    owned: 0,
  },
];

const lemonClickBtn = document.getElementById("lemonClickBtn");
const lemonCountEl = document.getElementById("lemonCount");
const lemonsPerClickEl = document.getElementById("lemonsPerClick");
const lemonsPerSecondEl = document.getElementById("lemonsPerSecond");
const stageTitleEl = document.getElementById("currentStageTitle");
const stageDescriptionEl = document.getElementById("currentStageDescription");
const treeForest = document.getElementById("treeForest");
const upgradeList = document.getElementById("upgradeList");

let lemons = 0;
let clickBase = 1;
let clickMultiplier = 1;
let lemonsPerSecond = 0;
let activeStageIndex = 0;
const treeScenes = [];
const treeRows = [];
const farmerLanes = [];
const farmers = [];
const farmersPerRow = 3;

function getTreesPerRow() {
  const rootStyles = getComputedStyle(document.documentElement);
  const configuredCount = parseInt(rootStyles.getPropertyValue("--min-tree-count"), 10);
  return Number.isFinite(configuredCount) && configuredCount > 0 ? configuredCount : 5;
}

function createTreeRowTrack() {
  const row = document.createElement("div");
  row.className = "tree-row";

  const track = document.createElement("div");
  track.className = "tree-row-track";
  row.appendChild(track);

  const farmerLane = document.createElement("div");
  farmerLane.className = "farmer-lane";
  row.appendChild(farmerLane);

  treeForest.appendChild(row);
  treeRows.push(track);
  farmerLanes.push(farmerLane);
  return track;
}

function createFarmerElement(slotInRow, farmerIndex) {
  const farmer = document.createElement("div");
  farmer.className = "farmer";
  farmer.style.setProperty("--farmer-duration", `${14 + (farmerIndex % 4) * 1.1}s`);
  farmer.style.setProperty("--farmer-delay", `${(farmerIndex % 5) * -0.7}s`);

  const frameA = document.createElement("span");
  frameA.className = "farmer-frame farmer-frame-a";

  const frameB = document.createElement("span");
  frameB.className = "farmer-frame farmer-frame-b";

  farmer.appendChild(frameA);
  farmer.appendChild(frameB);
  return farmer;
}

function addFarmerForPickingAssistant() {
  const farmerIndex = farmers.length;
  const rowIndex = Math.floor(farmerIndex / farmersPerRow);
  const slotInRow = farmerIndex % farmersPerRow;

  while (farmerLanes.length <= rowIndex) {
    createTreeRowTrack();
  }

  const farmer = createFarmerElement(slotInRow, farmerIndex);
  farmerLanes[rowIndex].appendChild(farmer);
  farmers.push(farmer);
}

function createTreeSceneElement() {
  const scene = document.createElement("div");
  scene.className = "tree-scene stage-1";
  scene.innerHTML = `
    <div class="germination-graphic"></div>
    <div class="seedling-graphic"></div>
    <div class="sapling-graphic"></div>
    <div class="young-tree-graphic"></div>
    <div class="flowering-graphic"></div>
    <div class="fruiting-graphic"></div>
    <div class="trunk"></div>
    <div class="branch branch-left"></div>
    <div class="branch branch-right"></div>
    <div class="leaf-group leaves-left"></div>
    <div class="leaf-group leaves-right"></div>
    <div class="flower"></div>
    <div class="lemon"></div>
    <div class="sprout"></div>
    <div class="seed"></div>
  `;
  return scene;
}

function addTreeIfSpaceAvailable() {
  let activeRow = treeRows[treeRows.length - 1];
  if (!activeRow || activeRow.children.length >= getTreesPerRow()) {
    activeRow = createTreeRowTrack();
  }

  const scene = createTreeSceneElement();
  activeRow.appendChild(scene);
  treeScenes.push(scene);
  scene.className = `tree-scene ${stages[activeStageIndex].className}`;
  return true;
}

function getCurrentClickValue() {
  return Math.max(1, Math.floor(clickBase * clickMultiplier));
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
}

function getUpgradeCost(upgrade) {
  return Math.floor(upgrade.baseCost * Math.pow(1.35, upgrade.owned));
}

function updateStageDisplay() {
  const stage = stages[activeStageIndex];
  stageTitleEl.textContent = stage.name;
  stageDescriptionEl.textContent = stage.description;
  treeScenes.forEach((scene) => {
    scene.className = `tree-scene ${stage.className}`;
  });
}

function tickStage() {
  activeStageIndex = (activeStageIndex + 1) % stages.length;
  updateStageDisplay();
}

function updateStats() {
  lemonCountEl.textContent = formatNumber(Math.floor(lemons));
  lemonsPerClickEl.textContent = formatNumber(getCurrentClickValue());
  lemonsPerSecondEl.textContent = formatNumber(lemonsPerSecond);
}

function renderUpgrades() {
  upgradeList.innerHTML = "";

  upgrades.forEach((upgrade) => {
    const cost = getUpgradeCost(upgrade);
    const canAfford = lemons >= cost;

    const card = document.createElement("article");
    card.className = "upgrade-card";

    const title = document.createElement("h3");
    title.textContent = upgrade.name;

    const desc = document.createElement("p");
    desc.textContent = `${upgrade.description} | Owned: ${upgrade.owned}`;

    const meta = document.createElement("div");
    meta.className = "upgrade-meta";

    const costLabel = document.createElement("strong");
    costLabel.textContent = `${formatNumber(cost)} lemons`;

    const buyButton = document.createElement("button");
    buyButton.type = "button";
    buyButton.className = "upgrade-buy";
    buyButton.textContent = canAfford ? "Buy" : "Need more";
    buyButton.disabled = !canAfford;
    buyButton.addEventListener("click", () => buyUpgrade(upgrade.id));

    meta.appendChild(costLabel);
    meta.appendChild(buyButton);

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(meta);
    upgradeList.appendChild(card);
  });
}

function buyUpgrade(id) {
  const upgrade = upgrades.find((item) => item.id === id);
  if (!upgrade) {
    return;
  }

  const cost = getUpgradeCost(upgrade);
  if (lemons < cost) {
    return;
  }

  lemons -= cost;
  upgrade.owned += 1;

  if (upgrade.type === "click") {
    clickBase += upgrade.amount;
    addTreeIfSpaceAvailable();
  } else if (upgrade.type === "multiplier") {
    clickMultiplier += upgrade.amount;
  } else if (upgrade.type === "auto") {
    lemonsPerSecond += upgrade.amount;
    if (upgrade.id === "autoclicker") {
      addFarmerForPickingAssistant();
    }
  }

  updateStats();
  renderUpgrades();
}

function clickLemon() {
  lemons += getCurrentClickValue();
  updateStats();
  renderUpgrades();
}

function autoLemonTick() {
  lemons += lemonsPerSecond / 4;
  updateStats();
  renderUpgrades();
}

lemonClickBtn.addEventListener("click", clickLemon);

addTreeIfSpaceAvailable();
updateStageDisplay();
updateStats();
renderUpgrades();

setInterval(tickStage, 5000);
setInterval(autoLemonTick, 250);
