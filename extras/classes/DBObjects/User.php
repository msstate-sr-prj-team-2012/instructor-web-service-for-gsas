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
 * Class User
 * @package API
 * @author  Kevin Benton
 * @version 1.0
 *
 * Child class of DBObject. Each User represents a row in the user database
 * table.
 *
 * USAGE
 *
 * // for a new User not currently in the database
 * $user = new User();
 *
 * // for a User currently in the database
 * $user = new User($userID);
 *          OR
 * $user = new User($userData);
 *
 */

class User
    extends DBObject
{
/**
 * memberID - represents the golfer's memberID. Can be null. Unique if set.
 *
 * @var int
 */
    private $_memberID = null;

/**
* nickname - represents the golfer's nickname. Can be null.
*
* @var String
*/
    private $_nickname = null;

/**
 * name - represents the golfer's name. Format: Last, First
 *
 * @var String
 */
    private $_name;

/**
 * email - represents the golfer's email. Unique.
 *
 * @var String
 */
    private $_email;

/**
 * stats - an associative array of the User's stats with years as keys.
 *
 * @var Array
 */
    private $_stats = array();

/**
 * ids - an associative array of the IDs of the stats of the User. Years are keys.
 *
 * @var Array
 */
    private $_ids = array();

/**
 * Constructor - overrides DBObject::__construct.
 *
 * @param   null    $data
 * @param   int     $data
 * @param   Array   $data
 */
    public function __construct($data = null)
    {
        // Instantiate an instance of DBObject with 'user' as the database table
        parent::__construct('user');

        // Check to see if any data is passed into the constructor.
        // If there is, load the User object from that data.
        // Passed in data can be an integer ID representing the auto incremented
        // ID of the database row or an associative array with variable names as
        // keys and values of what the variables should be set to as values.
        if (!empty($data)) {
            $this->load($data);
        }
    }

/**
 * Accessors/Mutators
 */
    public function memberID($data = null)
    {
        if (!empty($data)) {
            $this->_memberID = $data;
        } else {
            return $this->_memberID;
        }
    }

    public function nickname($data = null)
    {
        if (!empty($data)) {
            $this->_nickname = $data;
        } else {
            return $this->_nickname;
        }
    }

    public function name($data = null)
    {
        if (!empty($data)) {
            $this->_name = $data;
        } else {
            return $this->_name;
        }
    }

    public function email($data = null)
    {
        if (!empty($data)) {
            $this->_email = $data;
        } else {
            return $this->_email;
        }
    }

    public function stats($data = null)
    {
        if (!empty($data)) {
            $this->_stats = $data;
        } else {
            return $this->_stats;
        }
    }

    private function IDs($data = null)
    {
        if (!empty($data)) {
            $this->_ids = $data;
        } else {
            return $this->_ids;
        }
    }

/**
 * load - overrides DBObject::load($id)
 *        Loads a User object with from an integer ID or an associative array.
 *
 * @param   int     $data
 * @param   Array   $data
 *
 * @return  bool
 */
    public function load($data)
    {
        // if somehow nothing gets passed in, return true without setting any variables
        if (empty($data)) return true;

        // If it is not an array passed in, it is the ID
        // Load the User from the database by using DBObject's load function.
        // Set the $data array to the first result
        if (!is_array($data)) {
            if (!is_numeric($data)) {
                // construct the user from either an email or memberID depending on which
                // one is passed in
                $string = $data;
                $data = array();

                // do a string position search to look for the @ sign in an email
                $pos = strpos($string, '@');
                if ($pos !== false) {
                    // an email was found, construct from that
                    $data = self::$db->select('user',
                        'email = :email',
                        array(':email' => $string)
                    );

                    if (!empty($data)) {
                        $this->load($data[0]['userID']);
                    }
                } else {
                    // a memberID was found, construct from that
                    $data = self::$db->select('user',
                        'memberID = :memberID',
                        array(':memberID' => $string)
                    );

                    if (!empty($data)) {
                        $this->load($data[0]['userID']);
                    }
                }
            } else {
                $id = $data;
                $data = array();

                $data = parent::load($id);
            }

            if (!empty($data)) {
                $data = $data[0];
            } else {
                return true;
            }
        }

        // Here, there was either an array passed in or an array was formed when 
        // data was loaded from the database row
        // Set the attributes from the array
        $this->memberID($data['memberID']);
        $this->nickname($data['nickname']);
        $this->name($data['name']);
        $this->email($data['email']);

        // Load this User's stats
        $this->loadStats();
    }

/**
 * loadStats - Load the User's stats from the stats database table
 *
 */
    public function loadStats()
    {
        // get the rows of stats from the stats table for this User
        $results = self::$db->select('stats',
            'userID = :id',
            array(':id' => $this->ID())
        );

        $stats = array();
        $ids = array();

        // loop through the results setting the $ids and $stats Arrays
        foreach ($results as $data) {
            $ids[$data['year']] = $data['id'];

            $stats[$data['year']] = array();
            $stats[$data['year']]['driving_distance'] = (float)$data['drivingDistance'];
            $stats[$data['year']]['GIR_percentage']   = (float)$data['GIRPercentage'];
            $stats[$data['year']]['driving_accuracy'] = (float)$data['drivingAccuracy'];
        }

        // Set the attributes for IDs and stats
        $this->IDs($ids);
        $this->stats($stats);
    }

/**
 * save - saves a User to the database
 *
 * @return bool
 */
    public function save()
    {
        #TODO - check for unique memberID and email

        // make an Array from the attributes of this User
        $params = array(
            'memberID' => $this->memberID(),
            'nickname' => $this->nickname(),
            'name'     => $this->name(),
            'email'    => $this->email()
        );

        // call DBObject::saveToDB and either insert or update the User.
        // Return the return value of DBObject::saveToDB
        return parent::saveToDB($params);
    }

/**
 * saveStats - update the row of this User's stats for this year.
 *             Insert a row if one does not exist.
 *
 * @return bool
 */
    public function saveStats()
    {
        // Obtain an array of freshly calculated stats for this year for
        // this User.
        $stats = $this->calculateStats();

        // Set an array of the statistics parameters
        $params = array(
            'userID'          => $this->ID(),
            'year'            => date('Y'),
            'drivingDistance' => $stats['drivingDistance'],
            'GIRPercentage'   => $stats['GIRPercentage'],
            'drivingAccuracy' => $stats['drivingAccuracy']
        );

        // Check whether to be updated or inserted based on 
        // if there is an ID for this year's stats
        if (array_key_exists(date('Y'), $this->IDs())) {
            // Update the stats
            $ids = $this->IDs();

            $ok = self::$db->update('stats',
                $params,
                'id = :id',
                array(':id' => $ids[date('Y')])
            );
        } else {
            // Insert the stats
            $ok = self::$db->insert('stats', $params);
        }

        // reload the stats
        $this->load($this->ID());

        // return true or false based on success or failure
        return $ok == 1 ? true : false;
    }

/**
 * export - creates an associative array representing this object 
 *          to be used for JSON encoding.
 *
 * @return Array
 */
    public function export()
    {
        $data = array();
        $data['user'] = array();
        $data['user']['id']       = $this->ID();
        $data['user']['memberID'] = $this->memberID();
        $data['user']['nickname'] = $this->nickname();
        $data['user']['name']     = $this->name();
        $data['user']['email']    = $this->email();
        $data['user']['stats']    = $this->stats();

        return $data;
    }

/**
 * calculateStats - calculate the driving distance, driving accuracy and GIR
 *                  percentage for this year's rounds
 */
    private function calculateStats()
    {
        // Obtain all rounds played by this User
        $rounds = Round::getAll($this->ID());

        $numShots = 0;
        $numHolesFIR = 0;
        $numHolesGIR = 0;
        $FIRs = 0;
        $GIRs = 0;
        $distances = 0.0;

        // loop through each round
        foreach ($rounds as $round) {
            if (($timestamp = strtotime($round->startTime())) !== false) {
                if ((date('Y')) == (date('Y', $timestamp))) {
                    // If made to here, the round was played this year
                    foreach ($round->holes() as $hole) {
                        // increment the GIR holes counter for every hole
                        $numHolesGIR++;
                        if ($hole->GIR()) {
                            // if the green was hit in regulation on this hole,
                            // increment the GIR counter
                            $GIRs++;
                        }
                        // Check to see if this hole is not a par three
                        // Par threes do not have a FIR option so don't 
                        // count it against the User
                        if ($hole->par() !== 3) {
                            // increment the FIR hole counter
                            $numHolesFIR++;
                            if ($hole->FIR()) {
                                // if the fairway was hit off the tee on this hole, 
                                // increment the FIR counter
                                $FIRs++;
                            }
                        }
                        // loop through the holes to obtain driving distance
                        foreach ($hole->shots() as $shot) {
                            if ($shot->club() === 1) {
                                // here the club used was driver
                                // increment the numShots counter
                                $numShots++;

                                // Add the distance of the shot to the distances variable
                                $distances += distance($shot->startLongitude(),
                                    $shot->startLatitude(),
                                    $shot->endLongitude(),
                                    $shot->endLatitude()
                                );
                            }
                        }
                    }
                }
            }
        }

        // fill an array with the calculated stats
        // GIRPercentage = the number of greens hit divided by the number of holes
        // Driving accuracy = the number of fairways hit on non par threes divided by the number of holes that aren't par threes
        // Driving distance = the summation of distances of shots by the driver divided by the number of shots taken with the driver
        $data = array();

        if ($numHolesGIR === 0) {
            $data['GIRPercentage']   = 0;
        } else {
            $data['GIRPercentage']   = (float)$GIRs/$numHolesGIR * 100;
        }

        if ($numHolesFIR === 0) {
            $data['drivingAccuracy']   = 0;
        } else {
            $data['drivingAccuracy']   = (float)$GIRs/$numHolesFIR * 100;
        }

        if ($numShots === 0) {
            $data['drivingDistance'] = 0;
        } else {
            $data['drivingDistance'] = (float)$distances/$numShots;
        }

        return $data;
    }

/**
 * getAll - obtains all the User objects in the database
 *
 * @return Array
 */
    public static function getAll()
    {
        $db = DB::getInstance();

        $SQL = 'SELECT *
            FROM user
            ORDER BY name
        ';

        $results = $db->run($SQL);

        $users = array();

        foreach ($results as $result) {
            $user = new User($result['userID']);
            $users[] = $user;
        }

        return $users;
    }
}

?>
