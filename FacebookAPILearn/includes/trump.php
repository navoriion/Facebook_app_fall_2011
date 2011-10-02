<?

    function get_asset($assetType, $assetId = NULL) 
    {
            global $services;
            global $assets;

            if(!isset($assets)) 
            {
                $assets = $services->call('/assets')->data;
            }

            if(!$assets->$type) 
            {
                die('Cannot find asset type: ' . $type);
            }

            if(!isset($id)) 
            {
                return $assets->$type;
            }

            foreach($assets->$type as $a) 
            {
            if($a->id == $id) 
            {
                    return $a;
            }
            }

            die('Cannot find asset type: ' . $type . ' id: ' . $id);
    }

    function get_player() 
    {
            global $services;
            global $player_data;
            if(!isset($player_data)) 
            {
                $player_data = $services->call('/player/get')->data;
            }

            return $player_data;
    }

    function gen_uuid() 
    {
            return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            // 32 bits for "time_low"
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),

            // 16 bits for "time_mid"
            mt_rand( 0, 0xffff ),

            // 16 bits for "time_hi_and_version",
            // four most significant bits holds version number 4
            mt_rand( 0, 0x0fff ) | 0x4000,

            // 16 bits, 8 bits for "clk_seq_hi_res",
            // 8 bits for "clk_seq_low",
            // two most significant bits holds zero and one for variant DCE1.1
            mt_rand( 0, 0x3fff ) | 0x8000,

            // 48 bits for "node"
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
        );
    }

?>
