# Number Gather Game - Learnings and Knowledge Base

## Phase 7: UI Controls und Interaktion

### Implementierung Details

1. **Roll Result Display**
   - Prominente Anzeige der gewürfelten Zahl mit großer Schrift (4rem)
   - Animationen für verschiedene Ereignisse:
     - `rollAnimation`: Flip-Animation beim Würfeln
     - `newNumberPulse`: Pulse-Effekt für neue Zahlen
     - `levelUpGlow`: Glow-Effekt bei Level-Ups
   - Dynamische Label-Updates basierend auf dem Ergebnis

2. **Cooldown Progress Bars**
   - Visual feedback durch Progress-Bars am unteren Rand der Buttons
   - Berechnung: `progress = ((totalCooldown - remaining) / totalCooldown) * 100`
   - Berücksichtigung der Cooldown-Reduktion in der Berechnung
   - Smooth transitions mit CSS (0.1s linear)

3. **Keyboard Shortcuts**
   - Space/Enter: Manual Roll
   - A: Toggle Auto-Roll
   - Event-Handler ignoriert Input-Felder zur Vermeidung von Konflikten
   - preventDefault() verhindert Standard-Browser-Verhalten

### Technische Erkenntnisse

1. **Animation Timing**
   - 250ms Delay für Roll-Animation gibt visuelles Feedback
   - 1000ms für Animation-Reset verhindert überlappende Effekte
   - CSS transitions vs. keyframe animations für unterschiedliche Effekte

2. **Button States**
   - Disabled-State während Cooldown verhindert Spam
   - Visual feedback durch Farb- und Cursor-Änderungen
   - Progress-Bar als zusätzlicher visueller Indikator

3. **Auto-Roll Toggle**
   - Button-Text ändert sich dynamisch (Auto Roll ↔ Stop Auto)
   - Cooldown läuft weiter auch wenn gestoppt
   - Unlock-Feedback zeigt Fortschritt an

### Performance Optimierungen

1. **DOM Updates**
   - Batch-Updates in updateUI() Funktion
   - Nur notwendige Elemente werden aktualisiert
   - CSS-Klassen für Animationen statt inline-styles

2. **Event Handling**
   - Single keydown listener statt multiple
   - Switch-Statement für effiziente Key-Verarbeitung
   - Early returns für nicht-relevante Events

### UI/UX Verbesserungen

1. **Visual Hierarchy**
   - Roll Result als prominentestes Element
   - Buttons mit klarem Call-to-Action
   - Grid als sekundäres Element

2. **Feedback Mechanisms**
   - Sofortiges visuelles Feedback bei Aktionen
   - Progress-Indikatoren für zeitbasierte Aktionen
   - Animations-Feedback für besondere Events

3. **Accessibility**
   - Keyboard shortcuts für Hauptaktionen
   - Klare visuelle States (enabled/disabled)
   - Kontrastreiche Farben für bessere Lesbarkeit

### Häufige Fallstricke

1. **Animation Overlaps**
   - Klassen müssen vor neuen Animationen entfernt werden
   - Timeouts für Animation-Resets beachten

2. **Progress Bar Calculations**
   - Cooldown-Reduktion muss in Berechnung einfließen
   - Min/Max bounds für Progress-Werte (0-100%)

3. **Event Propagation**
   - preventDefault() für Keyboard-Events wichtig
   - Input-Felder von Keyboard-Shortcuts ausschließen

### Zukünftige Verbesserungen

1. **Animation Variety**
   - Verschiedene Roll-Animationen für Abwechslung
   - Particle-Effekte für besondere Events
   - Sound-Effekte (optional)

2. **Advanced Controls**
   - Batch-Roll Option (10x, 100x)
   - Roll-History Display
   - Statistics Dashboard

3. **Mobile Optimization**
   - Touch-Gesten für Mobile
   - Responsive Button-Größen
   - Optimierte Animationen für Mobile Performance

## Phase 4: Spezielle Zahlen-Eigenschaften

### Ausgangslage
Bei der Bearbeitung von Issue #4 stellte sich heraus, dass ein Großteil der geforderten Funktionalität bereits implementiert war:
- Die speziellen Zahlen-Arrays (PRIME_NUMBERS und FIBONACCI_NUMBERS) waren bereits definiert
- Die visuellen Indikatoren im Grid waren bereits implementiert
- Die CSS-Klassen für die Styling der speziellen Zahlen waren bereits vorhanden
- Die Bias-Berechnung berücksichtigte bereits die speziellen Eigenschaften

### Implementierte Änderungen
Die Hauptaufgabe bestand darin, die drei Utility-Funktionen zu erstellen:
- `isPrime(num)` - Prüft, ob eine Zahl eine Primzahl ist
- `isFibonacci(num)` - Prüft, ob eine Zahl eine Fibonacci-Zahl ist
- `isDivisibleBy5(num)` - Prüft, ob eine Zahl durch 5 teilbar ist

Diese Funktionen wurden als einfache Wrapper implementiert, die die bereits existierenden Arrays und Modulo-Operationen nutzen.

### Refactoring
Nach der Implementierung der Utility-Funktionen wurde der bestehende Code refactored, um diese neuen Funktionen zu verwenden anstatt direkte Array-Checks und Modulo-Operationen. Dies betraf:
- Die Bias-Berechnung in `calculateBias()`
- Die Special Number Bonus Berechnung in `getSpecialNumberBonus()`
- Die Cooldown-Reduktion in `getCooldownReduction()`
- Das Grid-Update in `updateGrid()`
- Die Tooltip-Anzeige in `showTooltip()`

