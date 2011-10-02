<?php

    include("includes/settings.php");
    
    function getJsonData($url)
    {
        $ch = curl_init();
        $timeout = 5;
        curl_setopt($ch,CURLOPT_URL,$url);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
    }
    
    
    function storeJsonDataToDb($data)
    {
        $USERNAME = 'vishakna_friends';     //database username
        $PASSWORD = 'trumpsterfriends';     //database password
        $DATABASE = 'vishakna_trumpster';   //database name
        $URL = 'localhost';                 //database location
        
        // Connect to trumpsters database
        $con = mysql_connect($URL, $USERNAME, $PASSWORD);
        mysql_select_db($DATABASE) or die('Cannot connect to database.');
                
        $data_length  = count($data);
        
        $query = "TRUNCATE TABLE friends_info";
        executeQuery($query, $con, "Table Cleared");
        
        // Add all the friends to the table friends_info
        for($i = 0; $i < $data_length; $i++)
        {
            $id = $data[$i][id];
            // STATUS - PLAYER - FBID
            $query = "INSERT INTO friends_info VALUES('N', '1', '$id')";   
            executeQuery($query, $con, "1 record added");
        }
    
        mysql_close($con);
    }
    
    
    function executeQuery($query, $con, $success_msg)
    {
        
        if (!mysql_query($query,$con))
        {
            die('Error: ' . mysql_error());
        }
        else 
        {
            //echo $success_msg;
        }
    }
?>
