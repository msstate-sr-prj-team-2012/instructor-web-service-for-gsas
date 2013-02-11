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
 * Class Stats
 * @package API
 * @author  Kevin Benton
 * @version 1.0
 *
 * A class to represent a User's statistics gained through a year's rounds.
 *
 * USAGE
 *
 * // for Stats not currently in the database
 * $stats = new Stats();
 *
 * // for Stats currently in the database
 * $stats = new Stats($userID);
 *
 */

class Stats
{
/**
 * userID - the ID representation of the User these stats belong to
 *
 * @var int
 */
    private $_userID;

/**
 * stats - an array of the multiple rows of stats in the database
 *
 * @var Array
 */
    private $_stats = array();

/**
 * ids - an array of the IDs of the rows of stats
 *
 * @var Array
 */
    private $_ids = array();

/**
 * db - static reference to the database
 *
 * @var DB
 */
    private static $db;

/**
 * Constructor - instatiates a new Stats object
 *
 * @param   int|null    $userID
 */
    public function  __construct($userID = null)
    {
        // get an instance of the database if needed
        if (empty(self::$db)) {
            self::$db = DB::getInstance();
        }
        
        // if a userID is passed in, load the stats
        if (!empty($userID)) {
            $this->userID($userID);
            $this->load($userID);
        }

    }

/**
 *
 * Accessores/Mutators
 *
 */
    private function userID($data = null)
    {
        if (!empty($data)) {
            $this->_userID = $data;
        } else {
            return $this->_userID;
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

/**
 * load - loads the User's stats from the database
 *
 * @param   int     $userID
 */
    private function load($userID)
    {
        $results = self::$db->select('stats',
            'userID = :id',
            array(':id' => $this->userID())
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

/**
 * save - saves (inserts or updates) a row of stats
 *
 */
    public function save()
    {
        $stats = $this->calculateStats();

        $params = array(
            'userID'          => $this->userID(),
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

        $this->load($this->userID());

        return $ok == 1 ? true : false;
    }

/**
 * calculateStats - calculates the stats of the User for this year
 *
 */
    private function calculateStats()
    {
        $rounds = Round::getAll($this->userID());

        $numShots = 0;
        $numHolesFIR = 0;
        $numHolesGIR = 0;
        $FIRs = 0;
        $GIRs = 0;
        $distances = 0.0;

        // loop through each round
        foreach ($rounds as $round) {
            if (($timestamp = strtotime($round->startTime())) !== false) {
                if ((date('Y')) == (date('Y', $timestamp))) {
                    // If made to here, the round was played this year
                    foreach ($round->holes() as $hole) {
                        // increment the GIR holes counter for every hole
                        $numHolesGIR++;
                        if ($hole->GIR()) {
                            // if the green was hit in regulation on this hole,
                            // increment the GIR counter
                            $GIRs++;
                        }
                        // Check to see if this hole is not a par three
                        // Par threes do not have a FIR option so don't 
                        // count it against the User
                        if ($hole->par() !== 3) {
                            // increment the FIR hole counter
                            $numHolesFIR++;
                            if ($hole->FIR()) {
                                // if the fairway was hit off the tee on this hole, 
                                // increment the FIR counter
                                $FIRs++;
                            }
                        }
                        // loop through the holes to obtain driving distance
                        foreach ($hole->shots() as $shot) {
                            if ($shot->club() === 1) {
                                // here the club used was driver
                                // increment the numShots counter
                                $numShots++;

                                // Add the distance of the shot to the distances variable
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

        // fill an array with the calculated stats
        // GIRPercentage = the number of greens hit divided by the number of holes
        // Driving accuracy = the number of fairways hit on non par threes divided by the number of holes that aren't par threes
        // Driving distance = the summation of distances of shots by the driver divided by the number of shots taken with the driver
        $data = array();

        if ($numHolesGIR === 0) {
            $data['GIRPercentage']   = 0;
        } else {
            $data['GIRPercentage']   = (float)$GIRs/$numHolesGIR * 100;
        }

        if ($numHolesFIR === 0) {
            $data['drivingAccuracy']   = 0;
        } else {
            $data['drivingAccuracy']   = (float)$FIRs/$numHolesFIR * 100;
        }

        if ($numShots === 0) {
            $data['drivingDistance'] = 0;
        } else {
            $data['drivingDistance'] = (float)$distances/$numShots;
        }

        return $data;
    }
}

?>
