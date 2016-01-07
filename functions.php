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
        
    default:
        break;
        
}

echo $res;

function book($p){
    
    mysql_connect("localhost", "videodesk", "ju87gtS") or
    die("Impossible de se connecter : " . mysql_error());
    mysql_select_db("simplybook");
    
    $token = $p['codeid'];
    $confirmed = true;
    $event = $p['event'];
    $unit = $p['unit'];
    $start_date_time = $p['time'];
    $end_date_time = $p['time'];
    
    $sql = 'INSERT INTO `simplybook`.`booking` (`id`, `booking_id`, `event_id`, `unit_id`, `start_date_time`, `end_date_time`, `is_confirmed`, `code`, `token`,`hash`, `user_id`) VALUES ' ;
    $sql .= '(NULL, '. $token .', '. $event.', '. $unit .', "'. $start_date_time .'", "'.$end_date_time .'", '. $confirmed .',"'. $token .'", "'. $token .'","abcdefg", 1111);' ;
    
    mysql_query($sql);
    
    return "succe";
}

function getBookingInfo($p){
    
    mysql_connect("localhost", "videodesk", "ju87gtS") or
    die("Impossible de se connecter : " . mysql_error());
    mysql_select_db("simplybook");
    
    $sql = 'SELECT * FROM `simplybook`.booking WHERE token = "'. $p[ 'code' ] .'"' ;
    $result = mysql_query($sql);

    $row = mysql_fetch_array($result, MYSQL_ASSOC) ;
    return json_encode($row);
    
}

function startCall($p){
    
    mysql_connect("localhost", "videodesk", "ju87gtS") or
    die("Impossible de se connecter : " . mysql_error());
    mysql_select_db("simplybook");
    
    $sql = 'UPDATE `simplybook`.booking set has_started = 1 WHERE token = "'. $p[ 'code' ] .'"' ;
    $result = mysql_query($sql);

    $row = mysql_fetch_array($result, MYSQL_ASSOC) ;
    return "success";
    
}
