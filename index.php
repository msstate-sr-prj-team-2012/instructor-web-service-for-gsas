<?php

require_once(dirname(__FILE__) . '/extras/config.php');

$app->get('/',
function() use ($app)
{
	$app->render('index.html');
});

$app->get('/rounds',
function() use ($app)
{
	$app->render('rounds.html');
});

$app->get('/map',
function() use ($app)
{
	$app->render('maps.html');
});

$app->get('/table',
function() use ($app)
{
	$app->render('data-table.html');
});

$app->run();

?>