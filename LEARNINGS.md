# Number Gather Game - Learnings and Knowledge Base

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