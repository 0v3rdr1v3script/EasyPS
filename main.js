// Détection de la page courante
const path = window.location.pathname;

// --- Pour index.html ---
if (path.endsWith('index.html')) {
    const arbitrageBtn = document.getElementById('arbitrage');
    if (arbitrageBtn) {
        arbitrageBtn.addEventListener('click', function() {
            window.location.href = 'Settings.html';
        });
    }
}

// --- Pour Settings.html ---
if (path.endsWith('Settings.html')) {
    // Gestion des boutons équipe
    document.querySelectorAll('.team').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.team').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Gestion des boutons chrono/rebours
    document.querySelectorAll('.timer-option').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.timer-option').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // Sauvegarde du mode chrono/rebours dans le localStorage
            localStorage.setItem('timer-mode', this.textContent.trim().toLowerCase());
        });
    });

    // Sauvegarde des couleurs dans localStorage
    const colorTeam1 = document.getElementById('color-team1');
    const colorTeam2 = document.getElementById('color-team2');
    if (colorTeam1 && colorTeam2) {
        colorTeam1.addEventListener('input', function() {
            localStorage.setItem('color-team1', this.value);
            updateTeamColors();
        });
        colorTeam2.addEventListener('input', function() {
            localStorage.setItem('color-team2', this.value);
            updateTeamColors();
        });
        window.addEventListener('DOMContentLoaded', function() {
            const c1 = localStorage.getItem('color-team1');
            const c2 = localStorage.getItem('color-team2');
            if (c1) colorTeam1.value = c1;
            if (c2) colorTeam2.value = c2;
            updateTeamColors();
        });
        function updateTeamColors() {
            const c1 = colorTeam1.value;
            const c2 = colorTeam2.value;
            const disp1 = document.getElementById('display-color-team1');
            const disp2 = document.getElementById('display-color-team2');
            if (disp1) disp1.style.backgroundColor = c1;
            if (disp2) disp2.style.backgroundColor = c2;
        }
    }

    // Sauvegarde de l'équipe qui engage
    document.querySelectorAll('.team-option').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.team-option').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            localStorage.setItem('possession', this.getAttribute('data-team'));
        });
    });

    // Stocke la durée du match (minutes et secondes) dans le localStorage à chaque changement
    const matchDurationMinInput = document.getElementById('match-duration-min');
    const matchDurationSecInput = document.getElementById('match-duration-sec');
    if (matchDurationMinInput && matchDurationSecInput) {
        window.addEventListener('DOMContentLoaded', function() {
            const savedMin = localStorage.getItem('match-duration-min');
            const savedSec = localStorage.getItem('match-duration-sec');
            if (savedMin !== null) matchDurationMinInput.value = savedMin;
            if (savedSec !== null) matchDurationSecInput.value = savedSec;
        });
        matchDurationMinInput.addEventListener('input', function() {
            localStorage.setItem('match-duration-min', this.value);
        });
        matchDurationSecInput.addEventListener('input', function() {
            localStorage.setItem('match-duration-sec', this.value);
        });
    }

    // Bouton retour
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }
}

