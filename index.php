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

$app->get('/maps',
function() use ($app)
{
	$app->render('maps.html');
});

$app->get('/table',
function() use ($app)
{
	$app->render('data_table.html');
});

$app->get('/spread',
function() use ($app)
{
	$app->render('vector_graph.html');
});

$app->get('/distance',
function() use ($app)
{
	$app->render('bar_graph.html');
});

$app->get('/stats',
function() use ($app)
{
	$app->render('stats.html');
});

$app->get('/admin',
function() use ($app)
{
	$app->render('admin.html');
});

$app->get('/help',
function() use ($app)
{
	$app->render('help.html');
});

$app->get('/about',
function() use ($app)
{
	$app->render('about.html');
});

$app->run();

?>