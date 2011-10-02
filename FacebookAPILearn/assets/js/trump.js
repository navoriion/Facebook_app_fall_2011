
function trump_share(share) 
{
    if(share.type == 'ui') 
    {
        FB.ui(share.data);
    }
}

function trump_email_callback(resp) 
{
    if (resp) 
    {
        $("#bar_email").html("<div style=\"background-image:url('" + trafficking_assets_url + "/images/header-done.png');height:114;width:136;\"><div style=\"height:70;width:80;margin-right:auto;margin-left:20;margin-top:auto;margin-bottom:auto;\"><font size=\"2\" style=\"font-weight:bold\" face=\"Arial\"><br/>You are already on our mailing list!</font></div></div>");
    }
}

function trump_get_email(as_callback) 
{
    function callback(response) 
    {
        if(!response.session) 
        {
            as_callback(0);
            return;
        }

        if(!response.perms) 
        {
            as_callback(0);
            return;
        }

        var perms = response.perms.split(",");
        if($.inArray("email", perms) >= 0) 
        {
            as_callback(1);
            return;
        }

        as_callback(0);
    }

    FB.login(callback, {perms: 'email'});
}

function resizeToContent() 
{
    document.body.style.height = (document.body.offsetHeight).toString() + "px";
}

function mouseover(buttonname) 
{
    if (document.getElementById(buttonname).src != trump_assets_url + "images/tmp/" + buttonname + "Active.png") 
    {
        document.getElementById(buttonname).src = trump_assets_url + "images/tmp/" + buttonname + "Down.png";
    }
}

function mouseout(buttonname) 
{
    if (document.getElementById(buttonname).src != trump_assets_url + "images/tmp/" + buttonname + "Active.png") 
    {
        document.getElementById(buttonname).src = trump_assets_url +"images/tmp/" + buttonname + "Up.png";
    }
}

function buttonclick(buttonname) 
{
    if (document.getElementById("Button_" + buttonname).src != trump_assets_url + "images/tmp/Button_" + buttonname + "Active.png") 
    {
        document.getElementById("Play_iFrame").style.left = "-10000";
        document.getElementById("MyCrew_iFrame").style.left = "-10000";
        document.getElementById("InviteFriends_iFrame").style.left = "-10000";

        document.getElementById(buttonname+"iFrame").style.left = "0";

        document.getElementById("Button_Play_").src = trump_assets_url + "images/tmp/Button_Play_Up.png";
        document.getElementById("Button_MyCrew_").src = trump_assets_url + "images/tmp/Button_MyCrew_Up.png";
        document.getElementById("Button_InviteFriends_").src = trump_assets_url + "images/tmp/Button_InviteFriends_Up.png";

        document.getElementById("Button_" + buttonname).src= trump_assets_url + "images/tmp/Button_" + buttonname + "Active.png";
    }

    return false;
}
