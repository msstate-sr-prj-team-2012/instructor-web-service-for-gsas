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
 * Users URIs
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
 * URI: /users
 * METHOD: GET
 * Response: list all users in the database
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
    $users = User::getAll();
    $data['users'] = array();
    foreach ($users as $u) {
        $ids = array();
        $ids['id'] = $u->ID();
        $ids['name'] = $u->name();
        $data['users'][] = $ids;
    }
    $res->write(json_encode($data));

    // set the content type
    $res['Content-Type'] = 'application/json';

    // finalize the response
    $array = $res->finalize();
});

/**
 * URI: /users/:id
 * METHOD: GET
 * Response: get the information of the user with the specified id
 *
 * SUCCESS RETURN CODE: 200 - OK
 * FAILURE RETURN POSSIBILITIES:
 *      204 - No Content
 *      5xx - Server Errors
 *
 */
$app->get('/:id',
function($id) use ($app) {
    // get the app's response object
    $res = $app->response();

    // set the body
    $user = new User($id);
    if (!$user->ID()) {
        // user does not exist
        // return a 204 - no content
        $res->status(204);
        $array = $res->finalize();
    } else {
        // set the status code
        $res->status(200);

        $res->write(json_encode($user->export()));

        // set the content type
        $res['Content-Type'] = 'application/json';

        // finalize the response
        $array = $res->finalize();
    }
});

