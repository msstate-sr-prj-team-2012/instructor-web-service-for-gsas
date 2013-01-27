<?php

class User
    extends DBObject
{
    private $_memberID = null;
    private $_nickname = null;
    private $_name;
    private $_email;

    private $_stats = array();
    private $_ids = array();

    public function __construct($data = null)
    {
        parent::__construct('user');

        if (!empty($data)) {
            $this->load($data);
        }
    }

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

    public function load($data)
    {
        if (empty($data)) return true;

        if (!is_array($data)) {
            $id = $data;
            $data = array();

            $data = parent::load($id);

            if (!empty($data)) {
                $data = $data[0];
            } else {
                return true;
            }
        }

        $this->memberID($data['memberID']);
        $this->nickname($data['nickname']);
        $this->name($data['name']);
        $this->email($data['email']);

        $this->loadStats();
    }

    public function loadStats()
    {
        // user stats
        $results = self::$db->select('stats',
            'userID = :id',
            array(':id' => $this->ID())
        );

        $stats = array();
        $ids = array();

        foreach ($results as $data) {
            $ids[$data['year']] = $data['id'];

            $stats[$data['year']] = array();
            $stats[$data['year']]['driving_distance'] = (float)$data['drivingDistance'];
            $stats[$data['year']]['GIR_percentage']   = (float)$data['GIRPercentage'];
            $stats[$data['year']]['driving_accuracy'] = (float)$data['drivingAccuracy'];
        }

        $this->IDs($ids);
        $this->stats($stats);
    }

    public function save()
    {
        #TODO - check for unique memberID and email

        $params = array(
            'memberID' => $this->memberID(),
            'nickname' => $this->nickname(),
            'name'     => $this->name(),
            'email'    => $this->email()
        );

        return parent::saveToDB($params);
    }

    public function saveStats()
    {
        $stats = $this->calculateStats();

        $params = array(
            'userID'          => $this->ID(),
            'year'            => date('Y'),
            'drivingDistance' => $stats['drivingDistance'],
            'GIRPercentage'   => $stats['GIRPercentage'],
            'drivingAccuracy' => $stats['drivingAccuracy']
        );

        if (array_key_exists(date('Y'), $this->IDs())) {
            // update
            $ids = $this->IDs();

            $ok = self::$db->update('stats',
                $params,
                'id = :id',
                array(':id' => $ids[date('Y')])
            );
        } else {
            // insert
            $ok = self::$db->insert('stats', $params);
        }

        $this->load($this->ID());

        return $ok == 1 ? true : false;
    }


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

    private function calculateStats()
    {
        $rounds = Round::getAll($this->ID());

        $numShots = 0;
        $numHoles = 0;
        $FIRs = 0;
        $GIRs = 0;
        $distances = 0.0;

        foreach ($rounds as $round) {
            if (($timestamp = strtotime($round->startTime())) !== false) {
                if ((date('Y')) == (date('Y', $timestamp))) {
                    foreach ($round->holes() as $hole) {
                        $numHoles++;
                        if ($hole->GIR()) {
                            $GIRs++;
                        }
                        if ($hole->FIR()) {
                            $FIRs++;
                        }
                        foreach ($hole->shots() as $shot) {
                            if ($shot->club() === 1) {
                                $numShots++;

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

        $data = array();

        if ($numHoles === 0) {
            $data['GIRPercentage']   = 0;
            $data['drivingAccuracy'] = 0;
        } else {
            $data['GIRPercentage']   = (float)$GIRs/$numHoles * 100;
            $data['drivingAccuracy'] = (float)$FIRs/$numHoles * 100;
        }

        if ($numShots === 0) {
            $data['drivingDistance'] = 0;
        } else {
            $data['drivingDistance'] = (float)$distances/$numShots;
        }

        return $data;
    }

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
