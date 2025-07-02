#!/usr/bin/env node

/**
 * Balance Simulation Script
 * 
 * Simuliert mehrere komplette Spielsessions headless um die Game Balance zu analysieren.
 * Nutzt die originale Game Logic ohne DOM/UI Dependencies.
 */

// Mock DOM elements für die Game Logic
global.document = {
  getElementById: () => ({ textContent: '', style: {}, classList: { add: () => {}, remove: () => {} } }),
  createElement: () => ({ style: {}, classList: { add: () => {}, remove: () => {} } }),
  addEventListener: () => {},
  querySelectorAll: () => [],
  head: { appendChild: () => {} },
  body: { appendChild: () => {} }
};

global.window = {
  innerWidth: 1920,
  innerHeight: 1080,
  addEventListener: () => {}
};

global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

global.requestAnimationFrame = (cb) => setTimeout(cb, 16);

// Console override für weniger Spam
const originalConsoleLog = console.log;
console.log = () => {}; // Disable game logs during simulation

// Import game constants and functions (we'll copy the essential parts)
const PRIME_NUMBERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const FIBONACCI_NUMBERS = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

/**
 * Game Simulator Class
 * Führt eine komplette Spielsession durch und sammelt Statistiken
 */
class GameSimulator {
  constructor(speedMultiplier = 1000) {
    this.speedMultiplier = speedMultiplier;
    this.initializeGameState();
    this.stats = {
      rollsByCompletion: {}, // rolls needed to reach each completion %
      biasProgression: [],   // bias values at different completion levels
      cooldownProgression: [], // cooldown reduction at different completion levels
      finalStats: null
    };
  }

  initializeGameState() {
    this.gameState = {
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
      this.gameState.numbers[i] = { count: 0, level: 0 };
    }
  }

  // Copy essential game functions
  isPrime(num) {
    return PRIME_NUMBERS.includes(num);
  }

  isFibonacci(num) {
    return FIBONACCI_NUMBERS.includes(num);
  }

  isDivisibleBy5(num) {
    return num % 5 === 0;
  }

  getMissingNumbers() {
    const missing = [];
    for (let i = 1; i <= 100; i++) {
      if (this.gameState.numbers[i].count === 0) {
        missing.push(i);
      }
    }
    return missing;
  }

  getNumberLevel(count) {
    if (count >= 100) return 4;
    if (count >= 50) return 3;
    if (count >= 25) return 2;
    if (count >= 10) return 1;
    return 0;
  }

  updateNumber(num, increment = 1) {
    const numberData = this.gameState.numbers[num];
    const oldLevel = numberData.level;
    
    numberData.count += increment;
    numberData.level = this.getNumberLevel(numberData.count);
    
    return numberData;
  }

  calculateBias() {
    let totalBias = 0;
    
    for (let i = 1; i <= 100; i++) {
      const number = this.gameState.numbers[i];
      if (number.level > 0) {
        let levelBonus = 0;
        switch (number.level) {
          case 1: levelBonus = 0.8; break;
          case 2: levelBonus = 2.0; break;
          case 3: levelBonus = 4.5; break;
          case 4: levelBonus = 8.0; break;
        }
        
        // Apply special number multipliers
        if (this.isPrime(i)) {
          levelBonus *= 1.5;
        }
        if (this.isFibonacci(i)) {
          levelBonus *= 1.2;
        }
        
        totalBias += levelBonus;
      }
    }
    
    // Cap at 85%
    return Math.min(totalBias, 85);
  }

  getLeveledNumbers(minLevel = 1) {
    return Object.keys(this.gameState.numbers)
      .filter(num => this.gameState.numbers[num].level >= minLevel)
      .map(Number);
  }

  getCooldownReduction() {
    let reduction = 0;
    
    // Divisible by 5 bonus (only level 1+ numbers)
    const divisibleBy5 = this.getLeveledNumbers(1).filter(n => this.isDivisibleBy5(n));
    reduction += divisibleBy5.length * 2; // 2% per number
    
    // Level sum bonus
    let levelSum = 0;
    for (let i = 1; i <= 100; i++) {
      levelSum += this.gameState.numbers[i].level;
    }
    reduction += levelSum * 1; // 1% per total level
    
    // Cap at 85%
    return Math.min(reduction, 85);
  }

