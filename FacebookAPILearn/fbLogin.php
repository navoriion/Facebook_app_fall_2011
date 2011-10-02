<html>
    <head>
      <title>My Facebook Login Page</title>
    </head>
    <body>
      <div id="fb-root"></div>
      <script src="http://connect.facebook.net/en_US/all.js"></script>
      <script>
         FB.init({ 
            appId:'158279094251542', cookie:true, 
            status:true, xfbml:true 
         }); 
      </script>
      <div align="center" height="300px">
      <fb:login-button>Vishak : Login with Facebook</fb:login-button>
      </div>
    </body>
 </html>