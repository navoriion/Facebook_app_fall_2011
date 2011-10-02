<? include('includes/header.php'); ?>

<!-- body tag started in header.php -->    
    <div align="center">
    <a href="JavaScript:void(0);" target="_top" style="text-decoration:none;" onmouseover="mouseover('Button_Play_')" onmouseout="mouseout('Button_Play_')" onclick="buttonclick('Play_'); return false;">

        <?
            if (!isset($_GET['forward']) || $_GET['forward'] == 'play') 
            {
        ?>
                
                <img src= "<? echo $trump_assets_url ?>images/tmp/Button_Play_Active.png" id="Button_Play_" border="0" />

        <?
            }
            else
            {
        ?>

                <img src= "<? echo $trump_assets_url ?>images/tmp/Button_Play_Up.png" id="Button_Play_" border="0" />

        <?
            }
        ?>

    </a>

    <a href="JavaScript:void(0);" target="_top" style="text-decoration:none;" onmouseover="mouseover('Button_MyCrew_')" onmouseout="mouseout('Button_MyCrew_')" onclick="buttonclick('MyCrew_'); return false;">

        <?
            if (isset($_GET['forward']) && $_GET['forward'] == 'mycrew') 
            { 
        ?>

                <img src= "<?php echo $trump_assets_url ?>images/tmp/Button_MyCrew_Active.png" id="Button_MyCrew_" border="0" />

        <?
            }
            else
            {
        ?>

                <img src= "<?php echo $trump_assets_url ?>images/tmp/Button_MyCrew_Up.png" id="Button_MyCrew_" border="0" />

        <?
            }
        ?>

    </a>

    <a href="JavaScript:void(0);" target="_top" style="text-decoration:none;" onmouseover="mouseover('Button_InviteFriends_')" onmouseout="mouseout('Button_InviteFriends_')" onclick="buttonclick('InviteFriends_'); return false;">

        <?
            if (isset($_GET['forward']) && $_GET['forward'] == 'invitefriends') 
            {
        ?>

                <img src= "<?php echo $trump_assets_url ?>images/tmp/Button_InviteFriends_Active.png" id="Button_InviteFriends_" border="0" />

        <?
            }
            else
            {
        ?>

                <img src= "<?php echo $trump_assets_url ?>images/tmp/Button_InviteFriends_Up.png" id="Button_InviteFriends_" border="0" />

        <?
            }
        ?>

    </a>
    </div>
    <div id="sizerDiv" name="sizerDiv" style="height:1000px;"></div>
        <div style="top:50px;">
            <iframe 
                    name="Play_iFrame" 
                    id="Play_iFrame" 
                    src="<?= $trump_game_url ?>play.php" 
                    frameBorder="0" 
                    style="width:758px;overflow-x:hidden;height:1000px;position:absolute;left:<?= (isset($_GET['forward'])? (isset($_GET['forward']) && $_GET['forward'] != "play"? -10000 : 0) : 0) ?>px;top: 40px;">
            </iframe>

            <iframe 
                    name="MyCrew_iFrame" 
                    id="MyCrew_iFrame" 
                    src="<?= $trump_game_url ?>crew.php" 
                    frameBorder="0" 
                    style="width:758px;overflow:hidden;height:1000px;position:absolute;left:<?= (isset($_GET['forward']) && $_GET['forward'] == 'mycrew'? 0 : -10000) ?>px;top: 40px;">
            </iframe>

            <iframe 
                    name="InviteFriends_iFrame" 
                    id="InviteFriends_iFrame" 
                    src="<?= $trump_game_url ?>newcrew.php" 
                    frameBorder="0" 
                    style="width:758px;overflow-x:hidden;height:1000px;position:absolute;left:<?= (isset($_GET['forward']) && $_GET['forward'] == 'invitefriends'? 0 : -10000) ?>px;top: 40px;">
            </iframe>
      </div>
</body>
</html>
