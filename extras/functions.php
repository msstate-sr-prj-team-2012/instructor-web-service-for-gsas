<?php

function ifndef($const, $val) {
    if (!defined($const)) {
        define($const, $val);
    }
}

?>