<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

date_default_timezone_set('CST6CDT');
require_once(dirname(__FILE__) . "/functions.php");
require_once(dirname(__FILE__) . "/defines.php");

require_once(SD_CLASSES . 'DB.php');

require_once(CLASSES . 'DBObject.php');

require_once(DBOBJECTS . 'Course.php');
require_once(DBOBJECTS . 'User.php');
require_once(DBOBJECTS . 'Round.php');
require_once(DBOBJECTS . 'Hole.php');
require_once(DBOBJECTS . 'Shot.php');

$app = new \Slim\Slim(array(
    'debug' => true,
    'mode' => 'development',
    'templates.path' => dirname(__FILE__) . '/../html'
));

?>