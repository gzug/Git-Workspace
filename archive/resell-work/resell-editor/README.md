# ClawSell Studio

Lokale Browser-App für Batch-Bearbeitung von Resell-Produktfotos.

## Kernfunktionen
- mehrere Bilder hochladen
- globale Regler für Licht, Kontrast, Schatten, Farbe, Wärme, Schärfe, Schwarzpunkt
- Auswahlmodus pro Bild
- Vorher/Nachher oder Nur-Nachher Ansicht
- Presets
- Quick-Look Großansicht per Leertaste oder Doppelklick
- Crop-Modus mit freiem, 3:4- oder 4:3-fixiertem Verhältnis
- Duplizieren / Entfernen pro Bild
- 3:4- und 4:3-Filter in der Übersicht
- Export nur der aktuell sichtbaren Bilder
- Zielordner-Picker wenn vom Browser unterstützt, sonst normaler Download
- Resell-Generator mit breiten Oberkategorien statt starrer Templates
- plattformspezifische Titel-/Textlogik für Vinted und Kleinanzeigen
- flexible Zusatzfelder für Specs, Vollständigkeit und freie Produktdetails

## Start
```bash
cd resell-editor
python3 -m http.server 4173
```

Dann im Browser öffnen:
```text
http://127.0.0.1:4173
```

## Workflow-Idee
1. Bilder hochladen
2. globales Preset wählen oder Regler setzen
3. einzelne Motive auswählen und bei Bedarf gezielt nachregeln
4. per Leertaste / Doppelklick in die Großansicht
5. dort optional cropen, duplizieren oder entfernen
6. gewünschtes Format filtern
7. sichtbare Bilder speichern
