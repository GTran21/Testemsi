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
    name: "Mass Cultivation",
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
  {
    id: "store-branding",
    name: "Store Branding",
    description: "Unlock the Store Branding tab",
    baseCost: 550,
    type: "branding",
    amount: 0,
    owned: 0,
  },
];

const lemonClickBtn = document.getElementById("lemonClickBtn");
const lemonCountEl = document.getElementById("lemonCount");
const lemonsPerClickEl = document.getElementById("lemonsPerClick");
const lemonsPerSecondEl = document.getElementById("lemonsPerSecond");
const totalLemonsHarvestedEl = document.getElementById("totalLemonsHarvested");
const stageTitleEl = document.getElementById("currentStageTitle");
const stageDescriptionEl = document.getElementById("currentStageDescription");
const treeForest = document.getElementById("treeForest");
const farmScrollHint = document.getElementById("farmScrollHint");
const upgradeList = document.getElementById("upgradeList");
const storeUpgradesTabBtn = document.getElementById("storeUpgradesTabBtn");
const storeBrandingTabBtn = document.getElementById("storeBrandingTabBtn");
const upgradesPanel = document.getElementById("upgradesPanel");
const brandingPanel = document.getElementById("brandingPanel");
const brandColorWheel = document.getElementById("brandColorWheel");
const brandHexInput = document.getElementById("brandHexInput");
const surfaceColorInput = document.getElementById("surfaceColorInput");
const surfaceHexInput = document.getElementById("surfaceHexInput");
const surfaceGradientColorInput = document.getElementById("surfaceGradientColorInput");
const surfaceGradientHexInput = document.getElementById("surfaceGradientHexInput");
const overlayColorInput = document.getElementById("overlayColorInput");
const overlayHexInput = document.getElementById("overlayHexInput");
const buttonColorInput = document.getElementById("buttonColorInput");
const buttonHexInput = document.getElementById("buttonHexInput");
const borderColorInput = document.getElementById("borderColorInput");
const borderHexInput = document.getElementById("borderHexInput");
const textColorInput = document.getElementById("textColorInput");
const textHexInput = document.getElementById("textHexInput");
const saveCodeInput = document.getElementById("saveCodeInput");
const exportSaveBtn = document.getElementById("exportSaveBtn");
const loadSaveBtn = document.getElementById("loadSaveBtn");
const saveStatusEl = document.getElementById("saveStatus");
const themeDarkModeBtn = document.getElementById("themeDarkModeBtn");
const themeLightModeBtn = document.getElementById("themeLightModeBtn");

let lemons = 0;
let clickBase = 1;
let clickMultiplier = 1;
let lemonsPerSecond = 0;
let totalLemonsHarvested = 0;
let activeStageIndex = 0;
let activeStoreTab = "upgrades";
let siteBackgroundColor = "#f0df9b";
let sectionSurfaceColor = "#f7e7b4";
let sectionSurfaceGradientColor = "#f4de9f";
let sectionOverlayColor = "#fff4c9";
let buttonColor = "#f0b936";
let sectionBorderColor = "#876226";
let siteTextColor = "#876226";
let inputSurfaceColor = "#fff8dd";
const treeScenes = [];
const treeRows = [];
const farmerLanes = [];
const farmers = [];
const farmersPerRow = 3;
const SAVE_CODE_PREFIX = "LSS1:";
const BASE_PAGE_TITLE = "Lemon Store Simulator";
const DEFAULT_LIGHT_THEME = Object.freeze({
  backgroundColor: "#f0df9b",
  surfaceColor: "#f7e7b4",
  surfaceGradientColor: "#f4de9f",
  overlayColor: "#fff4c9",
  buttonColor: "#f0b936",
  borderColor: "#876226",
  textColor: "#876226",
});
const DEFAULT_DARK_THEME = Object.freeze({
  backgroundColor: "#2d2b1f",
  surfaceColor: "#2d2b1f",
  surfaceGradientColor: "#454231",
  overlayColor: "#454231",
  buttonColor: "#f0b936",
  borderColor: "#f4de9f",
  textColor: "#fff4c9",
});

function normalizeHexColor(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim().toLowerCase();
  const normalizedValue = trimmedValue.startsWith("#") ? trimmedValue : `#${trimmedValue}`;
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(normalizedValue) ? normalizedValue : null;
}

