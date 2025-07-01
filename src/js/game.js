// Number Collection Game - Main Game Logic

// Game State
let gameState = {
  numbers: {},
  cooldowns: {
    manual: { active: false, remaining: 0 },
    auto: { active: false, remaining: 0, unlocked: false }
  },
  stats: {
    totalRolls: 0,
    collectedCount: 0,
    currentStreak: 0
  }
};

// Constants
const COOLDOWN_MANUAL = 3000; // 3 seconds
const COOLDOWN_AUTO = 8000; // 8 seconds
const UNLOCK_AUTO_THRESHOLD = 10; // Unlock auto-roll at 10 collected numbers

// Special number arrays
const PRIME_NUMBERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const FIBONACCI_NUMBERS = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

// Initialize game
function initGame() {
  // Initialize all numbers 1-100
  for (let i = 1; i <= 100; i++) {
    gameState.numbers[i] = { count: 0, level: 0 };
  }
  
  loadGameState();
  updateUI();
  setupEventListeners();
  startCooldownTimer();
  
  console.log('Game initialized');
}

// Event Listeners
function setupEventListeners() {
  document.getElementById('manual-roll').addEventListener('click', performManualRoll);
  document.getElementById('auto-roll').addEventListener('click', toggleAutoRoll);
}

// Manual Roll
function performManualRoll() {
  if (gameState.cooldowns.manual.active) return;
  
  performRoll();
  startManualCooldown();
}

// Auto Roll Toggle
function toggleAutoRoll() {
  if (!gameState.cooldowns.auto.unlocked) return;
  
  if (gameState.cooldowns.auto.active) {
    // Stop auto roll
    gameState.cooldowns.auto.active = false;
    gameState.cooldowns.auto.remaining = 0;
  } else {
    // Start auto roll
    performRoll();
    startAutoCooldown();
  }
  
  updateUI();
}

// Main roll logic
function performRoll() {
  const bias = calculateBias();
  const roll = rollWithBias(bias);
  
  processRollResult(roll);
  gameState.stats.totalRolls++;
  
  updateUI();
  saveGameState();
  
  console.log(`Rolled: ${roll} (Bias: ${bias.toFixed(1)}%)`);
}

// Roll with bias calculation
function rollWithBias(biasPercentage) {
  const random = Math.random() * 100;
  
  if (random < biasPercentage) {
    // Roll from missing numbers
    const missingNumbers = getMissingNumbers();
    if (missingNumbers.length > 0) {
      return missingNumbers[Math.floor(Math.random() * missingNumbers.length)];
    }
  }
  
  // Regular random roll
  return Math.floor(Math.random() * 100) + 1;
}

// Get missing numbers (count = 0)
function getMissingNumbers() {
  const missing = [];
  for (let i = 1; i <= 100; i++) {
    if (gameState.numbers[i].count === 0) {
      missing.push(i);
    }
  }
  return missing;
}

// Calculate current bias
function calculateBias() {
  let totalBias = 0;
  
  for (let i = 1; i <= 100; i++) {
    const number = gameState.numbers[i];
    if (number.level > 0) {
      let levelBonus = 0;
      switch (number.level) {
        case 1: levelBonus = 0.8; break;
        case 2: levelBonus = 2.0; break;
        case 3: levelBonus = 4.5; break;
        case 4: levelBonus = 8.0; break;
      }
      
      // Apply special number multipliers
      if (PRIME_NUMBERS.includes(i)) {
        levelBonus *= 1.5;
      }
      if (FIBONACCI_NUMBERS.includes(i)) {
        levelBonus *= 1.2;
      }
      
      totalBias += levelBonus;
    }
  }
  
  // Cap at 85%
  return Math.min(totalBias, 85);
}

// Process roll result
function processRollResult(number) {
  const numberData = gameState.numbers[number];
  const wasNew = numberData.count === 0;
  
  numberData.count++;
  
  // Update level based on count
  if (numberData.count >= 100) numberData.level = 4;
  else if (numberData.count >= 50) numberData.level = 3;
  else if (numberData.count >= 25) numberData.level = 2;
  else if (numberData.count >= 10) numberData.level = 1;
  
  // Update collected count if new
  if (wasNew) {
    gameState.stats.collectedCount++;
    
    // Unlock auto-roll if threshold reached
    if (gameState.stats.collectedCount >= UNLOCK_AUTO_THRESHOLD) {
      gameState.cooldowns.auto.unlocked = true;
    }
  }
}

// Cooldown management
function startManualCooldown() {
  gameState.cooldowns.manual.active = true;
  gameState.cooldowns.manual.remaining = COOLDOWN_MANUAL;
}

