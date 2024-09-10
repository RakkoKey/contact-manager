<?php
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phoneNumber = $inData["phoneNumber"];
    $address = $inData["address"];
    $userID =  $inData["userID"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_manager");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
    else
    {
        $stmt = $conn->prepare("INSERT into Contacts (userID, firstName, lastName, email, phone, address) VALUES(?,?,?,?,?,?)");
        $stmt->bind_param("isssss", $userID, $firstName, $lastName, $email, $phoneNumber, $address);
        $stmt->execute();
	$stmt->close();
	$conn->close();
	returnWithError("");
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
