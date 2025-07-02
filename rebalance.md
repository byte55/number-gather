# Game Balance Analysis & Rebalancing Plan

## Problem Analysis

Bei 93/100 completion berichtet der Spieler von minimalen Cooldown-Boni und keinen Bias-Änderungen. Nach Analyse der aktuellen Implementierung wurden folgende Balance-Probleme identifiziert:

### 1. Bias Calculation Issues (calculateBias - line 450)

**Aktuelle Level-Boni sind zu schwach für Endgame:**
- Level 1: 0.8% (zu niedrig)
- Level 2: 2.0% (zu niedrig) 
- Level 3: 4.5% (ok)
- Level 4: 8.0% (zu niedrig für max level)

**Problem:** Bei 93/100 completion mit wenigen Level 1+ Zahlen ergibt sich praktisch kein Bias. Beispiel:
- 10 Level 1 Zahlen = 10 × 0.8% = 8% Bias
- Das ist viel zu wenig für Endgame-Progression

### 2. Cooldown Reduction Issues (getCooldownReduction - line 767)

**Aktuelle Boni sind zu schwach:**
- Divisible by 5: nur 2% pro Zahl (line 772)
- Level sum: nur 1% pro Level (line 779)

**Problem:** Bei 93/100 completion:
- Max ~4 divisible-by-5 Zahlen auf Level 1+ = 8% Reduktion
- Level sum von ~15 = 15% Reduktion  
- Gesamt: ~23% Reduktion - viel zu wenig für spätes Spiel

### 3. Target Selection Problems (selectBiasedTarget - line 422)

**Near-Missing Pool ist kontraproduktiv:**
- Aktiviert sich bei >50% Bias (line 431)
- ±3 Range um fehlende Zahlen (line 410)
- **Problem:** Bei 7 fehlenden Zahlen wird der Pool mit bereits gesammelten Zahlen verdünnt

### 4. Fehlende Endgame-Mechaniken

- Keine Completion-Percentage-Boni
- Keine Milestone-basierte Boosts
- Keine speziellen Endgame-Modi für letzte Zahlen

## Rebalancing Plan

### Phase 1: Fix Bias Calculation

**Neue Level-Boni (deutlich erhöht):**
```javascript
case 1: levelBonus = 1.2; // war 0.8
case 2: levelBonus = 3.5; // war 2.0  
case 3: levelBonus = 8.0; // war 4.5
case 4: levelBonus = 15.0; // war 8.0
```

**Endgame-Multiplier hinzufügen:**
```javascript
// Completion percentage bonus
const completionPercent = gameState.stats.collectedCount / 100;
let endgameMultiplier = 1.0;

if (completionPercent >= 0.90) {
  endgameMultiplier = 2.0; // Double bias for 90%+
} else if (completionPercent >= 0.80) {
  endgameMultiplier = 1.5; // 1.5x bias for 80%+
}

totalBias *= endgameMultiplier;
```

**Milestone-Boni:**
- 95% completion: +10% flat bonus
- 98% completion: +20% flat bonus  
- 99% completion: +30% flat bonus

### Phase 2: Improve Cooldown Reduction

**Erhöhte Boni:**
```javascript
// Divisible by 5: 5% statt 2%
reduction += divisibleBy5.length * 5;

// Level sum: 2% statt 1%  
reduction += levelSum * 2;

// Completion percentage bonus
const completionBonus = Math.floor(completionPercent * 100 * 0.5); // 0.5% per percent
reduction += completionBonus;
```

**Endgame-Cooldown-Boni:**
- 90%+ completion: +15% Reduktion
- 95%+ completion: +25% Reduktion
- 99%+ completion: +35% Reduktion

### Phase 3: Optimize Target Selection

