<?php

    $USERNAME = 'vishakna_friends';     //database username
    $PASSWORD = 'trumpsterfriends';     //database password
    $DATABASE = 'vishakna_trumpster';   //database name
    $URL = 'localhost';                 //database location

    mysql_connect($URL, $USERNAME, $PASSWORD);
    mysql_select_db($DATABASE) or die('Cannot connect to database.');
        
    $getWhat = $_GET["value"];
    
    if($getWhat == "friends")
    {
        $returnArray = array();

        $query = 'SELECT * FROM friends_info';
        $result = mysql_query($query);

        while($row = mysql_fetch_assoc($result))
        {
            array_push($returnArray, $row); 
        }

        mysql_close();
        echo json_encode($returnArray);
    }
    
?>