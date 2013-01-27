<?php

class Round
    extends DBObject
{
    private $_user;
    private $_course;
    private $_teeID;
    private $_totalScore = null;
    private $_startTime;

    private $_holes = array();

    public function  __construct($data = null)
    {
        parent::__construct('round');

        if (!empty($data)) {
            $this->load($data);
        }
    }

    public function user($data = null)
    {
        if (!empty($data)) {
            $this->_user = $data;
        } else {
            return $this->_user;
        }
    }

    public function course($data = null)
    {
        if (!empty($data)) {
            $this->_course = $data;
        } else {
            return $this->_course;
        }
    }

    public function totalScore($data = null)
    {
        if (!empty($data)) {
            $this->_totalScore = (int)$data;
        } else {
            return (int)$this->_totalScore;
        }
    }

    public function teeID($data = null)
    {
        if (!empty($data)) {
            $this->_teeID = (int)$data;
        } else {
            return (int)$this->_teeID;
        }
    }

    public function startTime($data = null)
    {
        if (!empty($data)) {
            $this->_startTime = $data;
        } else {
            return $this->_startTime;
        }
    }

    public function holes($data = null)
    {
        if (!empty($data)) {
            $this->_holes = $data;
        } else {
            return $this->_holes;
        }
    }

    public function addHole($data)
    {
        $this->_holes[] = $data;
    }

    public function load($data)
    {
        if (empty($data)) return true;

        if (!is_array($data)) {
            $data = parent::load($data);

            if (!empty($data)) {
                $data = $data[0];

                // load holes
                $results = self::$db->select('hole',
                    'roundID = :id',
                    array(':id' => $this->ID())
                );

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

        $this->ID($data['roundID']);
        $this->user(new User($data['userID']));
        $this->course(new Course($data['courseID']));
        $this->teeID($data['teeID']);
        $this->totalScore($data['totalScore']);
        $this->startTime($data['startTime']);

        $this->holes($data['holes']);
    }

    public function save()
    {
        $params = array(
            'userID'     => $this->user()->ID(),
            'courseID'   => $this->course()->ID(),
            'teeID'      => $this->teeID(),
            'totalScore' => $this->totalScore(),
            'startTime'  => $this->startTime(),
        );

        // have to save round before saving holes
        $check = parent::saveToDB($params);

        // first delete all holes belonging to this round
        self::$db->delete('hole',
            'roundID = :id',
            array(':id' => $this->ID())
        );

        // now save each hole to the DB with the new round ID
        foreach ($this->holes() as $hole) {
            $hole->roundID($this->ID());
            $hole->save();
        }

        return $check;
    }

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

    public static function getAll($userID = null)
    {
        if (!empty($userID)) {
            $db = DB::getInstance();

            $results = $db->select('round', 
                'userID = :id', 
                array(':id' => $userID)
            );

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
