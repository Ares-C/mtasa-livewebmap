<?php

/*
----------------------------------------->>
-- IGC: International Gaming Community
-- Date: 06 Feb 2017
-- Project: Online Live Map
-- Type: Server Side
-- Author: tcaram
----------------------------------------->>
*/

include( "mtaphpsdk_0.4/mta_sdk.php" );
$mtaServer = new mta("localhost", 22005, "username", "password");
$resource = $mtaServer->getResource ( "IGCwebmap" );


if ($_GET) {
	$count = $_GET["count"];
	if ($count) {
		if ( (int)$count ) {
			if ( (int)$count >= 150 ) { die("Connection banned."); }
			$retn = $resource->call("returnServerData", (int)$count);
			$return = $retn[0];

			$jsonstring = json_encode($return);
			echo $jsonstring;	
		}
	}
}
?>
