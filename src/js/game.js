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
    currentStreak: 0,
    bestStreak: 0,
    startTime: Date.now(),
    totalPlayTime: 0
  },
  achievements: {}
};

// Constants
const COOLDOWN_MANUAL = 3000; // 3 seconds
const COOLDOWN_AUTO = 8000; // 8 seconds
const UNLOCK_AUTO_THRESHOLD = 10; // Unlock auto-roll at 10 collected numbers

// Special number arrays
const PRIME_NUMBERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const FIBONACCI_NUMBERS = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

// Achievement definitions
const ACHIEVEMENTS = {
  first10: { 
    id: 'first10',
    name: 'First Steps', 
    description: 'Collect your first 10 numbers',
    icon: '🎯',
    check: () => gameState.stats.collectedCount >= 10
  },
  halfway: { 
    id: 'halfway',
    name: 'Halfway There', 
    description: 'Collect 50 numbers',
    icon: '🌟',
    check: () => gameState.stats.collectedCount >= 50
  },
  completionist: { 
    id: 'completionist',
    name: 'Completionist', 
    description: 'Collect all 100 numbers',
    icon: '👑',
    check: () => gameState.stats.collectedCount >= 100
  },
  speedRunner: { 
    id: 'speedRunner',
    name: 'Speed Runner', 
    description: 'Collect 100 numbers in under 10 minutes',
    icon: '⚡',
    check: () => gameState.stats.collectedCount >= 100 && (Date.now() - gameState.stats.startTime) < 600000
  },
  luckyStreak: { 
    id: 'luckyStreak',
    name: 'Lucky Streak', 
    description: 'Get 10 new numbers in a row',
    icon: '🍀',
    check: () => gameState.stats.bestStreak >= 10
  },
  primeMaster: { 
    id: 'primeMaster',
    name: 'Prime Master', 
    description: 'Collect all prime numbers',
    icon: '🔢',
    check: () => PRIME_NUMBERS.every(n => gameState.numbers[n].count > 0)
  },
  fibonacciMaster: { 
    id: 'fibonacciMaster',
    name: 'Fibonacci Master', 
    description: 'Collect all Fibonacci numbers',
    icon: '🌀',
    check: () => FIBONACCI_NUMBERS.every(n => gameState.numbers[n].count > 0)
  },
  levelMaster: { 
    id: 'levelMaster',
    name: 'Level Master', 
    description: 'Get any number to level 4',
    icon: '🔥',
    check: () => Object.values(gameState.numbers).some(n => n.level >= 4)
  },
  biasBuilder: { 
    id: 'biasBuilder',
    name: 'Bias Builder', 
    description: 'Reach 50% bias',
    icon: '📈',
    check: () => calculateBias() >= 50
  },
  persistent: { 
    id: 'persistent',
    name: 'Persistent Player', 
    description: 'Roll the dice 1000 times',
    icon: '🎲',
    check: () => gameState.stats.totalRolls >= 1000
  }
};

// Initialize game
function initGame() {
  // Check if we have saved state first
  const hasSavedState = localStorage.getItem('numberGameState') !== null;
  
  if (!hasSavedState) {
    // Only initialize fresh state if no save exists
    initializeGameState();
  } else {
    // Initialize basic structure then load
    gameState = {
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
    
    // Initialize all numbers to default
    for (let i = 1; i <= 100; i++) {
      gameState.numbers[i] = { count: 0, level: 0 };
    }
    
    // Load saved state
    loadGameState();
  }
  
  updateUI();
  setupEventListeners();
  setupTooltip();
  startCooldownTimer();
  
  console.log('Game initialized');
}

// Event Listeners
function setupEventListeners() {
  document.getElementById('manual-roll').addEventListener('click', performManualRoll);
  document.getElementById('auto-roll').addEventListener('click', toggleAutoRoll);
  
  // Menu buttons
  document.getElementById('new-game-btn').addEventListener('click', showNewGameModal);
  document.getElementById('import-btn').addEventListener('click', showImportModal);
  document.getElementById('export-btn').addEventListener('click', showExportModal);
  document.getElementById('achievements-btn').addEventListener('click', showAchievementsModal);
  document.getElementById('stats-btn').addEventListener('click', showStatisticsModal);
  
  // Modal buttons
  document.getElementById('confirm-new-game').addEventListener('click', confirmNewGame);
  document.getElementById('cancel-new-game').addEventListener('click', hideModals);
  document.getElementById('confirm-import').addEventListener('click', confirmImport);
  document.getElementById('cancel-import').addEventListener('click', hideModals);
  document.getElementById('copy-export').addEventListener('click', copyExportData);
  document.getElementById('close-export').addEventListener('click', hideModals);
  document.getElementById('close-achievements').addEventListener('click', hideModals);
  document.getElementById('close-statistics').addEventListener('click', hideModals);
  
  // Modal overlay click to close
  document.getElementById('modal-overlay').addEventListener('click', hideModals);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyPress);
  
  // Handle visibility change (tab becomes inactive/active)
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Save state when page is about to unload
  window.addEventListener('beforeunload', () => {
    // Update total play time
    gameState.stats.totalPlayTime += Date.now() - gameState.stats.startTime;
    
    // Force immediate save on page unload
    if (saveTimeout) {
      clearTimeout(saveTimeout);
      try {
        localStorage.setItem('numberGameState', JSON.stringify(gameState));
      } catch (error) {
        console.error('Failed to save on unload:', error);
      }
    }
  });
}

