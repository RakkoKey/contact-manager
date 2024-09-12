<?php
	//Searches for 1: First name or last name
	//	       2: First name and last name
	//	       3: phone number

    $inData = getRequestInfo();

    $type =  $inData["type"];
    $userID = $inData["userID"];
    $str1 = $inData["str1"];
    $str2 = $inData["str2"];

    $resCount = 0;
    $searchResults = "";

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_manager");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
    else
    {    	//Check for type of search
	    
	if($type == 1){

		$stmt = $conn->prepare("CALL SearchContacts(?)");
        	$stmt->bind_param("s", $str1);
        	$stmt->execute();

		$result = $stmt->get_result();
	}
	elseif($type == 3){

		$stmt = $conn->prepare("CALL SearchContactsByPhoneNumber(?)");
        	$stmt->bind_param("s", $str1);
        	$stmt->execute();

		$result = $stmt->get_result();
	}
	elseif($type == 2){

		$stmt2 = $conn->prepare("CALL SearchContacts(?)");
		echo "prep";
        	$stmt2->bind_param("s", $str1);
		echo "bind";
        	$stmt2->execute();
		echo "ex";

		$result2 = $stmt2->get_result();
		echo "$result2";

		while($row2 = $result2->fetch_assoc())
		{
			if( $row2["userID"] == $userID ){
				
				if( $resCount > 0 )
				{
					$searchResults .= ",";
				}
				$resCount++;
				$searchResults .= '{"ID":"' . $row2["ID"] . '",';
				$searchResults .= '"firstName":"' . $row2["firstName"] . '",';
				$searchResults .= '"lastName":"' . $row2["lastName"] . '",';
				$searchResults .= '"phoneNumber":"' . $row2["phoneNumber"] . '",';
				$searchResults .= '"email":"' . $row2["email"] . '",';
				$searchResults .= '"address":"' . $row2["address"] . '"}';
			}
		}

		$stmt = $conn->prepare("CALL SearchContacts(?)");
        	$stmt->bind_param("s", $str2);
        	$stmt->execute();

		$result = $stmt->get_result();
		
	}

	while($row = $result->fetch_assoc())
	{
		if( $row["userID"] == $userID ){
		
			if( $resCount > 0 )
			{
				$searchResults .= ",";
			}
			$resCount++;
			$searchResults .= '{"ID":"' . $row["ID"] . '",';
			$searchResults .= '"firstName":"' . $row["firstName"] . '",';
			$searchResults .= '"lastName":"' . $row["lastName"] . '",';
			$searchResults .= '"phoneNumber":"' . $row["phoneNumber"] . '",';
			$searchResults .= '"email":"' . $row["email"] . '",';
			$searchResults .= '"address":"' . $row["address"] . '"}';
		}
	}


	    
	if( $resCount == 0 )
	{
		returnWithError( "No Contacts Found" );
	}
	else
	{
		returnWithInfo( $searchResults, $resCount );
	}


		$stmt->close();
		$conn->close();
    }


  function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults, $num )
	{
		$retValue = '{"results":[' . $searchResults . '],"num":' . $num . '}';
		sendResultInfoAsJson( $retValue );
	}

?>
