<?php

class Course
    extends DBObject
{
    private $_name;
    private $_location;

    public function __construct($data = null)
    {
        parent::__construct('course');

        if (!empty($data)) {
            $this->load($data);
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

    public function location($data = null)
    {
        if (!empty($data)) {
            $this->_location = $data;
        } else {
            return $this->_location;
        }
    }

    public function load($data)
    {
        if (empty($data)) return true;

        if (!is_array($data)) {
            $data = parent::load($data);

            if (!empty($data)) {
                $data = $data[0];
            } else {
                return true;
            }
        }

        $this->name($data['name']);
        $this->location($data['location']);
    }

    public function save()
    {
        $params = array(
            'name'     => $this->name(),
            'location' => $this->location()
        );

        return parent::saveToDB($params);
    }

    public function export()
    {
        $data = array();
        $data['course'] = array();
        $data['course']['id']       = $this->ID();
        $data['course']['name']     = $this->name();
        $data['course']['location'] = $this->location();

        return $data;
    }

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
