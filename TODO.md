# TODO.md - Number Collection Game Implementation

## Phase 1: Grundstruktur und Setup ✅
- [x] Projekt-Setup mit .editorconfig, .gitignore, .gitattributes
- [x] CLAUDE.md mit Projektspezifikationen
- [ ] HTML-Grundstruktur in index.html erstellen
- [ ] CSS-Datei (styles.css) anlegen
- [ ] JavaScript-Datei (game.js) anlegen
- [ ] Basis HTML-Layout mit Container für Grid, Controls und Stats

## Phase 2: Game State und Datenverwaltung
- [ ] Game State Objekt definieren
  - [ ] numbers: Object für alle 100 Zahlen
  - [ ] cooldowns: Manual und Auto Cooldown States
  - [ ] stats: totalRolls, collectedCount, currentStreak
- [ ] LocalStorage Funktionen implementieren
  - [ ] saveGameState()
  - [ ] loadGameState()
  - [ ] initializeGameState() für Neustart
- [ ] State Management Utilities
  - [ ] updateNumber(num, increment)
  - [ ] getNumberLevel(count)
  - [ ] calculateLevelProgress(count)

## Phase 3: UI Grid System
- [ ] 10x10 Grid Layout erstellen
  - [ ] CSS Grid für 100 Boxen
  - [ ] Nummerierung 1-100
  - [ ] Basis-Styling (graue Boxen für ungesammelt)
- [ ] Level-basierte Farbgebung
  - [ ] CSS-Klassen für jeden Level (collected, level-1 bis level-4)
  - [ ] Farben: Grau → Weiß → Grün → Blau → Lila → Orange
- [ ] updateGrid() Funktion
  - [ ] Iteriere durch alle Zahlen
  - [ ] Setze korrekte CSS-Klassen basierend auf Level
  - [ ] Update nur bei Änderungen (Performance)
- [ ] Hover-Tooltips
  - [ ] Anzahl Würfe anzeigen
  - [ ] Progress zum nächsten Level
  - [ ] Spezielle Eigenschaften (Primzahl, Fibonacci, etc.)

## Phase 4: Spezielle Zahlen-Eigenschaften
- [ ] Utility Funktionen erstellen
  - [ ] isPrime(num) - Primzahl-Check
  - [ ] isFibonacci(num) - Fibonacci-Check
  - [ ] isDivisibleBy5(num) - Durch 5 teilbar
- [ ] Arrays für spezielle Zahlen vorbereiten
  - [ ] PRIME_NUMBERS = [2, 3, 5, 7, 11, ...]
  - [ ] FIBONACCI_NUMBERS = [1, 2, 3, 5, 8, 13, ...]
- [ ] Visuelle Indikatoren im Grid
  - [ ] Icons oder Badges für spezielle Eigenschaften
  - [ ] CSS-Klassen für special-prime, special-fibonacci, special-div5

## Phase 5: Würfel-Mechanik (Core Gameplay)
- [ ] performRoll() Hauptfunktion
  - [ ] Zufallszahl 1-100 generieren
  - [ ] Bias-System anwenden
  - [ ] Ergebnis zurückgeben
- [ ] calculateBias() implementieren
  - [ ] Summiere Level-Boni aller Zahlen
  - [ ] Wende Primzahl-Multiplier (1.5x) an
  - [ ] Wende Fibonacci-Multiplier (1.2x) an
  - [ ] Soft-Cap bei 85% anwenden
- [ ] Bias-basierte Zielauswahl
  - [ ] getMissingNumbers() - Array fehlender Zahlen
  - [ ] getNearMissingPool() - ±3 um fehlende Zahlen (bei >50% Bias)
  - [ ] selectBiasedTarget() - Wähle Ziel basierend auf Bias
- [ ] processRollResult(number)
  - [ ] Update Game State
  - [ ] Trigger UI Updates
  - [ ] Update Statistics
  - [ ] Speichere in LocalStorage

## Phase 6: Cooldown System
- [ ] Cooldown Timer Implementation
  - [ ] updateCooldowns() mit 100ms Interval
  - [ ] Separate Timer für Manual und Auto
  - [ ] UI Updates für Cooldown-Anzeige
- [ ] Manual Roll Cooldown
  - [ ] Base: 3 Sekunden
  - [ ] calculateCooldownReduction() Funktion
  - [ ] Minimum: 15% der Base-Zeit
  - [ ] Button disable/enable Logic
- [ ] Auto Roll System
  - [ ] Freischaltung bei 10 gesammelten Zahlen
  - [ ] Base: 8 Sekunden
  - [ ] Parallel zu Manual Roll
  - [ ] Visueller Status-Indikator
- [ ] Cooldown-Reduktions-Berechnung
  - [ ] Zähle Level 1+ Zahlen die durch 5 teilbar sind
  - [ ] Summiere alle Level für generelle Reduktion
  - [ ] Maximum 85% Reduktion

