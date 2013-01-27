<?php

class Hole
    extends DBObject
{
    private $_roundID;
    private $_holeNumber = null;
    private $_holeScore = null;
    private $_FIR = null;
    private $_GIR = null;
    private $_putts = null;

    private $_distance = null;
    private $_par = null;
    private $_firstRefLat = null;
    private $_firstRefLong = null;
    private $_secondRefLat = null;
    private $_secondRefLong = null;
    private $_thirdRefLat = null;
    private $_thirdRefLong = null;
    private $_firstRefX = null;
    private $_firstRefY = null;
    private $_secondRefX = null;
    private $_secondRefY = null;
    private $_thirdRefX = null;
    private $_thirdRefY = null;

    private $_shots = array();

    public function  __construct($data = null)
    {
        parent::__construct('hole');

        $argc = func_num_args();
        $argv = func_get_args();

        if ($argc == 1) {
            $this->load($argv[0]);

            $result = self::$db->select('round',
                'roundID = :id',
                array(':id' => $this->roundID())
            );

            if (!empty($result)) {
                $result = $result[0];

                $this->loadStaticInfo($result['courseID'],
                    $this->holeNumber(),
                    $result['teeID']
                );
            }
        } 

        if ($argc == 3) {
            $this->loadStaticInfo($argv[0], $argv[1], $argv[2]);
        }
    }
    
    public function roundID($data = null)
    {
        if (!empty($data)) {
            $this->_roundID = (int)$data;
        } else {
            return (int)$this->_roundID;
        }
    }

    public function holeNumber($data = null)
    {
        if (!empty($data)) {
            $this->_holeNumber = (int)$data;
        } else {
            return (int)$this->_holeNumber;
        }
    }

    public function holeScore($data = null)
    {
        if (!empty($data)) {
            $this->_holeScore = (int)$data;
        } else {
            return (int)$this->_holeScore;
        }
    }

    public function FIR($data = null)
    {
        if (!empty($data)) {
            $this->_FIR = (bool)$data;
        } else {
            return (bool)$this->_FIR;
        }
    }

    public function GIR($data = null)
    {
        if (!empty($data)) {
            $this->_GIR = (bool)$data;
        } else {
            return (bool)$this->_GIR;
        }
    }

    public function putts($data = null)
    {
        if (!empty($data)) {
            $this->_putts = (int)$data;
        } else {
            return (int)$this->_putts;
        }
    }

    public function shots($data = null)
    {
        if (!empty($data)) {
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
        if (!empty($data)) {
            $this->_distance = (int)$data;
        } else {
            return (int)$this->_distance;
        }
    }

    public function par($data = null)
    {
        if (!empty($data)) {
            $this->_par = (int)$data;
        } else {
            return (int)$this->_par;
        }
    }

    public function firstRefLat($data = null)
    {
        if (!empty($data)) {
            $this->_firstRefLat = (float)$data;
        } else {
            return (float)$this->_firstRefLat;
        }
    }

    public function firstRefLong($data = null)
    {
        if (!empty($data)) {
            $this->_firstRefLong = (float)$data;
        } else {
            return (float)$this->_firstRefLong;
        }
    }

    public function secondRefLat($data = null)
    {
        if (!empty($data)) {
            $this->_secondRefLat = (float)$data;
        } else {
            return (float)$this->_secondRefLat;
        }
    }

    public function secondRefLong($data = null)
    {
        if (!empty($data)) {
            $this->_secondRefLong = (float)$data;
        } else {
            return (float)$this->_secondRefLong;
        }
    }

    public function thirdRefLat($data = null)
    {
        if (!empty($data)) {
            $this->_thirdRefLat = (float)$data;
        } else {
            return (float)$this->_thirdRefLat;
        }
    }

    public function thirdRefLong($data = null)
    {
        if (!empty($data)) {
            $this->_thirdRefLong = (float)$data;
        } else {
            return (float)$this->_thirdRefLong;
        }
    }

    public function firstRefX($data = null)
    {
        if (!empty($data)) {
            $this->_firstRefX = (int)$data;
        } else {
            return (int)$this->_firstRefX;
        }
    }

    public function firstRefY($data = null)
    {
        if (!empty($data)) {
            $this->_firstRefY = (int)$data;
        } else {
            return (int)$this->_firstRefY;
        }
    }

    public function secondRefX($data = null)
    {
        if (!empty($data)) {
            $this->_secondRefX = (int)$data;
        } else {
            return (int)$this->_secondRefX;
        }
    }

    public function secondRefY($data = null)
    {
        if (!empty($data)) {
            $this->_secondRefY = (int)$data;
        } else {
            return (int)$this->_secondRefY;
        }
    }

    public function thirdRefX($data = null)
    {
        if (!empty($data)) {
            $this->_thirdRefX = (int)$data;
        } else {
            return (int)$this->_thirdRefX;
        }
    }

    public function thirdRefY($data = null)
    {
        if (!empty($data)) {
            $this->_thirdRefY = (int)$data;
        } else {
            return (int)$this->_thirdRefY;
        }
    }

    public function load($data)
    {
        if (empty($data)) return true;

        if (!is_array($data)) {
            $data = parent::load($data);

            if (!empty($data)) {
                $data = $data[0];

                // load shots
                $results = self::$db->select('shot',
                    'holeID = :id',
                    array(':id' => $this->ID())
                );

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

        $this->ID($data['holeID']);
        $this->roundID($data['roundID']);
        $this->holeNumber($data['holeNumber']);
        $this->holeScore($data['holeScore']);
        $this->FIR($data['FIR']);
        $this->GIR($data['GIR']);
        $this->putts($data['putts']);

        $this->shots($data['shots']);
    }

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

    public function save()
    {
        $params = array(
            'roundID'    => $this->roundID(),
            'holeNumber' => $this->holeNumber(),
            'holeScore'  => $this->holeScore(),
            'FIR'        => $this->FIR(),
            'GIR'        => $this->GIR(),
            'putts'      => $this->putts()
        );

        // have to save hole before saving shots
        $check = parent::saveToDB($params);

        // first delete all shots belonging to this whole
        self::$db->delete('shot', 
            'holeID = :id', 
            array(':id' => $this->ID())
        );

        // now save each shot to the DB with the new holeID
        foreach ($this->shots() as $shot) {
            $shot->holeID($this->ID());
            $shot->save();
        }

        return $check;
    }

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

    public static function getAll($userID = null)
    {
        if (!empty($userID)) {
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
