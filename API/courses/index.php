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

require_once(dirname(__FILE__) . '/../../extras/config.php');
$app->add(new \Slim\Middleware\HttpBasicAuth(API_USERNAME, API_PASSWORD));

/**
 * URI: /courses
 * METHOD: GET
 * Response: list all courses in the database
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


/**
 * URI: /courses/:id
 * METHOD: GET
 * Response: get the information on the course with the specified id
 *
 * SUCCESS RETURN CODE: 200 - OK
 * FAILURE RETURN POSSIBILITIES:
 *      204 - No Content
 *      5xx - Server Errors
 */
$app->get('/:id',
function($id) use ($app) {
    // get the app's response object
    $res = $app->response();

    // set the body
    $course = new Course($id);
    if (!$course->ID()) {
        // course does not exist
        // return a 204 - no content
        $res->status(204);
        $array = $res->finalize();
    } else {
        // set the status code
        $res->status(200);

        $res->write(json_encode($course->export()));

        // set the content type
        $res['Content-Type'] = 'application/json';

        // finalize the response
        $array = $res->finalize();
    }
});

/**
 * URI: /courses
 * METHOD: POST
 * Response: insert a new course in the database, returns the inserted course
 *
 * SUCCESS RETURN CODE: 201 - Created
 * FAILURE RETURN POSSIBILITIES:
 *	400 - Bad Request
 *      5xx - Server Error
 *
 */
$app->post('/',
function() use ($app)
{
    // get the instance of the DB 
    $db = DB::getInstance();

    // get the request object
    $req = $app->request();

    // get the app's response object
    $res = $app->response();

    // decode the body
    $data = json_decode($req->getBody(), true);

    if (!array_key_exists('course', $data)) {
        // return a 400 for bad request - improper json format
        $res->status(400);
        $array = $res->finalize();
    } else {
        $data = $data['course'];

        // check for bad json input
        if (!array_key_exists('name', $data) || !array_key_exists('location', $data)) {
            // return a 400 for bad requestr - improper json format
            $res->status(400);
            $array = $res->finalize();
        } else {
            // check to see if the fields for each key are set
            if (!$data['name'] || !$data['location']) {
                // return a 400 for bad request - improper json format
                $res->status(400);
                $array = $res->finalize();
            } else {
                // create a new course
                $course = new Course();
                $course->name($data['name']);
                $course->location($data['location']);

                if ($course->save()) {
                    // commit the DB changes
                    $db->commit();

                    // set the status code
                    // 201 - created
                    $res->status(201);

                    // set the body
                    $res->write(json_encode($course->export()));

                    // set the content type
                    $res['Content-Type'] = 'application/json';

                    // finalize the response
                    $array = $res->finalize();
                } else {
                    // roll back the DB changes
                    $db->rollBack();

                    // problem with the save function
                    // return a 500 - server error
                    $res->status(500);
                    $array = $res->finalize();
                }
            }
        }
    }
});

/**
 * URI: /courses/:id
 * METHOD: POST
 * Response: update a course with the specified id, returns the updated course
 *
 * SUCCESS RETURN CODE: 200 - OK
 * FAILURE RETURN POSSIBILITIES:
 *	204 - No Content
 *	400 - Bad Request
 *      5xx - Server Errors
 *
 */
$app->post('/:id',
function($id) use ($app)
{
    // get the request object
    $req = $app->request();

    // get the app's response object
    $res = $app->response();

    // decode the body
    $data = json_decode($req->getBody(), true);
    
    if (!array_key_exists('course', $data)) {
        // return a 400 for bad request - improper json format
        $res->status(400);
        $array = $res->finalize();
    } else {
        $data = $data['course'];

        // check for bad json input
        if (!array_key_exists('name', $data) || !array_key_exists('location', $data)) {
            // return a 400 for bad request - improper json format
            $res->status(400);

            $array = $res->finalize();
        } else {
            // check to see if the fields for each key are set
            if (!$data['name'] || !$data['location']) {
                // return a 400 for bad request - improper json format
                $res->status(400);

                $array = $res->finalize();
            } else {
                // load course from the database
                $course = new Course($id);
                if (!$course->ID()) {
                    // course doesn't exist
                    // return a 204 - no content
                    $res->status(204);
                    $array = $res->finalize();
                } else {
                    // get the instance of the DB 
                    $db = DB::getInstance();

                    $course->name($data['name']);
                    $course->location($data['location']);

                    if ($course->save()) {
                        // commit the DB changes
                        $db->commit();

                        // set the status code
                        $res->status(200);

                        // set the body
                        $res->write(json_encode($course->export()));

                        // set the content type
                        $res['Content-Type'] = 'application/json';

                        // finalize the response
                        $array = $res->finalize();
                    } else {
                        // roll back the DB changes
                        $db->rollBack();

                        // problem with the save function
                        // return 500 - server error
                        $res->status(500);
                        $array = $res->finalize();
                    }
                }
            }
        }
    }
});

/**
 * URI: /courses/destroy/:id
 * METHOD: POST
 * Response: delete a course with the specified id, returns the deleted course
 *
 * SUCCESS RETURN CODE: 200 - OK
 * FAILURE RETURN POSSIBILITIES:
 *	204 - No Content
 *      5xx - Server Errors
 *
 */
$app->post('/destroy/:id',
function($id) use ($app)
{
    // get the request object
    $req = $app->request();

    // get the app's response object
    $res = $app->response();

    // there is no body coming in
    // it is just an empty post request

    // load course from the DB
    $course = new Course($id);
    if (!$course->ID()) {
        // course doesn't exist
        // return a 204 - no content
        $res->status(204);
        $array = $res->finalize();
    } else {
        // get the instance of the DB 
        $db = DB::getInstance();

        // delete the course to from DB
        if ($course->delete()) {
            // commit the DB changes
            $db->commit();

            // set the status code
            // 200 - ok
            $res->status(200);

            // set the body
            $res->write(json_encode($course->export()));

            // set the content type
            $res['Content-Type'] = 'application/json';

            // finalize the response
            $array = $res->finalize();
        } else {
            // roll back the DB changes
            $db->rollBack();
            
            // problem with the delete function
            // return a 500 - server error
            $res->status(500);
            $array = $res->finalize();
        }
    }
});

$app->run();

?>
