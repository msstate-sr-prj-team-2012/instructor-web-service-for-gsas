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
 * Class DBObject
 * @package API
 * @author  Kevin Benton
 * @version 1.0
 *
 * Child class of DBObject. Each Round represents a row in the round database
 * table.
 *
 * USAGE
 *
 * // for a new Round not currently in the database
 * $round = new Round();
 *
 * // for a Round currently in the database
 * $round = new Round($roundID);
 *          OR
 * $round = new Round($roundData);
 *
 */

class Round
    extends DBObject
{
/**
 * user - the User playing this Round
 *
 * @var User
 */
    private $_user;

/**
 * course - the Course this ROund is be played at
 *
 * @var Course
 */
    private $_course;

/**
 * teeID - the tee the User is playing from
 *
 * @var int
 */
    private $_teeID;

/**
 * totalScore - the score the User records on this Round
 *
 * @var int
 */
    private $_totalScore = null;

/**
 * startTime - the timestamp of the start of the Round. 
 *
 * @var String
 */
    private $_startTime;

/**
 * holes - an array holding all the Holes for this Round
 *
 * @var Array
 */
    private $_holes = array();

/**
 * constructor - overrides DBObject::__construct()
 *               Instantiates a Round object
 *
 * @param   null    $data
 * @param   int     $data
 * @param   Array   $data
 */
    public function  __construct($data = null)
    {
        // Instantiate a DBObject with 'shot' as the database table
        parent::__construct('round');

        // Check to see if any data is passed into the constructor.
        // If there is, load the Round object from that data.
        // Passed in data can be an integer ID representing the auto incremented
        // ID of the database row or an associative array with variable names as
        // keys and values of what the variables should be set to as values.
        if (!is_null($data)) {
            $this->load($data);
        }
    }

/**
 *
 * Accessors/Mutators
 *
 */
    public function user($data = null)
    {
        if (!is_null($data)) {
            $this->_user = $data;
        } else {
            return $this->_user;
        }
    }

    public function course($data = null)
    {
        if (!is_null($data)) {
            $this->_course = $data;
        } else {
            return $this->_course;
        }
    }

    public function totalScore($data = null)
    {
        if (!is_null($data)) {
            $this->_totalScore = (int)$data;
        } else {
            return (int)$this->_totalScore;
        }
    }

    public function teeID($data = null)
    {
        if (!is_null($data)) {
            $this->_teeID = (int)$data;
        } else {
            return (int)$this->_teeID;
        }
    }

    public function startTime($data = null)
    {
        if (!is_null($data)) {
            $this->_startTime = $data;
        } else {
            return $this->_startTime;
        }
    }

    public function holes($data = null)
    {
        if (!is_null($data)) {
            $this->_holes = $data;
        } else {
            return $this->_holes;
        }
    }

    public function addHole($data)
    {
        $this->_holes[] = $data;
    }

/**
 * load - overrides DBObject::load($id)
 *        Loads a Round object with from an integer ID or an associative array.
 *
 * @param   int     $data
 * @param   Array   $data
 *
 * @return  bool
 */
    public function load($data)
    {
        // if no data gets passed in, return without setting any class variables
        if (is_null($data)) return true;

        // If it is not an array passed in, it is the ID
        // Load the Round from the database by using DBObject's load function.
        // Set the $data array to the first result
        if (!is_array($data)) {
            $data = parent::load($data);

            if (!empty($data)) {
                $data = $data[0];

                // load holes from the database with the Rounds's
                // ID as the foreign key roundID
                $results = self::$db->select('hole',
                    'roundID = :id',
                    array(':id' => $this->ID())
                );

                // loop through the results and create a new Hole
                // object for each result
                $holes = array();
                foreach ($results as $result) {
                    $hole = new Hole($result['holeID']);
                    $holes[] = $hole;
                }

                $data['holes'] = $holes;
            } else {
                return true;
            }
        }

        // Here, there was either an array passed in or an array was formed when 
        // data was loaded from the database row
        // Set the attributes from the array
        $this->ID($data['roundID']);
        $this->user(new User($data['userID']));
        $this->course(new Course($data['courseID']));
        $this->teeID($data['teeID']);
        $this->totalScore($data['totalScore']);
        $this->startTime($data['startTime']);

        $this->holes($data['holes']);
    }

/**
 * Saves a Round to the database
 *
 * @return bool
 */
    public function save()
    {
        if ($this->ID()) $this->delete();

        // make an Array from the attributes of this Shot
        $params = array(
            'userID'     => $this->user()->ID(),
            'courseID'   => $this->course()->ID(),
            'teeID'      => $this->teeID(),
            'totalScore' => $this->totalScore(),
            'startTime'  => $this->startTime(),
        );

        // call DBObject::saveToDB and either insert or update the Round.
        // Keep the return value of DBObject::saveToDB to check for inserting
        // Hole.
        $check = parent::saveToDB($params);

        if ($check) {
            // first delete all holes belonging to this round
            self::$db->delete('hole', 
                'roundID = :id', 
                array(':id' => $this->ID())
            );

            // now save each hole to the DB with the new round ID
            foreach ($this->holes() as $hole) {
                // since all holes were just deleted,
                // if a Hole has an ID, set it to null
                // so it doesn't try to update a nonexistent
                // Hole
                if ($this->ID()) $hole->ID(0);

                $hole->roundID($this->ID());
                
                // check if the hole saved properly
                // if it didn't turn the check to false
                // and break from the loop
                $warn = $hole->save();
                if (!$warn) {
                    $check = false;
                    break;
                }
            }
        }

        // update the User's stats
        $this->user()->stats()->save();

        // return the status of the Hole save.
        return $check;
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
        $data['round'] = array();

        $data['round']['id']         = $this->ID();
        $data['round']['user']       = $this->user()->export();
        $data['round']['course']     = $this->course()->export();
        $data['round']['totalScore'] = $this->totalScore();
        $data['round']['teeID']      = $this->teeID();
        $data['round']['startTime']  = $this->startTime();

        $data['round']['holes'] = array();
        foreach ($this->holes() as $hole) {
            $data['round']['holes'][] = $hole->export();
        }

        return $data;
    }

/**
 * getAll - obtains all the Shot objects in the database.
 *          If a User ID is passed in, obtain all the Shot's
 *          for that User.
 *
 * @param   null    $userID
 * @param   int     $userID
 *
 * @return Array
 */
    public static function getAll($userID = null)
    {
        if (!is_null($userID)) {
            $db = DB::getInstance();

            $SQL = 'SELECT * 
                FROM round
                WHERE userID = :id
                ORDER BY startTime DESC
            ';

            $results = $db->run($SQL, array(':id' => $userID));

            $rounds = array();

            foreach ($results as $result) {
                $round = new Round($result['roundID']);
                $rounds[] = $round;
            }
        } else {
            $db = DB::getInstance();

            $results = $db->select('round');

            $rounds = array();

            foreach ($results as $result) {
                $round = new Round($result['roundID']);
                $rounds[] = $round;
            }
        }

        return $rounds;
    }
}

?>
