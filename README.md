# Daily Battle

Een gewoontetracker PWA met een unieke benadering: in plaats van gewoontes af te vinken, registreer je real-time of je je op dát moment aan een gewoonte houdt.

## Features

- **Real-time tracking** - Geen dagelijkse check-ins maar continue bewustwording
- **Gamification** - Dagelijkse "battle" met score en streak
- **Visuele feedback** - Kleurenspectrum van rood naar groen
- **Cooldown mechanisme** - Betekenisvolle meetmomenten (5, 10, 15 of 30 min)
- **Offline-first** - Werkt volledig zonder internet als PWA
- **Privacy** - Alle data lokaal opgeslagen in localStorage

## Installatie

### Als PWA (aanbevolen)
1. Open de app in je browser
2. Klik op "Installeren" wanneer de banner verschijnt
3. Of gebruik "Toevoegen aan startscherm" in je browser menu

### Lokaal draaien
```bash
# Clone de repository
git clone https://github.com/constantdynamics/habitbattle.git

# Ga naar de directory
cd habitbattle

# Start een lokale server (bijvoorbeeld met Python)
python -m http.server 8000

# Of met Node.js
npx serve
```

Open dan `http://localhost:8000` in je browser.

## Gebruik

1. **Setup** - Vul je gewoonte naam en check-in vraag in
2. **Battle** - Beantwoord gedurende de dag met Ja of Nee
3. **Bekijk statistieken** - Week- en maandoverzicht van je voortgang

## Iconen genereren

De repository bevat placeholder iconen. Voor productie:

1. Open `generate-icons.html` in een browser
2. Klik op "Download All"
3. Plaats de gedownloade PNG's in de `icons` map

## Data

Alle data wordt opgeslagen in localStorage onder de key `dailyBattle`. Je kunt:
- **Exporteren** - Download een JSON backup
- **Importeren** - Herstel vanuit een JSON bestand
- **Wissen** - Verwijder alle data

## Technologie

- Vanilla HTML/CSS/JavaScript
- Progressive Web App (PWA)
- Service Worker voor offline functionaliteit
- localStorage voor data persistentie

## Licentie

MIT
