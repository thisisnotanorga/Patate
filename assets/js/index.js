/*

'||''|.   ..|''||   |''||''|     |     |''||''|  ..|''||   
 ||   || .|'    ||     ||       |||       ||    .|'    ||  
 ||...|' ||      ||    ||      |  ||      ||    ||      || 
 ||      '|.     ||    ||     .''''|.     ||    '|.     || 
.||.      ''|...|'    .||.   .|.  .||.   .||.    ''|...|'  
                                                           
                                                           
POTATO.THESERVER.LIFE
LICENSE GPL-3.0

-------------------------------
index.js
-
Main entry file
*/




import { 
    initGame, 
    startGame, 
    setControlsActive 
} from './gameCore.js';
import { 
    initUI, 
    createNewAccount, 
    fetchAccount, 
    skipAccount,
    showPseudoForm,
    hidePseudoForm,
    updateProfileDisplay,
} from './ui.js';
import { 
    startLeaderboardUpdates, 
    startScoreSubmitInterval,
    fetchUserData
} from './leaderboard.js';

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    initUI();
    
    const inputFields = document.querySelectorAll('input, textarea');
    inputFields.forEach(field => {
        field.addEventListener('focus', () => {
            setControlsActive(false);
        });
        
        field.addEventListener('blur', () => {
            setControlsActive(true);
        });
    });
    
    const storedUid = localStorage.getItem("uid");
    const storedPseudo = localStorage.getItem("pseudo");

    if (storedUid && storedPseudo) {
        window.uid = storedUid;
        window.pseudo = storedPseudo;
        window.pseudoSubmitted = true;
        updateProfileDisplay();
        fetchUserData();
        hidePseudoForm();
        startLeaderboardUpdates();
        if (window.uid) {
            startScoreSubmitInterval();
        }
        startGame();
    } else {
        showPseudoForm();
    }

    document.getElementById("submitChangePseudo").addEventListener("click", createNewAccount);
    document.getElementById("submitFetchUid").addEventListener("click", fetchAccount);
    document.getElementById("skipPseudo").addEventListener("click", () => {
        skipAccount();
        startGame();
    });
    
    document.getElementById("submitPseudo").addEventListener("click", () => {
        const newPseudo = document.getElementById("pseudo").value.trim();
        if (newPseudo) {
            fetch(`leaderboard/?create=${encodeURIComponent(newPseudo)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        if (data.error === "Your username contains forbidden words. Please choose a different one.") {
                            const errorMsg = "Your username contains forbidden words. Please choose a different one.";
                            alert(errorMsg);
                            
                            document.getElementById("pseudo").focus();
                            
                        } else {
                            alert(data.error);
                        }
                        return;
                    }

                    window.pseudo = data.pseudo;
                    window.uid = data.uid;
                    localStorage.setItem("pseudo", window.pseudo);
                    localStorage.setItem("uid", window.uid);

                    window.pseudoSubmitted = true;
                    hidePseudoForm();
                    updateProfileDisplay();
                    startLeaderboardUpdates();
                    startScoreSubmitInterval();
                    startGame();
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Failed to create an account.");
                });
        }
    });
});

window.pseudo = "Guest";
window.uid = "";
window.pseudoSubmitted = false;
window.score = 0;
window.gameOver = false;
window.gamePaused = false;
window.lastSubmittedScore = 0;