// Détection de la page courante
const path = window.location.pathname;

// --- Pour index.html ---
if (path.endsWith('index.html')) {
        document.getElementById('arbitrage').addEventListener('click', function() {
            window.location.href = 'Settings.html';
        });
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
        // Charger la couleur si déjà choisie
        window.addEventListener('DOMContentLoaded', function() {
            const c1 = localStorage.getItem('color-team1');
            const c2 = localStorage.getItem('color-team2');
            if (c1) colorTeam1.value = c1;
            if (c2) colorTeam2.value = c2;
            updateTeamColors();
        });
        // Met à jour la couleur des containers selon la sélection
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

    // Options bouton (placeholder)
    const optionsBtn = document.querySelector('.options button');
    if (optionsBtn) {
        optionsBtn.addEventListener('click', function() {
            // option : demande a maman
        });
    }
}

// --- Pour Match.html ---
if (path.endsWith('Match.html')) {
    let score1 = 0;
    let score2 = 0;
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

    // Affichage de l'équipe en possession sur le jersey
    function updatePossessionDisplay() {
        const label = document.getElementById('possession-label');
        const jersey = document.getElementById('jersey');
        if (!label || !jersey) return;
        if (possession === '1') {
            label.textContent = "Possession : Équipe 1";
            jersey.style.backgroundColor = team1Color;
        } else {
            label.textContent = "Possession : Équipe 2";
            jersey.style.backgroundColor = team2Color;
        }
    }

    // Changement de possession
    function switchPossession() {
        possession = (possession === '1') ? '2' : '1';
        localStorage.setItem('possession', possession);
        updatePossessionDisplay();
    }

    function updateScores() {
        const s1 = document.getElementById('score1');
        const s2 = document.getElementById('score2');
        if (s1) s1.textContent = score1;
        if (s2) s2.textContent = score2;
    }

    function updateTimer() {
        let min = String(Math.floor(timer / 60)).padStart(2, '0');
        let sec = String(timer % 60).padStart(2, '0');
        const timerDiv = document.getElementById('timer');
        if (timerDiv) timerDiv.textContent = `${min}'${sec}`;
    }

    function startTimer() {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            timer++;
            updateTimer();
        }, 1000);
    }

    const tirBtn = document.getElementById('tir');
    const marqueBtn = document.getElementById('marque');
    const recupEquipeBtn = document.getElementById('recup-equipe');
    const recupAdverseBtn = document.getElementById('recup-adverse');
    const perteBalleBtn = document.getElementById('perte-balle');

    if (tirBtn) {
        tirBtn.addEventListener('click', () => {
            const tirOptions = document.getElementById('tir-options');
            if (tirOptions) tirOptions.style.display = 'block';
            startTimer();
        });
    }
    if (marqueBtn) {
        marqueBtn.addEventListener('click', () => {
            if (possession === '1') score1++;
            else score2++;
            updateScores();
            const tirOptions = document.getElementById('tir-options');
            if (tirOptions) tirOptions.style.display = 'none';
            switchPossession();
        });
    }
    if (recupEquipeBtn) {
        recupEquipeBtn.addEventListener('click', () => {
            const tirOptions = document.getElementById('tir-options');
            if (tirOptions) tirOptions.style.display = 'none';
        });
    }
    if (recupAdverseBtn) {
        recupAdverseBtn.addEventListener('click', () => {
            switchPossession();
            const tirOptions = document.getElementById('tir-options');
            if (tirOptions) tirOptions.style.display = 'none';
        });
    }
    if (perteBalleBtn) {
        perteBalleBtn.addEventListener('click', () => {
            switchPossession();
            startTimer();
        });
    }

    // --- Gestion du mode chrono/rebours ---
    let timerMode = localStorage.getItem('timer-mode') || 'chrono';
    let timerElement = document.getElementById('timer');
    // let timerInterval; // Removed duplicate declaration
    let duration = parseInt(localStorage.getItem('match-duration')) || 10; // Durée par défaut de 10 minutes

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
        let seconds = duration * 60;
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

    // Lancer le timer uniquement au clic sur le bouton
    const startTimerBtn = document.getElementById('start-timer');
    if (startTimerBtn) {
        startTimerBtn.addEventListener('click', function() {
            // Empêche de lancer plusieurs timers
            if (timerInterval) clearInterval(timerInterval);
            if (timerMode === 'rebours') {
                startRebours();
            } else {
                startChrono();
            }
        });
    }

    const matchEndBtn = document.getElementById('match-end');
    if (matchEndBtn) {
        matchEndBtn.addEventListener('click', function() {
            window.location.href = 'Statistiques.html';
        });
    }

    let matchStats = {
        possession: {1: 0, 2: 0}, // en secondes
        tirs: {1: 0, 2: 0},
        buts: {1: 0, 2: 0},
        pertes: {1: 0, 2: 0},
        currentPossession: localStorage.getItem('possession') || '1',
        possessionStart: null,
        totalTime: 0
    };

    // Chronométrage de la possession
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
    // Initialisation
    startPossessionTimer();

    // Gestion des boutons d'action
    if (perteBalleBtn) {
        perteBalleBtn.addEventListener('click', function() {
            matchStats.pertes[matchStats.currentPossession]++;
            // Changer la possession
            let newTeam = matchStats.currentPossession === '1' ? '2' : '1';
            switchPossessionStats(newTeam);
        });
    }
    if (tirBtn) {
        tirBtn.addEventListener('click', function() {
            matchStats.tirs[matchStats.currentPossession]++;
            // Affiche les options de tir (déjà géré dans ton code)
        });
    }
    if (marqueBtn) {
        marqueBtn.addEventListener('click', function() {
            matchStats.buts[matchStats.currentPossession]++;
            // Après un but, la possession change
            let newTeam = matchStats.currentPossession === '1' ? '2' : '1';
            switchPossessionStats(newTeam);
        });
    }
    if (recupEquipeBtn) {
        recupEquipeBtn.addEventListener('click', function() {
            // La même équipe garde la possession, rien à faire
        });
    }
    if (recupAdverseBtn) {
        recupAdverseBtn.addEventListener('click', function() {
            let newTeam = matchStats.currentPossession === '1' ? '2' : '1';
            switchPossessionStats(newTeam);
        });
    }

    // Fin du match : sauvegarde et redirection
    if (matchEndBtn) {
        matchEndBtn.addEventListener('click', function() {
            // Ajoute la dernière période de possession
            if (matchStats.possessionStart) {
                let elapsed = Math.floor((Date.now() - matchStats.possessionStart) / 1000);
                matchStats.possession[matchStats.currentPossession] += elapsed;
                matchStats.totalTime += elapsed;
            }
            // Sauvegarde dans le localStorage
            localStorage.setItem('matchStats', JSON.stringify(matchStats));
            window.location.href = 'Statistiques.html';
        });
    }

    // Initialisation
    updateScores();
    updateTimer();
    updatePossessionDisplay();
}

// --- Pour Statistiques.html ---
if (path.endsWith('Statistiques.html')) {
    // Récupère les stats du match
    const color1 = localStorage.getItem('color-team1') || '#002fff';
    const color2 = localStorage.getItem('color-team2') || '#f44336';
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

    // Affichage des autres stats
    const tirsElem = document.getElementById('tirs');
    if (tirsElem) tirsElem.textContent = `${stats.tirs?.['1'] || 0} - ${stats.tirs?.['2'] || 0}`;
    const butsElem = document.getElementById('buts');
    if (butsElem) butsElem.textContent = `${stats.buts?.['1'] || 0} - ${stats.buts?.['2'] || 0}`;
    const pertesElem = document.getElementById('pertes');
    if (pertesElem) pertesElem.textContent = `${stats.pertes?.['1'] || 0} - ${stats.pertes?.['2'] || 0}`;
}
