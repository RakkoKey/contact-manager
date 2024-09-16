<?php
    $inData = getRequestInfo();

    $userID =  $inData["userID"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phoneNumber = $inData["phoneNumber"];
    $email = $inData["email"];
    $address = $inData["address"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_manager");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE userID=? AND firstName=? AND lastName=? AND phoneNumber=? AND email=? AND address=?");
        $stmt->bind_param("isssss", $userID, $firstName, $lastName, $phoneNumber, $email, $address);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            returnWithInfo( $firstName, $lastName, $phoneNumber, $email, $address );
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

    function returnWithInfo( $firstName, $lastName, $phoneNumber, $email, $address)
	{
		$retValue = '{"phoneNumber":"' . $phoneNumber . '","firstName":"' . $firstName . '","lastName":"' . $lastName . '","email":"' . $email . '","address":"' . $address . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
