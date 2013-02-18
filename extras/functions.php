<?php

function ifndef($const, $val) {
    if (!defined($const)) {
        define($const, $val);
    }
}

function distance($long_1,$lat_1,$long_2,$lat_2)
{
	$earth_radius = 13950131.0/2; // in yards
	 
	$sin_lat   = sin(deg2rad($lat_2  - $lat_1)  / 2.0);
	$sin2_lat  = $sin_lat * $sin_lat;
	 
	$sin_long  = sin(deg2rad($long_2 - $long_2) / 2.0);
	$sin2_long = $sin_long * $sin_long;
	 
	$cos_lat_1 = cos($lat_1);
	$cos_lat_2 = cos($lat_2);
	 
	$sqrt      = sqrt($sin2_lat + ($cos_lat_1 * $cos_lat_2 * $sin2_long));
	 
	$distance  = 2.0 * $earth_radius * asin($sqrt);
	 
	return $distance;
}

?>