  getNearMissingPool() {
    const missingNumbers = this.getMissingNumbers();
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

  selectBiasedTarget(biasPercentage) {
    const missingNumbers = this.getMissingNumbers();
    
    // No missing numbers, return null
    if (missingNumbers.length === 0) {
      return null;
    }
    
    // High bias (>50%): Use near-missing pool
    if (biasPercentage > 50) {
      const nearMissingPool = this.getNearMissingPool();
      if (nearMissingPool.length > 0) {
        return nearMissingPool[Math.floor(Math.random() * nearMissingPool.length)];
      }
    }
    
    // Normal bias: Select from missing numbers only
    return missingNumbers[Math.floor(Math.random() * missingNumbers.length)];
  }

  rollWithBias(biasPercentage) {
    const random = Math.random() * 100;
    
    if (random < biasPercentage) {
      // Use bias to select from missing numbers
      const target = this.selectBiasedTarget(biasPercentage);
      if (target !== null) {
        return target;
      }
    }
    
    // Regular random roll (1-100)
    return Math.floor(Math.random() * 100) + 1;
  }

  performRoll() {
    // Calculate current bias
    const bias = this.calculateBias();
    
    // Generate random number between 1-100
    const roll = this.rollWithBias(bias);
    
    // Process the result
    const wasNew = this.gameState.numbers[roll].count === 0;
    const oldCollectedCount = this.gameState.stats.collectedCount;
    
    this.updateNumber(roll, 1);
    this.gameState.stats.totalRolls++;
    
    // Update collected count and streak if new
    if (wasNew) {
      this.gameState.stats.collectedCount++;
      this.gameState.stats.currentStreak++;
      
      if (this.gameState.stats.currentStreak > this.gameState.stats.bestStreak) {
        this.gameState.stats.bestStreak = this.gameState.stats.currentStreak;
      }
    } else {
      this.gameState.stats.currentStreak = 0;
    }
    
    return { roll, wasNew, bias };
  }

  recordProgress() {
    const completionPercent = this.gameState.stats.collectedCount;
    const bias = this.calculateBias();
    const cooldownReduction = this.getCooldownReduction();
    
    // Record at milestone percentages
    if ([10, 20, 30, 40, 50, 60, 70, 80, 85, 90, 93, 95, 97, 98, 99, 100].includes(completionPercent)) {
      this.stats.rollsByCompletion[completionPercent] = this.gameState.stats.totalRolls;
      this.stats.biasProgression.push({
        completion: completionPercent,
        bias: bias,
        cooldownReduction: cooldownReduction,
        rolls: this.gameState.stats.totalRolls
      });
    }
  }

  async runSimulation() {
    let lastProgress = 0;
    
    while (this.gameState.stats.collectedCount < 100) {
      const result = this.performRoll();
      
      // Record progress at milestones
      this.recordProgress();
      
      // Show progress
      const currentProgress = this.gameState.stats.collectedCount;
      if (currentProgress > lastProgress && currentProgress % 10 === 0) {
        console.log = originalConsoleLog;
        console.log(`   📊 ${currentProgress}/100 (${result.bias.toFixed(1)}% bias, ${this.gameState.stats.totalRolls} rolls)`);
        console.log = () => {};
        lastProgress = currentProgress;
      }
      
      // Speed simulation
      if (this.gameState.stats.totalRolls % this.speedMultiplier === 0) {
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
    
    this.stats.finalStats = {
      totalRolls: this.gameState.stats.totalRolls,
      finalBias: this.calculateBias(),
      finalCooldownReduction: this.getCooldownReduction(),
      completionTime: Date.now() - this.gameState.stats.startTime
    };
    
    console.log = () => {}; // Disable again
    return this.stats;
  }
}

/**
 * Balance Analyzer
 * Führt mehrere Simulationen durch und analysiert die Ergebnisse
 */
class BalanceAnalyzer {
  constructor(numSimulations = 10, speedMultiplier = 1000) {
    this.numSimulations = numSimulations;
    this.speedMultiplier = speedMultiplier;
    this.results = [];
  }

  async runAnalysis() {
    console.log = originalConsoleLog;
    console.log(`🔬 Starting balance analysis with ${this.numSimulations} simulations...\n`);
    
    for (let i = 0; i < this.numSimulations; i++) {
      console.log(`🎮 Running simulation ${i + 1}/${this.numSimulations}`);
      
      const simulator = new GameSimulator(this.speedMultiplier);
      const result = await simulator.runSimulation();
      this.results.push(result);
      
      console.log(`   ✅ Completed in ${result.finalStats.totalRolls} rolls (${result.finalStats.finalBias.toFixed(1)}% final bias)\n`);
    }
    
    this.analyzeResults();
  }

  analyzeResults() {
    console.log('📈 BALANCE ANALYSIS RESULTS');
    console.log('=' .repeat(50));
    
    // Calculate averages
    const avgTotalRolls = this.results.reduce((sum, r) => sum + r.finalStats.totalRolls, 0) / this.results.length;
    const avgFinalBias = this.results.reduce((sum, r) => sum + r.finalStats.finalBias, 0) / this.results.length;
    const avgFinalCooldown = this.results.reduce((sum, r) => sum + r.finalStats.finalCooldownReduction, 0) / this.results.length;
    
    console.log(`\n🎯 OVERALL STATISTICS (${this.results.length} simulations):`);
    console.log(`   Average total rolls: ${Math.round(avgTotalRolls)}`);
    console.log(`   Average final bias: ${avgFinalBias.toFixed(1)}%`);
    console.log(`   Average final cooldown reduction: ${avgFinalCooldown.toFixed(1)}%`);
    
    // Analyze progression at key milestones
    console.log('\n📊 PROGRESSION ANALYSIS:');
    const milestones = [50, 70, 80, 90, 93, 95, 97, 98, 99];
    
    milestones.forEach(milestone => {
      const data = this.results
        .map(r => r.biasProgression.find(p => p.completion === milestone))
        .filter(Boolean);
      
      if (data.length > 0) {
        const avgRolls = data.reduce((sum, d) => sum + d.rolls, 0) / data.length;
        const avgBias = data.reduce((sum, d) => sum + d.bias, 0) / data.length;
        const avgCooldown = data.reduce((sum, d) => sum + d.cooldownReduction, 0) / data.length;
        
        console.log(`   ${milestone}% completion: ${Math.round(avgRolls)} rolls, ${avgBias.toFixed(1)}% bias, ${avgCooldown.toFixed(1)}% cooldown reduction`);
      }
    });
    
    // Analyze rolls needed for last numbers
    console.log('\n🎯 ENDGAME DIFFICULTY:');
    const endgameAnalysis = {};
    
    [95, 97, 98, 99, 100].forEach(target => {
      const rollsData = this.results
        .map(r => {
          const targetData = r.rollsByCompletion[target];
          const prevData = r.rollsByCompletion[target - 1] || 0;
          return targetData ? targetData - prevData : null;
        })
        .filter(r => r !== null);
      
      if (rollsData.length > 0) {
        const avg = rollsData.reduce((sum, r) => sum + r, 0) / rollsData.length;
        const min = Math.min(...rollsData);
        const max = Math.max(...rollsData);
        
        endgameAnalysis[target] = { avg: Math.round(avg), min, max };
        console.log(`   ${target-1}% → ${target}%: avg ${Math.round(avg)} rolls (range: ${min}-${max})`);
      }
    });
    
    // Balance Assessment
    console.log('\n⚖️  BALANCE ASSESSMENT:');
    
    const endgameBias = this.results
      .map(r => r.biasProgression.find(p => p.completion === 93))
      .filter(Boolean)
      .reduce((sum, d) => sum + d.bias, 0) / this.results.length;
    
    const endgameCooldown = this.results
      .map(r => r.biasProgression.find(p => p.completion === 93))
      .filter(Boolean)
      .reduce((sum, d) => sum + d.cooldownReduction, 0) / this.results.length;
    
    console.log(`   At 93% completion (reported problem point):`);
    console.log(`   - Average bias: ${endgameBias.toFixed(1)}% ${endgameBias < 30 ? '❌ TOO LOW' : endgameBias < 50 ? '⚠️  LOW' : '✅ OK'}`);
    console.log(`   - Average cooldown reduction: ${endgameCooldown.toFixed(1)}% ${endgameCooldown < 30 ? '❌ TOO LOW' : endgameCooldown < 50 ? '⚠️  LOW' : '✅ OK'}`);
    
    if (endgameAnalysis[99] && endgameAnalysis[100]) {
      const finalStretch = (endgameAnalysis[99].avg + endgameAnalysis[100].avg) / 2;
      console.log(`   - Final numbers difficulty: ${finalStretch} avg rolls per number ${finalStretch > 50 ? '❌ TOO HARD' : finalStretch > 25 ? '⚠️  HARD' : '✅ OK'}`);
    }
    
    console.log('\n🔧 RECOMMENDATIONS:');
    if (endgameBias < 50) {
      console.log('   - Increase bias calculation for endgame (especially level bonuses)');
    }
    if (endgameCooldown < 50) {
      console.log('   - Increase cooldown reduction bonuses');
    }
    if (avgTotalRolls > 1000) {
      console.log('   - Game takes too long on average, consider balance improvements');
    }
    
    console.log('\n📝 Raw data saved to balance-results.json');
    
    // Save detailed results
    require('fs').writeFileSync('balance-results.json', JSON.stringify({
      summary: {
        simulations: this.results.length,
        avgTotalRolls: Math.round(avgTotalRolls),
        avgFinalBias: Number(avgFinalBias.toFixed(1)),
        avgFinalCooldown: Number(avgFinalCooldown.toFixed(1)),
        endgameAnalysis
      },
      detailedResults: this.results
    }, null, 2));
  }
}

// Run the analysis
async function main() {
  const args = process.argv.slice(2);
  const numSimulations = parseInt(args[0]) || 5;
  const speedMultiplier = parseInt(args[1]) || 1000;
  
  const analyzer = new BalanceAnalyzer(numSimulations, speedMultiplier);
  await analyzer.runAnalysis();
}

if (require.main === module) {
  main().catch(console.error);
}