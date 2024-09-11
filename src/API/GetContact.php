<?php
	//used to get all contacts from a particular user

    $inData = getRequestInfo();

    $userID =  $inData["userID"];

    $resCount = 0;
    $searchResults = "";

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_manager");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
    else
    {
        $stmt = $conn->prepare("SELECT firstName, lastName, phoneNumber, email, address FROM Contacts WHERE userID=?");
        $stmt->bind_param("i", $userID);
        $stmt->execute();

	$result = $stmt->get_result();

	while($row = $result->fetch_assoc())
	{
		if( $resCount > 0 )
		{
			$searchResults .= ",";
		}
		$resCount++;
		$searchResults .= '{"firstName":"' . $row["firstName"] . '",';
		$searchResults .= '"lastName":"' . $row["lastName"] . '",';
		$searchResults .= '"phoneNumber":"' . $row["phoneNumber"] . '",';
		$searchResults .= '"email":"' . $row["email"] . '",';
		$searchResults .= '"address":"' . $row["address"] . '"}';
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
