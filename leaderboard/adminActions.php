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
adminActions.php
-
Delete table lb
*/



require_once("config.php");
require_once("database.php");
require_once("utils.php");

try {
    if ($_GET['executeDropTable'] === $resetPassword) {
        $result = dropLeaderboardTable($conn);
        
        if ($result) {
            respondWithSuccess();
        } else {
            respondWithError("Échec de la suppression de la table");
        }
    } else {
        require_once("leaderboard.php");
    }
} catch (Exception $e) {
    respondWithError($e->getMessage());
}
?>