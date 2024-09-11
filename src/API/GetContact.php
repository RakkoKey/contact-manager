<?php
    $inData = getRequestInfo();

    $userID =  $inData["userID"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phoneNumber = $inData["phoneNumber"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_manager");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
    else
    {
        $stmt = $conn->prepare("SELECT FROM Contacts WHERE userID=? AND firstName=? AND lastName=? AND phoneNumber=?");
        $stmt->bind_param("isss", $userID, $firstName, $lastName, $phoneNumber);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            returnWithInfo( $phoneNumber, $firstName, $lastName );
        }
        else {
            returnWithError("Contact not found");
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
?>
