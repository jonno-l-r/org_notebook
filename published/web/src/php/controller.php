<?php
/*
 * 2023 Jon Rabe, jonrabe@jonr.net
 */


namespace controller;
require_once "index_generator.php";
require_once "get_document.php";
use IndexGenerator;
use Document;


class Controller {
    const api_root = "api";

    private $endpoint_name;
    private $cmd;
    private $document_root;
    private $request;
    private $config;

    public function __construct($config, $server, $request){
        $this->document_root = $server["DOCUMENT_ROOT"];
        $this->request = $request;
        $this->config = $config;

        $this->_getURI($server["REQUEST_URI"]);
    }


    public function processRequest(){
        switch ($this->cmd) {
        case "buildindex":
            $this->_buildIndex();
            break;

        case "fetch":
            $this->_getDocument();
            break;

        default:
            header("HTTP/1.1 404 Not Found");
        }
    }


    private function _getURI($_uri){
        $uri = explode("/", $_uri);
        $key = array_search(self::api_root, $uri);

        if ($key){
            $this->endpoint_name = $uri[$key + 1];
            $this->cmd = $uri[$key + 2];
        }
    }


    private function _getConfig(){
        foreach ($this->config as $config){
            if ($config["endpoint_name"] == $this->endpoint_name){
                return $config;
            }
        }

        return NULL;
    }


    private function _buildIndex(){
        $found = false;
        $config = $this->_getConfig();

        if ($config) {
            $index = new IndexGenerator($config, $this->document_root);

            header("HTTP/1.1 200 OK");
            echo json_encode($index->buildIndex());
        }

        else {
            header("HTTP/1.1 404 Not Found");
        }
    }


    private function _getDocument(){
        $config = $this->_getConfig();

        if ($config){
            $doc = new Document(
                $this->request["path"],
                $this->document_root
            );

            header("HTTP/1.1 200 OK");
            echo $doc->getDocument();
        }
        else {
            header("HTTP/1.1 404 Not Found");   
        }
    }
}

?>
