<?php

function ifndef($const, $val) {
    if (!defined($const)) {
        define($const, $val);
    }
}

function distance($lon1, $lat1, $lon2, $lat2) {
  $earth_radius = 6969600; // yards
  $delta_lat = $lat2 - $lat1;
  $delta_lon = $lon2 - $lon1;
  $alpha    = $delta_lat/2;
  $beta     = $delta_lon/2;
  $a        = sin(deg2rad($alpha)) * sin(deg2rad($alpha)) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin(deg2rad($beta)) * sin(deg2rad($beta)) ;
  $c        = asin(min(1, sqrt($a)));
  $distance = 2*$earth_radius * $c;
  $distance = round($distance, 4);
 
  return $distance;
}

?>