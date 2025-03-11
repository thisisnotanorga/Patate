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
scoreUpdate.php
-
Leaderboard score manager
*/




require_once("utils.php");
require_once("preventUltraScore.php");


function updateUserScore($conn, $uid, $score) {
    $stmt = $conn->prepare("UPDATE leaderboard SET score = ? WHERE uid = ?");
    $stmt->bind_param("is", $score, $uid);
    $result = $stmt->execute();
    $stmt->close();
    return $result;
}


function createUnknownUser($conn, $uid, $score) {
    $pseudoDefault = "Unknown";
    $stmt = $conn->prepare("INSERT INTO leaderboard (uid, pseudo, score) VALUES (?, ?, ?)");
    $stmt->bind_param("ssi", $uid, $pseudoDefault, $score);
    $result = $stmt->execute();
    $stmt->close();
    return $result;
}


function checkExistingScore($conn, $uid) {
    $stmt = $conn->prepare("SELECT score FROM leaderboard WHERE uid = ?");
    $stmt->bind_param("s", $uid);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();
    
    return $row;
}

try {
    $input = getPostData();
    
    $uid = isset($input['uid']) ? trim($input['uid']) : "";
    $score = isset($input['score']) ? intval($input['score']) : 0;
    $isGameEnd = isset($input['gameEnd']) ? boolval($input['gameEnd']) : false;

    if (empty($uid) || !is_numeric($score)) {
        respondWithError("UID and score are required for updating");
        exit;
    }

    $existingScore = checkExistingScore($conn, $uid);
    
    if ($isGameEnd && $existingScore !== null) {
        updateGameCounter($conn, $uid);
    }

    if ($existingScore !== null) {
        $currentScore = intval($existingScore['score']);
        
        if ($score > $currentScore && isScoreValid($conn, $uid, $score, $isGameEnd)) {
            updateUserScore($conn, $uid, $score);
        }
    } else {
        if (isScoreValid($conn, $uid, $score)) {
            createUnknownUser($conn, $uid, $score);
        }
    }
    
    require_once("leaderboard.php");
} catch (Exception $e) {
    respondWithError("Server error: " . $e->getMessage());
}
?>