**Near-Missing Pool Optimierung:**
```javascript
// Nur aktivieren wenn weniger als 10 fehlende Zahlen
if (biasPercentage > 50 && missingNumbers.length < 10) {
  // Reduziere Range von ±3 auf ±1 für besseres Targeting
  for (let offset = -1; offset <= 1; offset++) {
    // ...
  }
}

// Pure Bias Mode für finale 5 Zahlen
if (missingNumbers.length <= 5) {
  // 100% Bias nur auf fehlende Zahlen, kein Near-Missing Pool
  return missingNumbers[Math.floor(Math.random() * missingNumbers.length)];
}
```

### Phase 4: Add Endgame Mechanics

**"Last Stand" Modus (letzte 10 Zahlen):**
- Spezielle UI-Indikation
- Erhöhte Bias-Multiplikatoren
- Streak-Boni für aufeinanderfolgende fehlende Zahlen

**Completion Streak System:**
```javascript
// Streak-Bonus für aufeinanderfolgende fehlende Zahlen
let streakMultiplier = 1.0;
if (gameState.stats.currentStreak >= 5 && missingNumbers.length <= 20) {
  streakMultiplier = 1.5;
}
```

**Milestone-basierte Bias Boosts:**
- 95% completion: Alle Level-Boni × 1.5
- 98% completion: Alle Level-Boni × 2.0  
- 99% completion: Alle Level-Boni × 3.0

### Phase 5: Mathematical Verification

**Beispiel-Berechnung für 93/100 completion:**

*Alte Formel:*
- 15 Level 1 Zahlen: 15 × 0.8% = 12%
- 5 Level 2 Zahlen: 5 × 2.0% = 10%
- Gesamt: 22% Bias

*Neue Formel:*
- 15 Level 1 Zahlen: 15 × 1.2% = 18%
- 5 Level 2 Zahlen: 5 × 3.5% = 17.5%
- Subtotal: 35.5%
- Endgame-Multiplier (93% completion): ×2.0 = 71%
- **Ergebnis: 71% Bias** (vs. 22% vorher)

**Cooldown-Berechnung Beispiel:**
- 4 divisible-by-5 Level 1+: 4 × 5% = 20%
- Level sum 25: 25 × 2% = 50%
- Completion bonus (93%): 93 × 0.5% = 46.5%
- Endgame bonus (90%+): +15%
- **Gesamt: 85% Reduktion** (Maximum erreicht)

## Implementation Priority

1. **Kritisch:** Bias calculation (calculateBias Funktion)
2. **Kritisch:** Cooldown reduction (getCooldownReduction Funktion)  
3. **Hoch:** Target selection optimization (selectBiasedTarget Funktion)
4. **Medium:** Endgame mechanics und UI improvements
5. **Test:** Puppeteer testing zur Verifikation

## Testing Strategy

**Testszenarien:**
1. Fresh game (0-30 numbers): Bias sollte niedrig bleiben
2. Mid game (30-70 numbers): Moderate Bias-Steigerung
3. Late game (70-90 numbers): Deutliche Bias-Erhöhung
4. Endgame (90-100 numbers): Sehr hoher Bias für finale Zahlen

**Performance-Indikatoren:**
- Durchschnittliche Rolls pro fehlender Zahl bei verschiedenen Completion-Levels
- Cooldown-Reduktion sollte fühlbar werden ab ~50% completion
- Endgame (95%+) sollte deutlich schneller sein als vorher

**Debug-Output hinzufügen:**
```javascript
console.log(`Bias Details: Base=${baseBias.toFixed(1)}%, Multiplier=${multiplier}x, Final=${finalBias.toFixed(1)}%`);
console.log(`Cooldown: Base=${baseReduction}%, Completion=${completionBonus}%, Endgame=${endgameBonus}%`);
```

## Expected Impact

Mit diesen Änderungen sollte ein Spieler bei 93/100 completion:
- **Bias:** 60-80% statt ~20%
- **Cooldown Reduction:** 80-85% statt ~20%
- **Subjektives Gefühl:** Deutlich spürbare Progression und schnellere finale Zahlen

Die Änderungen bewahren das Early/Mid-Game Gefühl, während sie das Endgame erheblich verbessern.