### Visuelle Implementierung
Die speziellen Zahlen werden im Grid durch verschiedene Indikatoren dargestellt:
- **Primzahlen**: Stern (★) in der oberen rechten Ecke
- **Fibonacci-Zahlen**: Diamant (◆) in der unteren linken Ecke
- **Durch 5 teilbare Zahlen**: Goldener innerer Schatten-Rahmen

### Technische Erkenntnisse
1. **Code-Organisation**: Die Utility-Funktionen wurden logisch bei den anderen Utility-Funktionen platziert, um die Code-Struktur konsistent zu halten.

2. **Performance**: Die Verwendung von `includes()` für die Array-Checks ist für Arrays dieser Größe (25 Primzahlen, 11 Fibonacci-Zahlen) ausreichend performant.

3. **CSS-Positioning**: Die Verwendung von `::before` und `::after` Pseudo-Elementen für die Indikatoren ermöglicht eine saubere Trennung von Inhalt und Styling.

4. **Dark Mode Kompatibilität**: Die speziellen Indikatoren nutzen `opacity` anstatt fester Farben, wodurch sie sowohl im Light- als auch im Dark-Mode gut sichtbar sind.

### Mögliche zukünftige Verbesserungen
1. Die Primzahlen könnten algorithmisch berechnet werden statt hardcoded zu sein
2. Weitere spezielle Zahlentypen könnten hinzugefügt werden (z.B. Quadratzahlen, Dreieckszahlen)
3. Die visuellen Indikatoren könnten animiert werden beim Hover oder beim Erreichen eines neuen Levels

## Phase 5: Würfel-Mechanik (Core Gameplay)

### Implementierung der Kern-Spielmechanik
Die Würfel-Mechanik ist das Herzstück des Spiels und wurde mit einem innovativen Bias-System implementiert, das die Wahrscheinlichkeit erhöht, fehlende Zahlen zu würfeln.

### Haupt-Komponenten

#### 1. performRoll() - Hauptwürfelfunktion
- Berechnet den aktuellen Bias-Wert
- Führt den Wurf mit Bias durch
- Verarbeitet das Ergebnis und aktualisiert alle Statistiken
- Gibt detaillierte Logs mit Bias und fehlenden Zahlen aus
- Returnt das gewürfelte Ergebnis für weitere Verarbeitung

#### 2. calculateBias() - Bias-Berechnung
Die Bias-Berechnung summiert alle Level-Boni mit speziellen Multiplikatoren:
- **Level-Boni**: 0.8% (L1), 2.0% (L2), 4.5% (L3), 8.0% (L4)
- **Primzahl-Multiplier**: 1.5x auf den Level-Bonus
- **Fibonacci-Multiplier**: 1.2x auf den Level-Bonus
- **Kombination**: Multiplikatoren werden multipliziert (z.B. Primzahl + Fibonacci = 1.5 × 1.2 = 1.8x)
- **Soft-Cap**: Maximum bei 85% Bias

#### 3. Bias-basierte Zielauswahl
Drei neue Funktionen wurden implementiert:
- **getMissingNumbers()**: Bereits vorhanden, gibt alle Zahlen mit count=0 zurück
- **getNearMissingPool()**: Neue Funktion, die alle Zahlen im Bereich ±3 um fehlende Zahlen sammelt
- **selectBiasedTarget()**: Wählt basierend auf dem Bias-Level das Ziel aus
  - Bei Bias > 50%: Nutzt den Near-Missing Pool für mehr Varianz
  - Sonst: Wählt nur aus den fehlenden Zahlen

#### 4. rollWithBias() - Würfeln mit Bias
- Generiert eine Zufallszahl zwischen 0-100
- Wenn die Zahl kleiner als der Bias-Prozentsatz ist, wird ein Bias-Ziel gewählt
- Ansonsten wird eine komplett zufällige Zahl (1-100) gewürfelt

### Technische Erkenntnisse

1. **Set-Datenstruktur**: Für den Near-Missing Pool wurde ein Set verwendet, um Duplikate automatisch zu vermeiden

2. **Bias-Balance**: Das System sorgt für eine gute Balance zwischen gezieltem Progress und Zufälligkeit

3. **Performance**: Die Bias-Berechnung wird bei jedem Wurf durchgeführt, ist aber durch die einfache Schleife sehr performant

4. **Logging**: Detaillierte Console-Logs helfen beim Debugging und Verstehen des Bias-Systems

### Testing mit Puppeteer
Die Implementierung wurde ausgiebig mit Puppeteer getestet:
- Grundfunktionalität des Würfelns funktioniert einwandfrei
- Bias-System berechnet korrekt mit speziellen Multiplikatoren
- UI wird korrekt aktualisiert (Farben, Statistiken, Auto-Roll Unlock)
- Keine JavaScript-Fehler in der Console

### Wichtige Implementierungsdetails

1. **Near-Missing Pool**: Der Pool enthält ALLE Zahlen im Bereich, nicht nur die fehlenden. Dies sorgt für mehr Varianz bei hohem Bias.

2. **Multiplikator-Stacking**: Spezielle Eigenschaften stacken multiplikativ, was sehr mächtige Kombinationen ermöglicht (z.B. Zahl 5 als Primzahl UND Fibonacci).

3. **Return-Wert**: performRoll() gibt jetzt das gewürfelte Ergebnis zurück, was für zukünftige Features nützlich sein könnte.

### Mögliche zukünftige Verbesserungen
1. Bias-Visualisierung im UI (z.B. Fortschrittsbalken)
2. Detailliertere Statistiken über Bias-Effektivität
3. Alternative Bias-Modi für verschiedene Spielstile
4. Animation beim Würfeln zur besseren Visualisierung