<?php

class DBObject
{
    private $_object;
    private $_objectID;

    protected $_id = null;

    protected static $db;


    protected function __construct($object)
    {
        if (empty(self::$db)) {
            self::$db = DB::getInstance();
        }

        $this->object($object);
        $this->objectID($this->object() . "ID");
    }

    public function __destruct()
    {
        self::$db = null;
    }

    public function ID($data = null)
    {
        if (!empty($data)) {
            $this->_id = (int)$data;
        } else {
            return (int)$this->_id;
        }
    }

    private function object($data = null)
    {
        if (!empty($data)) {
            $this->_object = $data;
        } else {
            return $this->_object;
        }
    }

    private function objectID($data = null)
    {
        if (!empty($data)) {
            $this->_objectID = $data;
        } else {
            return $this->_objectID;
        }
    }

    protected function load($id)
    {
        $objectID = $this->objectID();

        $data = self::$db->select($this->object(),
            "$objectID = :id",
            array(':id' => $id)
        );

        if (!empty($data)) {
            $this->ID($data[0][$objectID]);
            return $data;
        } else {
            return array();
        }
    }

    protected function saveToDB($params)
    {
        if ($this->ID()) {
            // update
            $objectID = $this->objectID();

            $ok = self::$db->update($this->object(),
                $params,
                "$objectID = :id",
                array(':id' => $this->ID())
            );
        } else {
            // insert
            $ok = self::$db->insert($this->object(), $params);
        }

        if ($ok) {
            if (!$this->ID()) {
                $this->ID(self::$db->lastInsertId());
            }
        }

        return $ok == 1 ? true : false;
    }

    public function delete()
    {
        if (!$this->ID()) return false;

        $objectID = $this->objectID();

        $ok = self::$db->delete($this->object(),
            "$objectID = :id",
            array(':id' => $this->ID())
        );

        return !$ok;
    }
}

?>
