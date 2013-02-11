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
 * Class Course
 * @package API
 * @author  Kevin Benton
 * @version 1.0
 *
 * Child class of DBObject. Each Course represents a row in the course database
 * table.
 *
 * USAGE
 *
 * // for a new Course not currently in the database
 * $course = new Course();
 *
 * // for a Course currently in the database
 * $course = new Course($courseID);
 *              OR
 * $course = new Course($courseData);
 *
 */

class Course
    extends DBObject
{
/**
 * name - a string name representing this Course
 *
 * @var String
 */
    private $_name;

/**
 * location - a string representation of this Course's location
 *
 * @var String
 */
    private $_location;

/**
 * constructor - overrides DBObject::__construct()
 *               Instantiates a Course object
 *
 * @param   null    $data
 * @param   int     $data
 * @param   Array   $data
 */
    public function __construct($data = null)
    {
        // Instantiate a DBObject with 'course' as the database table
        parent::__construct('course');

        // Check to see if any data is passed into the constructor.
        // If there is, load the Course object from that data.
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
    public function name($data = null)
    {
        if (!is_null($data)) {
            $this->_name = $data;
        } else {
            return $this->_name;
        }
    }

    public function location($data = null)
    {
        if (!is_null($data)) {
            $this->_location = $data;
        } else {
            return $this->_location;
        }
    }

/**
 * load - overrides DBObject::load($id)
 *        Loads a Course object with from an integer ID or an associative array.
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
        // Load the Course from the database by using DBObject's load function.
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
        $this->name($data['name']);
        $this->location($data['location']);
    }

/**
 * Saves a Course to the database
 *
 * @return bool
 */
    public function save()
    {
        // make an Array from the attributes of this Course
        $params = array(
            'name'     => $this->name(),
            'location' => $this->location()
        );

        // call DBObject::saveToDB and either insert or update the Course.
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
        $data['course'] = array();
        $data['course']['id']       = $this->ID();
        $data['course']['name']     = $this->name();
        $data['course']['location'] = $this->location();

        return $data;
    }

/**
 * getAll - obtains all the Course objects in the database
 *
 * @return Array
 */
    public static function getAll()
    {
        $db = DB::getInstance();

        $SQL = 'SELECT *
            FROM course
            ORDER BY name
        ';
        
        $results = $db->run($SQL);

        $courses = array();

        foreach ($results as $result) {
            $course = new Course($result);
            $course->ID($result['courseID']);
            $courses[] = $course;
        }

        return $courses;
    }
}

?>
