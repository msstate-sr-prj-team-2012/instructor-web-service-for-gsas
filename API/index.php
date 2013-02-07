<?php
/**
 * OnPar - Fall 2012 software engineering senior design project at Mississippi
 *         State University.
 *
 * @author  Fall 2012 Senior Design Team
 * @version 1.0
 * @package OnPar
 */

/**
 * Courses URIs
 * @package API
 * @author  Kevin Benton
 * @version 1.0
 *
 * USAGE
 *
 * calls to different URIs will return, update, or insert the proper
 * information
 *
 */

require_once(dirname(__FILE__) . '/../extras/config.php');
$app->add(new \Slim\Middleware\HttpBasicAuth(API_USERNAME, API_PASSWORD));


/**
 * URI: /
 * METHOD: GET
 * Response: list all courses in the database - default
 *
 * SUCCESS RETURN CODE: 200 - OK
 * FAILURE RETURN POSSIBILITIES:
 *      5xx - Server Errors
 *
 */
$app->get('/',
function() use ($app)
{
	// get the app's response object
    $res = $app->response();

    // set the status code
    $res->status(200);

    // set the body
    $courses = Course::getAll();
    $data['courses'] = array();
    foreach ($courses as $c) {
        $data['courses'][] = $c->export();
    }
    $res->write(json_encode($data));

    // set the content type
    $res['Content-Type'] = 'application/json';

    // finalize the response
    $array = $res->finalize();
});

$app->run();

?>