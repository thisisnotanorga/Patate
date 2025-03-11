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
nameCheck.php
-
Name filter for user creation
*/

function containsForbiddenWord($text) {
    $nonowordsPath = __DIR__ . '/nonowords.txt';

    
    $forbiddenWords = file($nonowordsPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    if (!$forbiddenWords) {
        return false;
    }
    
    $text = strtolower($text);
    
    foreach ($forbiddenWords as $word) {
        $word = trim(strtolower($word));
        if (empty($word)) {
            continue;
        }
        
        if (strpos($text, $word) !== false) {
            return true;
        }
    }
    
    return false;
}

function getForbiddenWordError() {
    return "Your username contains forbidden words. Please choose a different one.";
}
?>