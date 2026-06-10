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
    name: "Young Tree",
    description: "The seedling grows stems and leaves as it develops a permanent root system.",
    className: "stage-3",
  },
  {
    id: 4,
    name: "Flowering",
    description: "Small fragrant blossoms appear before pollination and fruit formation.",
    className: "stage-4",
  },
  {
    id: 5,
    name: "Fruiting",
    description: "Lemons mature over weeks, showing the final stage of the tree's seasonal growth.",
    className: "stage-5",
  },
];

const stageButtons = document.getElementById("stageButtons");
const currentStageTitle = document.getElementById("currentStageTitle");
const currentStageDescription = document.getElementById("currentStageDescription");
const stageRange = document.getElementById("stageRange");
const playPauseBtn = document.getElementById("playPauseBtn");
const speedSelect = document.getElementById("speedSelect");
const treeScene = document.getElementById("treeScene");

let activeStageIndex = 0;
let animationTimer = null;
let isPlaying = false;

function createButtons() {
  stageButtons.innerHTML = "";
  stages.forEach((stage, index) => {
    const button = document.createElement("button");
    button.textContent = stage.name;
    button.type = "button";
    button.addEventListener("click", () => setStage(index));
    stageButtons.appendChild(button);
  });
}

function highlightActiveButton() {
  const buttons = stageButtons.querySelectorAll("button");
  buttons.forEach((button, index) => {
    button.classList.toggle("active", index === activeStageIndex);
  });
}

function updateDisplay() {
  const stage = stages[activeStageIndex];
  currentStageTitle.textContent = stage.name;
  currentStageDescription.textContent = stage.description;
  treeScene.className = `tree-scene ${stage.className}`;
  stageRange.value = (activeStageIndex / (stages.length - 1)) * 100;
  highlightActiveButton();
}

function setStage(index) {
  activeStageIndex = Math.max(0, Math.min(stages.length - 1, index));
  updateDisplay();
}

function playSimulation() {
  if (isPlaying) {
    pauseSimulation();
    return;
  }
  isPlaying = true;
  playPauseBtn.textContent = "Pause";
  animationTimer = setInterval(() => {
    if (activeStageIndex < stages.length - 1) {
      setStage(activeStageIndex + 1);
    } else {
      pauseSimulation();
    }
  }, Number(speedSelect.value));
}

function pauseSimulation() {
  isPlaying = false;
  playPauseBtn.textContent = "Play";
  clearInterval(animationTimer);
  animationTimer = null;
}

stageRange.addEventListener("input", () => {
  const position = Number(stageRange.value) / 100;
  const nextIndex = Math.round(position * (stages.length - 1));
  setStage(nextIndex);
  pauseSimulation();
});

playPauseBtn.addEventListener("click", playSimulation);

speedSelect.addEventListener("change", () => {
  if (isPlaying) {
    pauseSimulation();
    playSimulation();
  }
});

createButtons();
updateDisplay();
