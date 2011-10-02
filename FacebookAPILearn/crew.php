<?php

    if (isset($_GET["action"])) 
    {
        include('includes/header.php');
    } 
    else
    {
        include('includes/subheader.php');   
    }
    
    $neighbor_path = $facebook_canvas_location . $_SERVER["SCRIPT_NAME"];
    $add_neighbor_path = $neighbor_path . '?action=add&neighbor=' . $user;
    
    $content = <<<END
        <fb:name uid="$user" firstnameonly="true" shownetwork="false"/>
        thinks you should start building your <a href="$add_neighbor_path"/>Trumpster</a>
        gang!
        <fb:req-choice url="$add_neighbor_path" label="Add Trumpsters on your profile"/>
END;
?> 

<?php if ($user): ?>
    <?php
        
        $e_friends = array();
        $pending_friends = array();
        $playing_friends = array();
        $neighbor_friends = array();
    
        $attrs = $user.'/friends?access_token=';
        $url = $fb_graph_url . $attrs . $access_token;  
        $fb_friends_data = getJsonData($url);
        
        $friends_array = json_decode($fb_friends_data, true);
        storeJsonDataToDb($friends_array[data]);
        
        $dbUrl = 'http://vishaknag.com/fbapp/get/?value=friends';
        $friendsDbData = getJsonData($dbUrl);
        $friends = json_decode($friendsDbData); 
        
        $friendsCount = count($friends);
        
        for($i = 0; $i < $friendsCount; $i++) 
        {   
            if($friends[$i]->status == 'N' || $friends[$i]->status == 'P' || ($friends[$i]->status == 'F' && isset($friends[$i]->player))) 
            {
                $e_friends[] = $friends[$i]->fbId;
            }

            if($friends[$i]->status == 'N') 
            {
                $pending_friends[] = $friends[$i];
            }

            if ($friends[$i]->status == 'N' && isset($friends[$i]->player)) 
            {
                $playing_friends[] = $friends[$i];
            }

            if ($friends[$i]->status == 'N') 
            {
                $neighbor_friends[] = $friends[$i];
            }
        }
  
    $exclude_friends = implode(',', $e_friends);
?>
<?php endif ?>

<script type="text/javascript">/* <![CDATA[ */

    $(document).ready(function() { $('#neighborDiv').show(); }); /* ]]> */

</script>

<div style="display:none;" id="neighborDiv">
    
    <div style="width:592px; margin-left:84px; margin-right:auto;">
        
    <?
        foreach($playing_friends as $friend) 
        {
    ?>
            <div style="vertical-align: top; height:70px; position:relative; width:592px; text-align: right">
                <div class="addNeighbor" style="vertical-align: bottom; height:70px; background-image:url('<? echo $trump_assets_url ?>images/tmp/AddToCrew.png'); position:relative; width:592px; text-align: right">
                    <div style="position:absolute; right:15px; bottom:12px;">
                        <fb:request-form
                            action="<?= $trump_game_url ?><?= $_SERVER["SCRIPT_NAME"] ?>?action=add&neighbor=<?= $friend->fbId ?>"
                            method="post"
                            type="TrafficKing Neighbor"
                            invite="false"
                            content="<? echo htmlentities($content,ENT_COMPAT,'UTF-8'); ?>"
                            import_external_friends="false">
                            <fb:request-form-submit uid="<?= $friend->fbId ?>" label="Add %n as a neighbor" />
                        </fb:request-form>
                    </div>
                </div>
                                           
                <img src="http://graph.facebook.com/<?= $friend->fbId ?>/picture" style="position:absolute; left:31px; top:7px;" />
                
            </div>
    <?
        }   // foreach
    ?>

    </div>
    
</div>