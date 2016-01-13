<?php


$p = $_POST;
$res = 'fail';

switch($p['method']){
    
    case 'book':
        $res = book($p);
        break;
        
    case 'getBookingInfo':
        $res = getBookingInfo($p);
        break;
        
    case 'startCall':
        $res = startCall($p);
        break;
        
    case 'generateToken':
        $res = generateToken($p);
        break;
    case 'updateToken':
        $res = updateToken($p);
        break;
    default:
        break;
        
}

echo $res;

function book($p){
    
    mysql_connect("localhost", "videodesk", "ju87gtS") or
    die("Impossible de se connecter : " . mysql_error());
    mysql_select_db("simplybook");
    
    $code = $p['codeid'];
    $token = $p['token'];
    $confirmed = true;
    $event = $p['event'];
    $unit = $p['unit'];
    $start_date_time = $p['time'];
    $end_date_time = $p['time'];
    $timezone = $p['timezone'];
    
    $sql = 'INSERT INTO `simplybook`.`booking` (`id`, `booking_id`, `event_id`, `unit_id`, `start_date_time`, `end_date_time`, `is_confirmed`, `code`, `token`,`hash`, `user_id`,`timezone`) VALUES ' ;
    $sql .= '(NULL, '. $code .', '. $event.', '. $unit .', "'. $start_date_time .'", "'.$end_date_time .'", '. $confirmed .',"'. $code .'", "'. $token .'","abcdefg", 1111,"'.$timezone.'");' ;
    
    mysql_query($sql);
    
    return $sql;
}

function getBookingInfo($p){
    
    mysql_connect("localhost", "videodesk", "ju87gtS") or
    die("Impossible de se connecter : " . mysql_error());
    mysql_select_db("simplybook");
    
    switch($p['index']){
        case 'code':
            $sql = 'SELECT * FROM `simplybook`.booking WHERE code = "'. $p[ 'code' ] .'"' ;
            break;
        case 'token':
            $sql = 'SELECT * FROM `simplybook`.booking WHERE token = "'. $p[ 'token' ] .'"';
            break;
        default:
            break;
    }
    
    $result = mysql_query($sql);

    $row = mysql_fetch_array($result, MYSQL_ASSOC) ;
    return json_encode($row);
    
}


function startCall($p){
    
    mysql_connect("localhost", "videodesk", "ju87gtS") or
    die("Impossible de se connecter : " . mysql_error());
    mysql_select_db("simplybook");
    
    $sql = 'UPDATE `simplybook`.booking set has_started = 1 WHERE code = "'. $p[ 'code' ] .'"' ;
    $result = mysql_query($sql);

    $row = mysql_fetch_array($result, MYSQL_ASSOC) ;
    return "success";
    
}

function generateToken($p){
    $p = implode('|',$p);
    return md5("$p");
}

function updateToken($p){
    
    mysql_connect("localhost", "videodesk", "ju87gtS") or
    die("Impossible de se connecter : " . mysql_error());
    mysql_select_db("simplybook");
    
    $sql = 'UPDATE `simplybook`.booking set token ="'. $p['new_token'] .'" WHERE token = "'. $p[ 'old_token' ] .'"' ;
    $result = mysql_query($sql);

    $row = mysql_fetch_array($result, MYSQL_ASSOC) ;
    return "success";
}