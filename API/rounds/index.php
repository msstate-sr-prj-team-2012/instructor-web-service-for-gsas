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
 * Rounds URIs
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
 * URI: /rounds
 * METHOD: GET
 * Response: list all rounds in the databasei
 *
 * SUCCESS RETURN CODE: 200 - OK
 * FAILURE RETURN POSSIBILITIES:
 *      5xx - Server Errors
 *
 */
$app->get('/all/:page',
function($page) use ($app)
{
    // check for get variables
    $req = $app->request();

    // get the app's response object
    $res = $app->response();

    if ($page < 1) {
        // return a 204 for no content
        $res->status(204);
        $array = $res->finalize();
    } else {
        // get all the rounds
        $rounds = Round::getAll();

        // determine start and finish based on page number
        $page == 1 ? $start = 0 : $start = (($page - 1) * 10);
        $finish = $start + 10;

        // check to make sure we can fill up this page
        if (count($rounds) < $finish) {
            $finish = count($rounds);
        }

        // start to set the body
        $data['rounds'] = array();

        $current = $start;
        while ($current < $finish) {
            $ids = array();
            $ids['id'] = $rounds[$current]->ID();
            $ids['startTime'] = $rounds[$current]->startTime();
            $data['rounds'][] = $ids;

            $current++;
        }

        // if there are still more, put an integer with the
        // next page number. If not, set it to null
        count($rounds) > $finish ? $data['nextPage'] = $page + 1 : $data['nextPage'] = null;

        $res->write(json_encode($data));

        // set the status code
        $res->status(200);

        // set the content type
        $res['Content-Type'] = 'application/json';

        // finalize the response
        $array = $res->finalize();
    }
});

/**
 * URI: /rounds/:id
 * METHOD: GET
 * Response: get the information of the round with the specified id
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
    $round = new Round($id);
    if (!$round->ID()) {
        // user does not exist
        // return a 204 - no content
        $res->status(204);
        $array = $res->finalize();
    } else {
        // set the status code
        $res->status(200);

        // set the body
        $res->write(json_encode($round->export()));

        // set the content type
        $res['Content-Type'] = 'application/json';

        // finalize the response
        $array = $res->finalize();
    }
});

/**
 * URI: /rounds/user/:id
 * METHOD: GET
 * Response: get all the rounds of the specified User
 *
 * SUCCESS RETURN CODE: 200 - OK
 * FAILURE RETURN POSSIBILITIES:
 *      204 - No Content
 *      5xx - Server Errors
 *
 */
$app->get('/user/:id/:page',
function($id, $page) use ($app) {
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
        // get all the rounds
        $rounds = Round::getAll($user->ID());

        // determine start and finish based on page number
        $page == 1 ? $start = 0 : $start = (($page - 1) * 10);
        $finish = $start + 10;

        // check to make sure we can fill up this page
        if (count($rounds) < $finish) {
            $finish = count($rounds);
        }

        // start to set the body
        $data['rounds'] = array();

        $current = $start;
        while ($current < $finish) {
            $ids = array();
            $ids['id'] = $rounds[$current]->ID();
            $ids['startTime'] = $rounds[$current]->startTime();
            $data['rounds'][] = $ids;

            $current++;
        }

        // if there are still more, put an integer with the
        // next page number. If not, set it to null
        count($rounds) > $finish ? $data['nextPage'] = $page + 1 : $data['nextPage'] = null;

        $res->write(json_encode($data));

        // set the status code
        $res->status(200);

        // set the content type
        $res['Content-Type'] = 'application/json';

        // finalize the response
        $array = $res->finalize();
    }
});

