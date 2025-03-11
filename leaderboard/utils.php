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
utils.php
-
Different utilities
*/





function respondWithError($message) {
    echo json_encode(["error" => $message]);
}


function respondWithData($data) {
    echo json_encode($data);
}


function respondWithSuccess($additionalData = []) {
    $response = ["success" => true];
    if (!empty($additionalData)) {
        $response = array_merge($response, $additionalData);
    }
    echo json_encode($response);
}


function getPostData() {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input === null) {
        $input = $_POST;
    }
    return $input;
}


function formatPseudoWithUid($pseudo, $uid) {
    return $pseudo . ' [' . substr($uid, 0, 2) . substr($uid, -2) . ']';
}
?>