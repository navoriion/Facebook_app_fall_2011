/* IGN Mobile FreeWheel 4.0 Integration Script */

(function($){

    var FWAdManager;
    var FW_IGN_ServerURL = "http://1ee2f.v.fwmrm.net/ad/g/1";
    var FW_IGN_NetworkId = 126508;
    var FW_IGN_profile = "126508:ign_html5";
    var FW_IGN_siteSection = "m_ign"

    var theContext = new Array();
    var nodes = new Array();
    var contentVideoURL = new Array();
    var slotPlaying = new Array();  // 1 = PREROLLSLOT 2 = CONTENTVIDEOSLOT

    var nextVideoIndex = 0;
    var videosWatchedCount = 0;
    var prerollFrequency = 3;
    var videosCount = 0 ;
    var pageAction = 0;

    var typeDevice = 0;

    var PREROLLSLOT = 1;
    var CONTENTVIDEOSLOT = 2;

    // Global Struct for each video
    NodeStruct = function(theContext, videoIndex, prerollSlots, midroll_overlaySlots, postrollSlots, contentVideoCurrentTime, contentVideoURL) {
        this.theContext = theContext;
        this.videoIndex = videoIndex;
        this.prerollSlots = prerollSlots;
        this.midroll_overlaySlots = midroll_overlaySlots;
        this.postrollSlots = postrollSlots;
        this.contentVideoCurrentTime = contentVideoCurrentTime;
        this.contentVideoURL = contentVideoURL;
    },

    GetCurrentSlots = function()
    {
        return slotPlaying;
    }

    Initialize = function(videoIndex)
    {
        console.log("[FW] init");
        var myContext = FWAdManager.newContext(); // Create a new context (only one contentvideo per Context)
        theContext[myContext._instanceId - 1] = myContext;

        // Div encapsulating the HTML5 <video> tag
        theContext[videoIndex].registerVideoDisplayBase("videoDiv_"+videoIndex);


        // Setup the properties for the context
        theContext[videoIndex].setProfile(FW_IGN_profile);
        theContext[videoIndex].setSiteSection(FW_IGN_siteSection, FW_IGN_NetworkId);

        //var episodicId = $('#videoPlayer_'+videoIndex).attr("data-video-id");
        //theContext[videoIndex].setVideoAsset(episodicId,500,FW_IGN_NetworkId);
        theContext[videoIndex].setVideoAsset("4c2bd7b6eca3d84837cf1c88",500,FW_IGN_NetworkId);

        //To make sure video ad playback in poor network condition, set video ad timeout parameters.
        theContext[videoIndex].setParameter(tv.freewheel.SDK.PARAMETER_RENDERER_VIDEO_START_DETECT_TIMEOUT,10000,tv.freewheel.SDK.PARAMETER_LEVEL_GLOBAL);
        theContext[videoIndex].setParameter(tv.freewheel.SDK.PARAMETER_RENDERER_VIDEO_PROGRESS_DETECT_TIMEOUT,10000,tv.freewheel.SDK.PARAMETER_LEVEL_GLOBAL);

        // Create callback functions for the context
        theContext[videoIndex].addEventListener(tv.freewheel.SDK.EVENT_REQUEST_COMPLETE,onRequestComplete);
        theContext[videoIndex].addEventListener(tv.freewheel.SDK.EVENT_SLOT_ENDED,onSlotEnded);

        theContext[videoIndex].addTemporalSlot("preroll", tv.freewheel.SDK.ADUNIT_PREROLL, 0);

        //  FUTURE USE - FOR ANY NEW VIDEO AD SLOT, JUST UNCOMMENT THE FOLLOWING appropriate line
        //  Create slots and add them to the context before submitting the request to FreeWheel
        //  One Preroll slot is added by freewheel by default for every context that is instantiated
        //  theContext[videoIndex].addTemporalSlot("midroll", tv.freewheel.SDK.ADUNIT_MIDROLL, 20);
        //  theContext[videoIndex].addTemporalSlot("overlay", tv.freewheel.SDK.ADUNIT_OVERLAY, 15);
        //  theContext[videoIndex].addTemporalSlot("postroll", tv.freewheel.SDK.ADUNIT_POSTROLL, 30);
        if($('#videoPlayer_'+videoIndex+ ' #mVideoSource_'+videoIndex)[0])
            contentVideoURL[videoIndex] = $('#videoPlayer_'+videoIndex+ ' #mVideoSource_'+videoIndex)[0].src;
        else
            contentVideoURL[videoIndex] = $('#videoPlayer_'+videoIndex+ ' #videoSource_'+videoIndex)[0].src;

        $('#videoPlayer_'+videoIndex).bind('pause', {myIndex : videoIndex}, BlockPause);
        $('#videoPlayer_'+videoIndex).bind('timeupdate', {myIndex : videoIndex}, UnblockPause);

        // Initial setup is done, Send the request
        loadAdData(videoIndex);
    },

    UnblockPause= function(event)
    {
        if(document.getElementById("videoPlayer_"+event.data.myIndex).readyState > 0)
        {
            if(document.getElementById("videoPlayer_"+event.data.myIndex).currentTime >= document.getElementById("videoPlayer_"+event.data.myIndex).duration-1)
            {
                $('#videoPlayer_'+event.data.myIndex).unbind('pause', BlockPause);
            }
        }
    },

    BlockPause = function(event)
    {
        if(document.getElementById("videoPlayer_"+event.data.myIndex).webkitDisplayingFullscreen)
        {
            alert("Watch Ad for Video");
            $('#videoPlayer_'+event.data.myIndex)[0].play();
        }
    },

    loadAdData = function(videoIndex)
    {
        console.log("[FW] loadAd");
        theContext[videoIndex].submitRequest();
    },

    // Callback function invoked when the response is received from FreeWheel
    onRequestComplete = function(event)
    {
        console.log("[FW] onRequestComplete");
        var prerollSlots = new Array();
        var midroll_overlaySlots = new Array();
        var postrollSlots= new Array();

        videoIndex = event.target._instanceId - 1;
        console.log("[FW REPLY] Instance "+videoIndex+" Response received");

        if (event.success)
        {
            // Get all the filled temporal slots from the context
            var fwTemporalSlots = event.target.getTemporalSlots();
            console.log(fwTemporalSlots);

            // Segregate all the temporal slot contents into respective slot-arrays
            for (var i=0; i<fwTemporalSlots.length; i++)
            {
                var slot = fwTemporalSlots[i];
                switch (slot.getTimePositionClass())
                {
                    case tv.freewheel.SDK.TIME_POSITION_CLASS_PREROLL:
                        prerollSlots.push(slot);
                        break;
                    case tv.freewheel.SDK.TIME_POSITION_CLASS_MIDROLL:
                    case tv.freewheel.SDK.TIME_POSITION_CLASS_OVERLAY:
                        midroll_overlaySlots.push(slot);
                        break;
                    case tv.freewheel.SDK.TIME_POSITION_CLASS_POSTROLL:
                        postrollSlots.push(slot);
                        break;
                }
            }

            // Sort all the midroll overlay videos according to start time
            if (midroll_overlaySlots.length){
                midroll_overlaySlots.sort(function(slot_a,slot_b){
                    if(slot_a.getTimePosition() > slot_b.getTimePosition())
                        return 1;
                    else if (slot_a.getTimePosition() > slot_b.getTimePosition())
                        return 0;
                    else
                        return -1;});
            }

            // Create a Video info Node and populate it
            nodes[videoIndex] = new NodeStruct(event.target,videoIndex,prerollSlots,midroll_overlaySlots,postrollSlots, 0, contentVideoURL[videoIndex]);
        }
    },

    seekVideo = function(event)
    {
        var videoIndex = event.data.myIndex;
        console.log('current time '+ $('#videoPlayer_'+videoIndex)[0].currentTime);

        if ($('#videoPlayer_'+videoIndex)[0].currentTime > (nodes[videoIndex].contentVideoCurrentTime - 1.0))
            return;

        console.log('[FW] seek to '+ nodes[videoIndex].contentVideoCurrentTime);
        $('#videoPlayer_'+videoIndex).unbind('canplaythrough',seekVideo);
        $('#videoPlayer_'+videoIndex)[0].currentTime = nodes[videoIndex].contentVideoCurrentTime;
    },

    // Callback function: invoked when any slot completes its playtime
    onSlotEnded = function(event)
    {
        var slotTimePositionClass = event.slot.getTimePositionClass();
        var videoIndex = event.target._instanceId - 1;
        console.log("[FW] onSlotEnded slotTimePositionClass: " + slotTimePositionClass );

        switch (slotTimePositionClass)
        {
            case tv.freewheel.SDK.TIME_POSITION_CLASS_PREROLL:
                if (nodes[videoIndex].prerollSlots.length)
                {
                    console.log("Preroll of video "+videoIndex+" ended");
                    nodes[videoIndex].prerollSlots.shift();

                    if (nodes[videoIndex].prerollSlots.length)
                    {
                        nodes[videoIndex].prerollSlots[0].play();
                        slotPlaying[videoIndex] = PREROLLSLOT;
                    }else{
                        $('#videoPlayer_'+videoIndex).unbind('pause', BlockPause);
                        $('#videoPlayer_'+videoIndex).bind('ended', {myIndex : videoIndex}, onContentVideoEnded);
                        $('#videoPlayer_'+videoIndex).bind('timeupdate', {myIndex : videoIndex}, onContentVideoTimeUpdated);
                        $('#videoPlayer_'+videoIndex).attr('controls', true);
                        $('#videoPlayer_'+videoIndex).attr('src', nodes[videoIndex].contentVideoURL);
                        slotPlaying[videoIndex] = CONTENTVIDEOSLOT;
                        $('#videoPlayer_'+videoIndex)[0].load();
                        $('#videoPlayer_'+videoIndex)[0].play();

                        nodes[videoIndex].theContext.setVideoState(tv.freewheel.SDK.VIDEO_STATE_PLAYING);
                    }
                }
                break;

            case tv.freewheel.SDK.TIME_POSITION_CLASS_MIDROLL:
            case tv.freewheel.SDK.TIME_POSITION_CLASS_OVERLAY:
                $('#videoPlayer_'+videoIndex).bind('canplaythrough', {myIndex : videoIndex}, seekVideo);
                nodes[videoIndex].midroll_overlaySlots.shift();
                break;

            case tv.freewheel.SDK.TIME_POSITION_CLASS_POSTROLL:

                if (nodes[videoIndex].postrollSlots.length)
                {
                    nodes[videoIndex].postrollSlots.shift();
                    if (nodes[videoIndex].postrollSlots.length)
                        nodes[videoIndex].postrollSlots[0].play();
                    else
                        nodes[videoIndex].theContext.setVideoState(tv.freewheel.SDK.VIDEO_STATE_COMPLETED);
                }
                break;
        }
    },

    // If any midrolls exist, bind this to the video player when the content video is started
    onContentVideoTimeUpdated = function(event)
    {
        var videoIndex = event.data.myIndex;

        if (! nodes[videoIndex].midroll_overlaySlots.length){
            $('#videoPlayer_'+videoIndex).unbind('timeupdate',onContentVideoTimeUpdated);
            return;
        }

        var slot = nodes[videoIndex].midroll_overlaySlots[0];

        if ( $('#videoPlayer_'+videoIndex)[0].currentTime - slot.getTimePosition() >=0 && $('#videoPlayer_'+videoIndex)[0].currentTime - slot.getTimePosition()<=1)
        {
            nodes[videoIndex].contentVideoCurrentTime = $('#videoPlayer_'+videoIndex)[0].currentTime;
            console.log("[FW] onContentVideoTimeUpdated timePositionClass: "+ slot.getTimePositionClass());
            slot.play();
        }
    },

    onContentVideoEnded = function(event)
    {
        console.log("[FW] onContentVideoEnded");
        var videoIndex = event.data.myIndex;

        $('#videoPlayer_'+videoIndex).unbind('ended', onContentVideoTimeUpdated);
        $('#videoPlayer_'+videoIndex).unbind('ended', onContentVideoEnded);
        $('#videoPlayer_'+videoIndex).attr('controls', false);

        slotPlaying[videoIndex] = CONTENTVIDEOSLOT;

        nodes[videoIndex].theContext.setVideoState(tv.freewheel.SDK.VIDEO_STATE_STOPPED);
        if(nodes[videoIndex].postrollSlots.length){
            nodes[videoIndex].postrollSlots[0].play();
        }else{
            nodes[videoIndex].theContext.setVideoState(tv.freewheel.SDK.VIDEO_STATE_COMPLETED);
        }
    },

    AndroidStartPlayback = function(videoIndex)
    {
        console.log("[FW] Playback invoked");

        if(nodes[videoIndex].prerollSlots.length)
        {
            if(! (videosWatchedCount % prerollFrequency))
            {
                nodes[videoIndex].prerollSlots[0].play();
                $('.posterImg').hide();
                slotPlaying[videoIndex] = PREROLLSLOT;
                $('#videoPlayer_'+videoIndex).attr('controls', false);
            }
        }
    },

    IphoneStartPlayback = function(videoIndex)
    {
        console.log("[FW] Playback invoked");
        console.log('---------> videoIndex: '+videoIndex);
        if(1 /*nodes[videoIndex].prerollSlots.length*/)
        {
            if(! (videosWatchedCount % prerollFrequency))
            {
                console.log("-----> playing pre-rol!!!!!")
                $('#videoPlayer_'+videoIndex).show();
                nodes[videoIndex].prerollSlots[0].play();
                slotPlaying[videoIndex] = PREROLLSLOT;
                $('#videoPlayer_'+videoIndex).attr('controls', false);
            }
            else
            {
                console.log("-------------> playing no pre-roll:"+nodes[videoIndex].contentVideoURL);

                $('#videoPlayer_'+videoIndex).attr('src', nodes[videoIndex].contentVideoURL);
                $('#videoPlayer_'+videoIndex).show();
                $('#videoPlayer_'+videoIndex)[0].play();
                $('#videoPlayer_'+videoIndex).unbind('pause', BlockPause);
                $('#videoPlayer_'+videoIndex).attr('controls', true);

                slotPlaying[videoIndex] = CONTENTVIDEOSLOT;
                nodes[videoIndex].theContext.setVideoState(tv.freewheel.SDK.VIDEO_STATE_PLAYING);
                console.log('-------------> video is being watched');
            }
            videosWatchedCount++;
        }
    },



    IphoneFWVideoPlayer = function(videoIndex)
    {
        var height, width;

        if(pageAction == "videoshub" || pageAction == "videoseries" || pageAction == "videosgame")      // videos page
        {
            $listItem = $('.video_list_item_container')[videoIndex];
            $videoTag = $($listItem).find('.video_list_image video');
            $videoTag.hide();
            $listImage = $($listItem).find('.video_list_image');
        }
        else if(pageAction == "article")    // Articles pages
        {
            $listItem = $('.article_video')[videoIndex];
            $videoTag = $($listItem).find('video');
            $videoTag.hide();
            $listImage = $listItem;
        }
        else if(pageAction == "gobprofile")     // Games pages
        {
            $listItem = $('.game_video')[videoIndex];
            $videoTag = $($listItem).find('video');
            $videoTag.hide();
            $listImage = $listItem;
        }
        height = $videoTag.attr("height");
        width = $videoTag.attr("width");

        var posterImg = '<div class="posterImg">\n\
                    <img src="' + $videoTag.attr('poster') + '" height="'+height+'px" width="'+width+'px" class="posterImg" />\n\
                 </div>\n\
                 <div class="playBtn">\n\
                    <img src="'+playImageURL+'" height="57px" width="57px">\n\
                 </div>';

        $(posterImg).appendTo($listImage);

        $img = $($listImage).find('.playBtn');
        $($listImage).find('.videoDivClass').css('position','relative');
        $($listImage).find('.posterImg').css({'position':'absolute','top':'0','left':'0','z-index':'1'});

        if(pageAction == "article")
            $($listImage).find('.playBtn').css({'position':'absolute','top':'33%','left':'39%','z-index':'2'});
        else
            $($listImage).find('.playBtn').css({'position':'absolute','top':'24%','left':'28%','z-index':'2'});

        $($img).data('index',videoIndex);

        $($img).click(function(e){

            $(this).hide();
            $(this).parent().find('.posterImg').hide();

            console.log('clicked, now IphoneStartPlayback...');

            IphoneStartPlayback($(this).data('index'));

        });
    },
    AndroidFWVideoPlayer = function(videoIndex)
    {
        var height, width;

        if(pageAction == "videoshub" || pageAction == "videoseries" || pageAction == "videosgame")      // videos page
        {
            $listItem = $('.video_list_item_container')[videoIndex];
            $videoTag = $($listItem).find('.video_list_image video');
            $listImage = $($listItem).find('.video_list_image');
        }
        else if(pageAction == "article")    // Articles pages
        {
            $listItem = $('.article_video')[videoIndex];
            $videoTag = $($listItem).find('video');
            $listImage = $listItem;
        }
        else if(pageAction == "gobprofile")     // Games pages
        {
            $listItem = $('.game_video')[videoIndex];
            $videoTag = $($listItem).find('video');
            $listImage = $listItem;
        }
        height = $videoTag.attr("height");
        width = $videoTag.attr("width");

        var posterImg = '<div class="posterImg">\n\
                        <img src="' + $videoTag.attr('poster') + '" height="'+height+'px" width="'+width+'px" class="posterImg" />\n\
                        </div>';

        $(posterImg).appendTo($listImage);

        $img = $($listImage).find('.posterImg');
        $($listImage).find('.videoDivClass').css('position','relative');
        $($listImage).find('.posterImg').css({'position':'absolute','top':'0','left':'0','z-index':'1'});

        if((videosWatchedCount % prerollFrequency)!=0)
            $($listImage).find('.posterImg').hide();

        $($img).data('index',videoIndex);
        $($img).click(function(e){

            $(this).hide();

            AndroidStartPlayback($(this).data('index'));

        });

        $videoTag.bind("play", function(e){

            videosWatchedCount++;
            $(this).unbind("play");

            if(! (videosWatchedCount % prerollFrequency))
                $('.posterImg').show();
        });
    },

    AddAds = function(pageIndex)
    {
        var vStartIndex, vEndIndex;

        // Update the videos count present in the page & page action
        FetchPageInfo();

        if((pageAction == "videoshub" || pageAction == "videoseries" || pageAction == "videosgame") && pageIndex)      // Videos pages
        {
            FetchAjaxVideoCount();
            UpdateNextVideoIndex(pageIndex);
            vStartIndex = nextVideoIndex;
            vEndIndex = nextVideoIndex+videosCount;
        }
        else if(pageAction == "article")    // Articles pages
        {
            vStartIndex = 0;
            vEndIndex = 1;
        }
        else if(pageAction == "gobprofile")     // Games pages
        {
            vStartIndex = 0;
            vEndIndex = 2;
        }

        for(var videoIndex = vStartIndex; videoIndex < vEndIndex; videoIndex++)
        {
            Initialize(videoIndex);

            if(typeDevice)
                {
             AndroidFWVideoPlayer(videoIndex);
                }
                else
                {
             IphoneFWVideoPlayer(videoIndex);
                }

            //SetupVideoAnalytics(videoIndex);
        }
    },

    UpdatePageInfo = function(vCount, action, userDevice)
    {
        videosCount = vCount;
        pageAction = action;
        typeDevice = userDevice;


    },

    UpdateVideoCount = function(vCount)
    {
        videosCount = vCount;
    },

    UpdateNextVideoIndex = function(pageIndex)
    {
        nextVideoIndex = (pageIndex-1) * videosCount;
    },

    StartFW = function()
    {
        console.log("AdManager created");
        FWAdManager = new tv.freewheel.SDK.AdManager();
        FWAdManager.setNetwork(FW_IGN_NetworkId);
        FWAdManager.setServer(FW_IGN_ServerURL);
    },

    $(document).ready(function()
    {
        FetchPageInfo();
        if(pageAction == "videoshub" || pageAction == "videoseries" || pageAction == "videosgame" || pageAction == "article" || pageAction == "gobprofile")
        {
             StartFW();
             if(document.getElementsByTagName("video").length)
                AddAds(1);
        }
    });

})(jQuery);