// Handle keyboard shortcuts
function handleKeyPress(e) {
  // Ignore if user is typing in an input field
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  
  switch (e.key) {
    case ' ':  // Space
    case 'Enter':
      e.preventDefault();
      performManualRoll();
      break;
    case 'a':
    case 'A':
      e.preventDefault();
      toggleAutoRoll();
      break;
  }
}

// Handle tab visibility changes
let tabInactiveTime = 0;
function handleVisibilityChange() {
  if (document.hidden) {
    // Tab became inactive - record the time
    tabInactiveTime = Date.now();
    console.log('Tab became inactive');
  } else {
    // Tab became active - adjust cooldowns
    if (tabInactiveTime > 0) {
      const inactiveDuration = Date.now() - tabInactiveTime;
      console.log(`Tab was inactive for ${inactiveDuration}ms`);
      
      // Adjust cooldowns for time passed while inactive
      if (gameState.cooldowns.manual.active) {
        gameState.cooldowns.manual.remaining = Math.max(0, gameState.cooldowns.manual.remaining - inactiveDuration);
        if (gameState.cooldowns.manual.remaining === 0) {
          gameState.cooldowns.manual.active = false;
        }
      }
      
      if (gameState.cooldowns.auto.active) {
        gameState.cooldowns.auto.remaining = Math.max(0, gameState.cooldowns.auto.remaining - inactiveDuration);
      }
      
      tabInactiveTime = 0;
      updateUI();
    }
  }
}

// Manual Roll
let lastManualClick = 0;
const CLICK_THROTTLE = 100; // Minimum 100ms between clicks

function performManualRoll() {
  const now = Date.now();
  
  // Prevent rapid clicks
  if (now - lastManualClick < CLICK_THROTTLE) {
    return;
  }
  
  if (gameState.cooldowns.manual.active) return;
  
  lastManualClick = now;
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
  // Calculate current bias
  const bias = calculateBias();
  
  // Generate random number between 1-100
  const roll = rollWithBias(bias);
  
  // Process the result
  processRollResult(roll);
  gameState.stats.totalRolls++;
  
  // Update UI and save state
  updateUI();
  saveGameState();
  
  // Log result with bias info
  const missingCount = getMissingNumbers().length;
  console.log(`Rolled: ${roll} | Bias: ${bias.toFixed(1)}% | Missing: ${missingCount}/100`);
  
  return roll;
}

