# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser-based "Number Collection Game" where players collect and level up numbers from 1-100 through dice rolls. The game runs entirely in the browser using vanilla web technologies with no external dependencies.

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

1. **Number Collection**: Roll dice (1-100) to collect numbers
2. **Leveling System**: 
   - 1x = Collected (White)
   - 10x = Level 1 (Green) - +0.8% bias
   - 25x = Level 2 (Blue) - +2.0% bias
   - 50x = Level 3 (Purple) - +4.5% bias
   - 100x = Level 4 (Orange) - +8.0% bias
3. **Bias System**: Higher level numbers increase chances of rolling missing numbers (soft-cap at 85%)
4. **Dual Cooldown System**: 
   - Manual rolls: 3s base cooldown
   - Auto rolls: 8s base cooldown (unlocked at 10 collected numbers)
   - Both run in parallel

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
- **Hover Information**: Shows roll count, progress to next level, and special properties

### Special Number Properties

- **Divisible by 5**: -2% cooldown reduction per number (Level 1+)
- **Prime Numbers**: 1.5x multiplier on bias calculation
- **Fibonacci Numbers**: 1.2x multiplier on bias calculation

### Bias Calculation System

```
Bias-Stärke = Σ(Level-Boni) + Spezial-Boni + Milestone-Multiplier
```

Target selection:
- Bias chance: Roll from missing numbers pool
- Remaining chance: Completely random (1-100)
- High bias (>50%): Additional "Near-Missing" pool (±3 around missing numbers)

### Cooldown Reduction Formula

```
Gesamtreduktion = (Durch-5-teilbar × 5%) + (Level-Summe × 1%) + Prestige-Boni
Maximum: 85% Reduktion
```

## Performance Considerations

- Grid updates should only occur when state changes
- Cooldown timers run at 100ms intervals
- LocalStorage saves should be debounced to avoid excessive writes
- DOM manipulation should be batched where possible

## Testing with Puppeteer MCP

When implementing new features, always test them using the Puppeteer MCP tool to ensure:
- No JavaScript console errors occur
- All functionality works correctly as expected
- UI elements render and behave properly

**Game URL for testing**: `http://localhost:63342/number-gather/index.html`

Use the following Puppeteer MCP commands to verify:
1. Navigate to the game URL
2. Take screenshots before and after feature implementation
3. Check for console errors using `puppeteer_evaluate`
4. Test user interactions (clicks, form fills) to ensure proper functionality

## Game Progression Phases

- **Early Game (0-30 numbers)**: Low bias, almost all rolls are new numbers
- **Mid Game (30-70 numbers)**: Auto-roll unlocked, special number bonuses become important
- **End Game (70-100 numbers)**: High bias needed for last numbers, strategic leveling critical
- **Completion (100/100)**: Focus on maximum leveling and achievement hunting