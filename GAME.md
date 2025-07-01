# Number Collection Game

## Spielkonzept

**Ziel:** Alle Zahlen von 1-100 sammeln und leveln

**Grundmechanik:**
- Spieler würfelt zufällige Zahlen (1-100)
- Erste Sammlung einer Zahl = "erledigt"
- Weitere Würfe derselben Zahl = Level-Progress

## Level-System

| Anzahl Würfe | Level | Farbe | Effekt |
|--------------|--------|-------|---------|
| 1x | Gesammelt | Weiß | Zahl freigeschaltet |
| 10x | Level 1 | Grün | +0.8% Bias auf fehlende Zahlen |
| 25x | Level 2 | Blau | +2.0% Bias auf fehlende Zahlen |
| 50x | Level 3 | Lila | +4.5% Bias auf fehlende Zahlen |
| 100x | Level 4 | Orange | +8.0% Bias auf fehlende Zahlen |

## Würfel-System

### Bias-Berechnung
```
Bias-Stärke = Σ(Level-Boni) + Spezial-Boni + Milestone-Multiplier
Soft-Cap bei 85%
```

### Spezielle Zahlen-Boni
- **Durch 5 teilbar:** -2% Cooldown pro Zahl (Level 1+)
- **Primzahlen:** +1.5x Multiplier auf Bias-Berechnung
- **Fibonacci-Zahlen:** +1.2x Multiplier auf Bias-Berechnung

### Zielauswahl
- Bias-Chance: Würfel aus fehlenden Zahlen
- Restliche Chance: Komplett zufällig (1-100)
- Bei hohem Bias (>50%): Zusätzlicher "Near-Missing" Pool (±3 um fehlende Zahlen)

## Cooldown-System

### Manueller Wurf
- **Base Cooldown:** 3 Sekunden
- **Reduktion:** Durch Level-Boni und spezielle Zahlen
- **Minimum:** 15% der Base-Zeit

### Automatischer Wurf
- **Base Cooldown:** 8 Sekunden
- **Freischaltung:** Bei 10 gesammelten Zahlen
- **Läuft parallel** zum manuellen Cooldown
- **Upgradens:** Durch Achievements und Milestones

### Cooldown-Reduktion
```
Gesamtreduktion = (Durch-5-teilbar × 5%) + (Level-Summe × 1%) + Prestige-Boni
Maximum: 85% Reduktion
```

## UI/UX Design

### 10x10 Grid
- **Layout:** 100 Boxen in 10×10 Raster
- **Farbkodierung:**
    - Grau: Noch nicht gesammelt
    - Weiß: 1x gesammelt
    - Grün: Level 1 (10x)
    - Blau: Level 2 (25x)
    - Lila: Level 3 (50x)
    - Orange: Level 4 (100x)

### Hover-Information
- Aktuelle Anzahl Würfe
- Progress zur nächsten Stufe
- Spezielle Eigenschaften (Primzahl, Fibonacci, etc.)

### Würfel-Interface
- Manueller Würfel-Button mit Cooldown-Anzeige
- Auto-Würfel Status-Indikator
- Aktueller Wurf-Ergebnis prominente Anzeige

## Technische Spezifikation

### Tech Stack
- **Frontend:** Vanilla HTML/CSS/JavaScript
- **Storage:** Browser LocalStorage
- **Kein Framework:** Pure DOM-Manipulation

### Datenstruktur
```javascript
gameState = {
  numbers: {
    1: { count: 15, level: 1 },
    2: { count: 3, level: 0 },
    // ... für alle 100 Zahlen
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

### Core Functions
- `performRoll()` - Hauptwürfel-Logik mit Bias-System
- `calculateBias()` - Berechnet aktuelle Bias-Stärke
- `updateCooldowns()` - Verwaltet parallele Cooldown-Timer
- `saveGameState()` / `loadGameState()` - LocalStorage Persistierung
- `updateGrid()` - UI-Updates für das Zahlen-Grid
- `processRollResult()` - Verarbeitet Wurf-Ergebnis und Updates

### Performance
- Grid-Updates nur bei Änderungen
- Cooldown-Timer mit 100ms Intervall
- Efficient LocalStorage Saving (debounced)

## Progression & Balance

### Früh-Spiel (0-30 Zahlen)
- Niedrige Bias, fast alle Würfe sind neue Zahlen
- Manueller Fokus, Auto-Würfel noch nicht verfügbar
- Schnelle Progression und sofortige Belohnung

### Mittel-Spiel (30-70 Zahlen)
- Auto-Würfel freigeschaltet
- Erste Level-Strategien werden wichtig
- Spezielle Zahlen-Boni beginnen zu wirken

### End-Spiel (70-100 Zahlen)
- Hohe Bias nötig für letzte Zahlen
- Strategisches Leveling wird kritisch
- Cooldown-Optimierung im Fokus

### Completion (100/100)
- Fokus auf maximales Leveling
- Prestige-System Vorbereitung
- Achievement-Jagd

## Erweiterungsmöglichkeiten
- Prestige-System für Neustart mit permanenten Boni
- Achievement-System mit dauerhaften Upgrades
- Daily Challenges und besondere Events
- Verschiedene Würfel-Modi und Themes
