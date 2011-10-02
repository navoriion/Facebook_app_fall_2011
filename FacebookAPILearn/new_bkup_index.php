<?php

include('facebook.php');
include('settings.php');
include('services.php');

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
    $services = new Services($trump_services_url, base64_encode(json_encode($user)));
}
else
{
    //If this application hasn't been authorized by the user, redirect them to the login page
    $loginUrl = $facebook->getLoginUrl();
    fbredirect($loginUrl);
}

?>

<html xmlns:fb="http://www.facebook.com/2008/fbml">
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />

        <script type="text/javascript">
            var trump_assets_url = "<?= $trump_assets_url ?>";
            var trump_canvas_url = "<?= $facebook_canvas_location ?>";
        </script>

        <script type="text/javascript" src="<?= $trump_assets_url ?>/js/jquery-1.4.4.min.js"></script>
        <script type="text/javascript" src="<?= $trump_assets_url ?>/js/trump.js"></script>

        <style type="text/css">
            body 
            {
                    margin: 0;
                    padding: 0;
            }
        </style>
    </head>

    <body>
          
        <!-- Asynchronously Initialize JavaScript SDK with your app id, allowing you to 
           then make calls against the Facebook API -->
        <div id="fb-root"></div>

        <script type="text/javascript">

            
            window.fbAsyncInit = function() 
            {
                FB.init(
                            {
                                appId: <?= $facebook_app_id ?>,
                                status: true,
                                cookie: true,
                                oauth : true,   //enables OAuth 2.0
                                xfbml  : true,  // parse XFBML
                                channelUrl : 'http://vishaknag.com/fbapp/channel.html'
                            }
                        );

                FB.Canvas.setAutoResize();
                FB.XFBML.parse();
            };

            (function() 
                {
                    var e = document.createElement('script'); e.async = true;
                    e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
                    document.getElementById('fb-root').appendChild(e);
                }()
            );

        </script>
        
        <h1>Fetch Trump Card data</h1> 

        <?php if ($user): ?>
          <h3>Your Profile Picture</h3>
          <img src="https://graph.facebook.com/<?php echo $user; ?>/picture">
          <h3>Your Public Profile Data</h3>
          <pre><?php print_r($user_profile); ?></pre>
        <?php endif ?>
    </body>
</html>
