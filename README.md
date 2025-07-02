# Number Collection Game

A browser-based number collection game where players collect and level up numbers from 1-100 through strategic dice rolling. Features an innovative bias system that increases your chances of rolling missing numbers as you progress.

🎮 **[Play the Game](https://byte55.github.io/number-gather/)**

## Game Overview

The goal is simple: collect all 100 numbers by rolling dice. But the strategy runs deep! As you collect numbers and level them up, you build "bias" that helps you roll the numbers you're still missing.

### Key Features

✨ **Innovative Bias System** - Higher level numbers increase your chances of rolling missing numbers
🎯 **Strategic Leveling** - Collect the same number multiple times to level it up and increase bias
⚡ **Dual Rolling System** - Manual rolls (3s cooldown) and auto-roll (8s cooldown, unlocked at 10 numbers)
🌟 **Special Numbers** - Prime numbers, Fibonacci numbers, and numbers divisible by 5 have unique properties
📊 **Rich Statistics** - Track your progress with detailed stats and achievements
🏆 **Achievement System** - 10 different achievements to unlock
💾 **Save/Load** - Your progress is automatically saved and can be exported/imported
🎨 **Adaptive Theming** - Automatically follows your system's dark/light mode preference

## How to Play

### Basic Gameplay
1. **Roll the Dice** - Click "Roll Dice" to get a random number from 1-100
2. **Collect Numbers** - Each roll adds to your collection or levels up existing numbers
3. **Build Bias** - Higher level numbers help you roll missing numbers more often
4. **Complete the Set** - Collect all 100 numbers to win!

### Number Levels
- **White (0x)**: Not collected yet
- **Green (1x)**: Collected once - +0.8% bias
- **Blue (10x)**: Level 1 - +2.0% bias  
- **Purple (25x)**: Level 2 - +4.5% bias
- **Orange (50x)**: Level 3 - +8.0% bias
- **Max (100x)**: Level 4 - +8.0% bias + special glow

### Special Numbers
- **Prime Numbers** (★): 1.5x bias multiplier
- **Fibonacci Numbers** (◆): 1.2x bias multiplier  
- **Divisible by 5**: Reduces cooldown by 2% per number (when Level 1+)

### Rolling Modes
- **Manual Roll**: 3-second cooldown, available immediately
- **Auto Roll**: 8-second cooldown, unlocks after collecting 10 numbers

## Game Mechanics

### Bias System
The bias system is the heart of the game's strategy:
- Each leveled number contributes bias points
- Special number properties multiply the bias contribution
- Bias determines the chance of rolling from your "missing numbers" pool
- Maximum bias is capped at 85% for game balance

### Cooldown Reduction
Numbers divisible by 5 (5, 10, 15, etc.) provide cooldown reduction:
- Each Level 1+ number divisible by 5 reduces cooldowns by 2%
- Stacks up to a maximum of 85% reduction
- Applies to both manual and auto-roll cooldowns

### Achievement System
Unlock 10 different achievements by:
- Reaching collection milestones
- Achieving high bias percentages
- Collecting all special numbers
- Demonstrating persistence and skill

## Features

### Quality of Life
- **Hover Tooltips**: Detailed information about each number
- **Progress Tracking**: Visual progress bar and milestone notifications  
- **Keyboard Shortcuts**: Space/Enter for manual roll, 'A' for auto-roll toggle
- **Animations**: Smooth animations for rolls, level-ups, and achievements
- **Statistics**: Comprehensive stats tracking your play session

### Advanced Features
- **Save Data Management**: Export/import your game saves
- **Reset Option**: Start fresh with confirmation dialog
- **Performance Optimized**: Smooth gameplay even with frequent updates
- **Mobile Friendly**: Responsive design works on all devices
- **Accessibility**: Keyboard navigation and clear visual feedback

## Technical Details

### Technologies Used
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser LocalStorage for persistence
- **Styling**: CSS Custom Properties with automatic dark/light theme
- **Build**: No build process required - pure client-side implementation

### Browser Compatibility
- Modern browsers with ES6+ support
- LocalStorage support required for save/load functionality
- CSS Grid and Flexbox support recommended

### Performance
- Optimized DOM updates with requestAnimationFrame
- Debounced LocalStorage saves (1-second delay)
- Efficient event handling and memory management
- Tested for smooth performance up to 1000+ rolls

## Development

### Project Structure
```
number-gather/
├── index.html          # Main game file
├── src/
│   ├── css/
│   │   └── styles.css  # All styling with theme support
│   └── js/
│       └── game.js     # Complete game logic
├── README.md           # This file
├── CLAUDE.md          # Development guidance
├── LEARNINGS.md       # Technical documentation
└── TODO.md            # Task tracking
```

### Running Locally
1. Clone the repository
2. Open `index.html` in any modern web browser
3. No build process or dependencies required!

### Contributing
This project was developed as a learning exercise. Feel free to fork and experiment with your own variations!

## Game Statistics

The game tracks comprehensive statistics including:
- **General**: Total rolls, best streak, play time
- **Progress**: Collection rate, numbers per level
- **Efficiency**: Rolls per new number, collection percentage
- **Special Numbers**: Prime, Fibonacci, and divisible-by-5 tracking

## Achievements List

1. **First Steps** 🎯 - Collect your first 10 numbers
2. **Halfway There** 🌟 - Collect 50 numbers  
3. **Completionist** 👑 - Collect all 100 numbers
4. **Speed Runner** ⚡ - Complete the game in under 10 minutes
5. **Lucky Streak** 🍀 - Roll 10 new numbers in a row
6. **Prime Master** 🔢 - Collect all prime numbers
7. **Fibonacci Master** 🌀 - Collect all Fibonacci numbers
8. **Level Master** 🔥 - Get any number to level 4
9. **Bias Builder** 📈 - Reach 50% bias
10. **Persistent Player** 🎲 - Roll the dice 1000 times

## Tips & Strategy

### Early Game (0-30 numbers)
- Focus on manual rolling to build your initial collection
- Don't worry about leveling specific numbers yet
- Try to unlock auto-roll as quickly as possible

### Mid Game (30-70 numbers)  
- Start leveling numbers divisible by 5 for cooldown reduction
- Focus on prime and Fibonacci numbers for better bias multipliers
- Use both manual and auto-roll efficiently

### End Game (70-100 numbers)
- Strategic leveling becomes crucial
- High bias is needed to find the last missing numbers
- Consider which numbers to level for maximum bias benefit

## License

MIT License - Feel free to use and modify as you wish!

---

*Built with ❤️ using vanilla web technologies*