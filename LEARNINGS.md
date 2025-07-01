# LEARNINGS.md

## Phase 2: Game State und Datenverwaltung

### Key Technical Decisions

1. **State Initialization Order**: 
   - Problem: Initial implementation called `initializeGameState()` before `loadGameState()`, which caused the fresh state to overwrite saved data
   - Solution: Check for existing localStorage data first, only initialize fresh state if no save exists
   - This prevents data loss on page refresh

2. **State Structure Design**:
   - Used nested object structure for game state with clear separation of concerns:
     - `numbers`: Individual number tracking (count, level)
     - `cooldowns`: Timing state management 
     - `stats`: Game-wide statistics
   - This structure allows for easy extension and partial updates

3. **LocalStorage Persistence**:
   - Implemented defensive loading with validation to handle corrupted saves
   - Reset active cooldowns on load to prevent stuck states
   - Deep merge strategy preserves data integrity while allowing for schema evolution

### Utility Functions Created

1. **updateNumber()**: Centralized number update logic with automatic level calculation
2. **getNumberLevel()**: Pure function for level determination based on count thresholds
3. **calculateLevelProgress()**: Provides detailed progress information for UI
4. **getSpecialNumberBonus()**: Calculates multipliers for prime/fibonacci numbers
5. **getCooldownReduction()**: Computes total cooldown reduction from various sources

### Performance Considerations

- State saves are triggered after each roll (could be debounced in future if needed)
- Grid updates only modify changed cells rather than recreating entire grid
- Cooldown timers run at 100ms intervals for smooth UI updates

### Common Pitfalls

1. **State Overwriting**: Always check if saved state exists before initializing fresh state
2. **Cooldown Persistence**: Active cooldowns should be reset on page load to prevent stuck states
3. **Deep Object Merging**: Use proper deep merge for nested state objects to preserve all data

### Testing Insights

- Puppeteer testing revealed the state persistence bug immediately
- Console logging is essential for debugging state management issues
- Visual verification through screenshots helps confirm UI state matches data state

### Future Improvements

- Consider implementing state versioning for migration support
- Add state validation/sanitization for security
- Implement export/import functionality for game saves
- Add compression for localStorage to handle larger save states