// --- Pour Match.html ---
if (path.endsWith('Match.html')) {
    let score1 = 0;
    let score2 = 0;
    let paniers1 = 0;
    let paniers2 = 0;
    let timer = 0;
    let timerInterval = null;

    // Récupération des couleurs et possession depuis localStorage
    let team1Color = localStorage.getItem('color-team1') || '#002fff';
    let team2Color = localStorage.getItem('color-team2') || '#f44336';
    let possession = localStorage.getItem('possession') || '1'; // 1 ou 2

    // Appliquer les couleurs aux pastilles
    const team1ColorDiv = document.querySelector('#team1-score .team-color');
    const team2ColorDiv = document.querySelector('#team2-score .team-color');
    if (team1ColorDiv) team1ColorDiv.style.backgroundColor = team1Color;
    if (team2ColorDiv) team2ColorDiv.style.backgroundColor = team2Color;

    // Changement de possession
    function switchPossession() {
        possession = (possession === '1') ? '2' : '1';
        localStorage.setItem('possession', possession);
        updatePossessionDisplay();
    }

    // Affichage de l'équipe en possession sur le jersey
    function updatePossessionDisplay() {
        const label = document.getElementById('possession-label');
        const jersey = document.getElementById('jersey');
        if (!label || !jersey) return;
        const currentTeam1Color = localStorage.getItem('color-team1') || '#002fff';
        const currentTeam2Color = localStorage.getItem('color-team2') || '#f44336';
        if (possession === '1') {
            label.textContent = "Possession : Équipe 1";
            jersey.style.backgroundColor = currentTeam1Color;
        } else {
            label.textContent = "Possession : Équipe 2";
            jersey.style.backgroundColor = currentTeam2Color;
        }
    }

    window.addEventListener('DOMContentLoaded', function() {
        updatePossessionDisplay();
    });

    function updateScores() {
        const s1 = document.getElementById('score1');
        const s2 = document.getElementById('score2');
        if (s1) s1.textContent = score1;
        if (s2) s2.textContent = score2;
    }

    // Chronomètre/Rebours automatique
    let timerMode = localStorage.getItem('timer-mode') || 'chrono';
    let timerElement = document.getElementById('timer');
    let min = parseInt(localStorage.getItem('match-duration-min')) || 10;
    let sec = parseInt(localStorage.getItem('match-duration-sec')) || 0;
    let duration = min * 60 + sec;

    function formatTime(sec) {
        let m = Math.floor(sec / 60);
        let s = sec % 60;
        return (m < 10 ? '0' : '') + m + "'" + (s < 10 ? '0' : '') + s;
    }

    function startChrono() {
        let seconds = 0;
        timerElement.textContent = formatTime(seconds);
        timerInterval = setInterval(() => {
            seconds++;
            timerElement.textContent = formatTime(seconds);
        }, 1000);
    }

    function startRebours() {
        let seconds = duration;
        timerElement.textContent = formatTime(seconds);
        timerInterval = setInterval(() => {
            seconds--;
            timerElement.textContent = formatTime(seconds);
            if (seconds <= 0) {
                clearInterval(timerInterval);
                timerElement.textContent = "00'00";
            }
        }, 1000);
    }

    window.addEventListener('DOMContentLoaded', function() {
        if (timerInterval) clearInterval(timerInterval);
        if (timerMode === 'rebours') {
            startRebours();
        } else {
            startChrono();
        }
        updateScores();
        updatePossessionDisplay();
    });

    // Gestion des boutons d'action
    const tirBtn = document.getElementById('tir');
    const marqueBtn = document.getElementById('marque');
    const doublePasBtn = document.getElementById('double-pas');
    const recupEquipeBtn = document.getElementById('recup-equipe');
    const perteBalleBtn = document.getElementById('perte-balle');

    if (tirBtn) {
        tirBtn.addEventListener('click', () => {
            const tirOptions = document.getElementById('tir-options');
            if (tirOptions) {
                tirOptions.style.display = tirOptions.style.display === 'block' ? 'none' : 'block';
            }
            // Statistiques
            matchStats.tirs[matchStats.currentPossession]++;
            localStorage.setItem('matchStats', JSON.stringify(matchStats));
        });
    }
    if (marqueBtn) {
        marqueBtn.addEventListener('click', () => {
            if (possession === '1') score1 += 2, paniers1 += 1;
            else score2 += 2, paniers2 += 1;
            updateScores();
            const tirOptions = document.getElementById('tir-options');
            if (tirOptions) tirOptions.style.display = 'none';
            // Statistiques
            matchStats.paniers[matchStats.currentPossession]++;
            let newTeam = matchStats.currentPossession === '1' ? '2' : '1';
            switchPossessionStats(newTeam);
            localStorage.setItem('matchStats', JSON.stringify(matchStats));
            switchPossession();
        });
    }
    if (doublePasBtn) {
        doublePasBtn.addEventListener('click', () => {
            if (possession === '1') score1 += 10, paniers1 += 1;
            else score2 += 10, paniers2 += 1;
            updateScores();
            const tirOptions = document.getElementById('tir-options');
            if (tirOptions) tirOptions.style.display = 'none';
            // Statistiques
            matchStats.paniers[matchStats.currentPossession]++;
            let newTeam = matchStats.currentPossession === '1' ? '2' : '1';
            switchPossessionStats(newTeam);
            localStorage.setItem('matchStats', JSON.stringify(matchStats));
            switchPossession();
        });
    }
    if (recupEquipeBtn) {
        recupEquipeBtn.addEventListener('click', () => {
            const tirOptions = document.getElementById('tir-options');
            if (tirOptions) tirOptions.style.display = 'none';
            // Statistiques
            localStorage.setItem('matchStats', JSON.stringify(matchStats));
        });
    }
    if (perteBalleBtn) {
        perteBalleBtn.addEventListener('click', () => {
            switchPossession();
            const tirOptions = document.getElementById('tir-options');
            if (tirOptions) tirOptions.style.display = 'none';
            // Statistiques
            matchStats.pertes[matchStats.currentPossession]++;
            let newTeam = matchStats.currentPossession === '1' ? '2' : '1';
            switchPossessionStats(newTeam);
            localStorage.setItem('matchStats', JSON.stringify(matchStats));
        });
    }

    // Statistiques du match
    let matchStats = {
        possession: {1: 0, 2: 0}, // en secondes
        tirs: {1: 0, 2: 0},
        paniers: {1: 0, 2: 0},
        pertes: {1: 0, 2: 0},
        currentPossession: localStorage.getItem('possession') || '1',
        possessionStart: null,
        totalTime: 0
    };

    function startPossessionTimer() {
        matchStats.possessionStart = Date.now();
    }
    function switchPossessionStats(team) {
        if (matchStats.possessionStart) {
            let elapsed = Math.floor((Date.now() - matchStats.possessionStart) / 1000);
            matchStats.possession[matchStats.currentPossession] += elapsed;
            matchStats.totalTime += elapsed;
        }
        matchStats.currentPossession = team;
        matchStats.possessionStart = Date.now();
    }
    startPossessionTimer();

    // Fin du match : sauvegarde et redirection
    const matchEndBtn = document.getElementById('match-end');
    if (matchEndBtn) {
        matchEndBtn.addEventListener('click', function() {
            if (matchStats.possessionStart) {
                let elapsed = Math.floor((Date.now() - matchStats.possessionStart) / 1000);
                matchStats.possession[matchStats.currentPossession] += elapsed;
                matchStats.totalTime += elapsed;
            }
            localStorage.setItem('matchStats', JSON.stringify(matchStats));
            window.location.href = 'Statistiques.html';
        });
    }

    // Bouton retour
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }
}

