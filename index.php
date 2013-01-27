<?php

require_once(dirname(__FILE__) . '/extras/config.php');

$app->get('/',
function() use ($app)
{
	$app->render('index.html');
});

$app->get('/test',
function() use ($app)
{
	$app->render('test.html');
});

$app->run();

?>