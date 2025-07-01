# LEARNINGS.md

## Phase 2: Game State und Datenverwaltung

### Wichtige Erkenntnisse

1. **State Structure Design**
   - Die hierarchische Struktur des gameState Objekts (numbers, cooldowns, stats) ermöglicht eine klare Trennung der verschiedenen Spielaspekte
   - Jede Nummer wird als eigenes Objekt mit `count` und `level` gespeichert, was flexible Erweiterungen ermöglicht

2. **LocalStorage Implementation**
   - Beim Laden des gespeicherten States ist es wichtig, die Cooldown-States zurückzusetzen (active: false), um "stuck states" nach einem Reload zu vermeiden
   - Deep merging beim Laden erhält die Struktur und behandelt fehlende Properties gracefully
   - Try-catch Blöcke sind essentiell für robuste LocalStorage-Operationen

3. **State Initialization Pattern**
   - Die Unterscheidung zwischen "fresh start" und "load existing" verhindert das Überschreiben von gespeicherten Daten
   - Alle 100 Zahlen müssen explizit initialisiert werden (1-100), nicht 0-99

4. **State Management Utilities**
   - `updateNumber()` kapselt sowohl das Erhöhen des Counters als auch die Level-Berechnung
   - `calculateLevelProgress()` gibt detaillierte Informationen für UI-Updates zurück
   - Die Trennung von State-Logik und UI-Updates macht den Code wartbarer

5. **Best Practices**
   - State-Updates sollten immer von einem `saveGameState()` gefolgt werden
   - UI-Updates sollten nach State-Änderungen erfolgen, nicht davor
   - Utility-Funktionen wie `getCollectedNumbers()` und `getLeveledNumbers()` vereinfachen komplexe Queries

### Häufige Fallstricke

1. **Cooldown State Persistence**: Aktive Cooldowns sollten NICHT über Reloads persistiert werden
2. **Array vs Object**: Numbers als Object (keyed by number) statt Array für O(1) Zugriff
3. **Level Thresholds**: Die Level-Schwellen (10, 25, 50, 100) müssen konsistent verwendet werden

### Performance-Optimierungen

1. **Batch UI Updates**: `updateUI()` aktualisiert alle UI-Elemente in einem Durchgang
2. **Conditional Grid Creation**: Das Grid wird nur einmal erstellt, danach nur noch aktualisiert
3. **Debounced Saves**: Könnte in Zukunft implementiert werden bei häufigeren State-Updates