<?php

    if (isset($_GET["action"])) 
    {
        include('includes/header.php');
    } 
    else
    {
        include('includes/subheader.php');
    }

?>

<?php if ($user): ?>
    <?php
         
        $attrs = $user.'/friends?access_token=';
        $url = $fb_graph_url . $attrs . $access_token;  
        $fb_friends_data = getJsonData($url);
        $friends_array = json_decode($fb_friends_data, true);
        storeJsonDataToDb($friends_array[data]);
        
        $dbUrl = 'http://vishaknag.com/fbapp/get/?value=friends';
        $value = getJsonData($dbUrl);
        $valueArray = json_decode($value);
        
    ?>    
<?php endif ?>