// Roll with bias calculation
function rollWithBias(biasPercentage) {
  const random = Math.random() * 100;
  
  if (random < biasPercentage) {
    // Use bias to select from missing numbers
    const target = selectBiasedTarget(biasPercentage);
    if (target !== null) {
      return target;
    }
  }
  
  // Regular random roll (1-100)
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

// Get numbers near missing numbers (±3 range)
function getNearMissingPool() {
  const missingNumbers = getMissingNumbers();
  const nearMissing = new Set();
  
  missingNumbers.forEach(num => {
    // Add numbers within ±3 range of missing numbers
    for (let offset = -3; offset <= 3; offset++) {
      const nearNum = num + offset;
      if (nearNum >= 1 && nearNum <= 100) {
        nearMissing.add(nearNum);
      }
    }
  });
  
  return Array.from(nearMissing);
}

// Select target based on bias percentage
function selectBiasedTarget(biasPercentage) {
  const missingNumbers = getMissingNumbers();
  
  // No missing numbers, return null
  if (missingNumbers.length === 0) {
    return null;
  }
  
  // High bias (>50%): Use near-missing pool
  if (biasPercentage > 50) {
    const nearMissingPool = getNearMissingPool();
    if (nearMissingPool.length > 0) {
      return nearMissingPool[Math.floor(Math.random() * nearMissingPool.length)];
    }
  }
  
  // Normal bias: Select from missing numbers only
  return missingNumbers[Math.floor(Math.random() * missingNumbers.length)];
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
      if (isPrime(i)) {
        levelBonus *= 1.5;
      }
      if (isFibonacci(i)) {
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
  const wasNew = gameState.numbers[number].count === 0;
  const oldLevel = gameState.numbers[number].level;
  const oldCollectedCount = gameState.stats.collectedCount;
  
  // Use the updateNumber utility
  updateNumber(number, 1);
  
  const newLevel = gameState.numbers[number].level;
  const leveledUp = newLevel > oldLevel;
  
  // Update collected count and streak if new
  if (wasNew) {
    gameState.stats.collectedCount++;
    gameState.stats.currentStreak++;
    
    // Update best streak
    if (gameState.stats.currentStreak > gameState.stats.bestStreak) {
      gameState.stats.bestStreak = gameState.stats.currentStreak;
    }
    
    // Check for milestones
    checkMilestones(oldCollectedCount, gameState.stats.collectedCount);
    
    // Unlock auto-roll if threshold reached
    if (gameState.stats.collectedCount >= UNLOCK_AUTO_THRESHOLD) {
      gameState.cooldowns.auto.unlocked = true;
    }
  } else {
    // Reset streak if not a new number
    gameState.stats.currentStreak = 0;
  }
  
  // Check achievements after every roll
  checkAchievements();
  
  // Update roll result display
  displayRollResult(number, wasNew, leveledUp);
}

// Cooldown management
function startManualCooldown() {
  const reduction = getCooldownReduction();
  const reducedCooldown = COOLDOWN_MANUAL * (1 - reduction / 100);
  
  gameState.cooldowns.manual.active = true;
  gameState.cooldowns.manual.remaining = Math.max(reducedCooldown, COOLDOWN_MANUAL * 0.15); // Minimum 15% of base
}

function startAutoCooldown() {
  const reduction = getCooldownReduction();
  const reducedCooldown = COOLDOWN_AUTO * (1 - reduction / 100);
  
  gameState.cooldowns.auto.active = true;
  gameState.cooldowns.auto.remaining = Math.max(reducedCooldown, COOLDOWN_AUTO * 0.15); // Minimum 15% of base
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

// State Management Utilities
function updateNumber(num, increment = 1) {
  if (num < 1 || num > 100) return;
  
  const numberData = gameState.numbers[num];
  const oldLevel = numberData.level;
  
  numberData.count += increment;
  
  // Update level based on new count
  const newLevel = getNumberLevel(numberData.count);
  if (newLevel !== oldLevel) {
    numberData.level = newLevel;
    console.log(`Number ${num} reached level ${newLevel}!`);
  }
  
  return numberData;
}

function getNumberLevel(count) {
  if (count >= 100) return 4;
  if (count >= 50) return 3;
  if (count >= 25) return 2;
  if (count >= 10) return 1;
  return 0;
}

function calculateLevelProgress(count) {
  const currentLevel = getNumberLevel(count);
  
  // Define thresholds
  const thresholds = [0, 10, 25, 50, 100];
  
  if (currentLevel >= 4) {
    // Max level reached
    return { 
      currentLevel: 4, 
      nextLevel: null, 
      progress: 100, 
      remaining: 0 
    };
  }
  
  const currentThreshold = thresholds[currentLevel];
  const nextThreshold = thresholds[currentLevel + 1];
  const progress = ((count - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  const remaining = nextThreshold - count;
  
  return {
    currentLevel,
    nextLevel: currentLevel + 1,
    progress: Math.floor(progress),
    remaining
  };
}

// Utility functions for special numbers
function isPrime(num) {
  return PRIME_NUMBERS.includes(num);
}

function isFibonacci(num) {
  return FIBONACCI_NUMBERS.includes(num);
}

function isDivisibleBy5(num) {
  return num % 5 === 0;
}

// Additional utility functions
function getCollectedNumbers() {
  return Object.keys(gameState.numbers)
    .filter(num => gameState.numbers[num].count > 0)
    .map(Number);
}

function getLeveledNumbers(minLevel = 1) {
  return Object.keys(gameState.numbers)
    .filter(num => gameState.numbers[num].level >= minLevel)
    .map(Number);
}

function getSpecialNumberBonus(num) {
  let bonus = 1.0;
  
  if (isPrime(num)) {
    bonus *= 1.5;
  }
  if (isFibonacci(num)) {
    bonus *= 1.2;
  }
  
  return bonus;
}

// Check for milestone achievements
function checkMilestones(oldCount, newCount) {
  const milestones = [25, 50, 75, 100];
  
  milestones.forEach(milestone => {
    if (oldCount < milestone && newCount >= milestone) {
      displayMilestone(milestone);
    }
  });
}

// Display milestone notification
function displayMilestone(milestone) {
  const notification = document.getElementById('milestone-notification');
  
  // Create milestone content
  let title = '';
  let message = '';
  
  switch (milestone) {
    case 25:
      title = '25% Complete!';
      message = 'Quarter of the way there! Keep rolling!';
      break;
    case 50:
      title = '50% Complete!';
      message = 'Halfway to victory! The bias is building...';
      break;
    case 75:
      title = '75% Complete!';
      message = 'Almost there! The final push begins!';
      break;
    case 100:
      title = '100% Complete!';
      message = 'Congratulations! All numbers collected!';
      // Trigger confetti for 100% completion
      createConfetti();
      break;
  }
  
  // Update notification content
  notification.innerHTML = `
    <div class="milestone-title">${title}</div>
    <div class="milestone-message">${message}</div>
  `;
  
  // Show notification
  notification.classList.add('show');
  
  // Hide after 3 seconds (5 seconds for 100%)
  setTimeout(() => {
    notification.classList.remove('show');
  }, milestone === 100 ? 5000 : 3000);
}

// Create confetti effect
function createConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);
  
  // Create multiple confetti pieces
  const confettiCount = 50;
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(confetti);
    }, i * 50); // Stagger creation for wave effect
  }
  
  // Remove container after animation
  setTimeout(() => {
    container.remove();
  }, 5000);
}