/**
 * URI: /users
 * METHOD: POST
 * Response: insert a new user into the database, returns the inserted user
 *
 * SUCCESS RETURN CODE: 201 - Created
 * FAILURE RETURN POSSIBILITIES:
 *	400 - Bad Request
 *      5xx - Server Errors
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

    // check for bad json input
    if (!array_key_exists('user', $data)) {
        // return a 400 for bad request - imporper JSON format
        $res->status(400);
        $array = $res->finalize();
    } else {
        $data = $data['user'];
        
        if (!array_key_exists('memberID', $data) || !array_key_exists('nickname', $data)
                || !array_key_exists('name', $data) || !array_key_exists('email', $data)) {
            // return a 400 for bad request - improper JSON format
            $res->status(400);
            $array = $res->finalize();
        } else {
            // check to see if the required fiels for each key are set
            if (!$data['name'] || !$data['email']) {
                // return a 400 for bad request - improper JSON format
                $res->status(400);
                $array = $res->finalize();
            } else {
                $memberIDCheck = true;
                $emailCheck = true;

                if ($data['memberID']) {
                    $user = new User($data['memberID']);
                    if ($user->ID()) {
                        // the memberID already exists
                        $memberIDCheck = false;
                    }
                    $user = null;
                }

                if ($data['email']) {
                    $user = new User($data['email']);
                    if ($user->ID()) {
                        // the memberID already exists
                        $emailCheck = false;
                    }
                    $user = null;
                }

                if (!$memberIDCheck && !$emailCheck) {
                    // return a 412 for email and memberID IC failure
                    $res->status(412);
                    $array = $res->finalize();
                } else {
                    if (!$memberIDCheck) {
                        // return a 406 for memberID IC failure
                        $res->status(406);
                        $array = $res->finalize();
                    } else {
                        if (!$emailCheck) {
                            // return a 409 for email IC failure
                            $res->status(409);
                            $array = $res->finalize();
                        } else {
                            // create a new User
                            $user = new User();
                            $user->memberID($data['memberID']);
                            $user->nickname($data['nickname']);
                            $user->name($data['name']);
                            $user->email($data['email']);
                            
                            // save the user to the DB
                            if ($user->save()) {
                                // commit the DB changes
                                $db->commit();

                                // set the status code to 201 - created
                                $res->status(201);
                                
                                // set the body
                                $res->write(json_encode($user->export()));
                                
                                // set the content type
                                $res['Content-Type'] = 'application/json';

                                // finalize the response
                                $array = $res->finalize();
                            } else {
                                // roll back the DB changes
                                $db->rollBack();

                                // problem with save function
                                // return 500 - server error
                                $res->status(500);
                                $array = $res->finalize();
                            }
                        }
                    }
                }
            }
        }
    }
});

/**
 * URI: /users/:id
 * METHOD: POST
 * Response: updates a user in the database, returns the updated user
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

    // check for bad json input
    if (!array_key_exists('user', $data)) {
        // return a 400 for bad request - imporper JSON format
        $res->status(400);
        $array = $res->finalize();
    } else {
        $data = $data['user'];
        
        if (!array_key_exists('memberID', $data) || !array_key_exists('nickname', $data)
                || !array_key_exists('name', $data) || !array_key_exists('email', $data)) {
            // return a 400 for bad request - improper JSON format
            $res->status(400);
            $array = $res->finalize();
        } else {
            // check to see if the required fiels for each key are set
            if (!$data['name'] || !$data['email']) {
                // return a 400 for bad request - improper JSON format
                $res->status(400);
                $array = $res->finalize();
            } else {
                // create a new User
                $user = new User($id);
                if (!$user->ID()) {
                    // user doesn't exist
                    // return a 204 -- no content
                    $res->status(204);
                    $array = $res->finalize();
                } else {
                    $memberIDCheck = true;
                    $emailCheck = true;

                    if ($data['memberID']) {
                        $userM = new User($data['memberID']);
                        if ($userM->ID()) {
                            // the memberID already exists
                            // check to see if it's the same ID as the User
                            // that's being updated
                            if($userM->ID() !== $user->ID()) {
                                // return 406 for not acceptable
                                $memberIDCheck = false;
                            }
                        }
                        $userM = null;
                    }

                    if ($data['email']) {
                        $userE = new User($data['email']);
                        if ($userE->ID()) {
                            // the memberID already exists
                            // check to see if it's the same ID as the User
                            // that's being updated
                            if($userE->ID() !== $user->ID()) {
                                // return 406 for not acceptable
                                $emailCheck = false;
                            }
                        }
                        $userE = null;
                    }

                    if (!$memberIDCheck && !$emailCheck) {
                        // return a 412 for email and memberID IC failure
                        $res->status(412);
                        $array = $res->finalize();
                    } else {
                        if (!$memberIDCheck) {
                            // return a 406 for memberID IC failure
                            $res->status(406);
                            $array = $res->finalize();
                        } else {
                            if (!$emailCheck) {
                                // return a 409 for email IC failure
                                $res->status(409);
                                $array = $res->finalize();
                            } else {
                                $user->memberID($data['memberID']);
                                $user->nickname($data['nickname']);
                                $user->name($data['name']);
                                $user->email($data['email']);
                                
                                // save the user to the DB
                                if ($user->save()) {
                                    // commit the DB changes
                                    $db->commit();

                                    // set the status code to 201 - created
                                    $res->status(201);
                                    
                                    // set the body
                                    $res->write(json_encode($user->export()));
                                    
                                    // set the content type
                                    $res['Content-Type'] = 'application/json';

                                    // finalize the response
                                    $array = $res->finalize();
                                } else {
                                    // roll back the DB changes
                                    $db->rollBack();

                                    // problem with save function
                                    // return 500 - server error
                                    $res->status(500);
                                    $array = $res->finalize();
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});

/**
 * URI: /users/destroy/:id
 * METHOD: POST
 * Response: delete a user with the specified id, returns the deleted user
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

    // load user from the DB
    $user = new User($id);
    if (!$user->ID()) {
        // user doesn't exist
        // return a 204 - no content
        $res->status(204);
        $array = $res->finalize();
    } else {
        // get the instance of the DB 
        $db = DB::getInstance();
    
        // delete the user to from DB
        if ($user->delete()) {
            // commit the changes to the DB
            $db->commit();

            // set the status code
            // 200 - ok
            $res->status(200);

            // set the body
            $res->write(json_encode($user->export()));

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