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
preventUltraScore.php
-
Anti-cheat system for the leaderboard
*/

function isScoreValid($conn, $uid, $newScore, $isGameEnd = false) {
    require_once "config.php";
    global $absoluteMaxScore, $newPlayersMaxScore, $maxRateAllowed;
    
    if ($newScore > $absoluteMaxScore) {
        return false;
    }
    
    $stmt = $conn->prepare("SELECT score, last_update, games_played FROM leaderboard WHERE uid = ?");
    $stmt->bind_param("s", $uid);
    $stmt->execute();
    $result = $stmt->get_result();
    $userData = $result->fetch_assoc();
    $stmt->close();
    
    if (!$userData) {
        return $newScore <= $newPlayersMaxScore;
    }
    
    $previousScore = intval($userData['score']);
    $gamesPlayed = intval($userData['games_played']);
    $lastUpdate = strtotime($userData['last_update']);
    $currentTime = time();
    $timeDiff = max(1, $currentTime - $lastUpdate);
    
    if ($newScore <= $previousScore) {
        return true;
    }
    
    $scoreIncrease = $newScore - $previousScore;
    $scoreRatePerSecond = $scoreIncrease / $timeDiff;
    
    $adjustedMaxRate = $maxRateAllowed;
    if ($timeDiff < 10) {
        $adjustedMaxRate = 10.0;
    } else if ($timeDiff > 3600) {
        $adjustedMaxRate = 1.0;
    }
    
    if ($previousScore > 200) {
        $adjustedMaxRate *= (1.0 / log10(max(2, $previousScore / 100)));
    }
    
    if ($gamesPlayed < 5) {
        $maxAllowedScore = min(1000, $previousScore * 2);
        if ($newScore > $maxAllowedScore) {
            if ($isGameEnd && $newScore <= $previousScore * 3 && $newScore <= 1500) {
                return true;
            }
            return false;
        }
    } else {
        $maxAllowedScore = $previousScore * (1 + (10.0 / $gamesPlayed));
        if ($newScore > $maxAllowedScore && $newScore > 500) {
            if ($isGameEnd && $newScore <= $previousScore * 2 && $newScore <= 2000) {
                return true;
            }
            return false;
        }
    }
    
    $rateMultiplier = $isGameEnd ? 5.0 : 1.0;
    $increaseThreshold = $isGameEnd ? 200 : 100;
    
    if ($scoreRatePerSecond > ($adjustedMaxRate * $rateMultiplier) && $scoreIncrease > $increaseThreshold) {
        return false;
    }
    
    return true;
}

function updateGameCounter($conn, $uid) {
    $stmt = $conn->prepare("UPDATE leaderboard SET games_played = games_played + 1 WHERE uid = ?");
    $stmt->bind_param("s", $uid);
    $result = $stmt->execute();
    $stmt->close();
    return $result;
}
?>