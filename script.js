const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Charger l'image de la patate
const patateImg = new Image();
patateImg.src = "patate.png"; // Ajoute une image "patate.png" dans ton dossier

// La patate
let patate = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    gravity: 0.3,
    jumpPower: -9, // Augmenté pour un saut plus haut
    onGround: true,
    firstPlatformTouched: false
};

// Sol de départ (fixe en bas)
let ground = {
    x: 0,
    y: canvas.height - 20,  
    width: canvas.width,
    height: 20,
    visible: true 
};

// Plateformes générées aléatoirement
let platforms = [];
const minSpacing = 60;  // Espacement minimum entre les plateformes
const maxSpacing = 110; // Espacement maximum entre les plateformes
let lastY = canvas.height - 60; // Position de départ de la première plateforme

// Générer les plateformes initiales
function generatePlatforms() {
    for (let i = 0; i < 20; i++) {  
        let spacing = Math.random() * (maxSpacing - minSpacing) + minSpacing;
        lastY -= spacing;

        platforms.push({
            x: Math.random() * (canvas.width - 80),
            y: lastY,
            width: 80,
            height: 10,
            type: Math.random() > 0.8 ? "boost" : "normal",
            touched: false // Nouvelle propriété pour suivre si la plateforme a été touchée
        });
    }
}

generatePlatforms();

let score = 0;

// Contrôles
let moveLeft = false;
let moveRight = false;

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") moveLeft = true;
    if (event.key === "ArrowRight") moveRight = true;
    if (event.key === " " && patate.onGround) {
        patate.velocityY = patate.jumpPower;
        patate.onGround = false;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") moveLeft = false;
    if (event.key === "ArrowRight") moveRight = false;
});

// Récupérer l'écran de fin de jeu et le bouton de redémarrage
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreElement = document.getElementById("finalScore");
const restartButton = document.getElementById("restartButton");

// Fonction pour afficher l'écran de fin de jeu
function showGameOverScreen() {
    gameOverScreen.style.display = "block"; // Afficher l'écran
    finalScoreElement.textContent = score; // Afficher le score final
}

// Fonction pour redémarrer le jeu
function restartGame() {
    document.location.reload(); // Recharge la page pour redémarrer le jeu
}

// Ajouter un gestionnaire d'événement pour le bouton de redémarrage
restartButton.addEventListener("click", restartGame);

// Mise à jour du jeu
function update() {
    patate.velocityY += patate.gravity;
    patate.y += patate.velocityY;

    if (moveLeft) patate.velocityX = -3;
    else if (moveRight) patate.velocityX = 3;
    else patate.velocityX = 0;

    patate.x += patate.velocityX;

    // Collision avec le sol
    if (ground.visible && patate.y + patate.height >= ground.y) {
        patate.y = ground.y - patate.height;
        patate.velocityY = 0;
        patate.onGround = true;
    }

    // Gestion des bords gauche et droit
    if (patate.x + patate.width < 0) patate.x = canvas.width;
    else if (patate.x > canvas.width) patate.x = -patate.width;

    // Déplacement des plateformes lorsque la patate monte
    if (patate.y < canvas.height / 2) {
        platforms.forEach((plat) => {
            plat.y += Math.abs(patate.velocityY);
            if (plat.y > canvas.height) {
                plat.y = -10;
                plat.x = Math.random() * (canvas.width - 80);
                plat.type = Math.random() > 0.8 ? "boost" : "normal";
                plat.touched = false; // Réinitialiser la propriété "touched" pour les nouvelles plateformes

                let lastPlatform = platforms.reduce((a, b) => (a.y < b.y ? a : b));

                let newY = lastPlatform.y - (minSpacing + Math.random() * (maxSpacing - minSpacing));

                if (plat.type === "boost") {
                    newY -= 30;
                }

                plat.y = newY;

                if (plat.type === "boost") {
                    let safePlatform = {
                        x: Math.random() * (canvas.width - 80),
                        y: plat.y + 40,
                        width: 80,
                        height: 10,
                        type: "normal",
                        touched: false
                    };
                    platforms.push(safePlatform);
                }
            }
        });
    }

    // Collision avec les plateformes
    platforms.forEach((plat) => {
        // Vérifier si la patate est en train de traverser la plateforme
        if (
            patate.velocityY > 0 && // La patate tombe
            patate.y + patate.height > plat.y && // La patate est au-dessus de la plateforme
            patate.y + patate.height - patate.velocityY <= plat.y && // La patate était au-dessus de la plateforme avant cette frame
            patate.x + patate.width > plat.x && // La patate est à droite de la plateforme
            patate.x < plat.x + plat.width // La patate est à gauche de la plateforme
        ) {
            if (!plat.touched) { // Si la plateforme n'a pas encore été touchée
                if (plat.type === "boost") {
                    score += 5; // Ajoute +5 pour une plateforme rouge
                } else {
                    score += 1; // Ajoute +1 pour une plateforme normale
                }
                plat.touched = true; // Marquer la plateforme comme touchée
                document.getElementById("score").textContent = "Score : " + score;
            }

            // Ajuster la position de la patate pour qu'elle soit sur la plateforme
            patate.y = plat.y - patate.height;
            patate.velocityY = plat.type === "boost" ? patate.jumpPower * 1.5 : patate.jumpPower;

            if (!patate.firstPlatformTouched) {
                patate.firstPlatformTouched = true;
                ground.visible = false;
            }
        }
    });

    // Vérifier si la patate est tombée
    if (patate.y > canvas.height) {
        showGameOverScreen(); // Afficher l'écran de fin de jeu
        return; // Arrêter la mise à jour du jeu
    }

    draw();
    requestAnimationFrame(update);
}

// Dessiner les éléments
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (ground.visible) {
        ctx.fillStyle = "brown";
        ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
    }

    platforms.forEach((plat) => {
        ctx.fillStyle = plat.type === "boost" ? "red" : "green";
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
    });

    ctx.drawImage(patateImg, patate.x, patate.y, patate.width, patate.height);
}

// Démarrer le jeu
patateImg.onload = () => {
    update();
};