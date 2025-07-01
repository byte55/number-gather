#!/bin/bash

# Liste der interessanten Issue-Nummern
ISSUES=(2 3 4 5 6 7 8 9)

# Funktion zum Prüfen ob ein Issue geschlossen ist
is_issue_closed() {
    local issue_number=$1
    local state=$(gh issue view $issue_number --json state --jq '.state')

    if [ "$state" = "CLOSED" ]; then
        return 0  # Issue ist geschlossen
    else
        return 1  # Issue ist offen
    fi
}

# Funktion zum Prüfen ob alle Issues geschlossen sind
all_issues_closed() {
    for issue in "${ISSUES[@]}"; do
        if ! is_issue_closed $issue; then
            return 1  # Mindestens ein Issue ist noch offen
        fi
    done
    return 0  # Alle Issues sind geschlossen
}

# Hauptschleife
while true; do
    echo "Prüfe Status der Issues..."

    # Prüfen ob alle Issues geschlossen sind
    if all_issues_closed; then
        echo "✅ Alle Issues sind geschlossen!"
        break
    fi

    # Offene Issues anzeigen
    echo "Offene Issues:"
    for issue in "${ISSUES[@]}"; do
        if ! is_issue_closed $issue; then
            echo "  - Issue #$issue ist noch offen"
        fi
    done

    echo ""
    echo "🚀 Starte Claude..."

    # Claude Command ausführen
    claude --dangerously-skip-permissions -p "hol dir das nächste offene issue und arbeite es ab"

    # Exit-Code prüfen
    exit_code=$?

    if [ $exit_code -eq 0 ]; then
        echo "✅ Claude hat erfolgreich abgeschlossen (Exit-Code: 0)"
        echo "Prüfe Issues erneut..."
        echo ""
    else
        echo "❌ Claude hat mit Exit-Code $exit_code abgeschlossen"
        echo "Beende Script..."
        exit $exit_code
    fi

    # Kurze Pause vor dem nächsten Durchlauf
    sleep 2
done

echo "🎉 Alle Issues wurden erfolgreich abgearbeitet!"