function getCooldownReduction() {
  let reduction = 0;
  
  // Divisible by 5 bonus (only level 1+ numbers)
  const divisibleBy5 = getLeveledNumbers(1).filter(n => isDivisibleBy5(n));
  reduction += divisibleBy5.length * 2; // 2% per number
  
  // Level sum bonus
  let levelSum = 0;
  for (let i = 1; i <= 100; i++) {
    levelSum += gameState.numbers[i].level;
  }
  reduction += levelSum * 1; // 1% per total level
  
  // Cap at 85%
  return Math.min(reduction, 85);
}

// Display roll result with animations
function displayRollResult(number, isNew, leveledUp) {
  const resultContainer = document.getElementById('roll-result');
  const resultLabel = resultContainer.querySelector('.roll-result-label');
  const resultNumber = document.getElementById('roll-result-number');
  
  // Remove previous animation classes
  resultContainer.classList.remove('rolling', 'new-number', 'level-up');
  
  // Add rolling animation
  resultContainer.classList.add('rolling');
  
  // Animate button shake
  const manualButton = document.getElementById('manual-roll');
  if (!manualButton.disabled) {
    manualButton.classList.add('rolling');
    setTimeout(() => manualButton.classList.remove('rolling'), 500);
  }
  
  // Update the number display
  setTimeout(() => {
    resultNumber.textContent = number;
    
    if (leveledUp) {
      resultLabel.textContent = 'Level Up!';
      resultContainer.classList.add('level-up');
      // Trigger level up animation on grid cell
      animateGridCell(number, 'level-change');
    } else if (isNew) {
      resultLabel.textContent = 'New Number!';
      resultContainer.classList.add('new-number');
      // Trigger pulse animation on grid cell
      animateGridCell(number, 'pulse');
    } else {
      resultLabel.textContent = 'Rolled';
      // Still pulse the cell but more subtly
      animateGridCell(number, 'pulse');
    }
    
    resultContainer.classList.remove('rolling');
    
    // Create flying number effect
    if (isNew || leveledUp) {
      createFlyingNumber(number);
    }
  }, 250);
  
  // Reset label after animation
  setTimeout(() => {
    resultContainer.classList.remove('new-number', 'level-up');
  }, 1000);
}

// Create flying number animation
function createFlyingNumber(number) {
  const resultContainer = document.getElementById('roll-result');
  const targetCell = document.getElementById(`number-${number}`);
  
  if (!targetCell) return;
  
  // Use requestAnimationFrame for smooth animation start
  requestAnimationFrame(() => {
    // Get positions
    const startRect = resultContainer.getBoundingClientRect();
    const endRect = targetCell.getBoundingClientRect();
    
    // Create flying number element
    const flyingNum = document.createElement('div');
    flyingNum.className = 'flying-number';
    flyingNum.textContent = number;
    
    // Set starting position
    flyingNum.style.left = startRect.left + startRect.width / 2 + 'px';
    flyingNum.style.top = startRect.top + startRect.height / 2 + 'px';
    
    // Calculate movement distance
    const deltaX = endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2);
    const deltaY = endRect.top + endRect.height / 2 - (startRect.top + startRect.height / 2);
    
    // Set CSS variables for animation endpoint
    flyingNum.style.setProperty('--fly-x', deltaX + 'px');
    flyingNum.style.setProperty('--fly-y', deltaY + 'px');
    
    // Add to document
    document.body.appendChild(flyingNum);
    
    // Remove after animation
    setTimeout(() => {
      flyingNum.remove();
    }, 1000);
  });
}

// Animate grid cell
function animateGridCell(number, animationClass) {
  const cell = document.getElementById(`number-${number}`);
  if (!cell) return;
  
  // Remove any existing animation classes
  cell.classList.remove('pulse', 'level-change');
  
  // Force reflow to restart animation
  void cell.offsetWidth;
  
  // Add new animation class
  cell.classList.add(animationClass);
  
  // Remove animation class after completion
  setTimeout(() => {
    cell.classList.remove(animationClass);
  }, 800);
}

