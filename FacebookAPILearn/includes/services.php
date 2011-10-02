<?

class Services 
{
    private $servicesURL;
    private $access_token;

    // Set the services URL and userID
    public function __construct($url, $id) 
    {
        $this->servicesURL = $url;
        $this->access_token = $id;
    }

    // convert data into its JSON representation (encodes)
    // invokes __make_call and receives the contents of the json file in string form
    // decodes the string form of json and returnes back to caller
    public function getData($method, $data = array()) 
    {
        if(empty($data)) 
        {
                $json = '{}';
        }
        else 
        {
                $json = json_encode($data);
        }

        $retjson = $this->__make_call($method, $json);
        $retdata = json_decode($retjson);

        if($retdata->status) 
        {
                throw new Exception('Server Error: ' . $retdata->status);
        }

        return $retdata;
    }

    // receives the method name and the json encoded data
    // forms a stream context - http request
    // fetch the json file contents using the context from the servicesURLs
    private function __make_call($method, $data) 
    {
        global $trafficking_services_cookie;
        $context_options = array(
                'http' => array(
                        'method' => 'POST',
                        'header' =>
                                "Content-type: application/json\r\n" .
                                'Content-Length: ' . strlen($data) . "\r\n" .
                                'Cookie: ' . $trump_services_cookie . '=' . $this->access_token . "\r\n",
                        'content' => $data
                )
        );
   
        $context = stream_context_create($context_options);
        $retjson = file_get_contents($this->servicesURL . $method, false, $context);

        return $retjson;
    }
}

?>