// --- Pour Statistiques.html ---
if (path.endsWith('Statistiques.html')) {
    const color1 = localStorage.getItem('color-team1') || '#002fff';
    const color2 = localStorage.getItem('color-team2') || '#f44336';
    const color3 = "#808080"; // gris
    let stats = JSON.parse(localStorage.getItem('matchStats') || '{}');
    let total = stats.totalTime || 1;
    let p1 = Math.round((stats.possession?.['1'] || 0) * 100 / total);
    let p2 = Math.round((stats.possession?.['2'] || 0) * 100 / total);
    const possessionElem = document.getElementById('possession');
    if (possessionElem) possessionElem.textContent = `${p1}% - ${p2}%`;

    // Barres de possession (SVG)
    let bar = `<svg width="100%" height="40">
        <rect x="0" y="5" width="${p1}%" height="30" fill="${color1}"/>
        <rect x="${p1}%" y="5" width="${p2}%" height="30" fill="${color2}"/>
        <text x="10" y="28" fill="#fff" font-size="18">${p1}%</text>
        <text x="95%" y="28" fill="#fff" font-size="18" text-anchor="end">${p2}%</text>
    </svg>`;
    const possessionBarElem = document.getElementById('possession-bar');
    if (possessionBarElem) possessionBarElem.innerHTML = bar;

    // Calcul du nombre de tirs et possessions pour chaque équipe
    let tirs1 = stats.tirs?.['1'] || 0;
    let tirs2 = stats.tirs?.['2'] || 0;
    let paniers1 = stats.paniers?.['1'] || 0;
    let paniers2 = stats.paniers?.['2'] || 0;
    let pertes1 = stats.pertes?.['1'] || 0;
    let pertes2 = stats.pertes?.['2'] || 0;

    // Calcul du nombre de changements de possession (la balle change de camp)
    let nbChangementsPossession = 0;
    if (stats && stats.possession) {
        nbChangementsPossession = (parseInt(pertes1, 10) + parseInt(pertes2, 10)) + (parseInt(paniers1, 10) + parseInt(paniers2, 10));
    }

    let possessions1 = Math.floor(nbChangementsPossession / 2);
    let possessions2 = nbChangementsPossession - possessions1;

    if (possessions1 === 0 && (parseInt(stats.possession?.['1'] || 0, 10) > 0)) possessions1 = 1;
    if (possessions2 === 0 && (parseInt(stats.possession?.['2'] || 0, 10) > 0)) possessions2 = 1;

    function tirBar(tirs, possessions, color) {
        let percent = possessions ? Math.round((tirs * 100) / possessions) : 0;
        return `<svg width="100%" height="30">
            <rect x="0" y="5" width="100%" height="20" fill="${color3}"/>
            <rect x="0" y="5" width="${percent}%" height="20" fill="${color}"/>
            <text x="10" y="20" fill="#fff" font-size="14">${tirs} tirs / ${possessions} possessions</text>
            <text x="95%" y="20" fill="#fff" font-size="14" text-anchor="end">${percent}%</text>
        </svg>`;
    }

    const tirsurpossessionElem = document.getElementById('tir-sur-possession');
    if (tirsurpossessionElem) {
        tirsurpossessionElem.innerHTML =
            `<div style="margin-bottom:8px;">${tirBar(tirs1, possessions1 + 1, color1)}</div>
             <div>${tirBar(tirs2, possessions2, color2)}</div>`;
    }

    function panierBar(paniers, tirs, color) {
        let percent = tirs ? Math.round((paniers * 100) / tirs) : 0;
        return `<svg width="100%" height="30">
            <rect x="0" y="5" width="100%" height="20" fill="${color3}"/>
            <rect x="0" y="5" width="${percent}%" height="20" fill="${color}"/>
            <text x="10" y="20" fill="#fff" font-size="14">${paniers} paniers / ${tirs} tirs</text>
            <text x="95%" y="20" fill="#fff" font-size="14" text-anchor="end">${percent}%</text>
        </svg>`;
    }

    const paniersurTirsElem = document.getElementById('paniers-sur-tirs');
    if (paniersurTirsElem) {
        paniersurTirsElem.innerHTML =
            `<div style="margin-bottom:8px;">${panierBar(paniers1, tirs1, color1)}</div>
             <div>${panierBar(paniers2, tirs2, color2)}</div>`;
    }

    const tirsElem = document.getElementById('tirs');
    if (tirsElem) tirsElem.textContent = `${tirs1} - ${tirs2}`;
    const paniersElem = document.getElementById('paniers');
    if (paniersElem) paniersElem.textContent = `${paniers1} - ${paniers2}`;
    const pertesElem = document.getElementById('pertes');
    if (pertesElem) pertesElem.textContent = `${pertes1} - ${pertes2}`;
}