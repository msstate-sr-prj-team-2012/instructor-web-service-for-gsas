<?php

require_once(dirname(__FILE__) . '/extras/config.php');

$app->get('/',
function() use ($app)
{
	$app->render('index.html');
});

$app->get('/',
function() use ($app)
{
	$app->render('rounds.html');
});

$app->get('/',
function() use ($app)
{
	$app->render('maps.html');
});

$app->run();

?>