<?php
/*
 * 2023 Jon Rabe, jonrabe@jonr.net
 */


error_reporting(E_ALL ^ (E_NOTICE | E_WARNING | E_DEPRECATED));

class _DOMDocument extends DOMDocument {
    function __construct(){
        call_user_func_array(
            "DOMDocument::__construct",
            func_get_args()
        );
    }


    function getElementsByClassName($_class){
        $finder = new DomXPath($this);

        return $finder->query(
            "//*[contains(@class, '$_class')]"
        );
    }
}


class IndexGenerator {
    // Notes root
    const extension = "html";
    private $config;
    private $document_root;
    private $path;
    private $metadata;
    private $note_files;

    // Index container
    private $index = array(
        "index" => array(),
        "tags" => array()
    );

    // Org HTML classes
    const class_title = "title";
    const class_tags = "tags";
    const class_date = "date";

    public function __construct($config, $document_root){
        $this->document_root = $document_root . "/";
        $this->config = $config;
        $this->metadata = $this->config["metadata"];
        $this->path = $this->document_root . $this->config["path"];        

        $exclude_files = array();
        if (array_key_exists("exclude_files", $this->config)) {
            $exclude_files = $this->config["exclude_files"];
        }

        $this->note_files = scandir(
            $this->path,
            SCANDIR_SORT_DESCENDING
        );

        $this->note_files = array_filter(
            $this->note_files,
            $callback = function($e) use ($exclude_files) {
                $filename = explode(".", $e);

                return (
                    $filename[count($filename)-1] == self::extension
                ) && !in_array($e, $exclude_files);
            }
        );
    }


    public function buildIndex(){
        $note = array();

        foreach ($this->note_files as $note_file){
            $doc = new _DOMDocument();
            $doc->loadHTMLFile($this->path . $note_file);

            // Default metadata
            $note["endpoint"] = $this->config["endpoint_name"];

            $note["url"] = implode(
                explode(
                    $this->document_root,
                    $doc->documentURI
                )
            );

            // Custom metadata
            foreach ($this->metadata as $metadata) {
                if (array_key_exists("group", $metadata)) {
                    $note[$metadata["classname"]] = $this->_getElementsAsList(
                        $doc,
                        $metadata["classname"],
                        $metadata["group"]
                    );
                }
                else {
                    $note[$metadata["classname"]] = $this->_getElementsAsText(
                        $doc,
                        $metadata["classname"]
                    );
                }
            }

            if (array_key_exists("tags", $note)) {
                $this->_poolTags($note["tags"]);
            }

            array_push($this->index["index"], $note);
        }

        return $this->index;
    }


    private function _getElementsAsText($doc, $class_name){
        return $doc->getElementsByClassName($class_name)[0]->nodeValue;
    }


    private function _getElementsAsList($doc, $class_name, $tag_name){
        // Return text value of all elements tag_name
        // nested under element class_name as a list
        $list = array();

        $_elements = array();
        $_container = $doc->getElementsByClassName($class_name)[0]->firstElementChild;

        if ($_container->childElementCount){
            $_elements = $_container->getElementsByTagName($tag_name);
        }

        foreach ($_elements as $element){
            array_push(
                $list,
                $element->nodeValue
            );
        }

        return $list;
    }


    private function _poolTags($tags){
        foreach ($tags as $tag){
            if (array_key_exists($tag, $this->index["tags"])) {
                ++$this->index["tags"][$tag];
            }
            else {
                $this->index["tags"][$tag] = 1;
            }
        }    
    }
}

?>
