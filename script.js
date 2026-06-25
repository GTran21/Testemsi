const stages = [
  {
    id: 1,
    name: "Seed",
    description: "A lemon tree begins as a seed with the potential to sprout after moist soil and warmth.",
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
    description: "The seed sends up a small stem and first leaves while still relying on steady moisture.",
    className: "stage-3",
  },
  {
    id: 4,
    name: "Sapling",
    description: "The young plant thickens and strengthens as it prepares for sustained above-ground growth.",
    className: "stage-4",
  },
  {
    id: 5,
    name: "Young Tree",
    description: "The seedling grows stems and leaves as it develops a permanent root system.",
    className: "stage-5",
  },
  {
    id: 6,
    name: "Flowering",
    description: "Small fragrant blossoms appear before pollination and fruit formation.",
    className: "stage-6",
  },
  {
    id: 7,
    name: "Fruiting",
    description: "Lemons mature over weeks, showing the final stage of the tree's seasonal growth.",
    className: "stage-7",
  },
];

const upgrades = [
  {
    id: "click-power",
    name: "Bigger Basket",
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
const treeScene = document.getElementById("treeScene");
const upgradeList = document.getElementById("upgradeList");

let lemons = 0;
let clickBase = 1;
let clickMultiplier = 1;
let lemonsPerSecond = 0;
let activeStageIndex = 0;

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
  treeScene.className = `tree-scene ${stage.className}`;
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
  } else if (upgrade.type === "multiplier") {
    clickMultiplier += upgrade.amount;
  } else if (upgrade.type === "auto") {
    lemonsPerSecond += upgrade.amount;
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

updateStageDisplay();
updateStats();
renderUpgrades();

setInterval(tickStage, 5000);
setInterval(autoLemonTick, 250);