/**
 * URI: /rounds
 * METHOD: POST
 * Response: insert a new round into the database, returns the inserted round
 *
 * SUCCESS RETURN CODE: 201 - Created
 * FAILURE RETURN POSSIBILITIES:
 *      400 - Bad Request
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
    if (!array_key_exists('round', $data)) {
        // return a 400 for bad request - improper json format
        $res->status(400);
        $array = $res->finalize();
    } else {
        $data = $data['round'];
        
        if (!array_key_exists('user', $data) || !array_key_exists('course', $data) ||
                !array_key_exists('totalScore', $data) || !array_key_exists('teeID', $data) ||
                !array_key_exists('startTime', $data) || !array_key_exists('holes', $data)) {
            // return a 400 for bad request - improper json format
            $res->status(400);
            $array = $res->finalize();
        } else {
            // create a new round
            $round = new Round();
            $round->user(new User($data['user']['user']['id']));
            $round->course(new Course($data['course']['course']['id']));
            $round->totalScore($data['totalScore']);
            $round->teeID($data['teeID']);
            $round->startTime($data['startTime']);

            $holes = $data['holes'];

            // add the holes
            foreach ($holes as $h) {
                $hole = new Hole($round->course()->ID(),
                    $h['hole']['holeNumber'],
                    $round->teeID()
                );
                $hole->holeScore($h['hole']['holeScore']);
                $hole->FIR($h['hole']['FIR']);
                $hole->GIR($h['hole']['GIR']);
                $hole->putts($h['hole']['putts']);

                $shots = $h['hole']['shots'];

                // add all the shots for the hole
                foreach ($shots as $s) {
                    $shot = new Shot();
                    $shot->club($s['shot']['club']);
                    $shot->shotNumber($s['shot']['shotNumber']);
                    $shot->aimLatitude($s['shot']['aimLatitude']);
                    $shot->aimLongitude($s['shot']['aimLongitude']);
                    $shot->startLatitude($s['shot']['startLatitude']);
                    $shot->startLongitude($s['shot']['startLongitude']);
                    $shot->endLatitude($s['shot']['endLatitude']);
                    $shot->endLongitude($s['shot']['endLongitude']);
                    $hole->addShot($shot);
                }

                $round->addHole($hole);
            }
            
            // save the round to the DB
            // adds holes and shots
            if ($round->save()) {
                // commit the DB changes
                $db->commit();

                // set the status code
                // 201 - created
                $res->status(201);

                // set the body
                $newRound = new Round($round->ID());
                $data = $newRound->export();
                $res->write(json_encode($data));

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
});

/**
 * URI: /rounds/:id
 * METHOD: POST
 * Response: updates a round in the database, returns the updated round
 *
 * SUCCESS RETURN CODE: 200 - OK
 * FAILURE RETURN POSSIBILITIES:
 *      204 - No Content
 *      400 - Bad request
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
    if (!array_key_exists('round', $data)) {
        // return a 400 for bad request - improper json format
        $res->status(400);
        $array = $res->finalize();
    } else {
        $data = $data['round'];
        
        if (!array_key_exists('user', $data) || !array_key_exists('course', $data) ||
                !array_key_exists('totalScore', $data) || !array_key_exists('teeID', $data) ||
                !array_key_exists('startTime', $data) || !array_key_exists('holes', $data)) {
            // return a 400 for bad request - improper json format
            $res->status(400);
            $array = $res->finalize();
        } else {
            // create a new round
            $round = new Round($id);
            if (!$round->ID()) {
                // round doesn't exist
                // return a 204 - no content
                $res->status(204);
                $array = $res->finalize();
            } else {
                // get the instance of the DB 
                $db = DB::getInstance();

                $round->user(new User($data['user']['user']['id']));
                $round->course(new Course($data['course']['course']['id']));
                $round->totalScore($data['totalScore']);
                $round->teeID($data['teeID']);
                $round->startTime($data['startTime']);

                $holes = $data['holes'];

                // add the holes
                foreach ($holes as $h) {
                    $hole = new Hole($round->course()->ID(),
                        $h['hole']['holeNumber'],
                        $round->teeID()
                    );
                    $hole->holeScore($h['hole']['holeScore']);
                    $hole->FIR($h['hole']['FIR']);
                    $hole->GIR($h['hole']['GIR']);
                    $hole->putts($h['hole']['putts']);

                    $shots = $h['hole']['shots'];

                    // add all the shots for the hole
                    foreach ($shots as $s) {
                        $shot = new Shot();
                        $shot->club($s['shot']['club']);
                        $shot->shotNumber($s['shot']['shotNumber']);
                        $shot->aimLatitude($s['shot']['aimLatitude']);
                        $shot->aimLongitude($s['shot']['aimLongitude']);
                        $shot->startLatitude($s['shot']['startLatitude']);
                        $shot->startLongitude($s['shot']['startLongitude']);
                        $shot->endLatitude($s['shot']['endLatitude']);
                        $shot->endLongitude($s['shot']['endLongitude']);
                        $hole->addShot($shot);
                    }

                    $round->addHole($hole);
                }

                // save the round to the DB
                // adds holes and shots
                if ($round->save()) {
                    // commit the changes
                    $db->commit();

                    // set the status code
                    // 200 - ok
                    $res->status(200);

                    // set the body
                    $newRound = new Round($round->ID());
                    $data = $newRound->export();
                    $res->write(json_encode($data));

                    // set the content type
                    $res['Content-Type'] = 'application/json';

                    // finalize the response
                    $array = $res->finalize();
                } else {
                    // roll back the changes
                    $db->rollBack();

                    // problem with the save function
                    // return 500 - server error
                    $res->status(500);
                    $array = $res->finalize();
                }
            }
        }
    }
});

/**
 * URI: /rounds/destroy/:id
 * METHOD: POST
 * Response: delete a round with the specified id, returns the deleted round
 * SUCCESS RETURN CODE: 200 - OK
 * FAILURE RETURN POSSIBILITIES:
 *      204 - No Content
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

    // load round from the DB
    $round = new Round($id);
    if (!$round->ID()) {
        // round doesn't exist
        // return a 204 - no content
        $res->status(204);
        $array = $res->finalize();
    } else {
        // get the instance of the DB 
        $db = DB::getInstance();
    
        // delete the round to from DB
        if ($round->delete()) {
            // commit the DB changes
            $db->commit();

            // set the status code
            // 200 - ok
            $res->status(200);

            // set the body
            $res->write(json_encode($round->export()));

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