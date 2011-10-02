<? include('includes/subheader.php'); ?>

<?php if ($user): ?>

    <?php 
        
        // Fetch Friends count
        $attrs = $user.'/friends?access_token=';
        $url = $fb_graph_url . $attrs . $access_token;  
        $fb_friends_data = getJsonData($url);
        $friends_array = json_decode($fb_friends_data, true);
        $friends_count  = count($friends_array[data]);
        //echo $friends_count

        // Fetch Page Likes count
        $attrs = 'me/likes?access_token=';
        $url = $fb_graph_url . $attrs . $access_token;  
        $fb_likes_data = getJsonData($url);
        $likes_array = json_decode($fb_likes_data, true);
        $likes_count  = count($likes_array[data]);
        //echo $likes_count;

        // Fetch Albums count
        $attrs = $user.'/albums?access_token=';
        $url = $fb_graph_url . $attrs . $access_token;  
        $fb_albums_data = getJsonData($url);
        $albums_array = json_decode($fb_albums_data, true);
        $albums_count  = count($albums_array[data]);

        // Fetch Groups count
        $attrs = 'me/groups?access_token=';
        $url = $fb_graph_url . $attrs . $access_token;  
        $fb_groups_data = getJsonData($url);
        $groups_array = json_decode($fb_groups_data, true);
        $groups_count  = count($groups_array[data]);
        //echo $groups_count;

    ?>
<?php endif ?>

<div class="topDiv">                    

    <div class="card">
        <img src="<? echo $trump_assets_url ?>images/fb_trump_card_proto1.png"/> 
    </div>

    <div class="picture">
        <img src="<?= $fb_graph_url ?><?= $user ?>/picture?type=large" height="225px" width="210px"/> 
    </div>

    <div class="username"> 
        <h1><?= $user_profile[first_name] ?><br/></h1>
    </div>

    <div class="prop1" >
        <h3>Friends</h3>  
    </div>

    <div class="prop1val">
        <h3><?= $friends_count ?></h3>  
    </div>

    <div class="prop2">
        <h3>Likes</h3>  
    </div>

    <div class="prop2val">
        <h3><?= $likes_count ?></h3>  
    </div>

    <div class="prop3">
        <h3>Albums</h3>  
    </div>

    <div class="prop3val">
        <h3><?= $albums_count ?></h3>  
    </div>

    <div class="prop4">
        <h3>Groups</h3>  
    </div>

    <div class="prop4val">
        <h3><?= $groups_count ?></h3>   
    </div>

</div>  