// UI Updates
let updateScheduled = false;
let pendingUpdates = {
  stats: false,
  buttons: false,
  grid: false
};

function updateUI() {
  // Mark all updates as pending
  pendingUpdates.stats = true;
  pendingUpdates.buttons = true;
  pendingUpdates.grid = true;
  
  scheduleUpdate();
}

function scheduleUpdate() {
  if (!updateScheduled) {
    updateScheduled = true;
    requestAnimationFrame(performBatchUpdate);
  }
}

function performBatchUpdate() {
  // Perform all pending updates
  if (pendingUpdates.stats) {
    updateStats();
    pendingUpdates.stats = false;
  }
  
  if (pendingUpdates.buttons) {
    updateButtons();
    pendingUpdates.buttons = false;
  }
  
  if (pendingUpdates.grid) {
    updateGrid();
    pendingUpdates.grid = false;
  }
  
  updateScheduled = false;
}

function updateStats() {
  updateStatistics();
}

// Comprehensive statistics update function
function updateStatistics() {
  // Update basic stats
  document.getElementById('collected-count').textContent = `${gameState.stats.collectedCount}/100`;
  document.getElementById('bias-value').textContent = `${calculateBias().toFixed(1)}%`;
  document.getElementById('total-rolls').textContent = gameState.stats.totalRolls;
  document.getElementById('current-streak').textContent = gameState.stats.currentStreak;
  
  // Update progress bar
  const progressPercentage = (gameState.stats.collectedCount / 100) * 100;
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  
  progressFill.style.width = `${progressPercentage}%`;
  progressText.textContent = `${Math.floor(progressPercentage)}%`;
  
  // Update cooldown reduction display
  const reduction = getCooldownReduction();
  const cooldownElement = document.getElementById('cooldown-reduction');
  if (cooldownElement) {
    cooldownElement.textContent = `${reduction.toFixed(1)}%`;
  }
  
  // Add animation class for stat changes
  const statElements = document.querySelectorAll('.stat-value');
  statElements.forEach(el => {
    el.classList.add('stat-update');
    setTimeout(() => el.classList.remove('stat-update'), 300);
  });
}

function updateButtons() {
  const manualButton = document.getElementById('manual-roll');
  const autoButton = document.getElementById('auto-roll');
  const manualCooldown = document.getElementById('manual-cooldown');
  const autoCooldown = document.getElementById('auto-cooldown');
  const manualProgress = document.getElementById('manual-progress');
  const autoProgress = document.getElementById('auto-progress');
  
  // Manual button
  manualButton.disabled = gameState.cooldowns.manual.active;
  if (gameState.cooldowns.manual.active) {
    const seconds = Math.ceil(gameState.cooldowns.manual.remaining / 1000);
    manualCooldown.textContent = `${seconds}s`;
    
    // Update progress bar
    const reduction = getCooldownReduction();
    const totalCooldown = COOLDOWN_MANUAL * (1 - reduction / 100);
    const progress = ((totalCooldown - gameState.cooldowns.manual.remaining) / totalCooldown) * 100;
    manualProgress.style.width = `${progress}%`;
  } else {
    manualCooldown.textContent = '';
    manualProgress.style.width = '0%';
  }
  
  // Auto button
  autoButton.disabled = !gameState.cooldowns.auto.unlocked;
  if (!gameState.cooldowns.auto.unlocked) {
    autoCooldown.textContent = `Unlock at ${UNLOCK_AUTO_THRESHOLD} numbers`;
    autoProgress.style.width = '0%';
  } else if (gameState.cooldowns.auto.active) {
    const seconds = Math.ceil(gameState.cooldowns.auto.remaining / 1000);
    autoCooldown.textContent = `${seconds}s`;
    autoButton.querySelector('.button-text').textContent = 'Stop Auto';
    
    // Update progress bar
    const reduction = getCooldownReduction();
    const totalCooldown = COOLDOWN_AUTO * (1 - reduction / 100);
    const progress = ((totalCooldown - gameState.cooldowns.auto.remaining) / totalCooldown) * 100;
    autoProgress.style.width = `${progress}%`;
  } else {
    autoCooldown.textContent = '';
    autoButton.querySelector('.button-text').textContent = 'Auto Roll';
    autoProgress.style.width = '0%';
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
      if (isPrime(i)) cell.classList.add('prime');
      if (isFibonacci(i)) cell.classList.add('fibonacci');
      if (isDivisibleBy5(i)) cell.classList.add('divisible-by-5');
      
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
    
    // Remove title attribute since we're using custom tooltips
    cell.removeAttribute('title');
  }
}

// Tooltip functionality
let tooltipElement = null;
let tooltipTimeout = null;

