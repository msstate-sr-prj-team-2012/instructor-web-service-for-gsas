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
 * Inheritable object for all database objects with an auto incremented ID.
 * Provides base load, save, and delete methods.
 *
 * Never instantiated directly. DBObject children are not polymorphic.
 *
 */

class DBObject
{
/**
 * object - the object is the name of the database table.
 *          It is private to the class. 
 *
 * @var String
 */
    private $_object;

/**
 * objectID - the objectID specifies the name of the column
 *            of the auto incremented ID. It is private to 
 *            the class.
 *
 * @var String
 */
    private $_objectID;

/**
 * id - the numerical value of the auto incremented ID.
 *      This is inherited by all child classes.
 *
 * @var int
 */
    protected $_id = null;

/**
 *  db - a reference to the database connection
 *
 * @var DB
 */
    protected static $db;


/**
 * Constructor - inheritable function that takes the name of the 
 *               database table to be able reference the correct 
 *               table when executing SQL statements. Gets a database 
 *               instance and sets the object and objectID attributes.
 *
 * @param   String      $object
 */
    protected function __construct($object)
    {
        // get a database instance to work with
        if (empty(self::$db)) {
            self::$db = DB::getInstance();
        }

        // set the object and objectID
        $this->object($object);
        $this->objectID($this->object() . "ID");
    }

/**
 * Destructor
 *
 */
    public function __destruct() { }

/**
 * Accessors/mutators
 *
 */
    public function ID($data = null)
    {
        if (!is_null($data)) {
            if ($data === 0) {
                $this->_id = null;
            } else {
                $this->_id = (int)$data;
            }
        } else {
            return (int)$this->_id;
        }
    }

    private function object($data = null)
    {
        if (!is_null($data)) {
            $this->_object = $data;
        } else {
            return $this->_object;
        }
    }

    private function objectID($data = null)
    {
        if (!is_null($data)) {
            $this->_objectID = $data;
        } else {
            return $this->_objectID;
        }
    }

/**
 * load - inheritable function that takes an integer ID that
 *        represents the auto incremented ID in this object's
 *        database table. Returns an array to the child containing
 *        the database row selected if present.
 *
 * @param   int     $id
 *
 * @return  array
 */
    protected function load($id)
    {
        // obtain the objectID for use in the WHERE clause of the SELECT statement
        $objectID = $this->objectID();

        // get the specified row from the database table
        $data = self::$db->select($this->object(),
            "$objectID = :id",
            array(':id' => $id)
        );

        // if there was a row returned, set the ID and return the array
        // if no row was returned, return an empty array
        if (!empty($data)) {
            $this->ID($data[0][$objectID]);
            return $data;
        } else {
            return array();
        }
    }

/**
 * saveToDB - inheritable function that inserts or updates
 *            a row in this object's database table.
 *
 * @param   array   $params
 *
 * @return  bool
 */
    protected function saveToDB($params)
    {
        self::$db->beginTransaction();

        // Check for an existing ID, if one, update the database row
        if ($this->ID()) {
            // obtain the objectID for use in the WHERE clause of the UPDATE statement
            $objectID = $this->objectID();

            // update the database row with the specified ID
            $ok = self::$db->update($this->object(),
                $params,
                "$objectID = :id",
                array(':id' => $this->ID())
            );
        } else {
            // insert the new row into the database
            $ok = self::$db->insert($this->object(), $params);
        }

        // check to see if this was an insert or an update.
        // If it was an insert, set the ID to the lastInsertId
        if ($ok) {
            if (!$this->ID()) {
                $this->ID(self::$db->lastInsertId());
            }
        }

        // Return true if there was 1 row affected
        return $ok == 1 ? true : false;
    }

/**
 * delete - public function used by all child classes. Functions
 *          by deleting a row in the object's database table 
 *          corresponding to the object's ID.
 *
 * @return  bool
 */
    public function delete()
    {
        self::$db->beginTransaction();
        
        // if there is no ID, there is nothing to delete from the database, return false
        if (!$this->ID()) return false;

        // obtain the objectID for use in the WHERE clause of the DELETE statement
        $objectID = $this->objectID();

        // delete the row from the database
        $ok = self::$db->delete($this->object(),
            "$objectID = :id",
            array(':id' => $this->ID())
        );

        $this->ID(0);

        return !$ok;
    }
}

?>
