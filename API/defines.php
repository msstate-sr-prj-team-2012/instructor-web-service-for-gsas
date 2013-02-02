<?php

// Construct MY_URL
if (isset($_SERVER['SERVER_NAME'])) {
    define('MY_URL', 'https://' . $_SERVER['SERVER_NAME'] . $_SERVER['SCRIPT_NAME']);
}

ifndef('API_USERNAME', 'cse3213');
ifndef('API_PASSWORD', 'test');

ifndef('DSN', 'mysql:dbname=gsas;host=127.0.0.1');
ifndef('DB_USER', 'gsas');
ifndef('DB_PASSWORD', 'pQMzSYAp');

ifndef('ROOT', dirname(__FILE__));
ifndef('CLASSES', ROOT . '/classes/');
ifndef('SD_CLASSES', CLASSES . 'SD/');
ifndef('DBOBJECTS', CLASSES . 'DBObjects/');

// define club constants
ifndef('DRIVER', 1);
ifndef('THREE_WOOD', 2);
ifndef('FOUR_WOOD', 3);
ifndef('FIVE_WOOD', 4);
ifndef('SEVEN_WOOD', 5);
ifndef('NINE_WOOD', 6);
ifndef('TWO_HYBRID', 7);
ifndef('THREE_HYBRID', 8);
ifndef('FOUR_HYBRID', 9);
ifndef('FIVE_HYBRID', 10);
ifndef('SIX_HYBRID', 11);
ifndef('TWO_IRON',12);
ifndef('THREE_IRON', 13);
ifndef('FOUR_IRON', 14);
ifndef('FIVE_IRON', 15);
ifndef('SIX_IRON', 16);
ifndef('SEVEN_IRON', 17);
ifndef('EIGHT_IRON', 18);
ifndef('NINE_IRON', 19);
ifndef('PW', 20);
ifndef('AW', 21);
ifndef('SW', 22);
ifndef('LW', 23);
ifndef('HLW', 24);

// define tee constants
ifndef('AGGIES', 1);
ifndef('MAROONS', 2);
ifndef('COWBELLS', 3);
ifndef('TIPS', 4);

// User roles
ifndef('ROLE_GOLFER',       1);
ifndef('ROLE_INSTRUCTOR',   2);

global $ALL_ROLES;
$ALL_ROLES = array(
    ROLE_GOLFER      => 'Golfer',
    ROLE_INSTRUCTOR  => 'Instructor'
);

?>