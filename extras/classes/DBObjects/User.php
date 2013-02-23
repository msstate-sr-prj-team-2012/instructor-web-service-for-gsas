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
 * birthYear - integer value of the User's birth year
 *
 * @var int
 */
    private $_birthYear;

/**
 * male - boolean value, true if male, false if female
 *
 * @var bool
 */
    private $_male;

/**
 * rightHanded - boolean value, true if right handed
 *
 * @var bool
 */
    private $_rightHanded;

/**
 * stats - an associative array of the User's stats with years as keys.
 *
 * @var Stats
 */
    private $_stats;

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
        if (!is_null($data)) {
            $this->load($data);
        } else {
            $this->stats(new Stats());
        }
    }

/**
 * Accessors/Mutators
 */
    public function memberID($data = null)
    {
        if (!is_null($data)) {
            $this->_memberID = $data;
        } else {
            return $this->_memberID;
        }
    }

    public function nickname($data = null)
    {
        if (!is_null($data)) {
            $this->_nickname = $data;
        } else {
            return $this->_nickname;
        }
    }

    public function name($data = null)
    {
        if (!is_null($data)) {
            $this->_name = $data;
        } else {
            return $this->_name;
        }
    }

    public function email($data = null)
    {
        if (!is_null($data)) {
            $this->_email = $data;
        } else {
            return $this->_email;
        }
    }

    public function birthYear($data = null)
    {
        if (!is_null($data)) {
            $this->_birthYear = (int)$data;
        } else {
            return (int)$this->_birthYear;
        }
    }

    public function male($data = null)
    {
        if (!is_null($data)) {
            $this->_male = (bool)$data;
        } else {
            return (bool)$this->_male;
        }
    }

    public function rightHanded($data = null)
    {
        if (!is_null($data)) {
            $this->_rightHanded = (bool)$data;
        } else {
            return (bool)$this->_rightHanded;
        }
    }

    public function stats($data = null)
    {
        if (!is_null($data)) {
            $this->_stats = $data;
        } else {
            return $this->_stats;
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
        if (is_null($data)) return true;

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
        $this->birthYear($data['birthYear']);
        $this->male($data['male']);
        $this->rightHanded($data['rightHanded']);

        $this->ID() ? $this->stats(new Stats($this->ID())) : $this->stats(new Stats());
    }

/**
 * save - saves a User to the database
 *
 * @return bool
 */
    public function save()
    {
        // make an Array from the attributes of this User
        $params = array(
            'memberID'    => $this->memberID(),
            'nickname'    => $this->nickname(),
            'name'        => $this->name(),
            'email'       => $this->email(),
            'birthYear'   => $this->birthYear(),
            'male'        => $this->male(),
            'rightHanded' => $this->rightHanded()
        );

        // call DBObject::saveToDB and either insert or update the User.
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
        $data['user'] = array();
        $data['user']['id']          = $this->ID();
        $data['user']['memberID']    = $this->memberID();
        $data['user']['nickname']    = $this->nickname();
        $data['user']['name']        = $this->name();
        $data['user']['email']       = $this->email();
        $data['user']['birthYear']   = $this->birthYear();
        $data['user']['male']        = $this->male();
        $data['user']['rightHanded'] = $this->rightHanded();
        $data['user']['stats']       = $this->stats()->stats();

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