function setupTooltip() {
  // Create tooltip element
  tooltipElement = document.createElement('div');
  tooltipElement.className = 'tooltip';
  document.body.appendChild(tooltipElement);
  
  // Add event listeners to all number cells
  document.addEventListener('mouseover', handleTooltipShow);
  document.addEventListener('mouseout', handleTooltipHide);
  document.addEventListener('mousemove', handleTooltipMove);
}

function handleTooltipShow(e) {
  const cell = e.target.closest('.number-cell');
  if (!cell) return;
  
  clearTimeout(tooltipTimeout);
  tooltipTimeout = setTimeout(() => {
    const number = parseInt(cell.textContent);
    showTooltip(number, e.pageX, e.pageY);
  }, 300); // Small delay to prevent tooltip spam
}

function handleTooltipHide(e) {
  const cell = e.target.closest('.number-cell');
  if (!cell) return;
  
  clearTimeout(tooltipTimeout);
  hideTooltip();
}

function handleTooltipMove(e) {
  if (tooltipElement.classList.contains('show')) {
    positionTooltip(e.pageX, e.pageY);
  }
}

function showTooltip(number, x, y) {
  const numberData = gameState.numbers[number];
  const progress = calculateLevelProgress(numberData.count);
  
  // Build tooltip content
  let html = `<div class="tooltip-header">Number ${number}</div>`;
  
  // Basic stats
  html += `
    <div class="tooltip-row">
      <span class="tooltip-label">Rolls:</span>
      <span class="tooltip-value">${numberData.count}</span>
    </div>
    <div class="tooltip-row">
      <span class="tooltip-label">Level:</span>
      <span class="tooltip-value">${numberData.level}</span>
    </div>
  `;
  
  // Progress bar
  if (progress.nextLevel !== null) {
    html += `
      <div class="tooltip-progress">
        <div class="tooltip-row">
          <span class="tooltip-label">Next Level:</span>
          <span class="tooltip-value">${progress.remaining} rolls needed</span>
        </div>
        <div class="tooltip-progress-bar">
          <div class="tooltip-progress-fill" style="width: ${progress.progress}%"></div>
        </div>
      </div>
    `;
  } else {
    html += `
      <div class="tooltip-progress">
        <div class="tooltip-row">
          <span class="tooltip-label">Status:</span>
          <span class="tooltip-value">Max Level!</span>
        </div>
      </div>
    `;
  }
  
  // Special properties
  const specialProps = [];
  if (isPrime(number)) {
    specialProps.push('<div class="tooltip-special-item">★ Prime Number (1.5x bias multiplier)</div>');
  }
  if (isFibonacci(number)) {
    specialProps.push('<div class="tooltip-special-item">◆ Fibonacci Number (1.2x bias multiplier)</div>');
  }
  if (isDivisibleBy5(number)) {
    if (numberData.level >= 1) {
      specialProps.push('<div class="tooltip-special-item">÷5 Divisible by 5 (-2% cooldown)</div>');
    } else {
      specialProps.push('<div class="tooltip-special-item">÷5 Divisible by 5 (cooldown bonus at Level 1+)</div>');
    }
  }
  
  if (specialProps.length > 0) {
    html += '<div class="tooltip-special">' + specialProps.join('') + '</div>';
  }
  
  tooltipElement.innerHTML = html;
  positionTooltip(x, y);
  tooltipElement.classList.add('show');
}

function hideTooltip() {
  tooltipElement.classList.remove('show');
}

function positionTooltip(x, y) {
  const tooltip = tooltipElement;
  const tooltipRect = tooltip.getBoundingClientRect();
  const padding = 10;
  
  // Calculate position
  let left = x + padding;
  let top = y + padding;
  
  // Check if tooltip goes off the right edge
  if (left + tooltipRect.width > window.innerWidth - padding) {
    left = x - tooltipRect.width - padding;
  }
  
  // Check if tooltip goes off the bottom edge
  if (top + tooltipRect.height > window.innerHeight - padding) {
    top = y - tooltipRect.height - padding;
  }
  
  // Apply position
  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
}

// Save/Load Game State
let saveTimeout = null;
const SAVE_DEBOUNCE_DELAY = 1000; // 1 second debounce

function saveGameState() {
  // Clear existing timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  // Debounce the save operation
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem('numberGameState', JSON.stringify(gameState));
      console.log('Game state saved');
    } catch (error) {
      console.error('Failed to save game state:', error);
      // Handle storage quota exceeded
      if (error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded. Consider clearing old data.');
      }
    }
  }, SAVE_DEBOUNCE_DELAY);
}

