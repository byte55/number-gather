# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser-based "Number Collection Game" where players collect and level up numbers from 1-100 through dice rolls. The game is designed to run entirely in the browser using vanilla web technologies.

## Technology Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript (no frameworks)
- **Storage**: Browser LocalStorage for game state persistence
- **Build Tools**: None required - pure client-side implementation
- **Dependencies**: None - completely self-contained

## Development Commands

Since this is a vanilla JavaScript project, there are no build, test, or lint commands. Development workflow:

1. **Running the game**: Open `index.html` directly in a web browser
2. **Testing changes**: Refresh the browser (F5 or Cmd+R)
3. **Debugging**: Use browser developer tools (F12)

## Architecture Overview

### Game State Structure
The game maintains state in a JavaScript object that is persisted to LocalStorage:
```javascript
gameState = {
  numbers: {
    1: { count: 15, level: 1 },
    2: { count: 3, level: 0 },
    // ... for all 100 numbers
  },
  cooldowns: {
    manual: { active: false, remaining: 0 },
    auto: { active: false, remaining: 0, unlocked: false }
  },
  stats: {
    totalRolls: 0,
    collectedCount: 0,
    currentStreak: 0
  }
}
```

### Core Game Mechanics

1. **Number Collection**: Players roll dice (1-100) to collect numbers
2. **Leveling System**: Numbers level up with repeated rolls (10x, 25x, 50x, 100x)
3. **Bias System**: Higher level numbers increase chances of rolling missing numbers
4. **Dual Cooldown System**: Manual rolls (3s base) and automatic rolls (8s base, unlocked at 10 numbers)

### Key Functions to Implement

- `performRoll()` - Main dice roll logic with bias calculation
- `calculateBias()` - Computes current bias strength based on leveled numbers
- `updateCooldowns()` - Manages parallel cooldown timers
- `saveGameState()` / `loadGameState()` - LocalStorage persistence
- `updateGrid()` - Updates the 10x10 number grid UI
- `processRollResult()` - Handles roll results and state updates

### UI Components

- **10x10 Grid**: Visual representation of all 100 numbers with color-coded levels
- **Roll Interface**: Manual roll button and auto-roll status indicator
- **Statistics Display**: Current bias, collected count, and progress tracking

### Special Number Properties

- **Divisible by 5**: -2% cooldown reduction per number (Level 1+)
- **Prime Numbers**: 1.5x multiplier on bias calculation
- **Fibonacci Numbers**: 1.2x multiplier on bias calculation

## Performance Considerations

- Grid updates should only occur when state changes
- Cooldown timers run at 100ms intervals
- LocalStorage saves should be debounced to avoid excessive writes
- DOM manipulation should be batched where possible