
$(function() {
        // run the currently selected effect
        function runEffect(effect) {
                // get effect type from 
                // most effect types need no options passed by default    
                var options = {};

                // run the effect
                $( ".topDiv" ).effect( effect, options, 500, callback );
        };

        // callback function to bring a hidden box back 
        function callback() {
            setTimeout(function() {
                    $( ".topDiv" ).removeAttr( "style" ).hide().fadeIn();
            }, 1000 );    
        };

        $( ".topDiv" ).click(function() {
            runEffect("explode");
            return false;
        });
});