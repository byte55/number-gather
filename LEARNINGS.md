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

## Phase 3: UI Grid System

### Grid Layout Implementation
1. **CSS Grid für 10x10 Layout**
   - `grid-template-columns: repeat(10, 1fr)` erstellt gleichmäßige Spalten
   - `aspect-ratio: 1` garantiert quadratische Zellen unabhängig von der Container-Größe
   - Grid gap von 8px bietet gute visuelle Trennung ohne zu viel Abstand

2. **Responsive Design**
   - Media Queries reduzieren Grid-Gap und Schriftgröße auf kleineren Bildschirmen
   - Grid bleibt immer 10x10, nur die Zellengröße passt sich an

### Custom Tooltip System
1. **Event Delegation Pattern**
   - Ein einziger Event Listener auf document-Level statt 100 einzelne Listener
   - Performance-Vorteil bei vielen interaktiven Elementen
   - `e.target.closest('.number-cell')` findet das richtige Element

2. **Tooltip Delay Implementation**
   - 300ms Verzögerung verhindert Tooltip-Spam bei schnellen Mausbewegungen
   - `clearTimeout()` bei mouseout verhindert verspätetes Erscheinen

3. **Dynamic Positioning**
   - Tooltips werden repositioniert wenn sie über Bildschirmränder hinausgehen würden
   - Berechnung berücksichtigt Tooltip-Breite und -Höhe sowie Viewport-Dimensionen

### Dark Mode Support
1. **CSS Custom Properties**
   - Alle Farben als CSS-Variablen definiert
   - `@media (prefers-color-scheme: dark)` überschreibt automatisch die Variablen
   - Keine JavaScript-Logik für Theme-Switching nötig

2. **Kontrast-Anpassungen**
   - Uncollected numbers: Weiß → Dunkelgrau
   - Collected indicator: Hellerer Blau-Ton im Dark Mode
   - Text-Kontraste bleiben in beiden Modi lesbar

### Special Number Visualization
1. **CSS Pseudo-Elements**
   - `::before` für Primzahl-Indikator (★)
   - `::after` für Fibonacci-Indikator (◆)
   - Keine zusätzlichen DOM-Elemente nötig

2. **Divisible-by-5 Styling**
   - Inset box-shadow statt border für subtilen Gold-Effekt
   - Funktioniert gut mit anderen visuellen Indikatoren

### Performance-Erkenntnisse
1. **DOM-Manipulation minimieren**
   - Grid-Zellen werden einmal erstellt und wiederverwendet
   - Nur CSS-Klassen werden bei Updates geändert
   - `classList.remove()` mit mehreren Klassen in einem Call

2. **Tooltip-Rendering**
   - Ein einzelnes Tooltip-Element wird wiederverwendet
   - innerHTML-Update nur bei Bedarf
   - CSS-Transitionen für smooth fade-in/out

### Testing mit Puppeteer MCP
1. **Hover-Events simulieren**
   - `new MouseEvent('mouseover', {...})` mit bubbles: true für Event-Propagation
   - setTimeout nötig um auf Tooltip-Delay zu warten

2. **Screenshot-Testing**
   - Visuelle Verifikation von Grid-Layout und Tooltip-Darstellung
   - Dark Mode Testing durch programmatisches Setzen von color-scheme

### Zukünftige Verbesserungen
1. **Touch-Support**
   - Tooltips auf Touch-Geräten würden andere Interaktionsmuster benötigen
   - Long-press oder tap-to-show könnte implementiert werden

2. **Erweiterte Tooltip-Features**
   - Animation der Progress-Bar beim Öffnen
   - Mehr visuelle Indikatoren für Special Properties
   - Tooltip-Positioning könnte Popper.js-ähnliche Logik verwenden