## Phase 7: UI Controls und Interaktion
- [ ] Manual Roll Button
  - [ ] Click Handler mit performRoll()
  - [ ] Cooldown-Anzeige (Progress Bar oder Timer)
  - [ ] Disable während Cooldown
  - [ ] Animations-Effekt beim Würfeln
- [ ] Auto Roll Status Display
  - [ ] "Locked" Anzeige bis 10 Zahlen
  - [ ] Active/Inactive Status
  - [ ] Nächster Roll Timer
  - [ ] Toggle On/Off Option
- [ ] Roll Result Display
  - [ ] Große, prominente Anzeige der gewürfelten Zahl
  - [ ] Animation beim neuen Wurf
  - [ ] Indikator ob neu/level-up
- [ ] Keyboard Shortcuts
  - [ ] Space/Enter für Manual Roll
  - [ ] A für Auto-Roll Toggle

## Phase 8: Statistiken und Progress Display
- [ ] Stats Panel erstellen
  - [ ] Gesammelte Zahlen: X/100
  - [ ] Aktuelle Bias: X%
  - [ ] Total Rolls Counter
  - [ ] Current Streak (optional)
- [ ] Progress Indicators
  - [ ] Progress Bar für Gesamtfortschritt
  - [ ] Milestone Notifications (25%, 50%, 75%, 100%)
  - [ ] Level Distribution Chart (optional)
- [ ] updateStatistics() Funktion
  - [ ] Berechne alle Stats
  - [ ] Update UI Elemente
  - [ ] Smooth Transitions/Animations

## Phase 9: Animationen und Polish
- [ ] Roll Animationen
  - [ ] Würfel-Animation beim Roll
  - [ ] Nummer "fliegt" ins Grid
  - [ ] Glow-Effekt bei Level-Up
- [ ] Grid Animationen
  - [ ] Smooth Color Transitions
  - [ ] Pulse-Effekt bei Update
  - [ ] Hover-Effekte
- [ ] Sound Effects (optional)
  - [ ] Roll Sound
  - [ ] Collection Sound
  - [ ] Level-Up Sound
  - [ ] 100% Completion Fanfare
- [ ] Particle Effects (optional)
  - [ ] Konfetti bei Milestones
  - [ ] Sparkles bei Level-Ups

## Phase 10: Testing und Optimierung
- [ ] Puppeteer MCP Tests
  - [ ] Alle Buttons funktionieren
  - [ ] Keine Console Errors
  - [ ] LocalStorage Persistenz
  - [ ] Cooldown Timer Genauigkeit
- [ ] Performance Optimierung
  - [ ] Debounce LocalStorage Saves
  - [ ] Batch DOM Updates
  - [ ] RequestAnimationFrame für Animationen
- [ ] Cross-Browser Testing
  - [ ] Chrome, Firefox, Safari, Edge
  - [ ] Mobile Responsiveness
- [ ] Edge Cases
  - [ ] LocalStorage voll
  - [ ] Browser Tab inaktiv
  - [ ] Sehr schnelle Klicks

## Phase 11: Erweiterte Features (Optional)
- [ ] Reset/New Game Button mit Bestätigung
- [ ] Import/Export Save Feature
- [ ] Achievements System
  - [ ] "First 10", "Halfway There", "Completionist"
  - [ ] Speed Achievements
  - [ ] Special Number Collections
- [ ] Statistics History
  - [ ] Best Streaks
  - [ ] Fastest to 100
  - [ ] Roll Efficiency
- [ ] Dark Mode Toggle
- [ ] Verschiedene Themes/Skins

## Phase 12: Dokumentation und Release
- [ ] README.md erstellen
  - [ ] Spielbeschreibung
  - [ ] How to Play
  - [ ] Features Liste
  - [ ] Screenshots
- [ ] Code Comments und JSDoc
- [ ] Performance Profiling
- [ ] Final Testing Checklist
- [ ] GitHub Pages Deployment Setup

## Priorisierung
1. **Kritisch** (Phases 1-6): Grundfunktionalität
2. **Wichtig** (Phases 7-8): Vollständige Spielerfahrung  
3. **Nice-to-have** (Phases 9-11): Polish und Extras
4. **Final** (Phase 12): Release-Vorbereitung

## Geschätzte Entwicklungszeit
- Phase 1-3: 2-3 Stunden (Grundstruktur)
- Phase 4-6: 3-4 Stunden (Core Gameplay)
- Phase 7-8: 2-3 Stunden (UI/UX)
- Phase 9-11: 2-4 Stunden (Polish, optional)
- Phase 12: 1-2 Stunden (Dokumentation)

**Gesamt: ~10-16 Stunden für vollständige Implementation**