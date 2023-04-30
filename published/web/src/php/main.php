<?php
/*
 * © 2023 Jon Rabe, jonrabe@jonr.net
 */


namespace main;
require_once "controller.php";
use controller\Controller;


$config = yaml_parse_file(
    "../conf/config.yml",
);


$api = new Controller(
    $config["server"],
    $_SERVER,
    $_GET
);
$api->processRequest();

?>
