<?php
/*
 * 2023 Jon Rabe, jonrabe@jonr.net
 */


class Document {
    const external_path_keywords = [
        "http://",
        "https://",
        "gopher://"
    ];
    
    private $path;
    private $document_root;
    private $document;


    public function __construct($path, $document_root){
        $this->path = $path;
        $this->document_root = $document_root;
        $this->document = new DOMDocument();
    }


    public function getDocument(){
        $this->document->loadHTMLFile(
            $this->document_root . "/" . $this->path,
            
            // This option ensures HTML tags
            // will not be removed
            $options = LIBXML_SCHEMA_CREATE
        );

        $this->_adjustNodePaths("a", "href");
        $this->_adjustNodePaths("img", "src");

        return $this->document->saveHTML();
    }


    private function _adjustNodePaths($tag, $prop){
        $tags = $this->document->getElementsByTagName($tag);

        foreach ($tags as $tag){
            if ($tag->hasAttributes()){
                $path = $tag->attributes[$prop]->value;

                if (!$this->_testPathExternal($path)) {
                    $tag->attributes[$prop]->value = $this->_getRootPath($path);
                }

            }
        }
    }


    private function _getRootPath($_path){
        return ""
             . implode(
                 "/",
                 array_slice(
                     explode("/", $this->path),
                     0,
                     $length = -1
                 )
             )
             . "/" . $_path;
    }


    private function _testPathExternal($path){
        foreach (self::external_path_keywords as $key){
            $_path = explode($key, $path);

            if (count($_path) > 1)
                return true;

            break;
        }

        return false;
    }
}

?>
