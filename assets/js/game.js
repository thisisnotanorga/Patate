const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

const patateImg = new Image();
patateImg.src = "assets/img/patate.png";

let patate = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    gravity: 0.3,
    baseGravity: 0.3,
    jumpPower: -9,
    baseJumpPower: -9,
    onGround: true,
    firstPlatformTouched: false
};

let ground = {
    x: 0,
    y: canvas.height - 20,  
    width: canvas.width,
    height: 20,
    visible: true 
};

let platforms = [];
let minSpacing = 60;
let maxSpacing = 110;
let lastY = canvas.height - 60;

let gamePaused = false;
let gameOver = false;
let score = 0;

function adjustDifficulty() {
    if (score > 50) {
        minSpacing = 100;
        maxSpacing = 150;
        
        if (score <= 100) {
            patate.gravity = patate.baseGravity * 0.8;
            patate.jumpPower = patate.baseJumpPower * 1.15;
        } else {
            patate.gravity = patate.baseGravity;
            patate.jumpPower = patate.baseJumpPower;
        }
    }

    if (score > 100 && score <= 200) {
        platforms.forEach(plat => {
            plat.type = "boost";
        });
    }

    if (score > 200) {
        minSpacing = 150;
        maxSpacing = 200;
        platforms.forEach(plat => {
            plat.y += 2;
        });
    }
}


function generatePlatforms() {
    const maxJumpHeight = Math.abs(patate.jumpPower * patate.jumpPower / (2 * patate.gravity));
    
    const firstPlatformY = ground.y - (maxJumpHeight * 0.8);
    
    platforms.push({
        x: Math.random() * (canvas.width - 80),
        y: firstPlatformY,
        width: 80,
        height: 10,
        type: "normal",
        touched: false
    });
    
    lastY = firstPlatformY;
    
    for (let i = 0; i < 19; i++) { 
        let spacing = Math.random() * (maxSpacing - minSpacing) + minSpacing;
        lastY -= spacing;

        platforms.push({
            x: Math.random() * (canvas.width - 80),
            y: lastY,
            width: 80,
            height: 10,
            type: Math.random() > 0.8 ? "boost" : "normal",
            touched: false
        });
    }
}


generatePlatforms();

let moveLeft = false;
let moveRight = false;

document.addEventListener("keydown", (event) => {
    if (gameOver) return;
    
    if (event.key === "ArrowLeft") moveLeft = true;
    if (event.key === "ArrowRight") moveRight = true;
    
    if (event.key === "a" || event.key === "A") moveLeft = true;
    if (event.key === "d" || event.key === "D") moveRight = true;
    
    if ((event.key === " " || event.key === "w" || event.key === "W") && patate.onGround) {
        patate.velocityY = patate.jumpPower;
        patate.onGround = false;
    }
    
    if (event.key === "Escape" || event.key === "p" || event.key === "P") {
        togglePause();
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") moveLeft = false;
    if (event.key === "ArrowRight") moveRight = false;
    
    if (event.key === "a" || event.key === "A") moveLeft = false;
    if (event.key === "d" || event.key === "D") moveRight = false;
});

const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreElement = document.getElementById("finalScore");
const restartButton = document.getElementById("restartButton");

const pauseMenu = document.createElement("div");
pauseMenu.id = "pauseMenu";
pauseMenu.style.display = "none";
pauseMenu.innerHTML = `
    <h1>Game Paused</h1>
    <p>Score: <span id="pauseScore">0</span></p>
    <button id="continueButton">Continue</button>
    <button id="restartFromPauseButton">Restart</button>
`;
document.body.appendChild(pauseMenu);

pauseMenu.style.position = "absolute";
pauseMenu.style.top = "50%";
pauseMenu.style.left = "50%";
pauseMenu.style.transform = "translate(-50%, -50%)";
pauseMenu.style.textAlign = "center";
pauseMenu.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
pauseMenu.style.color = "white";
pauseMenu.style.padding = "20px";
pauseMenu.style.borderRadius = "10px";
pauseMenu.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.5)";
pauseMenu.style.zIndex = "1000";

const buttons = pauseMenu.querySelectorAll("button");
buttons.forEach(button => {
    button.style.padding = "10px 20px";
    button.style.fontSize = "1.2em";
    button.style.backgroundColor = "#4CAF50";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.margin = "10px";
});

document.getElementById("continueButton").addEventListener("click", togglePause);
document.getElementById("restartFromPauseButton").addEventListener("click", restartGame);

function togglePause() {
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        pauseMenu.style.display = "block";
        document.getElementById("pauseScore").textContent = score;
    } else {
        pauseMenu.style.display = "none";
        requestAnimationFrame(update);
    }
}

function showGameOverScreen() {
    gameOver = true;
    gameOverScreen.style.display = "block";
    finalScoreElement.textContent = score;
}

function restartGame() {
    document.location.reload();
}

restartButton.addEventListener("click", restartGame);

function update() {
    if (gameOver || gamePaused) return;
    
    adjustDifficulty();

    patate.velocityY += patate.gravity;
    patate.y += patate.velocityY;

    if (moveLeft) patate.velocityX = -3;
    else if (moveRight) patate.velocityX = 3;
    else patate.velocityX = 0;

    patate.x += patate.velocityX;

    if (ground.visible && patate.y + patate.height >= ground.y) {
        patate.y = ground.y - patate.height;
        patate.velocityY = 0;
        patate.onGround = true;
    }

    if (patate.x + patate.width < 0) patate.x = canvas.width;
    else if (patate.x > canvas.width) patate.x = -patate.width;

    if (patate.y < canvas.height / 2) {
        platforms.forEach((plat) => {
            plat.y += Math.abs(patate.velocityY);
            if (plat.y > canvas.height) {
                plat.y = -10;
                plat.x = Math.random() * (canvas.width - 80);
                plat.type = Math.random() > 0.8 ? "boost" : "normal";
                plat.touched = false; 
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

    platforms.forEach((plat) => {
        if (
            patate.velocityY > 0 &&
            patate.y + patate.height > plat.y &&
            patate.y + patate.height - patate.velocityY <= plat.y &&
            patate.x + patate.width > plat.x && 
            patate.x < plat.x + plat.width
        ) {
            if (!plat.touched) {
                if (plat.type === "boost") {
                    score += 5;
                } else {
                    score += 1;
                }
                plat.touched = true;
                document.getElementById("score").textContent = "Score : " + score;
            }

            patate.y = plat.y - patate.height;
            patate.velocityY = plat.type === "boost" ? patate.jumpPower * 1.5 : patate.jumpPower;

            if (!patate.firstPlatformTouched) {
                patate.firstPlatformTouched = true;
                ground.visible = false;
            }
        }
    });

    if (patate.y > canvas.height) {
        showGameOverScreen();
        return;
    }

    draw();
    requestAnimationFrame(update);
}

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

patateImg.onload = () => {
    update();
};
