<?php
/*

'||''|.   ..|''||   |''||''|     |     |''||''|  ..|''||   
 ||   || .|'    ||     ||       |||       ||    .|'    ||  
 ||...|' ||      ||    ||      |  ||      ||    ||      || 
 ||      '|.     ||    ||     .''''|.     ||    '|.     || 
.||.      ''|...|'    .||.   .|.  .||.   .||.    ''|...|'  
                                                           
                                                           
POTATO.THESERVER.LIFE
LICENSE GPL-3.0

-------------------------------
adminInterface.php
-
Drop page gui
*/






require_once("config.php");


function displayAdminInterface($resetPassword) {
    header('Content-Type: text/html; charset=UTF-8');
    echo '<!DOCTYPE html>
    <html>
    <head>
        <title>Bye Bye LB</title>
        <style>
            #dropButton {
                position: absolute;
            }
        </style>
    </head>
    <body>
        <button id="dropButton">Drop</button>
        <script>
            const button = document.getElementById("dropButton");
            let clickCount = 0;
            const password = "' . htmlspecialchars($resetPassword, ENT_QUOTES, 'UTF-8') . '";

            function repositionButton() {
                const maxWidth = window.innerWidth - 100;
                const maxHeight = window.innerHeight - 50;
                
                const randomX = Math.floor(Math.random() * maxWidth);
                const randomY = Math.floor(Math.random() * maxHeight);
                
                button.style.left = randomX + "px";
                button.style.top = randomY + "px";
            }

            function updateButtonColor() {
                const colorIntensity = Math.floor((clickCount / 10) * 255);
                button.style.backgroundColor = `rgb(255, ${255 - colorIntensity}, ${255 - colorIntensity})`;
            }

            repositionButton();
            
            button.addEventListener("click", function() {
                clickCount++;
                updateButtonColor();
                
                if (clickCount < 10) {
                    repositionButton();
                } else {
                    fetch(window.location.pathname + "?executeDropTable=" + encodeURIComponent(password))
                    .then(response => response.json())
                    .then(data => {
                        button.disabled = true;
                        if (data.success) {
                            alert("Yay! Table has gone boom");
                        } else {
                            alert("Error: " + (data.error || "Idk men"));
                        }
                    })
                    .catch(error => {
                        alert("Error");
                    });
                }
            });
        </script>
    </body>
    </html>';
}

displayAdminInterface($resetPassword);
?>