function loadGameState() {
  try {
    const saved = localStorage.getItem('numberGameState');
    if (saved) {
      const loaded = JSON.parse(saved);
      
      // Validate loaded data structure
      if (loaded && loaded.numbers && loaded.cooldowns && loaded.stats) {
        // Deep merge to preserve structure and handle missing properties
        gameState.numbers = { ...gameState.numbers, ...loaded.numbers };
        gameState.cooldowns = {
          manual: {
            ...gameState.cooldowns.manual,
            ...(loaded.cooldowns.manual || {})
          },
          auto: {
            ...gameState.cooldowns.auto,
            ...(loaded.cooldowns.auto || {})
          }
        };
        gameState.stats = { ...gameState.stats, ...(loaded.stats || {}) };
        
        // Ensure new properties exist for backward compatibility
        gameState.stats.bestStreak = gameState.stats.bestStreak || 0;
        gameState.stats.startTime = gameState.stats.startTime || Date.now();
        gameState.stats.totalPlayTime = gameState.stats.totalPlayTime || 0;
        gameState.achievements = loaded.achievements || {};
        
        // Reset active cooldowns to prevent stuck states
        gameState.cooldowns.manual.active = false;
        gameState.cooldowns.manual.remaining = 0;
        gameState.cooldowns.auto.active = false;
        gameState.cooldowns.auto.remaining = 0;
        
        console.log('Game state loaded successfully');
      } else {
        console.warn('Invalid save data, starting fresh');
        initializeGameState();
      }
    }
  } catch (error) {
    console.error('Failed to load game state:', error);
    initializeGameState();
  }
}

function initializeGameState() {
  // Reset to default state
  gameState = {
    numbers: {},
    cooldowns: {
      manual: { active: false, remaining: 0 },
      auto: { active: false, remaining: 0, unlocked: false }
    },
    stats: {
      totalRolls: 0,
      collectedCount: 0,
      currentStreak: 0,
      bestStreak: 0,
      startTime: Date.now(),
      totalPlayTime: 0
    },
    achievements: {}
  };
  
  // Initialize all numbers 1-100
  for (let i = 1; i <= 100; i++) {
    gameState.numbers[i] = { count: 0, level: 0 };
  }
  
  console.log('Game state initialized (fresh start)');
}

// Modal Functions
function showModal(modalId) {
  document.getElementById('modal-overlay').classList.add('active');
  document.getElementById(modalId).classList.add('active');
}

function hideModals() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('active');
  });
}

function showNewGameModal() {
  showModal('new-game-modal');
}

function confirmNewGame() {
  // Reset game state
  initializeGameState();
  gameState.stats.startTime = Date.now();
  
  // Clear achievements
  gameState.achievements = {};
  
  // Update UI and save
  updateUI();
  saveGameState();
  
  hideModals();
  
  // Show notification
  displayNotification('New game started!', 'success');
}

function showImportModal() {
  document.getElementById('import-data').value = '';
  showModal('import-modal');
}

function confirmImport() {
  const importData = document.getElementById('import-data').value.trim();
  
  try {
    const imported = JSON.parse(importData);
    
    // Validate imported data
    if (!imported.numbers || !imported.stats) {
      throw new Error('Invalid save data format');
    }
    
    // Apply imported state
    gameState = imported;
    
    // Ensure all required properties exist
    gameState.stats.bestStreak = gameState.stats.bestStreak || 0;
    gameState.stats.startTime = gameState.stats.startTime || Date.now();
    gameState.stats.totalPlayTime = gameState.stats.totalPlayTime || 0;
    gameState.achievements = gameState.achievements || {};
    
    // Reset cooldowns
    gameState.cooldowns.manual.active = false;
    gameState.cooldowns.manual.remaining = 0;
    gameState.cooldowns.auto.active = false;
    gameState.cooldowns.auto.remaining = 0;
    
    updateUI();
    saveGameState();
    hideModals();
    
    displayNotification('Game imported successfully!', 'success');
  } catch (error) {
    displayNotification('Invalid save data!', 'error');
  }
}

function showExportModal() {
  const exportData = JSON.stringify(gameState, null, 2);
  document.getElementById('export-data').value = exportData;
  showModal('export-modal');
}

function copyExportData() {
  const exportTextarea = document.getElementById('export-data');
  exportTextarea.select();
  document.execCommand('copy');
  
  displayNotification('Copied to clipboard!', 'success');
}

