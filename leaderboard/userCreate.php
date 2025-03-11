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
userCreate.php
-
User creation system
*/

require_once("utils.php");
require_once("nameCheck.php");

function createUser($conn, $pseudo) {
    if (containsForbiddenWord($pseudo)) {
        return false;
    }
    
    $uid = uniqid();
    $initialScore = 0;

    $stmt = $conn->prepare("INSERT INTO leaderboard (uid, pseudo, score) VALUES (?, ?, ?)");
    $stmt->bind_param("ssi", $uid, $pseudo, $initialScore);
    $result = $stmt->execute();
    $stmt->close();
    
    if ($result) {
        return ["pseudo" => $pseudo, "uid" => $uid];
    } else {
        return false;
    }
}

try {
    if (empty($_GET['create'])) {
        respondWithError("Pseudo is required for creation");
        exit;
    }

    $pseudo = trim($_GET['create']);
    
    if (containsForbiddenWord($pseudo)) {
        respondWithError(getForbiddenWordError());
        exit;
    }
    
    $result = createUser($conn, $pseudo);
    
    if ($result) {
        respondWithData($result);
    } else {
        respondWithError("Failed to create user");
    }
} catch (Exception $e) {
    respondWithError("Server error: " . $e->getMessage());
}
?>