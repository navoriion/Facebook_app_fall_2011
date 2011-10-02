<?php

    include('facebook.php');
    include('settings.php');
    include('services.php');
    include('core.php');

    $facebook = new Facebook(array(
      'appId'  => $facebook_app_id, 
      'secret' => $facebook_app_secret,
      'cookie' => true,
    ));
   
    
    function fbredirect($url = NULL) 
    {
        if(!isset($url)) 
        {
            global $facebook_canvas_location;
            $url = $facebook_canvas_location;
        }
        elseif(substr($url, 0, 1) == '/') 
        {
            $url = $facebook_canvas_location . substr($url, 1);
        }
        
        foreach ($_POST as $key => $value) 
        {
                if ($key == "ids") 
                {
                        $pageURL = 'http';

                        // $_SERVER is an array containing information such as headers, paths, 
                        // and script locations. The entries in this array are created by the web server.
                        if ($_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
                        $pageURL .= "://";

                        if ($_SERVER["SERVER_PORT"] != "80") 
                        {
                                $pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
                        }
                        else 
                        {
                                $pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
                        }
                        header('Location: ' . $pageURL . "&" . $key . "=" . implode(",", $value));
                }
        }
        
        echo <<<END
        <html><head>
        <script>
            top.location = '$url';
        </script>
        </head></html> 
END;

        exit;
    }
    
    
    try
    {
        $user = $facebook->getUser();
        
        if($user)
        {
            try 
            {
                $user_profile = $facebook->api('/me');

            } 
            catch (FacebookApiException $e) 
            {
                error_log($e);
                $user = null;
            }
        }
    }
    catch (FacebookApiException $e) 
    {
        error_log($e);
    }


    if($user)
    {
        $logoutUrl = $facebook->getLogoutUrl();
    }
    else
    {
        //If this application hasn't been authorized by the user, redirect them to the login page
        $loginUrl = $facebook->getLoginUrl(array('scope' => 'publish_stream, user_likes, user_photos, user_groups'));
        fbredirect($loginUrl);
    }
    
    $access_token = $_SESSION['fb_261260527237365_access_token'];
    
    $services = new Services($trump_services_url, $access_token);
    
    try {
        // Before processing the request
        // check if we got the right permission
        $perms = $facebook->api(array(
            "method"    => "fql.query",
            "query"     => "SELECT publish_stream, user_likes, user_photos, user_groups FROM permissions WHERE uid=me()"
        ));
        if($perms[0]['publish_stream']==='1' && $perms[0]['user_likes']==='1' && $perms[0]['user_photos']==='1' && $perms[0]['user_groups']==='1') {
            // We have the right permissions
        }
        else {
            // We do not have the right permissions
            $loginUrl = $facebook->getLoginUrl(array('scope' => 'publish_stream, user_likes, user_photos, user_groups'));
            fbredirect($loginUrl);
        }
    }
    catch (FacebookApiException $e) {
        error_log($e);
    }
?>

<html xmlns:fb="http://www.facebook.com/2008/fbml">
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
        <meta http-equiv="Pragma" Content="no-cache" />
        <meta http-equiv="Cache-Control" Content="no-cache" />
        <meta http-equiv="Expires" Content="0" />

        <script type="text/javascript">
            var trump_assets_url = "<?= $trump_assets_url ?>";
            var trump_canvas_url = "<?= $facebook_canvas_location ?>";
            var facebook_user_id = <?= $user ?>;
        </script>
        
        <script type="text/javascript">

        function navigateToInviteCrew() 
        {
            try
            {
                parent.buttonClick("Button_MyCrew_");
            }
            catch (err)
            {
                top.location = "<?= $facebook_canvas_location ?>?forward=mycrew";
            }
        }

        </script>

        <!-- JQuery includes -->
        <script type="text/javascript" src="<?= $trump_assets_url ?>/js/jquery-1.4.4.min.js"></script>
        <script type="text/javascript" src="<?= $trump_assets_url ?>/js/jquery-1.6.2.js"></script>
        
        <!-- Game JS includes -->
        <script type="text/javascript" src="<?= $trump_assets_url ?>/js/trump.js"></script>
        
        <!-- Effects JS includes -->
	<script src="<?= $trump_assets_url ?>js/effects/ui/jquery.effects.core.js"></script>
	<script src="<?= $trump_assets_url ?>js/effects/ui/jquery.effects.explode.js"></script>
        <script src="<?= $trump_assets_url ?>js/effects/effects.js"></script>
        
        <!-- Game CSS includes -->
        <link rel="stylesheet" href="<?= $trump_assets_url ?>css/styles.css" type="text/css">
        
        <!-- Effects CSS includes -->
        <link rel="stylesheet" href="<?= $trump_assets_url ?>js/effects/themes/base/jquery.ui.all.css" type="text/css">
        
    </head>

    <body>
          
        <!-- Asynchronously Initialize JavaScript SDK with your app id, allowing you to 
           then make calls against the Facebook API -->
        <div id="fb-root"></div>

        <script type="text/javascript">

            if(window.top == window)
		top.location = '<? echo $facebook_canvas_location  ?>'; 

            window.fbAsyncInit = function() 
            {
                FB.init(
                            { 
                                appId: <?= $facebook_app_id ?>,
                                status: true,
                                cookie: true,
                                oauth : true,   //enables OAuth 2.0
                                xfbml  : true,  // parse XFBML
                                channelUrl : 'http://fbapp/vishaknag.com/includes/channel.html'
                            }
                        );

                FB.Canvas.setAutoResize();
                FB.XFBML.parse();
                
                FB.Event.subscribe('auth.login', function(response) {
                    top.location = '<? echo $facebook_canvas_location ?>'; 
                });
                
            };

            (function() 
                {
                    var e = document.createElement('script'); e.async = true;
                    e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
                    document.getElementById('fb-root').appendChild(e);
                }()
            );

        </script> 