function setCssVar(name, value) {
  document.documentElement.style.setProperty(name, value);
}

function brightenHexColor(color, mixAmount) {
  return mixHexColors(color, "#ffffff", mixAmount);
}

function darkenHexColor(color, mixAmount) {
  return mixHexColors(color, "#000000", mixAmount);
}

function mixHexColors(startColor, endColor, weight) {
  const start = normalizeHexColor(startColor) ?? "#000000";
  const end = normalizeHexColor(endColor) ?? "#ffffff";
  const clampWeight = Math.max(0, Math.min(1, weight));
  const startNumber = Number.parseInt(start.slice(1), 16);
  const endNumber = Number.parseInt(end.slice(1), 16);
  const startRed = (startNumber >> 16) & 255;
  const startGreen = (startNumber >> 8) & 255;
  const startBlue = startNumber & 255;
  const endRed = (endNumber >> 16) & 255;
  const endGreen = (endNumber >> 8) & 255;
  const endBlue = endNumber & 255;

  const red = Math.round(startRed + (endRed - startRed) * clampWeight);
  const green = Math.round(startGreen + (endGreen - startGreen) * clampWeight);
  const blue = Math.round(startBlue + (endBlue - startBlue) * clampWeight);

  return `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function getHexLuminance(color) {
  const normalizedColor = normalizeHexColor(color) ?? "#000000";
  const colorValue = Number.parseInt(normalizedColor.slice(1), 16);
  const red = ((colorValue >> 16) & 255) / 255;
  const green = ((colorValue >> 8) & 255) / 255;
  const blue = (colorValue & 255) / 255;
  return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
}

function applyBackgroundGradient(baseColor) {
  const normalizedBaseColor = normalizeHexColor(baseColor) ?? DEFAULT_LIGHT_THEME.backgroundColor;
  const isDarkBackground = getHexLuminance(normalizedBaseColor) < 0.45;
  const topColor = isDarkBackground ? brightenHexColor(normalizedBaseColor, 0.16) : brightenHexColor(normalizedBaseColor, 0.58);
  const bottomColor = isDarkBackground ? darkenHexColor(normalizedBaseColor, 0.28) : darkenHexColor(normalizedBaseColor, 0.16);

  setCssVar("--bg-top", topColor);
  setCssVar("--bg-mid", normalizedBaseColor);
  setCssVar("--bg-bottom", bottomColor);
}

function setThemeColor(name, value) {
  const normalizedColor = normalizeHexColor(value);
  if (!normalizedColor) {
    return false;
  }

  if (name === "background") {
    siteBackgroundColor = normalizedColor;
    applyBackgroundGradient(normalizedColor);
  } else if (name === "surface") {
    sectionSurfaceColor = normalizedColor;
  } else if (name === "surface-gradient") {
    sectionSurfaceGradientColor = normalizedColor;
  } else if (name === "overlay") {
    sectionOverlayColor = normalizedColor;
  } else if (name === "button") {
    buttonColor = normalizedColor;
  } else if (name === "border") {
    sectionBorderColor = normalizedColor;
  } else if (name === "text") {
    siteTextColor = normalizedColor;
  }

  applyThemeVariables();
  updateBrandingControlValues();
  return true;
}

function applyThemePreset(preset) {
  siteBackgroundColor = preset.backgroundColor;
  sectionSurfaceColor = preset.surfaceColor;
  sectionSurfaceGradientColor = preset.surfaceGradientColor;
  sectionOverlayColor = preset.overlayColor;
  buttonColor = preset.buttonColor;
  sectionBorderColor = preset.borderColor;
  siteTextColor = preset.textColor;

  applyBackgroundGradient(siteBackgroundColor);
  applyThemeVariables();
  updateBrandingControlValues();
}

function applyThemeVariables() {
  applyBackgroundGradient(siteBackgroundColor);
  setCssVar("--surface", sectionSurfaceColor);
  setCssVar("--surface-strong", sectionSurfaceGradientColor);
  setCssVar("--overlay", sectionOverlayColor);
  setCssVar("--button-color", buttonColor);
  setCssVar("--section-border", sectionBorderColor);
  setCssVar("--text", siteTextColor);
  setCssVar("--muted", siteTextColor);
  inputSurfaceColor = brightenHexColor(sectionOverlayColor, 0.42);
  setCssVar("--input-surface", inputSurfaceColor);
  setCssVar("--selected-tab-color", buttonColor);
  setCssVar("--stage-summary-border", sectionBorderColor);
  setCssVar("--stage-summary-bg", sectionOverlayColor);
}

function isStoreBrandingUnlocked() {
  return (upgrades.find((upgrade) => upgrade.id === "store-branding")?.owned ?? 0) > 0;
}

function updateBrandingControlValues() {
  const colorControls = [
    [brandColorWheel, brandHexInput, siteBackgroundColor],
    [surfaceColorInput, surfaceHexInput, sectionSurfaceColor],
    [surfaceGradientColorInput, surfaceGradientHexInput, sectionSurfaceGradientColor],
    [overlayColorInput, overlayHexInput, sectionOverlayColor],
    [buttonColorInput, buttonHexInput, buttonColor],
    [borderColorInput, borderHexInput, sectionBorderColor],
    [textColorInput, textHexInput, siteTextColor],
  ];

  colorControls.forEach(([wheelInput, hexInput, value]) => {
    if (wheelInput && wheelInput.value !== value) {
      wheelInput.value = value;
    }

    if (hexInput && hexInput.value !== value) {
      hexInput.value = value;
    }
  });
}

function syncBrandingInputs() {
  updateBrandingControlValues();
}

function syncThemeInputs() {
  updateBrandingControlValues();
}

function setActiveStoreTab(tabName) {
  if (tabName === "branding" && !isStoreBrandingUnlocked()) {
    tabName = "upgrades";
  }

  activeStoreTab = tabName;

  if (upgradesPanel) {
    upgradesPanel.hidden = activeStoreTab !== "upgrades";
  }

  if (brandingPanel) {
    brandingPanel.hidden = activeStoreTab !== "branding";
  }

  if (storeUpgradesTabBtn) {
    storeUpgradesTabBtn.classList.toggle("is-active", activeStoreTab === "upgrades");
    storeUpgradesTabBtn.setAttribute("aria-selected", activeStoreTab === "upgrades" ? "true" : "false");
  }

  if (storeBrandingTabBtn) {
    storeBrandingTabBtn.classList.toggle("is-active", activeStoreTab === "branding");
    storeBrandingTabBtn.setAttribute("aria-selected", activeStoreTab === "branding" ? "true" : "false");
  }
}

function updateStoreTabs() {
  if (storeBrandingTabBtn) {
    storeBrandingTabBtn.disabled = !isStoreBrandingUnlocked();
  }

  if (activeStoreTab === "branding" && !isStoreBrandingUnlocked()) {
    activeStoreTab = "upgrades";
  }

  setActiveStoreTab(activeStoreTab);
  syncBrandingInputs();
  syncThemeInputs();
  updateThemeModeControls();
}

function updateThemeModeControls() {
  const brandingUnlocked = isStoreBrandingUnlocked();

  if (themeDarkModeBtn) {
    themeDarkModeBtn.textContent = brandingUnlocked ? "Default Dark Mode" : "Dark Mode";
  }

  if (themeLightModeBtn) {
    themeLightModeBtn.textContent = brandingUnlocked ? "Default Light Mode" : "Light Mode";
  }
}

function applyDefaultBranding() {
  applyThemeVariables();
  updateBrandingControlValues();
}

function updateFarmScrollHint() {
  if (!farmScrollHint) {
    return;
  }

  const scrollEnabled = treeForest ? treeForest.scrollHeight > treeForest.clientHeight + 1 : false;
  farmScrollHint.hidden = !scrollEnabled;
}

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
  updateFarmScrollHint();
  return track;
}

function createFarmerElement(slotInRow, farmerIndex) {
  const farmer = document.createElement("div");
  farmer.className = "farmer";
  farmer.style.setProperty("--farmer-duration", `${14 + (farmerIndex % 4) * 1.1}s`);
  farmer.style.setProperty("--farmer-delay", `${(farmerIndex % 5) * -0.7}s`);

  const frameClasses = ["farmer-frame-a", "farmer-frame-b", "farmer-frame-c", "farmer-frame-d"];
  frameClasses.forEach((frameClass) => {
    const frame = document.createElement("span");
    frame.className = `farmer-frame ${frameClass}`;
    farmer.appendChild(frame);
  });

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

function clearForest() {
  treeForest.innerHTML = "";
  treeScenes.length = 0;
  treeRows.length = 0;
  farmerLanes.length = 0;
  farmers.length = 0;
  updateFarmScrollHint();
}

function setTreeCount(targetCount) {
  const safeTarget = Math.max(1, Math.floor(targetCount));
  while (treeScenes.length < safeTarget) {
    addTreeIfSpaceAvailable();
  }
}

function setFarmerCount(targetCount) {
  const safeTarget = Math.max(0, Math.floor(targetCount));
  while (farmers.length < safeTarget) {
    addFarmerForPickingAssistant();
  }
}

function setSaveStatus(message) {
  if (saveStatusEl) {
    saveStatusEl.textContent = message;
  }
}

function recomputeDerivedStatsFromUpgrades() {
  const clickUpgrade = upgrades.find((upgrade) => upgrade.id === "click-power");
  const multiplierUpgrade = upgrades.find((upgrade) => upgrade.id === "multiplier");

  clickBase = 1 + (clickUpgrade ? clickUpgrade.owned * clickUpgrade.amount : 0);
  clickMultiplier = 1 + (multiplierUpgrade ? multiplierUpgrade.owned * multiplierUpgrade.amount : 0);
  lemonsPerSecond = upgrades
    .filter((upgrade) => upgrade.type === "auto")
    .reduce((total, upgrade) => total + upgrade.owned * upgrade.amount, 0);
}

function getTargetFarmerCountFromUpgrades() {
  const pickingAssistantsOwned = upgrades.find((upgrade) => upgrade.id === "autoclicker")?.owned ?? 0;
  const orchardTeamsOwned = upgrades.find((upgrade) => upgrade.id === "orchard-team")?.owned ?? 0;
  return pickingAssistantsOwned + orchardTeamsOwned * 3;
}

function getUpgradeOwnershipMap() {
  return upgrades.reduce((acc, upgrade) => {
    acc[upgrade.id] = upgrade.owned;
    return acc;
  }, {});
}

function applyUpgradeOwnershipMap(ownershipMap) {
  upgrades.forEach((upgrade) => {
    const loadedOwned = ownershipMap?.[upgrade.id];
    upgrade.owned = Number.isFinite(loadedOwned) ? Math.max(0, Math.floor(loadedOwned)) : 0;
  });
}

function exportSaveCode() {
  const payload = {
    version: 2,
    lemons,
    totalLemonsHarvested,
    activeStageIndex,
    treeCount: treeScenes.length,
    farmerCount: farmers.length,
    upgrades: getUpgradeOwnershipMap(),
    backgroundColor: siteBackgroundColor,
    surfaceColor: sectionSurfaceColor,
    surfaceGradientColor: sectionSurfaceGradientColor,
    overlayColor: sectionOverlayColor,
    buttonColor,
    borderColor: sectionBorderColor,
    textColor: siteTextColor,
    activeStoreTab,
  };

  const code = `${SAVE_CODE_PREFIX}${btoa(JSON.stringify(payload))}`;
  if (saveCodeInput) {
    saveCodeInput.value = code;
    saveCodeInput.select();
  }
  setSaveStatus("Save code exported. Keep this code to resume later.");
}

function loadSaveCode() {
  const rawCode = saveCodeInput ? saveCodeInput.value.trim() : "";
  if (!rawCode) {
    setSaveStatus("Paste a save code before loading.");
    return;
  }

  if (!rawCode.startsWith(SAVE_CODE_PREFIX)) {
    setSaveStatus("Invalid code format.");
    return;
  }

  try {
    const decodedJson = atob(rawCode.slice(SAVE_CODE_PREFIX.length));
    const payload = JSON.parse(decodedJson);

    if (!payload || (payload.version !== 1 && payload.version !== 2)) {
      throw new Error("Unsupported save version");
    }

    lemons = Number.isFinite(payload.lemons) ? Math.max(0, payload.lemons) : 0;
    totalLemonsHarvested = Number.isFinite(payload.totalLemonsHarvested)
      ? Math.max(0, payload.totalLemonsHarvested)
      : lemons;
    activeStageIndex = Number.isFinite(payload.activeStageIndex)
      ? Math.max(0, Math.min(stages.length - 1, Math.floor(payload.activeStageIndex)))
      : 0;

    applyUpgradeOwnershipMap(payload.upgrades);
    recomputeDerivedStatsFromUpgrades();

    clearForest();
    const targetTreeCount = Number.isFinite(payload.treeCount)
      ? Math.max(1, Math.floor(payload.treeCount))
      : 1 + (upgrades.find((upgrade) => upgrade.id === "click-power")?.owned ?? 0);
    setTreeCount(targetTreeCount);

    const targetFarmerCount = Number.isFinite(payload.farmerCount)
      ? Math.max(0, Math.floor(payload.farmerCount))
      : getTargetFarmerCountFromUpgrades();
    setFarmerCount(targetFarmerCount);

    if (payload.version === 2 && typeof payload.backgroundColor === "string") {
      const loadedColor = normalizeHexColor(payload.backgroundColor);
      if (loadedColor) {
        siteBackgroundColor = loadedColor;
      }
    }

    if (payload.version === 2) {
      if (typeof payload.surfaceColor === "string") {
        const loadedSurfaceColor = normalizeHexColor(payload.surfaceColor);
        if (loadedSurfaceColor) {
          sectionSurfaceColor = loadedSurfaceColor;
        }
      }

      if (typeof payload.surfaceGradientColor === "string") {
        const loadedSurfaceGradientColor = normalizeHexColor(payload.surfaceGradientColor);
        if (loadedSurfaceGradientColor) {
          sectionSurfaceGradientColor = loadedSurfaceGradientColor;
        }
      }

      if (typeof payload.overlayColor === "string") {
        const loadedOverlayColor = normalizeHexColor(payload.overlayColor);
        if (loadedOverlayColor) {
          sectionOverlayColor = loadedOverlayColor;
        }
      }

      if (typeof payload.buttonColor === "string") {
        const loadedButtonColor = normalizeHexColor(payload.buttonColor);
        if (loadedButtonColor) {
          buttonColor = loadedButtonColor;
        }
      }

      if (typeof payload.borderColor === "string") {
        const loadedBorderColor = normalizeHexColor(payload.borderColor);
        if (loadedBorderColor) {
          sectionBorderColor = loadedBorderColor;
        }
      }

      if (typeof payload.textColor === "string") {
        const loadedTextColor = normalizeHexColor(payload.textColor);
        if (loadedTextColor) {
          siteTextColor = loadedTextColor;
        }
      }
    }

    applyThemeVariables();

    syncBrandingInputs();
    setActiveStoreTab(payload.activeStoreTab === "branding" ? "branding" : "upgrades");

    updateStageDisplay();
    updateStats();
    renderUpgrades();
    setSaveStatus("Save code loaded. Progress restored.");
  } catch (error) {
    setSaveStatus("Could not load this save code.");
  }
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

function getTopMostAvailableTreeRow() {
  const maxTreesPerRow = getTreesPerRow();
  return treeRows.find((row) => row.children.length < maxTreesPerRow) ?? null;
}

function addTreeIfSpaceAvailable() {
  let activeRow = getTopMostAvailableTreeRow();
  if (!activeRow) {
    activeRow = createTreeRowTrack();
  }

  const scene = createTreeSceneElement();
  activeRow.appendChild(scene);
  treeScenes.push(scene);
  scene.className = `tree-scene ${stages[activeStageIndex].className}`;
  updateFarmScrollHint();
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
  const wholeLemons = Math.floor(lemons);
  lemonCountEl.textContent = formatNumber(wholeLemons);
  lemonsPerClickEl.textContent = formatNumber(getCurrentClickValue());
  lemonsPerSecondEl.textContent = formatNumber(lemonsPerSecond);
  if (totalLemonsHarvestedEl) {
    totalLemonsHarvestedEl.textContent = formatNumber(Math.floor(totalLemonsHarvested));
  }
  document.title = `${formatNumber(wholeLemons)} Lemons - ${BASE_PAGE_TITLE}`;
}

function renderUpgrades() {
  upgradeList.innerHTML = "";

  upgrades.forEach((upgrade) => {
    const cost = getUpgradeCost(upgrade);
    const canAfford = lemons >= cost;
    const isStoreBrandingUpgrade = upgrade.id === "store-branding";
    const alreadyUnlocked = isStoreBrandingUpgrade && upgrade.owned > 0;

    const card = document.createElement("article");
    card.className = "upgrade-card";

    const title = document.createElement("h3");
    title.textContent = upgrade.name;

    const desc = document.createElement("p");
    desc.textContent = isStoreBrandingUpgrade && alreadyUnlocked
      ? "Already unlocked."
      : `${upgrade.description} | Owned: ${upgrade.owned}`;

    const meta = document.createElement("div");
    meta.className = "upgrade-meta";

    const costLabel = document.createElement("strong");
    costLabel.textContent = isStoreBrandingUpgrade && alreadyUnlocked ? "Unlocked" : `${formatNumber(cost)} lemons`;

    const buyButton = document.createElement("button");
    buyButton.type = "button";
    buyButton.className = "upgrade-buy";
    buyButton.textContent = isStoreBrandingUpgrade && alreadyUnlocked ? "Unlocked" : canAfford ? "Buy" : "Need more";
    buyButton.disabled = !canAfford || alreadyUnlocked;
    if (!alreadyUnlocked) {
      buyButton.addEventListener("click", () => buyUpgrade(upgrade.id));
    }

    meta.appendChild(costLabel);
    meta.appendChild(buyButton);

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(meta);
    upgradeList.appendChild(card);
  });

  updateStoreTabs();
}

function buyUpgrade(id) {
  const upgrade = upgrades.find((item) => item.id === id);
  if (!upgrade) {
    return;
  }

  if (upgrade.id === "store-branding" && upgrade.owned > 0) {
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
    addTreeIfSpaceAvailable();
    addTreeIfSpaceAvailable();
  } else if (upgrade.type === "auto") {
    lemonsPerSecond += upgrade.amount;
    if (upgrade.id === "autoclicker") {
      addFarmerForPickingAssistant();
    }
    if (upgrade.id === "orchard-team") {
      for (let i = 0; i < 3; i += 1) {
        addFarmerForPickingAssistant();
      }
    }
  } else if (upgrade.id === "store-branding") {
    setActiveStoreTab("branding");
    renderUpgrades();
    return;
  }

  updateStats();
  renderUpgrades();
}

function getClickOrigin(event) {
  if (event && Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
    return { x: event.clientX, y: event.clientY };
  }

  const lemonBounds = lemonClickBtn.getBoundingClientRect();
  return {
    x: lemonBounds.left + lemonBounds.width / 2,
    y: lemonBounds.top + lemonBounds.height / 2,
  };
}

function showClickGainPopup(gainAmount, event) {
  const origin = getClickOrigin(event);
  const popup = document.createElement("div");
  popup.className = "click-gain-popup";
  popup.textContent = `+${formatNumber(gainAmount)} Lemons 🍋`;
  popup.style.left = `${origin.x}px`;
  popup.style.top = `${origin.y}px`;
  document.body.appendChild(popup);

  popup.addEventListener(
    "animationend",
    () => {
      popup.remove();
    },
    { once: true }
  );
}

function clickLemon(event) {
  const gainAmount = getCurrentClickValue();
  lemons += gainAmount;
  totalLemonsHarvested += gainAmount;
  showClickGainPopup(gainAmount, event);
  updateStats();
  renderUpgrades();
}

function autoLemonTick() {
  const gainAmount = lemonsPerSecond / 4;
  lemons += gainAmount;
  totalLemonsHarvested += gainAmount;
  updateStats();
  renderUpgrades();
}

if (storeUpgradesTabBtn) {
  storeUpgradesTabBtn.addEventListener("click", () => setActiveStoreTab("upgrades"));
}

if (storeBrandingTabBtn) {
  storeBrandingTabBtn.addEventListener("click", () => setActiveStoreTab("branding"));
}

if (brandColorWheel) {
  brandColorWheel.addEventListener("input", (event) => {
    if (isStoreBrandingUnlocked()) {
      setThemeColor("background", event.target.value);
    }
  });
}

if (brandHexInput) {
  brandHexInput.addEventListener("change", (event) => {
    if (isStoreBrandingUnlocked()) {
      setThemeColor("background", event.target.value);
    }
  });
}

if (surfaceColorInput) {
  surfaceColorInput.addEventListener("input", (event) => {
    if (!isStoreBrandingUnlocked()) {
      syncThemeInputs();
      return;
    }

    setThemeColor("surface", event.target.value);
  });
}

if (surfaceHexInput) {
  surfaceHexInput.addEventListener("change", (event) => {
    if (!isStoreBrandingUnlocked()) {
      syncThemeInputs();
      return;
    }

    setThemeColor("surface", event.target.value);
  });
}

if (surfaceGradientColorInput) {
  surfaceGradientColorInput.addEventListener("input", (event) => {
    if (!isStoreBrandingUnlocked()) {
      syncThemeInputs();
      return;
    }

    setThemeColor("surface-gradient", event.target.value);
  });
}

if (surfaceGradientHexInput) {
  surfaceGradientHexInput.addEventListener("change", (event) => {
    if (!isStoreBrandingUnlocked()) {
      syncThemeInputs();
      return;
    }

    setThemeColor("surface-gradient", event.target.value);
  });
}

if (overlayColorInput) {
  overlayColorInput.addEventListener("input", (event) => {
    if (!isStoreBrandingUnlocked()) {
      syncThemeInputs();
      return;
    }

    setThemeColor("overlay", event.target.value);
  });
}

if (overlayHexInput) {
  overlayHexInput.addEventListener("change", (event) => {
    if (!isStoreBrandingUnlocked()) {
      syncThemeInputs();
      return;
    }

    setThemeColor("overlay", event.target.value);
  });
}

if (buttonColorInput) {
  buttonColorInput.addEventListener("input", (event) => {
    if (!isStoreBrandingUnlocked()) {
      syncThemeInputs();
      return;
    }

    setThemeColor("button", event.target.value);
  });
}

if (buttonHexInput) {
  buttonHexInput.addEventListener("change", (event) => {
    if (!isStoreBrandingUnlocked()) {
      syncThemeInputs();
      return;
    }

    setThemeColor("button", event.target.value);
  });
}

if (borderColorInput) {
  borderColorInput.addEventListener("input", (event) => {
    if (!isStoreBrandingUnlocked()) {
      syncThemeInputs();
      return;
    }

    setThemeColor("border", event.target.value);
  });
}

if (borderHexInput) {
  borderHexInput.addEventListener("change", (event) => {
    if (!isStoreBrandingUnlocked()) {
      syncThemeInputs();
      return;
    }

    setThemeColor("border", event.target.value);
  });
}

if (textColorInput) {
  textColorInput.addEventListener("input", (event) => {
    if (!isStoreBrandingUnlocked()) {
      syncThemeInputs();
      return;
    }

    setThemeColor("text", event.target.value);
  });
}

if (textHexInput) {
  textHexInput.addEventListener("change", (event) => {
    if (!isStoreBrandingUnlocked()) {
      syncThemeInputs();
      return;
    }

    setThemeColor("text", event.target.value);
  });
}

if (themeDarkModeBtn) {
  themeDarkModeBtn.addEventListener("click", () => {
    applyThemePreset(DEFAULT_DARK_THEME);
  });
}

if (themeLightModeBtn) {
  themeLightModeBtn.addEventListener("click", () => {
    applyThemePreset(DEFAULT_LIGHT_THEME);
  });
}

lemonClickBtn.addEventListener("click", clickLemon);
if (exportSaveBtn) {
  exportSaveBtn.addEventListener("click", exportSaveCode);
}
if (loadSaveBtn) {
  loadSaveBtn.addEventListener("click", loadSaveCode);
}

syncBrandingInputs();
syncThemeInputs();
applyDefaultBranding();
setTreeCount(1);
updateStageDisplay();
updateStats();
updateFarmScrollHint();
renderUpgrades();
updateThemeModeControls();

setInterval(tickStage, 5000);
setInterval(autoLemonTick, 250);
window.addEventListener("resize", updateFarmScrollHint);
