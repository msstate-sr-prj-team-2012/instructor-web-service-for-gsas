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
 * Class Shot
 * @package API
 * @author  Kevin Benton
 * @version 1.0
 *
 * Child class of DBObject. Each Shot represents a row in the shot database
 * table.
 *
 * USAGE
 *
 * // for a new Shot not currently in the database
 * $shot = new Shot();
 *
 * // for a Shot currently in the database
 * $shot = new Shot($shotID);
 *          OR
 * $shot = new Shot($shotData);
 *
 */

class Shot
    extends DBObject
{
/**
 * holeID - an integer value representing the ID of the Hole
 *          of which this Shot belongs to.
 *
 * @var int
 */
    private $_holeID;

/**
 * club - an integer value representing which club was used to take
 *        this Shot
 *
 * @var int
 */
    private $_club;

/**
 * shot - an integer value ordering the Shots in a Hole
 *
 * @var int
 */
    private $_shotNumber;

/**
 * aimLatitude - a float value of the Shot's aim latitude
 *
 * @var float
 */
    private $_aimLatitude;

/**
 * aimLongitude - a float value of the Shot's aim longitude
 *
 * @var float
 */
    private $_aimLongitude;

/**
 * startLatitude - a float value of the Shot's start latitude
 *
 * @var float
 */
    private $_startLatitude;

/**
 * startLongitude - a float value of the Shot's start longitude
 *
 * @var float
 */
    private $_startLongitude;

/**
 * endLatitude - a float value of the Shot's end latitude
 *
 * @var float
 */
    private $_endLatitude;

/**
 * endLongitude - a float value of the Shot's end longitude
 *
 * @var float
 */
    private $_endLongitude;

/**
 * constructor - overrides DBObject::__construct()
 *               Instantiates a Shot object
 *
 * @param   null    $data
 * @param   int     $data
 * @param   Array   $data
 */
    public function __construct($data = null)
    {
        // Instantiate a DBObject with 'shot' as the database table
        parent::__construct('shot');

        // Check to see if any data is passed into the constructor.
        // If there is, load the Shot object from that data.
        // Passed in data can be an integer ID representing the auto incremented
        // ID of the database row or an associative array with variable names as
        // keys and values of what the variables should be set to as values.
        if (!empty($data)) {
            $this->load($data);
        }
    }

/**
 *
 * Accessors/Mutators
 *
 */
    public function holeID($data = null)
    {
        if (!empty($data)) {
            $this->_holeID = (int)$data;
        } else {
            return (int)$this->_holeID;
        }
    }

    public function club($data = null)
    {
        if (!empty($data)) {
            $this->_club = (int)$data;
        } else {
            return (int)$this->_club;
        }
    }

    public function shotNumber($data = null)
    {
        if (!empty($data)) {
            $this->_shotNumber = (int)$data;
        } else {
            return (int)$this->_shotNumber;
        }
    }

    public function aimLatitude($data = null)
    {
        if (!empty($data)) {
            $this->_aimLatitude = (float)$data;
        } else {
            return (float)$this->_aimLatitude;
        }
    }

    public function aimLongitude($data = null)
    {
        if (!empty($data)) {
            $this->_aimLongitude = (float)$data;
        } else {
            return (float)$this->_aimLongitude;
        }
    }

    public function startLatitude($data = null)
    {
        if (!empty($data)) {
            $this->_startLatitude = (float)$data;
        } else {
            return (float)$this->_startLatitude;
        }
    }

    public function startLongitude($data = null)
    {
        if (!empty($data)) {
            $this->_startLongitude = (float)$data;
        } else {
            return (float)$this->_startLongitude;
        }
    }

    public function endLatitude($data = null)
    {
        if (!empty($data)) {
            $this->_endLatitude = (float)$data;
        } else {
            return (float)$this->_endLatitude;
        }
    }

    public function endLongitude($data = null)
    {
        if (!empty($data)) {
            $this->_endLongitude = (float)$data;
        } else {
            return (float)$this->_endLongitude;
        }
    }

/**
 * load - overrides DBObject::load($id)
 *        Loads a Shot object with from an integer ID or an associative array.
 *
 * @param   int     $data
 * @param   Array   $data
 *
 * @return  bool
 */
    public function load($data)
    {
        // if no data gets passed in, return without setting any class variables
        if (empty($data)) return true;

        // If it is not an array passed in, it is the ID
        // Load the Shot from the database by using DBObject's load function.
        // Set the $data array to the first result
        if (!is_array($data)) {
            $data = parent::load($data);

            if (!empty($data)) {
                $data = $data[0];
            } else {
                return true;
            }
        }

        // Here, there was either an array passed in or an array was formed when 
        // data was loaded from the database row
        // Set the attributes from the array
        $this->ID($data['shotID']);
        $this->holeID($data['holeID']);
        $this->club($data['club']);
        $this->shotNumber($data['shotNumber']);
        $this->aimLatitude($data['aimLatitude']);
        $this->aimLongitude($data['aimLongitude']);
        $this->startLatitude($data['startLatitude']);
        $this->startLongitude($data['startLongitude']);
        $this->endLatitude($data['endLatitude']);
        $this->endLongitude($data['endLongitude']);
    }

/**
 * Saves a Shot to the database
 *
 * @return bool
 */
    public function save()
    {
        // make an Array from the attributes of this Shot
        $params = array(
            'holeID'         => $this->holeID(),
            'club'           => $this->club(),
            'shotNumber'     => $this->shotNumber(),
            'aimLatitude'    => $this->aimLatitude(),
            'aimLongitude'   => $this->aimLongitude(),
            'startLatitude'  => $this->startLatitude(),
            'startLongitude' => $this->startLongitude(),
            'endLatitude'    => $this->endLatitude(),
            'endLongitude'   => $this->endLongitude()
        );

        // call DBObject::saveToDB and either insert or update the Shot.
        // Return the return value of DBObject::saveToDB
        return parent::saveToDB($params);
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
        $data['shot'] = array();
        $data['shot']['id']             = $this->ID();
        $data['shot']['holeID']         = $this->holeID();
        $data['shot']['club']           = $this->club();
        $data['shot']['shotNumber']     = $this->shotNumber();
        $data['shot']['aimLatitude']    = $this->aimLatitude();
        $data['shot']['aimLongitude']   = $this->aimLongitude();
        $data['shot']['startLatitude']  = $this->startLatitude();
        $data['shot']['startLongitude'] = $this->startLongitude();
        $data['shot']['endLatitude']    = $this->endLatitude();
        $data['shot']['endLongitude']   = $this->endLongitude();

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
        if (!empty($userID)) {
            $rounds = Round::getAll($userID);

            $shots = array();

            foreach ($rounds as $round) {
                foreach ($round->holes() as $hole) {
                    foreach ($hole->shots() as $shot) {
                        $shots[] = $shot;
                    }
                }
            }
        } else {
            $db = new DB();

            $results = $db->select('shot');

            // must set the DB to null to close the connection
            $db = null;

            $shots = array();

            foreach ($results as $result) {
                $shot = new Shot($result['shotID']);
                $shots[] = $shot;
            }
        }

        return $shots;
    }
}

?>
