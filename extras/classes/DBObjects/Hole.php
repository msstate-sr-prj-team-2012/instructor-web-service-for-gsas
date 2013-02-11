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
 * Class Hole
 * @package API
 * @author  Kevin Benton
 * @version 1.0
 *
 * Child class of DBObject. Each Hole represents a row in the hole database
 * table.
 *
 * USAGE
 *
 * // for a new Hole not currently in the database
 * $hole = new Hole();
 *
 * // for a Shot currently in the database
 * $hole = new Hole($holeID);
 *          OR
 * $hole = new Hole($holeData);
 *
 * // for the static information on a hole
 * $hole = new Hole($courseID, $holeNumber, $teeID);
 *
 */

class Hole
    extends DBObject
{
/**
 * roundID - a foreign key to refernce this Hole to a certain Round
 *
 * @var int
 */
    private $_roundID;

/**
 * holeNumber - the hole number of the current Hole - concurrent with the hole
 *              on the course
 *
 * @var int
 */
    private $_holeNumber;

/**
 * distance - the distance, in yards, of the current Hole
 *
 * @var int
 */
    private $_distance = null;

/**
 * holeScore - the score the User scores on this Hole
 *
 * @var int
 */
    private $_holeScore = null;

/**
 * FIR - fairway in regulation
 *
 * @var bool
 */
    private $_FIR = null;

/**
 * GIR - green in regualtion
 *
 * @var bool
 */
    private $_GIR = null;

/**
 * putts - the number of putts a User takes on this Hole
 *
 * @var int
 */
    private $_putts = null;

/**
 * par - the par of the hole
 *
 * @var int
 */
    private $_par = null;

/**
 * firstRefLat - the latitude of the first reference point of the hole
 *
 * @var float
 */
    private $_firstRefLat = null;

/**
 * firstRefLong - the longitude of the first reference point of the hole
 *
 * @var float
 */
    private $_firstRefLong = null;

/**
 * secondRefLat - the latitude of the second reference point of the hole
 *
 * @var float
 */
    private $_secondRefLat = null;

/**
 * secondRefLong - the longitude of the second reference point of the hole
 *
 * @var float
 */
    private $_secondRefLong = null;

/**
 * thirdRefLat - the latitude of the third reference point of the hole
 *
 * @var float
 */
    private $_thirdRefLat = null;

/**
 * thirdRefLong - the longitude of the third reference point of the hole
 *
 * @var float
 */
    private $_thirdRefLong = null;

/**
 * firstRefX - the corresponding X coordinate of the first reference point
 *
 * @var int
 */
    private $_firstRefX = null;

/**
 * firstRefY - the corresponding Y coordinate the first reference point
 *
 * @var int
 */
    private $_firstRefY = null;

/**
 * secondRefX - the corresponding X coordinate of the second reference point
 *
 * @var int
 */
    private $_secondRefX = null;

/**
 * secondRefY - the corresponding Y coordinate of the second reference point
 *
 * @var int
 */
    private $_secondRefY = null;

/**
 * thirdRefX - the corresponding X coordinate of the third reference point
 *
 * @var int
 */
    private $_thirdRefX = null;

/**
 * thirdRefY - the corresponding Y coordinate of the third reference point
 *
 * @var int
 */
    private $_thirdRefY = null;

/**
 * shots - an array holding all the Shots for the Hole
 *
 * @var array
 */
    private $_shots = array();

/**
 * constructor - overrides DBObject::__construct()
 *               Instantiates a Hole object
 *
 * Can take on two forms.
 *
 * The first is just like all other DBObjects where an object
 * is created in correspondence with one row of the hole table.
 * In addition to this, reference points are taken from another
 * table(s). To do this option, use it just like the other objects.
 *
 * @param   null    $data
 * @param   int     $data
 * @param   Array   $data
 *
 * The second option is creating an empty Hole object with just 
 * reference points. For this option, you need three arguments: the courseID
 * where the round is going to be played, the hole number, and the teeID
 * of which tee will be used.
 *
 * @param   int     $courseID
 * @param   int     $holeNumber
 * @param   int     $teeID
 */
    public function  __construct($data = null)
    {
        // Instantiate a DBObject with 'hole' as the database table
        parent::__construct('hole');

        // get the number of arguments and the actual arguments passed in
        $argc = func_num_args();
        $argv = func_get_args();

        if ($argc == 1) {
            // This is the constructor that all other DBObject children have
            // Check to see if any data is passed into the constructor.
            // If there is, load the Shot object from that data.
            // Passed in data can be an integer ID representing the auto incremented
            // ID of the database row or an associative array with variable names as
            // keys and values of what the variables should be set to as values.
            $this->load($argv[0]);

            // After loading from the ID or array, obtain the reference points for this
            // hole. A Hole that is loaded already has an ID so get the courseID and teeID
            // from the Round table.
            $result = self::$db->select('round',
                'roundID = :id',
                array(':id' => $this->roundID())
            );

            // Make sure there was data selected.
            if (!empty($result)) {
                $result = $result[0];

                // Load the static information
                $this->loadStaticInfo($result['courseID'],
                    $this->holeNumber(),
                    $result['teeID']
                );
            }
        } 

        if ($argc == 3) {
            // If there are three arguments passed in, load the static information
            // for this hole.
            $this->loadStaticInfo($argv[0], $argv[1], $argv[2]);
        }
    }
   
/**
 *
 * Accessors/Mutators
 *
 */ 
    public function roundID($data = null)
    {
        if (!is_null($data)) {
            $this->_roundID = (int)$data;
        } else {
            return (int)$this->_roundID;
        }
    }

    public function holeNumber($data = null)
    {
        if (!is_null($data)) {
            $this->_holeNumber = (int)$data;
        } else {
            return (int)$this->_holeNumber;
        }
    }

    public function holeScore($data = null)
    {
        if (!is_null($data)) {
            $this->_holeScore = (int)$data;
        } else {
            return (int)$this->_holeScore;
        }
    }

    public function FIR($data = null)
    {
        if (!is_null($data)) {
            $this->_FIR = (bool)$data;
        } else {
            return (bool)$this->_FIR;
        }
    }

    public function GIR($data = null)
    {
        if (!is_null($data)) {
            $this->_GIR = (bool)$data;
        } else {
            return (bool)$this->_GIR;
        }
    }

    public function putts($data = null)
    {
        if (!is_null($data)) {
            $this->_putts = (int)$data;
        } else {
            return (int)$this->_putts;
        }
    }

    public function shots($data = null)
    {
        if (!is_null($data)) {
            $this->_shots = $data;
        } else {
            return $this->_shots;
        }
    }

    public function addShot($data)
    {
        $this->_shots[] = $data;
    }

    public function distance($data = null)
    {
        if (!is_null($data)) {
            $this->_distance = (int)$data;
        } else {
            return (int)$this->_distance;
        }
    }

    public function par($data = null)
    {
        if (!is_null($data)) {
            $this->_par = (int)$data;
        } else {
            return (int)$this->_par;
        }
    }

    public function firstRefLat($data = null)
    {
        if (!is_null($data)) {
            $this->_firstRefLat = (float)$data;
        } else {
            return (float)$this->_firstRefLat;
        }
    }

    public function firstRefLong($data = null)
    {
        if (!is_null($data)) {
            $this->_firstRefLong = (float)$data;
        } else {
            return (float)$this->_firstRefLong;
        }
    }

    public function secondRefLat($data = null)
    {
        if (!is_null($data)) {
            $this->_secondRefLat = (float)$data;
        } else {
            return (float)$this->_secondRefLat;
        }
    }

    public function secondRefLong($data = null)
    {
        if (!is_null($data)) {
            $this->_secondRefLong = (float)$data;
        } else {
            return (float)$this->_secondRefLong;
        }
    }

    public function thirdRefLat($data = null)
    {
        if (!is_null($data)) {
            $this->_thirdRefLat = (float)$data;
        } else {
            return (float)$this->_thirdRefLat;
        }
    }

    public function thirdRefLong($data = null)
    {
        if (!is_null($data)) {
            $this->_thirdRefLong = (float)$data;
        } else {
            return (float)$this->_thirdRefLong;
        }
    }

    public function firstRefX($data = null)
    {
        if (!is_null($data)) {
            $this->_firstRefX = (int)$data;
        } else {
            return (int)$this->_firstRefX;
        }
    }

    public function firstRefY($data = null)
    {
        if (!is_null($data)) {
            $this->_firstRefY = (int)$data;
        } else {
            return (int)$this->_firstRefY;
        }
    }

    public function secondRefX($data = null)
    {
        if (!is_null($data)) {
            $this->_secondRefX = (int)$data;
        } else {
            return (int)$this->_secondRefX;
        }
    }

    public function secondRefY($data = null)
    {
        if (!is_null($data)) {
            $this->_secondRefY = (int)$data;
        } else {
            return (int)$this->_secondRefY;
        }
    }

    public function thirdRefX($data = null)
    {
        if (!is_null($data)) {
            $this->_thirdRefX = (int)$data;
        } else {
            return (int)$this->_thirdRefX;
        }
    }

    public function thirdRefY($data = null)
    {
        if (!is_null($data)) {
            $this->_thirdRefY = (int)$data;
        } else {
            return (int)$this->_thirdRefY;
        }
    }

/**
 * load - overrides DBObject::load($id)
 *        Loads a Hole object with from an integer ID or an associative array.
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
        // Load the Hole from the database by using DBObject's load function.
        // Set the $data array to the first result
        if (!is_array($data)) {
            $data = parent::load($data);

            if (!empty($data)) {
                $data = $data[0];

                // load shots from the database with the Hole's
                // ID as the foreign key holeID
                $results = self::$db->select('shot',
                    'holeID = :id',
                    array(':id' => $this->ID())
                );

                // loop through the results and create a new Shot
                // object for each result
                $shots = array();
                foreach ($results as $result) {
                    $shot = new Shot($result['shotID']);
                    $shots[] = $shot;
                }

                $data['shots'] = $shots;
            } else {
                return true;
            }
        }

        // Here, there was either an array passed in or an array was formed when 
        // data was loaded from the database row
        // Set the attributes from the array
        $this->ID($data['holeID']);
        $this->roundID($data['roundID']);
        $this->holeNumber($data['holeNumber']);
        $this->holeScore($data['holeScore']);
        $this->FIR($data['FIR']);
        $this->GIR($data['GIR']);
        $this->putts($data['putts']);

        $this->shots($data['shots']);
    }

/**
 * loadStaticInfo - loads the reference points and static information
 *                  for this hole on the specified course and tee.
 *
 * @param   int     $courseID
 * @param   int     $holeNumber
 * @param   int     $teeID
 */
    public function loadStaticInfo($courseID, $holeNumber, $teeID)
    {
        $SQL = 'SELECT *
            FROM holeDefinition
            NATURAL JOIN holeReference
            WHERE courseID=:courseID
            AND holeNumber=:holeNumber
            AND teeID=:teeID
        ';
        $bind = array(
            ':courseID' => $courseID,
            ':holeNumber' => $holeNumber,
            ':teeID' => $teeID
        );
        $data = self::$db->run($SQL, $bind);

        if (!empty($data)) {
            $data = $data[0];

            $this->holeNumber($holeNumber);
            $this->distance($data['distance']);
            $this->par($data['par']);
            $this->firstRefLat($data['firstRefLat']);
            $this->firstRefLong($data['firstRefLong']);
            $this->secondRefLat($data['secondRefLat']);
            $this->secondRefLong($data['secondRefLong']);
            $this->thirdRefLat($data['thirdRefLat']);
            $this->thirdRefLong($data['thirdRefLong']);
            $this->firstRefX($data['firstRefX']);
            $this->firstRefY($data['firstRefY']);
            $this->secondRefX($data['secondRefX']);
            $this->secondRefY($data['secondRefY']);
            $this->thirdRefX($data['thirdRefX']);
            $this->thirdRefY($data['thirdRefY']);
        }
    }

/**
 * Saves a Hole to the database
 *
 * @return bool
 */
    public function save()
    {
        // make an Array from the attributes of this Shot
        $params = array(
            'roundID'    => $this->roundID(),
            'holeNumber' => $this->holeNumber(),
            'holeScore'  => $this->holeScore(),
            'FIR'        => $this->FIR(),
            'GIR'        => $this->GIR(),
            'putts'      => $this->putts()
        );

        // call DBObject::saveToDB and either insert or update the Hole.
        // Keep the return value of DBObject::saveToDB to check for inserting
        // Shots.
        $check = parent::saveToDB($params);

        if ($check) {
            // first delete all shots belonging to this hole
            self::$db->delete('shot', 
                'holeID = :id', 
                array(':id' => $this->ID())
            );

            // now save each shot to the DB with the new holeID
            foreach ($this->shots() as $shot) {
                // since all shots were just deleted,
                // if a shot has an ID, set it to null
                // so it doesn't try to update a nonexistent
                // shot
                if ($shot->ID()) $shot->ID(0);

                $shot->holeID($this->ID());
                
                // check to see if the shot saved
                // if one doesn't, return false after breaking
                // from the loop
                $warn = $shot->save();
                if (!$warn) {
                    $check = false;
                    break;
                }
            }
        }

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
        $data['hole'] = array();

        $data['hole']['id']         = $this->ID();
        $data['hole']['roundID']    = $this->roundID();
        $data['hole']['holeScore']  = $this->holeScore();
        $data['hole']['FIR']        = $this->FIR();
        $data['hole']['GIR']        = $this->GIR();
        $data['hole']['putts']      = $this->putts();

        $reference = $this->exportReference();
        foreach ($reference['hole'] as $key => $val) {
            $data['hole'][$key] = $val;
        }

        $data['hole']['shots'] = array();
        foreach ($this->shots() as $shot) {
            $data['hole']['shots'][] = $shot->export();
        }

        return $data;
    }

/**
 * exportReference - creates an associative array representing just the static
 *                   information of this Hole to be used for JSON encoding.
 *
 * @return Array
 */
    public function exportReference()
    {
        $data = array();
        $data['hole'] = array();
        $data['hole']['distance'] = $this->distance();
        $data['hole']['par'] = $this->par();
        $data['hole']['holeNumber'] = $this->holeNumber();
        $data['hole']['firstRefLat'] = $this->firstRefLat();
        $data['hole']['firstRefLong'] = $this->firstRefLong();
        $data['hole']['secondRefLat'] = $this->secondRefLat();
        $data['hole']['secondRefLong'] = $this->secondRefLong();
        $data['hole']['thirdRefLat'] = $this->thirdRefLat();
        $data['hole']['thirdRefLong'] = $this->thirdRefLong();
        $data['hole']['firstRefX'] = $this->firstRefX();
        $data['hole']['firstRefY'] = $this->firstRefY();
        $data['hole']['secondRefX'] = $this->secondRefX();
        $data['hole']['secondRefY'] = $this->secondRefY();
        $data['hole']['thirdRefX'] = $this->thirdRefX();
        $data['hole']['thirdRefY'] = $this->thirdRefY();

        return $data;
    }

/**
 * getAll - obtains all the Hole objects in the database.
 *          If a User ID is passed in, obtain all the Hole's
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
            $rounds = Round::getAll($userID);

            $holes = array();

            foreach ($rounds as $round) {
                foreach ($round->holes() as $hole) {
                    $holes[] = $hole;
                }
            }
        } else {
            $db = DB::getInstance();

            $results = $db->select('hole');

            $holes = array();

            foreach ($results as $result) {
                $hole = new Hole($result['holeID']);
                $holes[] = $hole;
            }
        }

        return $holes;
    }
}

?>
