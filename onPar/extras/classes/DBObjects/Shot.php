<?php

class Shot
    extends DBObject
{
    private $_holeID;
    private $_club;
    private $_shotNumber;
    private $_aimLatitude;
    private $_aimLongitude;
    private $_startLatitude;
    private $_startLongitude;
    private $_endLatitude;
    private $_endLongitude;

    public function __construct($data = null)
    {
        parent::__construct('shot');

        if (!empty($data)) {
            $this->load($data);
        }
    }

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

    public function save()
    {
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

        return parent::saveToDB($params);
    }

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