function showAchievementsModal() {
  const achievementsList = document.getElementById('achievements-list');
  achievementsList.innerHTML = '';
  
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    const unlocked = gameState.achievements[achievement.id];
    const item = document.createElement('div');
    item.className = `achievement-item ${unlocked ? 'unlocked' : ''}`;
    
    item.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-info">
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-description">${achievement.description}</div>
        ${unlocked ? `<div class="achievement-date">Unlocked: ${new Date(unlocked).toLocaleDateString()}</div>` : ''}
      </div>
    `;
    
    achievementsList.appendChild(item);
  });
  
  showModal('achievements-modal');
}

function showStatisticsModal() {
  const totalPlayTime = gameState.stats.totalPlayTime + (Date.now() - gameState.stats.startTime);
  const playTimeMinutes = Math.floor(totalPlayTime / 60000);
  const playTimeSeconds = Math.floor((totalPlayTime % 60000) / 1000);
  
  const collectedNumbers = getCollectedNumbers();
  const leveledNumbers = getLeveledNumbers();
  const missingNumbers = getMissingNumbers();
  
  const statsContent = document.getElementById('statistics-content');
  statsContent.innerHTML = `
    <div class="stat-section">
      <h3>General Statistics</h3>
      <div class="stat-grid">
        <div class="stat-item">
          <span class="stat-item-label">Total Rolls:</span>
          <span class="stat-item-value">${gameState.stats.totalRolls}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Numbers Collected:</span>
          <span class="stat-item-value">${gameState.stats.collectedCount}/100</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Current Streak:</span>
          <span class="stat-item-value">${gameState.stats.currentStreak}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Best Streak:</span>
          <span class="stat-item-value">${gameState.stats.bestStreak}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Play Time:</span>
          <span class="stat-item-value">${playTimeMinutes}m ${playTimeSeconds}s</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Current Bias:</span>
          <span class="stat-item-value">${calculateBias().toFixed(1)}%</span>
        </div>
      </div>
    </div>
    
    <div class="stat-section">
      <h3>Level Distribution</h3>
      <div class="stat-grid">
        <div class="stat-item">
          <span class="stat-item-label">Level 0 (Not collected):</span>
          <span class="stat-item-value">${100 - collectedNumbers.length}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Level 1+ Numbers:</span>
          <span class="stat-item-value">${getLeveledNumbers(1).length}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Level 2+ Numbers:</span>
          <span class="stat-item-value">${getLeveledNumbers(2).length}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Level 3+ Numbers:</span>
          <span class="stat-item-value">${getLeveledNumbers(3).length}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Level 4 Numbers:</span>
          <span class="stat-item-value">${getLeveledNumbers(4).length}</span>
        </div>
      </div>
    </div>
    
    <div class="stat-section">
      <h3>Special Numbers</h3>
      <div class="stat-grid">
        <div class="stat-item">
          <span class="stat-item-label">Prime Numbers Collected:</span>
          <span class="stat-item-value">${PRIME_NUMBERS.filter(n => gameState.numbers[n].count > 0).length}/${PRIME_NUMBERS.length}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Fibonacci Numbers Collected:</span>
          <span class="stat-item-value">${FIBONACCI_NUMBERS.filter(n => gameState.numbers[n].count > 0).length}/${FIBONACCI_NUMBERS.length}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Divisible by 5 Collected:</span>
          <span class="stat-item-value">${collectedNumbers.filter(n => isDivisibleBy5(n)).length}/20</span>
        </div>
      </div>
    </div>
    
    <div class="stat-section">
      <h3>Efficiency</h3>
      <div class="stat-grid">
        <div class="stat-item">
          <span class="stat-item-label">Rolls per Number:</span>
          <span class="stat-item-value">${gameState.stats.collectedCount > 0 ? (gameState.stats.totalRolls / gameState.stats.collectedCount).toFixed(1) : '0'}</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Collection Rate:</span>
          <span class="stat-item-value">${gameState.stats.totalRolls > 0 ? ((gameState.stats.collectedCount / gameState.stats.totalRolls) * 100).toFixed(1) : '0'}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-item-label">Cooldown Reduction:</span>
          <span class="stat-item-value">${getCooldownReduction().toFixed(1)}%</span>
        </div>
      </div>
    </div>
  `;
  
  showModal('statistics-modal');
}

// Notification System
function displayNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? 'var(--level-1)' : type === 'error' ? '#dc3545' : 'var(--button-primary)'};
    color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Achievement Checking
function checkAchievements() {
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    if (!gameState.achievements[achievement.id] && achievement.check()) {
      // Unlock achievement
      gameState.achievements[achievement.id] = Date.now();
      
      // Show achievement notification
      displayAchievementNotification(achievement);
      
      // Save state
      saveGameState();
    }
  });
}

function displayAchievementNotification(achievement) {
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  
  notification.innerHTML = `
    <div class="achievement-notification-icon">${achievement.icon}</div>
    <div class="achievement-notification-content">
      <div class="achievement-notification-title">Achievement Unlocked!</div>
      <div class="achievement-notification-name">${achievement.name}</div>
    </div>
  `;
  
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, var(--level-3), var(--level-4));
    color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 2000;
    animation: achievementSlideIn 0.5s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'achievementSlideOut 0.5s ease forwards';
    setTimeout(() => notification.remove(), 500);
  }, 4000);
}

// Add achievement animations to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  @keyframes achievementSlideIn {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes achievementSlideOut {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(100%); opacity: 0; }
  }
  
  .achievement-notification-icon { font-size: 2rem; }
  .achievement-notification-title { font-size: 0.9rem; opacity: 0.8; }
  .achievement-notification-name { font-size: 1.1rem; font-weight: bold; }
`;
document.head.appendChild(style);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initGame);