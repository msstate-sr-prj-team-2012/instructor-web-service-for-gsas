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
 * Holes URIs
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

require_once('../../config.php');
$app->add(new \Slim\Middleware\HttpBasicAuth(API_USERNAME, API_PASSWORD));

/**
 * URI: /holes/reference/:courseID/:teeID
 * METHOD: GET
 * Response: get the information of the hole with the specified id
 *
 * SUCCESS RETURN CODE: 200 - OK
 * FAILURE RETURN POSSIBILITIES:
 *      400 - Bad Request
 *      5xx - Server Errors
 *
 */
$app->get('/reference/:courseID/:teeID',
function($courseID, $teeID) use ($app) 
{
    // get the app's request object
    $res = $app->response();
    
    // bit of sanity checking
    if ($teeID < 1 || $teeID > 4) {
        // nonexistent tee
        // return 400 - bad request
        $res->status(400);
        $array = $res->finalize();
    } else {
        $course = new Course($courseID);
        if (!$course->ID()) {
            // return a 400 - bad request
            $res->status(400);
            $array = $res->finalize();
        } else {
            // set response status to 200 - ok
            $res->status(200);
            
            // set the body
            $data = array();
            $data['holes'] = array();
            for ($holeNumber = 1; $holeNumber < 19; $holeNumber++) {
                $hole = new Hole($courseID, $holeNumber, $teeID);
                $data['holes'][] = $hole->exportReference();
            }
            
            // set the body
            $res->write(json_encode($data));

            // set the content type
            $res['Content-Type'] = 'application/json';

            // finalize the response
            $array = $res->finalize();
        }
    }
});

$app->run();