function startAutoCooldown() {
  gameState.cooldowns.auto.active = true;
  gameState.cooldowns.auto.remaining = COOLDOWN_AUTO;
}

function startCooldownTimer() {
  setInterval(() => {
    // Manual cooldown
    if (gameState.cooldowns.manual.active) {
      gameState.cooldowns.manual.remaining -= 100;
      if (gameState.cooldowns.manual.remaining <= 0) {
        gameState.cooldowns.manual.active = false;
        gameState.cooldowns.manual.remaining = 0;
      }
    }
    
    // Auto cooldown
    if (gameState.cooldowns.auto.active) {
      gameState.cooldowns.auto.remaining -= 100;
      if (gameState.cooldowns.auto.remaining <= 0) {
        // Auto roll again
        performRoll();
        startAutoCooldown();
      }
    }
    
    updateUI();
  }, 100);
}

// UI Updates
function updateUI() {
  updateStats();
  updateButtons();
  updateGrid();
}

function updateStats() {
  document.getElementById('collected-count').textContent = `${gameState.stats.collectedCount}/100`;
  document.getElementById('bias-value').textContent = `${calculateBias().toFixed(1)}%`;
  document.getElementById('total-rolls').textContent = gameState.stats.totalRolls;
}

function updateButtons() {
  const manualButton = document.getElementById('manual-roll');
  const autoButton = document.getElementById('auto-roll');
  const manualCooldown = document.getElementById('manual-cooldown');
  const autoCooldown = document.getElementById('auto-cooldown');
  
  // Manual button
  manualButton.disabled = gameState.cooldowns.manual.active;
  if (gameState.cooldowns.manual.active) {
    const seconds = Math.ceil(gameState.cooldowns.manual.remaining / 1000);
    manualCooldown.textContent = `${seconds}s`;
  } else {
    manualCooldown.textContent = '';
  }
  
  // Auto button
  autoButton.disabled = !gameState.cooldowns.auto.unlocked;
  if (!gameState.cooldowns.auto.unlocked) {
    autoCooldown.textContent = `Unlock at ${UNLOCK_AUTO_THRESHOLD} numbers`;
  } else if (gameState.cooldowns.auto.active) {
    const seconds = Math.ceil(gameState.cooldowns.auto.remaining / 1000);
    autoCooldown.textContent = `${seconds}s`;
    autoButton.querySelector('.button-text').textContent = 'Stop Auto';
  } else {
    autoCooldown.textContent = '';
    autoButton.querySelector('.button-text').textContent = 'Auto Roll';
  }
}

function updateGrid() {
  const grid = document.getElementById('numbers-grid');
  
  // Create grid if empty
  if (grid.children.length === 0) {
    for (let i = 1; i <= 100; i++) {
      const cell = document.createElement('div');
      cell.className = 'number-cell';
      cell.textContent = i;
      cell.id = `number-${i}`;
      
      // Add special number classes
      if (PRIME_NUMBERS.includes(i)) cell.classList.add('prime');
      if (FIBONACCI_NUMBERS.includes(i)) cell.classList.add('fibonacci');
      if (i % 5 === 0) cell.classList.add('divisible-by-5');
      
      grid.appendChild(cell);
    }
  }
  
  // Update cell states
  for (let i = 1; i <= 100; i++) {
    const cell = document.getElementById(`number-${i}`);
    const numberData = gameState.numbers[i];
    
    // Remove old level classes
    cell.classList.remove('level-1', 'level-2', 'level-3', 'level-4', 'collected');
    
    // Add current level class
    if (numberData.level > 0) {
      cell.classList.add(`level-${numberData.level}`);
    }
    
    // Add collected class
    if (numberData.count > 0) {
      cell.classList.add('collected');
    }
    
    // Update title with count info
    cell.title = `Number ${i}\nCount: ${numberData.count}\nLevel: ${numberData.level}`;
  }
}

// Save/Load Game State
function saveGameState() {
  try {
    localStorage.setItem('numberGameState', JSON.stringify(gameState));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

function loadGameState() {
  try {
    const saved = localStorage.getItem('numberGameState');
    if (saved) {
      const loaded = JSON.parse(saved);
      
      // Merge with default state to handle new properties
      gameState = {
        ...gameState,
        ...loaded,
        cooldowns: {
          ...gameState.cooldowns,
          ...loaded.cooldowns
        },
        stats: {
          ...gameState.stats,
          ...loaded.stats
        }
      };
      
      console.log('Game state loaded');
    }
  } catch (error) {
    console.error('Failed to load game state:', error);
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initGame);