// Détection de la page courante
const path = window.location.pathname;

// --- Pour index.html ---
if (path.endsWith('index.html')) {
    const startBtn = document.getElementById('start-arbitrage');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
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

    // Initialisation
    updateScores();
    updateTimer();
    updatePossessionDisplay();
}
