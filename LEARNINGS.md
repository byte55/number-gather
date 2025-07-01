# LEARNINGS.md

## Phase 3: UI Grid System (Issue #3)

### Implementation Status
Phase 3 war bereits vollständig implementiert, als ich mit der Bearbeitung begann. Alle Anforderungen wurden erfüllt:

- 10x10 Grid mit CSS Grid erstellt
- Level-basierte Farbgebung implementiert (Grau → Weiß → Grün → Blau → Lila → Orange)
- updateGrid() Funktion vorhanden und funktionsfähig
- Hover-Tooltips mit detaillierten Informationen implementiert

### Technische Erkenntnisse

1. **CSS Grid Layout**: 
   - Verwendet `display: grid` mit `grid-template-columns: repeat(10, 1fr)`
   - `aspect-ratio: 1` für quadratische Zellen
   - Responsive mit `gap` Anpassungen für mobile Geräte

2. **Special Number Indicators**:
   - Primzahlen: ★ Symbol mit `::before` Pseudo-Element
   - Fibonacci-Zahlen: ◆ Symbol mit `::after` Pseudo-Element
   - Durch 5 teilbare Zahlen: Gelber Rahmen mit `box-shadow: inset`

3. **Tooltip System**:
   - Custom Tooltip-Element statt Browser-Standard `title` Attribute
   - Event-basiert mit `mouseover`, `mouseout`, und `mousemove`
   - 300ms Verzögerung um Tooltip-Spam zu vermeiden
   - Intelligente Positionierung die Viewport-Grenzen berücksichtigt

4. **Performance-Optimierungen**:
   - Grid wird nur einmal beim Start erstellt
   - Nur CSS-Klassen werden bei Updates geändert
   - Tooltip-Content wird dynamisch generiert nur bei Bedarf

### Dark Mode Integration
- Alle Farben verwenden CSS Custom Properties
- Automatische Anpassung mit `@media (prefers-color-scheme: dark)`
- Level-Farben wurden für Dark Mode optimiert (z.B. dunkleres Grau für Level 0)

### Architektur-Entscheidungen

1. **Keine Framework-Abhängigkeiten**: Vanilla JavaScript für maximale Performance
2. **Event Delegation**: Tooltip-Events auf document-Level für bessere Performance
3. **Separation of Concerns**: UI-Update-Logik klar getrennt von Game-State-Logik

### Debugging-Erfahrungen
- Browser DevTools zeigen korrekte Grid-Struktur
- Alle 100 Zellen werden korrekt generiert
- Tooltip-Element ist im DOM vorhanden
- Keine JavaScript-Fehler in der Console

### Best Practices
1. Immer `removeAttribute('title')` verwenden wenn custom Tooltips implementiert werden
2. CSS-Klassen für Zustände verwenden statt inline styles
3. Tooltips sollten `pointer-events: none` haben um Interferenz zu vermeiden